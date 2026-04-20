const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const Product = require('../models/Product');
const { optionalAuth, hidePrice, protect, adminOnly } = require('../middleware/auth');

// Helper to clean body for updates
const cleanUpdateBody = (body) => {
  const clean = { ...body };
  delete clean._id;
  delete clean.__v;
  delete clean.createdAt;
  delete clean.updatedAt;
  return clean;
};

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only images (jpg, jpeg, png, webp) are allowed!'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// ───────────────────────────────────────────────────────
// GET /api/products — List all ACTIVE products
// Uses optionalAuth + hidePrice: prices hidden for non-approved users
// ───────────────────────────────────────────────────────
router.get('/', optionalAuth, hidePrice, async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'Products retrieved successfully',
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products',
    });
  }
});

// ───────────────────────────────────────────────────────
// GET /api/products/admin/all — List ALL products for Admin
// ───────────────────────────────────────────────────────
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json({
      success: true,
      message: 'All products retrieved successfully',
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error('Admin get products error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ───────────────────────────────────────────────────────
// POST /api/products/upload — Upload product image (Admin only)
// ───────────────────────────────────────────────────────
router.post('/upload', protect, adminOnly, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }
    
    // Construct the URL to be used by the frontend
    // Assuming backend is at http://localhost:5000
    const imageUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: imageUrl,
        filename: req.file.filename
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ───────────────────────────────────────────────────────
// GET /api/products/:handle — Get single product by handle
// ───────────────────────────────────────────────────────
router.get('/:handle', optionalAuth, hidePrice, async (req, res) => {
  try {
    const product = await Product.findOne({
      handle: req.params.handle,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      message: 'Product retrieved successfully',
      data: product,
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product',
    });
  }
});

// ───────────────────────────────────────────────────────
// POST /api/products — Create product (Admin only)
// ───────────────────────────────────────────────────────
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    console.error('Create product error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A product with this handle already exists',
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating product',
    });
  }
});

// ───────────────────────────────────────────────────────
// PUT /api/products/:id — Update product (Admin only)
// ───────────────────────────────────────────────────────
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const updateData = cleanUpdateBody(req.body);
    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ───────────────────────────────────────────────────────
// DELETE /api/products/:id — Toggle product active status (Admin only)
// ───────────────────────────────────────────────────────
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.isActive = !product.isActive;
    await product.save();

    res.json({
      success: true,
      message: `Product ${product.isActive ? 'activated' : 'deactivated'} successfully`,
      data: product,
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ───────────────────────────────────────────────────────
// POST /api/products/admin/bulk-price — Bulk price adjustment
// ───────────────────────────────────────────────────────
router.post('/admin/bulk-price', protect, adminOnly, async (req, res) => {
  try {
    const { type, value, action } = req.body; // type: 'percentage'|'fixed', action: 'increase'|'decrease'
    
    if (!['percentage', 'fixed'].includes(type) || !['increase', 'decrease'].includes(action) || isNaN(value)) {
      return res.status(400).json({ success: false, message: 'Invalid adjustment parameters' });
    }

    const products = await Product.find({});
    const bulkOps = products.map(product => {
      let newPrice = product.price;
      const val = Number(value);

      if (type === 'percentage') {
        const diff = (newPrice * val) / 100;
        newPrice = action === 'increase' ? newPrice + diff : newPrice - diff;
      } else {
        newPrice = action === 'increase' ? newPrice + val : newPrice - val;
      }

      newPrice = Math.max(0, newPrice);

      const newBulkPricing = (product.bulkPricing || []).map(tier => {
        let tierPrice = tier.price;
        if (type === 'percentage') {
          const diff = (tierPrice * val) / 100;
          tierPrice = action === 'increase' ? tierPrice + diff : tierPrice - diff;
        } else {
          tierPrice = action === 'increase' ? tierPrice + val : tierPrice - val;
        }
        return { 
          minQty: tier.minQty,
          maxQty: tier.maxQty,
          label: tier.label,
          price: Math.max(0, tierPrice) 
        };
      });

      return {
        updateOne: {
          filter: { _id: product._id },
          update: { $set: { price: newPrice, bulkPricing: newBulkPricing } }
        }
      };
    });

    if (bulkOps.length > 0) {
      await Product.bulkWrite(bulkOps);
    }

    res.json({
      success: true,
      message: `Successfully updated prices for ${products.length} products`,
    });
  } catch (error) {
    console.error('Bulk price adjustment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

