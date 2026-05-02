const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 }
});

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true, trim: true, maxlength: 100 },
  customerEmail: { type: String, required: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Valid email required'] },
  customerPhone: { type: String, default: '', maxlength: 20 },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'], default: 'pending' },
  paymentMethod: { type: String, enum: ['online', 'offline'], default: 'offline' },
  deliveryType: { type: String, enum: ['dine-in', 'takeaway', 'delivery'], default: 'dine-in' },
  deliveryAddress: { type: String, default: '' },
  specialInstructions: { type: String, default: '', maxlength: 500 }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);