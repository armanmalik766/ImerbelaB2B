const express = require('express');
const jwt = require('jsonwebtoken');
const Seller = require('../models/Seller');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * Generate JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/**
 * @route   POST /api/seller/register
 * @desc    Register a new seller
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const {
      title,
      firstName,
      lastName,
      email,
      phone,
      businessName,
      businessType,
      gstNumber,
      addressLine1,
      addressLine2,
      city,
      district,
      state,
      pincode,
      password,
    } = req.body;

    // Check if seller already exists
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // Create seller
    const seller = await Seller.create({
      title,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim(),
      email,
      phone,
      businessName: businessName || '',
      businessType,
      gstNumber: gstNumber || '',
      addressLine1,
      addressLine2: addressLine2 || '',
      city,
      district,
      state,
      pincode,
      password,
      status: 'pending',
      role: 'seller',
    });

    res.status(201).json({
      success: true,
      message:
        'Registration successful. Your application is under review. You will be notified once approved.',
      data: {
        id: seller._id,
        name: seller.name,
        email: seller.email,
        status: seller.status,
      },
    });
  } catch (error) {
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join('. '),
      });
    }

    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
});

/**
 * @route   POST /api/seller/login
 * @desc    Login seller & return JWT
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    // Find seller and include password field for comparison
    const seller = await Seller.findOne({ email }).select('+password');

    if (!seller) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Check password
    const isMatch = await seller.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Check approval status (unless admin)
    if (seller.role !== 'admin' && seller.status !== 'approved') {
      let statusMessage = '';
      if (seller.status === 'pending') {
        statusMessage =
          'Your application is still under review. Please wait for approval.';
      } else if (seller.status === 'rejected') {
        statusMessage =
          'Your application has been rejected. Please contact support for more information.';
      }

      return res.status(403).json({
        success: false,
        message: statusMessage,
        status: seller.status,
      });
    }

    // Generate token
    const token = generateToken(seller._id);

    res.json({
      success: true,
      message: 'Login successful.',
      data: {
        id: seller._id,
        name: seller.name,
        email: seller.email,
        role: seller.role,
        status: seller.status,
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
});

/**
 * @route   GET /api/seller/me
 * @desc    Get current seller profile
 * @access  Protected
 */
router.get('/me', protect, async (req, res) => {
  try {
    const seller = await Seller.findById(req.seller._id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found.',
      });
    }

    res.json({
      success: true,
      data: seller,
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
});

module.exports = router;
