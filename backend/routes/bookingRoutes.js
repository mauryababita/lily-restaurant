const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: bookings, count: bookings.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const today = new Date(); today.setHours(0,0,0,0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate()+1);
    const [total, pending, confirmed, cancelled, todayCount] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.countDocuments({ status: 'cancelled' }),
      Booking.countDocuments({ contact_date: { $gte: today, $lt: tomorrow } })
    ]);
    res.json({ success: true, data: { total, pending, confirmed, cancelled, today: todayCount } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, message, contact_date, contact_time, phone, guests } = req.body;
    if (!name || !email || !message || !contact_date || !contact_time)
      return res.status(400).json({ success: false, message: 'All required fields must be filled' });
    const bookingDate = new Date(contact_date);
    bookingDate.setHours(0,0,0,0);

    const existing = await Booking.findOne({
      email,
      contact_date: {
        $gte: bookingDate,
        $lt: new Date(bookingDate.getTime() + 24 * 60 * 60 * 1000)
      },
      contact_time,
      status: { $ne: 'cancelled' }
    });

    if (existing)
      return res.status(400).json({ success: false, message: 'A booking already exists for this email, date and time' });

    const booking = await Booking.create({
      name, email, message,
      contact_date: bookingDate,
      contact_time, phone, guests
    });
    res.status(201).json({ success: true, message: 'Booking submitted! We will contact you soon.', data: booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending','confirmed','cancelled'].includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status' });
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, message: 'Status updated to ' + status, data: booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, message: 'Booking deleted!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
