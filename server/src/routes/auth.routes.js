/**
 * @file auth.routes.js
 * @description Authentication routes.
 * @route POST /api/auth/login
 * @route GET  /api/auth/me
 */
const express = require('express')
const { body } = require('express-validator')
const { login, getMe } = require('../controllers/auth.controller')
const validate = require('../middleware/validate.middleware')
const authMiddleware = require('../middleware/auth.middleware')

const router = express.Router()

// Login — validate email and password before hitting controller
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
)

// Get current user — requires valid JWT
router.get('/me', authMiddleware, getMe)

module.exports = router
