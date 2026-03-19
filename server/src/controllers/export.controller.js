/**
 * @file export.controller.js
 * @description Handles Excel export generation.
 *              Generates payroll results workbook and census template for download.
 * @route GET /api/export/excel/:runId
 * @route GET /api/export/template
 */
const exportService = require('../services/export.service')
const { runStore } = require('./run.controller')

/**
 * GET /api/export/excel/:runId
 * Generates and streams an Excel workbook for a completed payroll run.
 */
const downloadExcel = async (req, res, next) => {
  try {
    const { runId } = req.params
    const run = runStore.get(runId)

    if (!run) {
      return res.status(404).json({ message: 'Run not found or results have expired.' })
    }

    const buffer = await exportService.generateResultsWorkbook(run.results, runId)

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename=payroll-results-${runId}.xlsx`)
    res.send(buffer)
  } catch (error) {
    next(error)
  }
}

/**
 * GET /api/export/template
 * Generates and streams the blank census template Excel file.
 */
const downloadTemplate = async (req, res, next) => {
  try {
    const buffer = await exportService.generateTemplate()

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', 'attachment; filename=payroll-census-template.xlsx')
    res.send(buffer)
  } catch (error) {
    next(error)
  }
}

module.exports = { downloadExcel, downloadTemplate }
