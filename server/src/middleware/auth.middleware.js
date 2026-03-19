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
      return res.status(401).json({ message: 'No token provided. Please log in.' })
    }

    const token = authHeader.split(' ')[1]

    // Verify token signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Fetch user from DB to ensure they still exist and are active
    const user = await User.findById(decoded.userId).select('-password')
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User not found or inactive.' })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired. Please log in again.' })
    }
    return res.status(401).json({ message: 'Invalid token. Please log in.' })
  }
}

module.exports = authMiddleware
