// seed.js — Run once to populate sample menu data
// Usage: node seed.js

require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');

const sampleMenu = [
  {
    name: 'Sushi Deluxe',
    description: 'Delicate Japanese sushi rolls with fresh seafood and rice.',
    price: 450,
    category: 'Japanese',
    variants: [
      { name: 'California Roll', price: 350, description: 'Cucumber, avocado, crab' },
      { name: 'Dragon Roll', price: 400, description: 'Tempura shrimp, avocado' },
      { name: 'Philadelphia Roll', price: 450, description: 'Salmon, cream cheese, cucumber' },
      { name: 'Spicy Tuna Roll', price: 380, description: 'Spicy tuna with cucumber' }
    ]
  },
  {
    name: 'Wood-Fired Pizza',
    description: 'Wood-fired pizza topped with mozzarella, basil, and olive oil.',
    price: 450,
    category: 'Italian',
    variants: [
      { name: 'Margherita', price: 400, description: 'Classic tomato, mozzarella, basil' },
      { name: 'Pepperoni', price: 450, description: 'Tomato, mozzarella, pepperoni' },
      { name: 'Quattro Formaggi', price: 500, description: 'Four cheese blend' },
      { name: 'Bianca', price: 420, description: 'Mozzarella, ricotta, garlic' }
    ]
  },
  {
    name: 'Creamy Pasta',
    description: 'Creamy Italian pasta crafted with fresh herbs and sauces.',
    price: 425,
    category: 'Italian',
    variants: [
      { name: 'Alfredo', price: 400, description: 'Fettuccine with parmesan cream' },
      { name: 'Carbonara', price: 420, description: 'Spaghetti with bacon and cream' },
      { name: 'Bolognese', price: 410, description: 'Penne with meat sauce' },
      { name: 'Pesto Cream', price: 430, description: 'Tagliatelle with basil pesto' }
    ]
  },
  {
    name: 'Signature Soups',
    description: 'Warm and comforting soups made with fresh ingredients.',
    price: 195,
    category: 'Appetizers',
    variants: [
      { name: 'Tomato Basil', price: 180, description: 'Creamy tomato soup' },
      { name: 'Mushroom', price: 200, description: 'Creamy mushroom bisque' },
      { name: 'Vegetable', price: 165, description: 'Mixed vegetables' },
      { name: 'Chicken', price: 210, description: 'Chicken broth with vegetables' }
    ]
  },
  {
    name: 'Garden Salad',
    description: 'Fresh garden greens with a light vinaigrette dressing.',
    price: 250,
    category: 'Healthy',
    variants: [
      { name: 'Mixed Green', price: 220, description: 'Lettuce, spinach, arugula' },
      { name: 'Caesar', price: 280, description: 'Romaine, parmesan, croutons' },
      { name: 'Greek', price: 270, description: 'Feta, olives, tomatoes' },
      { name: 'Caprese', price: 290, description: 'Mozzarella, tomato, basil' }
    ]
  },
  {
    name: 'Premium Coffee',
    description: 'Freshly brewed aromatic coffee to start your day right.',
    price: 95,
    category: 'Beverages',
    variants: [
      { name: 'Espresso', price: 85, description: 'Single shot' },
      { name: 'Cappuccino', price: 110, description: 'With steamed milk' },
      { name: 'Latte', price: 120, description: 'Smooth and creamy' },
      { name: 'Americano', price: 90, description: 'Espresso with water' }
    ]
  },
  {
    name: 'Sweet Dessert',
    description: 'Sweet and creamy dessert to perfectly finish your meal.',
    price: 150,
    category: 'Desserts',
    variants: [
      { name: 'Chocolate Cake', price: 160, description: 'Rich chocolate layer cake' },
      { name: 'Cheesecake', price: 170, description: 'Creamy New York cheesecake' },
      { name: 'Tiramisu', price: 180, description: 'Italian coffee-flavored dessert' },
      { name: 'Brownie', price: 140, description: 'Warm fudgy brownie' }
    ]
  },
  {
    name: 'Fresh Mocktails',
    description: 'Refreshing non-alcoholic blends with fruits and herbs.',
    price: 195,
    category: 'Beverages',
    variants: [
      { name: 'Mojito', price: 180, description: 'Mint, lime, soda' },
      { name: 'Virgin Pina Colada', price: 200, description: 'Coconut, pineapple' },
      { name: 'Berry Blast', price: 190, description: 'Mixed berry juice' },
      { name: 'Mango Lassi', price: 170, description: 'Mango, yogurt drink' }
    ]
  },
  {
    name: 'Hot Sizzler',
    description: 'Hot sizzler platters served with fresh vegetables and sauces.',
    price: 599,
    category: 'Main Course',
    variants: [
      { name: 'Chicken Sizzler', price: 550, description: 'Grilled chicken strips' },
      { name: 'Paneer Sizzler', price: 520, description: 'Cottage cheese sizzler' },
      { name: 'Shrimp Sizzler', price: 650, description: 'Jumbo shrimp sizzler' },
      { name: 'Tandoori Mix', price: 599, description: 'Mixed tandoori platter' }
    ]
  },
  {
    name: 'Rice & Noodles',
    description: 'Delicious stir-fried rice noodles with fresh vegetables and sauces.',
    price: 350,
    category: 'Asian',
    variants: [
      { name: 'Vegetable', price: 300, description: 'Mixed vegetables' },
      { name: 'Chicken', price: 350, description: 'With tender chicken' },
      { name: 'Shrimp', price: 400, description: 'Succulent shrimp' },
      { name: 'Paneer', price: 330, description: 'Cottage cheese sautéed' }
    ]
  },
  {
    name: 'Rice Biryani',
    description: 'Aromatic basmati rice cooked with spices, herbs, and toppings.',
    price: 480,
    category: 'Main Course',
    variants: [
      { name: 'Hyderabadi', price: 450, description: 'Traditional Hyderabad style' },
      { name: 'Chicken', price: 480, description: 'With spiced chicken' },
      { name: 'Mutton', price: 520, description: 'Tender mutton biryani' },
      { name: 'Vegetable', price: 420, description: 'Garden vegetables biryani' }
    ]
  },
  {
    name: 'Oriental',
    description: 'Exquisite oriental dishes with noodles, sauces, and spices.',
    price: 425,
    category: 'Asian',
    variants: [
      { name: 'Hakka Noodles', price: 350, description: 'Vegetable hakka noodles' },
      { name: 'Chicken Hakka', price: 400, description: 'With tender chicken' },
      { name: 'Lo Mein', price: 420, description: 'Soft egg noodles' },
      { name: 'Chow Mein', price: 410, description: 'Crispy fried noodles' }
    ]
  }
];

async function seed() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant_db';
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected');

    await MenuItem.deleteMany({});
    console.log('🗑️  Cleared existing menu items');

    const inserted = await MenuItem.insertMany(sampleMenu);
    console.log(`🌸 Inserted ${inserted.length} menu items with variants successfully!`);

    await mongoose.disconnect();
    console.log('✅ Done! You can now start the server with: npm run dev');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
