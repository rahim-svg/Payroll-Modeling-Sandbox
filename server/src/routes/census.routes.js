/**
 * @file census.routes.js
 * @description Census file upload and template download routes.
 * @route POST /api/census/upload
 * @route GET  /api/census/template
 */
const express = require('express')
const { uploadCensus, downloadTemplate } = require('../controllers/census.controller')
const authMiddleware = require('../middleware/auth.middleware')
const upload = require('../middleware/upload.middleware')

const router = express.Router()

// All census routes require authentication
router.use(authMiddleware)

// Upload and validate census Excel file
router.post('/upload', upload.single('census'), uploadCensus)

// Download the census template
router.get('/template', downloadTemplate)

module.exports = router
