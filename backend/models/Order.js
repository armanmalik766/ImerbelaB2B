const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  handle: { type: String, required: true },
  title: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true,
  },
  items: {
    type: [orderItemSchema],
    required: true,
    validate: {
      validator: (v) => v.length > 0,
      message: 'Order must contain at least one item',
    },
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  totalUnits: {
    type: Number,
    required: true,
    min: 1,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  shippingAddress: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    businessName: { type: String },
    gstNumber: { type: String },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  notes: {
    type: String,
    default: '',
  },
  razorpayOrderId: {
    type: String,
  },
  razorpayPaymentId: {
    type: String,
  },
  razorpaySignature: {
    type: String,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'captured', 'failed'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);
