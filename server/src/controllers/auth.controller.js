/**
 * @file auth.controller.js
 * @description Handles all authentication logic.
 * @route POST /api/auth/login
 * @route GET  /api/auth/me
 */
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User.model')

/**
 * POST /api/auth/login
 * Validates credentials and returns a signed JWT token.
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Compare password against stored hash
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Check account is active
    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is disabled. Contact your administrator.' })
    }

    // Sign JWT token with user ID
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    )

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * GET /api/auth/me
 * Returns current user info from JWT. Used by frontend on page load to validate session.
 */
const me = async (req, res, next) => {
  try {
    res.json({ user: req.user })
  } catch (error) {
    next(error)
  }
}

module.exports = { login, me }
