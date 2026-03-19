/**
 * @file auth.routes.js
 * @description Authentication routes.
 * @route POST /api/auth/login
 * @route GET  /api/auth/me
 */
const express = require('express')
const { body } = require('express-validator')
const { login, me } = require('../controllers/auth.controller')
const authMiddleware = require('../middleware/auth.middleware')
const validate = require('../middleware/validate.middleware')

const router = express.Router()

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
)

// GET /api/auth/me — protected
router.get('/me', authMiddleware, me)

module.exports = router
