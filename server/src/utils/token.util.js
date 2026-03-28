/**
 * @file token.util.js
 * @description Utility functions for JWT token generation and verification.
 *              Handles access token creation and validation.
 * @requires    jsonwebtoken, dotenv
 */

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  throw new Error(
    '❌ JWT_SECRET not defined in .env file. Add a secure secret (minimum 32 characters).'
  );
}

/**
 * Generate JWT access token
 *
 * @param {string} userId - User ID to encode in token
 * @returns {string} JWT token
 */
export const generateAccessToken = (userId) => {
  try {
    const token = jwt.sign(
      { userId },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    return token;
  } catch (error) {
    throw new Error(`Token generation failed: ${error.message}`);
  }
};

/**
 * Verify JWT access token
 * Throws error if token is invalid, expired, or malformed
 *
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload { userId, iat, exp }
 * @throws {Error} If token is invalid or expired
 */
export const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw error;
  }
};

/**
 * Extract token from Authorization header
 * Expected format: "Bearer <token>"
 *
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Token if valid format, null otherwise
 */
export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7); // Remove "Bearer " prefix
};
