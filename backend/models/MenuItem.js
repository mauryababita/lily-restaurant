const mongoose = require('mongoose');
const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 1000 },
  price: { type: Number, required: true, min: 0 },
  category: {
    type: String,
    enum: ['Appetizers','Main Course','Italian','Japanese','Asian','Beverages','Desserts','Healthy','General'],
    default: 'General'
  },
  image_path: { type: String, default: '' },
  available: { type: Boolean, default: true },
  variants: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true, min: 0 },
      description: { type: String, default: '' }
    }
  ]
}, { timestamps: true });
module.exports = mongoose.model('MenuItem', menuItemSchema);
