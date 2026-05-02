const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// GET all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('items.menuItem').sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: orders, count: orders.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET order stats
router.get('/stats', async (req, res) => {
  try {
    const today = new Date(); today.setHours(0,0,0,0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate()+1);
    const [total, pending, confirmed, preparing, ready, delivered, cancelled, todayCount] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'confirmed' }),
      Order.countDocuments({ status: 'preparing' }),
      Order.countDocuments({ status: 'ready' }),
      Order.countDocuments({ status: 'delivered' }),
      Order.countDocuments({ status: 'cancelled' }),
      Order.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } })
    ]);
    res.json({ success: true, data: { total, pending, confirmed, preparing, ready, delivered, cancelled, today: todayCount } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST new order
router.post('/', async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, items, deliveryType, deliveryAddress, specialInstructions } = req.body;
    if (!customerName || !customerEmail || !items || items.length === 0)
      return res.status(400).json({ success: false, message: 'Name, email, and items are required' });

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem || !menuItem.available) {
        return res.status(400).json({ success: false, message: `Menu item ${item.menuItemId} not available` });
      }
      const price = menuItem.price * item.quantity;
      totalAmount += price;
      orderItems.push({
        menuItem: item.menuItemId,
        quantity: item.quantity,
        price: price
      });
    }

    const order = await Order.create({
      customerName,
      customerEmail,
      customerPhone,
      items: orderItems,
      totalAmount,
      deliveryType,
      deliveryAddress,
      specialInstructions
    });

    res.status(201).json({ success: true, message: 'Order placed successfully!', data: order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PATCH order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'].includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status' });
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('items.menuItem');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, message: 'Status updated to ' + status, data: order });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE order
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, message: 'Order deleted!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;