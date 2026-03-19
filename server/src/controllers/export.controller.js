/**
 * @file export.controller.js
 * @description Handles Excel export of payroll run results.
 * @route GET /api/export/:runId
 */
const exportService = require('../services/export.service')
const { runStore } = require('./run.controller')

/**
 * GET /api/export/:runId
 * Generates and streams Excel report for a completed run
 */
const exportRun = async (req, res, next) => {
  try {
    const { runId } = req.params
    const run = runStore.get(runId)

    if (!run) {
      return res.status(404).json({ success: false, message: 'Run not found' })
    }

    if (run.status !== 'complete') {
      return res.status(400).json({ success: false, message: 'Run is not complete yet' })
    }

    // Generate Excel buffer from results
    const buffer = await exportService.generateResultsExcel(run.results, runId)

    res.setHeader('Content-Disposition', `attachment; filename="payroll_results_${runId}.xlsx"`)
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.send(buffer)
  } catch (error) {
    next(error)
  }
}

module.exports = { exportRun }
