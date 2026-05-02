const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Valid email required'] },
  message: { type: String, required: true, maxlength: 1000 },
  contact_date: { type: Date, required: true },
  contact_time: { type: String, required: true },
  phone: { type: String, default: '', maxlength: 20 },
  guests: { type: Number, default: 2, min: 1, max: 20 },
  status: { type: String, enum: ['pending','confirmed','cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
  paymentMethod: { type: String, enum: ['online', 'offline'], default: 'offline' },
  estimatedAmount: { type: Number, default: 0 }
}, { timestamps: true });
module.exports = mongoose.model('Booking', bookingSchema);
