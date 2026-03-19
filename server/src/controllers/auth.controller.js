/**
 * @file auth.controller.js
 * @description Handles authentication logic — login and token validation.
 * @route POST /api/auth/login
 * @route GET  /api/auth/me
 */
const bcrypt = require('bcryptjs')
const User = require('../models/User.model')
const { generateToken } = require('../utils/token.util')

/**
 * POST /api/auth/login
 * Validates credentials and returns JWT token
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    // Compare submitted password against stored hash
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' })
    }

    // Generate JWT
    const token = generateToken(user._id)

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * GET /api/auth/me
 * Returns current user from valid JWT (used to validate token on app load)
 */
const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { login, getMe }
