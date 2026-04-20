const mongoose = require('mongoose');

const bulkTierSchema = new mongoose.Schema({
  minQty: { type: Number, required: true },
  maxQty: { type: Number, default: null },
  price: { type: Number, required: true },
  label: { type: String, required: true },
}, { _id: false });

const productSchema = new mongoose.Schema({
  handle: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  benefit: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  mrpPerUnit: {
    type: Number,
    default: 0,
  },
  imageUrl: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    enum: ['shampoo', 'conditioner', 'oil', 'serum', 'kit'],
    default: 'shampoo',
  },
  tags: [{
    type: String,
  }],
  description: {
    type: String,
    default: '',
  },
  howToUse: [{
    type: String,
  }],
  ingredients: [{
    name: { type: String, required: true },
    benefit: { type: String, default: '' },
  }],
  moq: {
    type: Number,
    required: true,
    default: 5,
    min: 1,
  },
  isB2BOnly: {
    type: Boolean,
    default: true,
  },
  bulkPricing: [bulkTierSchema],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
