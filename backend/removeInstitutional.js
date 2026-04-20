const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

async function removeTargeted() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const result = await Product.deleteMany({
      $or: [
        { subtitle: 'Institutional Pack | 500ml' },
        { title: 'Scalp Recovery Duo' }
      ]
    });

    console.log(`🗑️  Deleted ${result.deletedCount} unwanted products.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed:', error);
    process.exit(1);
  }
}

removeTargeted();
