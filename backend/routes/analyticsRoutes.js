const express = require('express');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const MenuItem = require('../models/MenuItem');
const Review = require('../models/Review');
const User = require('../models/User');

const router = express.Router();

// Helper: Verify admin token
const verifyAdminToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'lily_restaurant_secret_key');
    req.userId = decoded.id;
    // You can add role check here if needed
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard overview metrics
// @access  Private (Admin)
router.get('/dashboard', verifyAdminToken, async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'Success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const totalMenuItems = await MenuItem.countDocuments();
    const averageRating = await Review.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } },
    ]);

    res.status(200).json({
      success: true,
      dashboard: {
        totalBookings,
        totalUsers,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalMenuItems,
        averageRating: averageRating[0]?.avgRating?.toFixed(2) || 0,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /api/analytics/revenue
// @desc    Get revenue analytics
// @access  Private (Admin)
router.get('/revenue', verifyAdminToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = { status: 'Success' };
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const revenueData = await Payment.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          revenue: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    res.status(200).json({
      success: true,
      revenueData,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /api/analytics/bookings-trends
// @desc    Get booking trends
// @access  Private (Admin)
router.get('/bookings-trends', verifyAdminToken, async (req, res) => {
  try {
    const bookingTrends = await Booking.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          count: { $sum: 1 },
          guests: { $sum: '$guests' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.status(200).json({
      success: true,
      bookingTrends,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /api/analytics/peak-hours
// @desc    Get peak booking hours
// @access  Private (Admin)
router.get('/peak-hours', verifyAdminToken, async (req, res) => {
  try {
    const peakHours = await Booking.aggregate([
      {
        $group: {
          _id: { $hour: '$date' },
          count: { $sum: 1 },
          guests: { $sum: '$guests' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      peakHours,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /api/analytics/top-dishes
// @desc    Get top-performing dishes
// @access  Private (Admin)
router.get('/top-dishes', verifyAdminToken, async (req, res) => {
  try {
    const topDishes = await Review.aggregate([
      { $match: { rating: { $gte: 4 } } },
      { $group: { _id: '$menuItemId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
      { $sort: { avgRating: -1, count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'menuitems',
          localField: '_id',
          foreignField: '_id',
          as: 'dish',
        },
      },
    ]);

    res.status(200).json({
      success: true,
      topDishes,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /api/analytics/customer-demographics
// @desc    Get customer demographics
// @access  Private (Admin)
router.get('/customer-demographics', verifyAdminToken, async (req, res) => {
  try {
    const demographics = await User.aggregate([
      {
        $group: {
          _id: '$dietaryPreferences',
          count: { $sum: 1 },
        },
      },
    ]);

    const totalCustomers = await User.countDocuments();
    const dietaryBreakdown = {};

    demographics.forEach((item) => {
      if (item._id && item._id.length > 0) {
        item._id.forEach((pref) => {
          dietaryBreakdown[pref] = (dietaryBreakdown[pref] || 0) + item.count;
        });
      }
    });

    res.status(200).json({
      success: true,
      totalCustomers,
      dietaryBreakdown,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
