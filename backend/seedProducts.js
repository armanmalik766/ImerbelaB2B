const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

const products = [
  {
    title: 'Neem & Aloe Hair Cleanser',
    handle: 'neem-aloe-shampoo',
    subtitle: 'Natural purification for healthy scalp',
    price: 499,
    category: 'shampoo',
    imageUrl: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=800',
    description: 'A gentle but effective cleanser infused with organic Neem and pure Aloe Vera. Helps eliminate dandruff and strengthens hair from the roots.',
    moq: 5,
    isActive: true,
    bulkPricing: [
      { minQty: 5, maxQty: 20, price: 449, label: 'Standard Wholesale' },
      { minQty: 21, maxQty: 50, price: 399, label: 'Bulk Discount' },
      { minQty: 51, maxQty: null, price: 349, label: 'Tier 1 Wholesale' }
    ]
  },
  {
    title: 'Argan Oil Restorative Conditioner',
    handle: 'argan-conditioner',
    subtitle: 'Deep hydration for damaged hair',
    price: 599,
    category: 'conditioner',
    imageUrl: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&q=80&w=800',
    description: 'Enriched with Moroccan Argan oil, this conditioner provides intense moisture and repairs split ends while making hair silkier.',
    moq: 5,
    isActive: true,
    bulkPricing: [
      { minQty: 5, maxQty: 20, price: 539, label: 'Standard Wholesale' },
      { minQty: 21, maxQty: null, price: 479, label: 'Bulk Discount' }
    ]
  },
  {
    title: 'Onion Hair Growth Serum',
    handle: 'onion-hair-serum',
    subtitle: 'Reduces hair fall and promotes growth',
    price: 749,
    category: 'serum',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
    description: 'A non-greasy formula with red onion extract and biotin to revitalize hair follicles and boost density.',
    moq: 10,
    isActive: true,
    bulkPricing: [
      { minQty: 10, maxQty: 30, price: 674, label: 'Standard Wholesale' },
      { minQty: 31, maxQty: null, price: 599, label: 'Bulk Discount' }
    ]
  },
  {
    title: 'Herbal Hair Revitalizing Oil',
    handle: 'herbal-hair-oil',
    subtitle: 'Classical therapy for hair wellness',
    price: 399,
    category: 'oil',
    imageUrl: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=800',
    description: 'A blend of 12 traditional herbs infused in pure coconut oil to prevent premature greying and hair fall.',
    moq: 10,
    isActive: true,
    bulkPricing: [
      { minQty: 10, maxQty: null, price: 349, label: 'Fixed Wholesale' }
    ]
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for product seeding');

    // Optionally clear existing products if you want a clean slate
    // await Product.deleteMany({});
    
    for (const p of products) {
      await Product.findOneAndUpdate(
        { handle: p.handle },
        p,
        { upsert: true, new: true }
      );
    }

    console.log('✅ Products seeded/updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedProducts();
