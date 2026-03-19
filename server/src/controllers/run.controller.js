/**
 * @file run.controller.js
 * @description Orchestrates the full payroll run lifecycle.
 *              Coordinates census parsing, solver invocation, Rollfi submission,
 *              comparison generation, and result storage in memory.
 * @route POST /api/run/bulk
 * @route POST /api/run/single
 * @route GET  /api/run/results/:runId
 */
const { v4: uuidv4 } = require('uuid')
const censusService = require('../services/census.service')
const solverService = require('../services/solver.service')
const rollfiService = require('../services/rollfi.service')
const comparisonService = require('../services/comparison.service')

// In-memory store for run results — ephemeral, cleared when server restarts
const runStore = new Map()

/**
 * POST /api/run/bulk
 * Processes an uploaded census Excel file through the full payroll simulation pipeline.
 */
const startBulkRun = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No census file uploaded.' })
    }

    // Step 1: Parse and validate the uploaded Excel file
    const { employees, validationErrors } = await censusService.parseAndValidate(req.file.buffer)

    if (validationErrors.length > 0) {
      return res.status(422).json({
        message: 'Census file has validation errors. Please fix and re-upload.',
        validationErrors,
      })
    }

    // Step 2: Run Python solver to calculate WIMPER and SIMERP per employee
    const solverResults = await solverService.solve(employees)

    // Step 3: Submit both scenarios to Rollfi
    const normalPayroll = await rollfiService.runPayroll(employees, 'normal', [])
    const hybridPayroll = await rollfiService.runPayroll(employees, 'hybrid', solverResults)

    // Step 4: Build comparison and reporting outputs
    const results = comparisonService.buildComparison(employees, normalPayroll, hybridPayroll, solverResults)

    // Step 5: Store results in memory with a unique run ID
    const runId = uuidv4()
    runStore.set(runId, { results, createdAt: new Date() })

    res.json({ runId, employeeCount: employees.length, message: 'Run complete' })
  } catch (error) {
    next(error)
  }
}

/**
 * POST /api/run/single
 * Runs payroll simulation for a single employee from form data.
 */
const startSingleRun = async (req, res, next) => {
  try {
    const employeeData = req.body

    // Wrap single employee in array for consistent processing
    const employees = [{ ...employeeData, employee_id: employeeData.employee_id || uuidv4() }]

    // Validate the single employee record
    const { validationErrors } = await censusService.validateEmployees(employees)
    if (validationErrors.length > 0) {
      return res.status(422).json({ message: 'Invalid employee data', validationErrors })
    }

    // Run solver, Rollfi, and build comparison — same pipeline as bulk
    const solverResults = await solverService.solve(employees)
    const normalPayroll = await rollfiService.runPayroll(employees, 'normal', [])
    const hybridPayroll = await rollfiService.runPayroll(employees, 'hybrid', solverResults)
    const results = comparisonService.buildComparison(employees, normalPayroll, hybridPayroll, solverResults)

    const runId = uuidv4()
    runStore.set(runId, { results, createdAt: new Date() })

    res.json({ runId, employeeCount: 1, message: 'Single employee run complete' })
  } catch (error) {
    next(error)
  }
}

/**
 * GET /api/run/results/:runId
 * Retrieves stored results for a completed run.
 */
const getResults = async (req, res, next) => {
  try {
    const { runId } = req.params
    const run = runStore.get(runId)

    if (!run) {
      return res.status(404).json({ message: 'Run not found. Results are temporary and may have expired.' })
    }

    res.json({ runId, results: run.results })
  } catch (error) {
    next(error)
  }
}

// Export runStore so export controller can access results
module.exports = { startBulkRun, startSingleRun, getResults, runStore }
