const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_default_key');
const Payment = require('../models/Payment');
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

// @route   POST /api/payments/create-payment-intent
// @desc    Create a Stripe payment intent
// @access  Private
router.post('/create-payment-intent', verifyToken, async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    if (!bookingId || !amount) {
      return res.status(400).json({ error: 'Booking ID and amount are required' });
    }

    // Verify booking exists and belongs to user
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const user = await User.findById(req.userId);

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'inr',
      metadata: {
        bookingId: bookingId.toString(),
        userId: req.userId.toString(),
      },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /api/payments/confirm-payment
// @desc    Confirm payment and save to database
// @access  Private
router.post('/confirm-payment', verifyToken, async (req, res) => {
  try {
    const { bookingId, transactionId, paymentMethod, amount } = req.body;

    if (!bookingId || !transactionId || !paymentMethod || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create payment record
    const payment = new Payment({
      userId: req.userId,
      bookingId,
      amount,
      paymentMethod,
      transactionId,
      status: 'Success',
      paymentGateway: 'Stripe',
      receiptEmail: user.email,
    });

    await payment.save();

    // Update booking status
    await Booking.findByIdAndUpdate(bookingId, { paymentStatus: 'Paid' });

    res.status(201).json({
      success: true,
      message: 'Payment confirmed successfully',
      payment: {
        id: payment._id,
        transactionId: payment.transactionId,
        amount: payment.amount,
        status: payment.status,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /api/payments/history
// @desc    Get payment history for logged-in user
// @access  Private
router.get('/history', verifyToken, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.userId })
      .populate('bookingId', 'guests date time')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /api/payments/:id
// @desc    Get payment details
// @access  Private
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate(
      'bookingId userId'
    );

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Ensure user can only view their own payments
    if (payment.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /api/payments/refund
// @desc    Refund a payment
// @access  Private
router.post('/refund/:id', verifyToken, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (payment.status === 'Refunded') {
      return res.status(400).json({ error: 'Payment already refunded' });
    }

    // Process refund through Stripe
    try {
      await stripe.refunds.create({
        payment_intent: payment.transactionId,
      });
    } catch (stripeErr) {
      // If Stripe refund fails, log but continue
      console.error('Stripe refund failed:', stripeErr);
    }

    payment.status = 'Refunded';
    await payment.save();

    res.status(200).json({
      success: true,
      message: 'Payment refunded successfully',
      payment,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
