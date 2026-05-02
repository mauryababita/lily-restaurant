const express = require('express');
const Review = require('../models/Review');
const MenuItem = require('../models/MenuItem');
const Booking = require('../models/Booking');
const User = require('../models/User');

const router = express.Router();

// Helper: Verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'lily_restaurant_secret_key');
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Helper: Calculate similarity score between user preferences and dishes
const calculateSimilarityScore = (userPrefs, dishTags, dishRating) => {
  let score = 0;

  // Check dietary preferences match
  if (userPrefs.dietaryPreferences && userPrefs.dietaryPreferences.length > 0) {
    const matchingPrefs = userPrefs.dietaryPreferences.filter((pref) =>
      dishTags.includes(pref)
    );
    score += matchingPrefs.length * 2;
  }

  // Check for allergies conflict (negative score)
  if (userPrefs.allergies && userPrefs.allergies.length > 0) {
    const allergyMatch = userPrefs.allergies.filter((allergy) =>
      dishTags.includes(allergy)
    );
    score -= allergyMatch.length * 3;
  }

  // Dish rating influence
  score += (dishRating || 3) * 0.5;

  return Math.max(score, 0);
};

// @route   GET /api/recommendations/personalized
// @desc    Get personalized dish recommendations for user
// @access  Private
router.get('/personalized', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get all menu items
    const allDishes = await MenuItem.find().limit(50);

    // Get user's past reviews to understand preferences
    const userReviews = await Review.find({ userId: req.userId });

    // Calculate recommendation scores
    const recommendations = await Promise.all(
      allDishes.map(async (dish) => {
        // Check if user already reviewed this dish
        const alreadyReviewed = userReviews.find(
          (review) => review.menuItemId.toString() === dish._id.toString()
        );

        if (alreadyReviewed) {
          return null; // Skip already reviewed dishes
        }

        // Get average rating for this dish
        const dishReviews = await Review.find({ menuItemId: dish._id });
        const avgRating =
          dishReviews.length > 0
            ? dishReviews.reduce((sum, r) => sum + r.rating, 0) / dishReviews.length
            : 3;

        // Calculate similarity score
        const score = calculateSimilarityScore(
          user,
          dish.tags || [],
          avgRating
        );

        return {
          dish,
          score,
          avgRating: avgRating.toFixed(2),
          reviewCount: dishReviews.length,
        };
      })
    );

    // Filter out null values and sort by score
    const filteredRecommendations = recommendations
      .filter((r) => r !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    res.status(200).json({
      success: true,
      count: filteredRecommendations.length,
      recommendations: filteredRecommendations,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /api/recommendations/seasonal
// @desc    Get seasonal dish recommendations
// @access  Public
router.get('/seasonal', async (req, res) => {
  try {
    const currentMonth = new Date().getMonth() + 1;
    let season = 'Summer';

    if (currentMonth >= 12 || currentMonth <= 2) season = 'Winter';
    else if (currentMonth >= 3 && currentMonth <= 5) season = 'Spring';
    else if (currentMonth >= 6 && currentMonth <= 8) season = 'Summer';
    else season = 'Autumn';

    // Get highly-rated dishes tagged with current season
    const seasonalDishes = await MenuItem.aggregate([
      { $match: { tags: { $in: [season] } } },
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'menuItemId',
          as: 'reviews',
        },
      },
      {
        $addFields: {
          avgRating: { $avg: '$reviews.rating' },
          reviewCount: { $size: '$reviews' },
        },
      },
      { $sort: { avgRating: -1, reviewCount: -1 } },
      { $limit: 8 },
    ]);

    res.status(200).json({
      success: true,
      season,
      count: seasonalDishes.length,
      dishes: seasonalDishes,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /api/recommendations/rate-dish
// @desc    Rate a dish (for AI training)
// @access  Private
router.post('/rate-dish', verifyToken, async (req, res) => {
  try {
    const { menuItemId, rating, comment, tags, bookingId } = req.body;

    if (!menuItemId || !rating) {
      return res.status(400).json({
        error: 'Menu item ID and rating are required',
      });
    }

    // Determine sentiment
    let sentiment = 'Neutral';
    if (rating >= 4) sentiment = 'Positive';
    else if (rating <= 2) sentiment = 'Negative';

    const review = new Review({
      userId: req.userId,
      menuItemId,
      rating,
      comment: comment || '',
      tags: tags || [],
      sentiment,
      bookingId: bookingId || null,
      isVerifiedPurchase: bookingId ? true : false,
    });

    await review.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /api/recommendations/similar-dishes
// @desc    Get dishes similar to a specified dish
// @access  Public
router.get('/similar/:dishId', async (req, res) => {
  try {
    const mainDish = await MenuItem.findById(req.params.dishId);
    if (!mainDish) {
      return res.status(404).json({ error: 'Dish not found' });
    }

    // Find similar dishes based on tags and category
    const similarDishes = await MenuItem.aggregate([
      {
        $match: {
          _id: { $ne: mainDish._id },
          tags: { $in: mainDish.tags || [] },
        },
      },
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'menuItemId',
          as: 'reviews',
        },
      },
      {
        $addFields: {
          avgRating: { $avg: '$reviews.rating' },
          matchingTags: {
            $size: {
              $filter: {
                input: '$tags',
                as: 'tag',
                cond: { $in: ['$$tag', mainDish.tags || []] },
              },
            },
          },
        },
      },
      { $sort: { matchingTags: -1, avgRating: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      success: true,
      mainDish,
      count: similarDishes.length,
      similarDishes,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
