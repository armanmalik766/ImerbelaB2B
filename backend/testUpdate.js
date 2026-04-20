const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

async function testUpdate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find a product
    const product = await Product.findOne({});
    if (!product) {
      console.log('❌ No products found to test update');
      process.exit(0);
    }

    console.log('Testing update for:', product.title);
    
    // Simulate updating title and price
    const updateData = {
      title: 'Updated Test Title ' + Date.now(),
      price: product.price + 10,
      _id: product._id // Include _id to see if it causes issues
    };

    const updated = await Product.findByIdAndUpdate(product._id, updateData, {
      new: true,
      runValidators: true,
    });

    console.log('✅ Update successful:', updated.title, updated.price);
    process.exit(0);
  } catch (error) {
    console.error('❌ Update failed:', error);
    process.exit(1);
  }
}

testUpdate();
