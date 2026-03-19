/**
 * @file export.routes.js
 * @description Export routes for Excel report download.
 * @route GET /api/export/:runId
 */
const express = require('express')
const { exportRun } = require('../controllers/export.controller')
const authMiddleware = require('../middleware/auth.middleware')

const router = express.Router()

router.use(authMiddleware)
router.get('/:runId', exportRun)

module.exports = router
