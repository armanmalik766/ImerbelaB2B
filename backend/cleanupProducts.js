const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

async function cleanup() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Remove products that don't belong to Imerbela brand or the actual constants
    const result = await Product.deleteMany({
      title: { $nin: [
        'Neem Kernel Seeds Shampoo',
        'Neem Kernel Seeds Conditioner',
        'Neem Kernel Seeds Serum',
        'Imerbela Neem Seed Kernel Hair Care Kit'
      ]}
    });

    console.log(`🗑️  Deleted ${result.deletedCount} non-Imerbela products.`);
    
    // Check what's left
    const remaining = await Product.find({}, 'title');
    console.log('📦 Remaining products:', remaining.map(p => p.title));

    console.log('✅ Cleanup complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  }
}

cleanup();
