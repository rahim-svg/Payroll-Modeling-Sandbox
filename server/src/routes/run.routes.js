/**
 * @file run.routes.js
 * @description Payroll run routes.
 * @route POST /api/run/bulk
 * @route POST /api/run/single
 * @route GET  /api/run/results/:runId
 */
const express = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const upload = require('../middleware/upload.middleware')
const { startBulkRun, startSingleRun, getResults } = require('../controllers/run.controller')

const router = express.Router()

// All run routes require authentication
router.use(authMiddleware)

// POST /api/run/bulk — upload and run census file
router.post('/bulk', upload.single('census'), startBulkRun)

// POST /api/run/single — run single employee from form data
router.post('/single', startSingleRun)

// GET /api/run/results/:runId — retrieve run results
router.get('/results/:runId', getResults)

module.exports = router
