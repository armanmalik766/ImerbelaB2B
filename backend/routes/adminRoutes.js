const express = require('express');
const Seller = require('../models/Seller');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

/**
 * @route   GET /api/admin/sellers
 * @desc    Get all sellers
 * @access  Admin
 */
router.get('/sellers', async (req, res) => {
  try {
    const { status, search } = req.query;

    let query = { role: 'seller' }; // Only return sellers, not admins

    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { businessName: { $regex: search, $options: 'i' } },
      ];
    }

    const sellers = await Seller.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: sellers.length,
      data: sellers,
    });
  } catch (error) {
    console.error('Admin sellers list error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
});

/**
 * @route   GET /api/admin/sellers/:id
 * @desc    Get single seller profile by id
 * @access  Admin
 */
router.get('/sellers/:id', async (req, res) => {
  try {
    const seller = await Seller.findOne({ _id: req.params.id, role: 'seller' });

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
    console.error('Admin seller detail error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
});

/**
 * @route   PUT /api/admin/approve/:id
 * @desc    Approve a seller
 * @access  Admin
 */
router.put('/approve/:id', async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found.',
      });
    }

    if (seller.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify admin accounts.',
      });
    }

    seller.status = 'approved';
    await seller.save();

    res.json({
      success: true,
      message: `Seller "${seller.businessName}" has been approved.`,
      data: seller,
    });
  } catch (error) {
    console.error('Approve error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
});

/**
 * @route   PUT /api/admin/reject/:id
 * @desc    Reject a seller
 * @access  Admin
 */
router.put('/reject/:id', async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found.',
      });
    }

    if (seller.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify admin accounts.',
      });
    }

    seller.status = 'rejected';
    await seller.save();

    res.json({
      success: true,
      message: `Seller "${seller.businessName}" has been rejected.`,
      data: seller,
    });
  } catch (error) {
    console.error('Reject error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
});

module.exports = router;
