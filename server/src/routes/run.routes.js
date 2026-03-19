/**
 * @file run.routes.js
 * @description Payroll simulation run routes.
 * @route POST /api/run/bulk
 * @route POST /api/run/single
 * @route GET  /api/run/:runId/status
 * @route GET  /api/run/:runId/results
 */
const express = require('express')
const { bulkRun, singleRun, getRunStatus, getRunResults } = require('../controllers/run.controller')
const authMiddleware = require('../middleware/auth.middleware')

const router = express.Router()

router.use(authMiddleware)

router.post('/bulk', bulkRun)
router.post('/single', singleRun)
router.get('/:runId/status', getRunStatus)
router.get('/:runId/results', getRunResults)

module.exports = router
