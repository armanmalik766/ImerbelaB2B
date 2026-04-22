const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect, protectSeller, adminOnly } = require('../middleware/auth');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Helper: Get the bulk price for a given quantity
const getBulkPrice = (product, quantity) => {
  if (!product.bulkPricing || product.bulkPricing.length === 0) {
    return product.price;
  }
  for (let i = product.bulkPricing.length - 1; i >= 0; i--) {
    const tier = product.bulkPricing[i];
    if (quantity >= tier.minQty) {
      return tier.price;
    }
  }
  return product.price;
};

// ───────────────────────────────────────────────────────
// POST /api/orders — Place a seller order
// Requires: approved seller
// Validates: each item quantity >= product MOQ
// ───────────────────────────────────────────────────────
router.post('/', protect, protectSeller, async (req, res) => {
  try {
    const { items, notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item',
      });
    }

    // Validate each item
    const orderItems = [];
    let totalAmount = 0;
    let totalUnits = 0;

    for (const item of items) {
      const { productId, quantity } = item;

      if (!productId || !quantity || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have a valid productId and quantity',
        });
      }

      const product = await Product.findById(productId);

      if (!product || !product.isActive) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${productId}`,
        });
      }

      // MOQ validation
      if (quantity < product.moq) {
        return res.status(400).json({
          success: false,
          message: `Minimum order quantity for "${product.title}" is ${product.moq} units. You requested ${quantity}.`,
        });
      }

      const unitPrice = getBulkPrice(product, quantity);
      const lineTotal = unitPrice * quantity;

      orderItems.push({
        productId: product._id,
        handle: product.handle,
        title: product.title,
        quantity,
        unitPrice,
        totalPrice: lineTotal,
      });

      totalAmount += lineTotal;
      totalUnits += quantity;
      console.log(`[ORDER_DEBUG] Product: ${product.title}, Qty: ${quantity}, UnitPrice: ${unitPrice}, LineTotal: ${lineTotal}`);
    }
    console.log(`[ORDER_DEBUG] Final TotalAmount: ${totalAmount}`);

    // Create the order in DB
    const { shippingAddress } = req.body;
    
    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required',
      });
    }

    const order = await Order.create({
      seller: req.seller._id,
      items: orderItems,
      totalAmount,
      totalUnits,
      status: 'pending',
      paymentStatus: 'pending',
      shippingAddress,
      notes: notes || '',
    });

    // Create Razorpay Order
    const options = {
      amount: Math.round(totalAmount * 100), // amount in smallest currency unit (paise)
      currency: 'INR',
      receipt: `order_rcptid_${order._id}`,
    };

    try {
      const razorpayOrder = await razorpay.orders.create(options);
      
      // Update order with Razorpay Order ID
      order.razorpayOrderId = razorpayOrder.id;
      await order.save();

      res.status(201).json({
        success: true,
        message: 'Order created for payment',
        data: {
          order,
          razorpayOrderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          keyId: process.env.RAZORPAY_KEY_ID,
        },
      });
    } catch (rzpError) {
      console.error('Razorpay order creation error:', rzpError);
      // Even if Razorpay fails, we have the order in DB, but the user can't pay.
      // We could delete the order or keep it as failed.
      res.status(500).json({
        success: false,
        message: 'Failed to initialize payment gateway',
        error: rzpError.message,
      });
    }
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while placing order',
    });
  }
});

// ───────────────────────────────────────────────────────
// GET /api/orders — Get seller's own orders
// ───────────────────────────────────────────────────────
router.get('/', protect, protectSeller, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { seller: req.seller._id };
    if (status) filter.status = status;

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'Orders retrieved successfully',
      data: orders,
      count: orders.length,
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders',
    });
  }
});

// ───────────────────────────────────────────────────────
// GET /api/orders/admin/all — Admin: Get all orders
// ───────────────────────────────────────────────────────
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    let query = Order.find(filter)
      .populate('seller', 'name email businessName')
      .sort({ createdAt: -1 });

    if (search) {
      // Search by seller fields after population on the in-memory list.
      const orders = await query;
      const searchText = String(search).toLowerCase();
      const filtered = orders.filter((order) => {
        const seller = order.seller || {};
        return (
          String(seller.name || '').toLowerCase().includes(searchText) ||
          String(seller.email || '').toLowerCase().includes(searchText) ||
          String(seller.businessName || '').toLowerCase().includes(searchText)
        );
      });

      return res.json({
        success: true,
        message: 'All orders retrieved successfully',
        data: filtered,
        count: filtered.length,
      });
    }

    const orders = await query;

    res.json({
      success: true,
      message: 'All orders retrieved successfully',
      data: orders,
      count: orders.length,
    });
  } catch (error) {
    console.error('Admin get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders',
    });
  }
});

// ───────────────────────────────────────────────────────
// PUT /api/orders/admin/:id/status — Admin: Update order status
// ───────────────────────────────────────────────────────
router.put('/admin/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('seller', 'name email businessName');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      message: `Order status updated to "${status}"`,
      data: order,
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating order',
    });
  }
});

// ───────────────────────────────────────────────────────
// GET /api/orders/:id — Get single order detail
// ───────────────────────────────────────────────────────
router.get('/:id', protect, protectSeller, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Sellers can only see their own orders; admins can see all
    if (
      req.seller.role !== 'admin' &&
      order.seller.toString() !== req.seller._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order',
      });
    }

    res.json({
      success: true,
      message: 'Order retrieved successfully',
      data: order,
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order',
    });
  }
});

// ───────────────────────────────────────────────────────
// POST /api/orders/verify — Verify Razorpay payment signature
// ───────────────────────────────────────────────────────
router.post('/verify', protect, protectSeller, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (isSignatureValid) {
      // Find order and update
      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          paymentStatus: 'captured',
          status: 'confirmed', // Automatically confirm on payment
        },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found for verification',
        });
      }

      res.status(200).json({
        success: true,
        message: 'Payment verified and order confirmed',
        data: order,
      });
    } else {
      // Update payment status as failed
      await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { paymentStatus: 'failed' }
      );

      res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during payment verification',
    });
  }
});

// ───────────────────────────────────────────────────────
// POST /api/orders/webhook — Razorpay Webhook
// ───────────────────────────────────────────────────────
router.post('/webhook', async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const shasum = crypto.createHmac('sha256', secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');

  if (digest === req.headers['x-razorpay-signature']) {
    const event = req.body.event;
    
    if (event === 'payment.captured' || event === 'order.paid') {
      const { order_id, id: payment_id } = req.body.payload.payment.entity;
      
      await Order.findOneAndUpdate(
        { razorpayOrderId: order_id },
        { 
          paymentStatus: 'captured',
          status: 'confirmed',
          razorpayPaymentId: payment_id
        }
      );
    }
    
    res.status(200).json({ status: 'ok' });
  } else {
    res.status(400).json({ status: 'invalid signature' });
  }
});

module.exports = router;
