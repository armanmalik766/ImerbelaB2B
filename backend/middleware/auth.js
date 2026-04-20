const jwt = require('jsonwebtoken');
const Seller = require('../models/Seller');

/**
 * Protect routes — verify JWT token and attach seller to request
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. No token provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.seller = await Seller.findById(decoded.id).select('-password');

    if (!req.seller) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. User not found.',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Invalid token.',
    });
  }
};

/**
 * Admin-only middleware — must be used after protect
 */
const adminOnly = (req, res, next) => {
  if (req.seller && req.seller.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    });
  }
};

/**
 * Approved Seller Only — must be used after protect
 * Ensures user is an approved seller (or admin)
 */
const protectSeller = (req, res, next) => {
  if (!req.seller) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Please log in.',
    });
  }

  if (req.seller.role === 'admin') {
    return next(); // Admins bypass approval check
  }

  if (req.seller.status !== 'approved') {
    return res.status(403).json({
      success: false,
      message:
        req.seller.status === 'pending'
          ? 'Your account is still under review. Please wait for approval.'
          : 'Your account has been rejected. Contact support for details.',
    });
  }

  next();
};

/**
 * Optional Auth — does NOT reject unauthenticated requests
 * If token present, attaches seller to req; otherwise passes through
 */
const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(); // No token — proceed as guest
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.seller = await Seller.findById(decoded.id).select('-password');
  } catch {
    // Invalid token — proceed as guest
  }

  next();
};

/**
 * Hide Price — strips price/bulkPricing from product data for non-approved users
 * Must be used after optionalAuth
 * Modifies res.json to intercept product responses
 */
const hidePrice = (req, res, next) => {
  const isApproved =
    req.seller &&
    (req.seller.status === 'approved' || req.seller.role === 'admin');

  if (isApproved) {
    return next(); // Full access
  }

  // Override res.json to strip price fields
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (body && body.data) {
      const stripPrice = (product) => {
        if (!product) return product;
        const obj = product.toObject ? product.toObject() : { ...product };
        delete obj.price;
        delete obj.bulkPricing;
        obj.priceHidden = true;
        return obj;
      };

      if (Array.isArray(body.data)) {
        body.data = body.data.map(stripPrice);
      } else if (body.data && body.data.handle) {
        body.data = stripPrice(body.data);
      }
    }
    return originalJson(body);
  };

  next();
};

module.exports = { protect, adminOnly, protectSeller, optionalAuth, hidePrice };
