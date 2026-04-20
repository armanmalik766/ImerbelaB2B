/**
 * Admin Seeder Script
 * Creates a default admin account for the IMERBELA B2B platform.
 *
 * Usage: node seed.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const Seller = require('./models/Seller');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Check if admin already exists
    const existingAdmin = await Seller.findOne({ email: 'admin@imerbela.com' });

    if (existingAdmin) {
      console.log('ℹ️  Admin account already exists.');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role}`);
    } else {
      const admin = await Seller.create({
        name: 'IMERBELA Admin',
        email: 'admin@imerbela.com',
        phone: '+91 98765 43210',
        businessName: 'IMERBELA',
        gstNumber: '',
        monthlyQuantity: '1000+',
        address: '1200, Indiranagar, Bangalore, India',
        password: 'admin123',
        status: 'approved',
        role: 'admin',
      });

      console.log('✅ Admin account created successfully!');
      console.log(`   Email: ${admin.email}`);
      console.log(`   Password: admin123`);
      console.log(`   ⚠️  CHANGE THIS PASSWORD IN PRODUCTION!`);
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();
