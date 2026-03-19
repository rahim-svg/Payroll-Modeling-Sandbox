/**
 * @file token.util.js
 * @description JWT token generation utility.
 */
const jwt = require('jsonwebtoken')

/**
 * Generates a signed JWT for a given user ID
 * @param {string} userId - MongoDB user _id
 * @returns {string} Signed JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  )
}

module.exports = { generateToken }
