/**
 * @file census.routes.js
 * @description Census validation route — allows pre-validation without running full pipeline.
 * @route POST /api/census/validate
 */
const express = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const upload = require('../middleware/upload.middleware')
const censusService = require('../services/census.service')

const router = express.Router()

// POST /api/census/validate — validate file without running
router.post('/validate', authMiddleware, upload.single('census'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })
    const { employees, validationErrors } = await censusService.parseAndValidate(req.file.buffer)
    res.json({
      valid: validationErrors.length === 0,
      employeeCount: employees.length,
      validationErrors,
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
