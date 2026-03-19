/**
 * @file auth.middleware.js
 * @description JWT authentication middleware.
 *              Validates Bearer token on every protected route.
 *              Attaches decoded user to req.user for downstream use.
 */
const jwt = require('jsonwebtoken')
const User = require('../models/User.model')

const authMiddleware = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]

    // Verify token signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach user to request
    const user = await User.findById(decoded.userId).select('-password')
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' })
  }
}

module.exports = authMiddleware
