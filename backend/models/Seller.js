const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const sellerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      enum: ['Mr.', 'Ms.', 'Mrs.'],
      required: [true, 'Title is required'],
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Surname is required'],
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
    },
    businessName: {
      type: String,
      trim: true,
      default: '',
    },
    businessType: {
      type: String,
      enum: ['Home Seller', 'Salon', 'Beauty Parlour', 'Shop'],
      required: [true, 'Business type is required'],
    },
    gstNumber: {
      type: String,
      trim: true,
      default: '',
    },
    addressLine1: {
      type: String,
      required: [true, 'Address line 1 is required'],
      trim: true,
    },
    addressLine2: {
      type: String,
      trim: true,
      default: '',
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    role: {
      type: String,
      enum: ['seller', 'admin'],
      default: 'seller',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Hash password before saving
sellerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
sellerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Seller', sellerSchema);
