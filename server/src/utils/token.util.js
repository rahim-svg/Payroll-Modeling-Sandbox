/**
 * @file token.util.js
 * @description JWT token generation and verification utilities.
 */
const jwt = require('jsonwebtoken')

// Generate a signed JWT for a user
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  })
}

// Verify a JWT and return the decoded payload
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET)
}

module.exports = { generateToken, verifyToken }
