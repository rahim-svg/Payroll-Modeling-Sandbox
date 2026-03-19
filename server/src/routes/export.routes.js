/**
 * @file export.routes.js
 * @description Export routes for Excel download.
 * @route GET /api/export/excel/:runId
 * @route GET /api/export/template
 */
const express = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const { downloadExcel, downloadTemplate } = require('../controllers/export.controller')

const router = express.Router()

// All export routes require authentication
router.use(authMiddleware)

router.get('/excel/:runId', downloadExcel)
router.get('/template', downloadTemplate)

module.exports = router
