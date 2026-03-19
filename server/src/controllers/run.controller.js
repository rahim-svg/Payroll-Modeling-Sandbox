/**
 * @file run.controller.js
 * @description Orchestrates the full payroll simulation run.
 *              Coordinates: solver → Rollfi → comparison → results.
 * @route POST /api/run/bulk
 * @route POST /api/run/single
 * @route GET  /api/run/:runId/status
 * @route GET  /api/run/:runId/results
 */
const { v4: uuidv4 } = require('uuid')
const censusService = require('../services/census.service')
const solverService = require('../services/solver.service')
const rollfiService = require('../services/rollfi.service')
const comparisonService = require('../services/comparison.service')

// In-memory run store — ephemeral, cleared when server restarts
const runStore = new Map()

/**
 * POST /api/run/bulk
 * Full bulk payroll simulation run from uploaded census
 */
const bulkRun = async (req, res, next) => {
  try {
    const { employees } = req.body

    if (!employees || !Array.isArray(employees) || employees.length === 0) {
      return res.status(400).json({ success: false, message: 'No employee data provided' })
    }

    // Create a unique run ID for this simulation
    const runId = uuidv4()
    runStore.set(runId, { status: 'solving', startedAt: new Date(), employees: [] })

    // Run solver and Rollfi async — return runId immediately
    res.json({ success: true, runId, message: 'Run started' })

    // Process in background
    processRun(runId, employees)
  } catch (error) {
    next(error)
  }
}

/**
 * POST /api/run/single
 * Single employee payroll simulation
 */
const singleRun = async (req, res, next) => {
  try {
    const { employee } = req.body

    if (!employee) {
      return res.status(400).json({ success: false, message: 'No employee data provided' })
    }

    const runId = uuidv4()
    runStore.set(runId, { status: 'solving', startedAt: new Date(), employees: [] })

    res.json({ success: true, runId, message: 'Single employee run started' })

    processRun(runId, [employee])
  } catch (error) {
    next(error)
  }
}

/**
 * GET /api/run/:runId/status
 * Returns current status of a run
 */
const getRunStatus = async (req, res, next) => {
  try {
    const { runId } = req.params
    const run = runStore.get(runId)

    if (!run) {
      return res.status(404).json({ success: false, message: 'Run not found' })
    }

    res.json({ success: true, runId, status: run.status, error: run.error || null })
  } catch (error) {
    next(error)
  }
}

/**
 * GET /api/run/:runId/results
 * Returns full results of a completed run
 */
const getRunResults = async (req, res, next) => {
  try {
    const { runId } = req.params
    const run = runStore.get(runId)

    if (!run) {
      return res.status(404).json({ success: false, message: 'Run not found' })
    }

    if (run.status !== 'complete') {
      return res.status(400).json({ success: false, message: `Run is not complete. Current status: ${run.status}` })
    }

    res.json({ success: true, runId, results: run.results })
  } catch (error) {
    next(error)
  }
}

/**
 * Internal async run processor
 * Runs solver → Rollfi → comparison and stores results
 */
const processRun = async (runId, employees) => {
  try {
    // Step 1: Run Python solver for WIMPER/SIMERP
    runStore.get(runId).status = 'solving'
    const solverResults = await solverService.solve(employees)

    // Step 2: Submit both scenarios to Rollfi
    runStore.get(runId).status = 'submitting'
    const normalResults = await rollfiService.runNormalPayroll(employees)
    const hybridResults = await rollfiService.runHybridPayroll(employees, solverResults)

    // Step 3: Generate comparison
    runStore.get(runId).status = 'processing'
    const comparison = comparisonService.compare(normalResults, hybridResults, solverResults)

    // Step 4: Store results
    runStore.set(runId, {
      ...runStore.get(runId),
      status: 'complete',
      completedAt: new Date(),
      results: comparison,
    })
  } catch (error) {
    console.error(`[RUN ${runId}] Failed:`, error.message)
    runStore.set(runId, {
      ...runStore.get(runId),
      status: 'failed',
      error: error.message,
    })
  }
}

module.exports = { bulkRun, singleRun, getRunStatus, getRunResults, runStore }
