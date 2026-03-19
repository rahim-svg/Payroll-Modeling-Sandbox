/**
 * @file census.controller.js
 * @description Handles census file upload, parsing, and validation.
 * @route POST /api/census/upload
 * @route GET  /api/census/template
 */
const censusService = require('../services/census.service')
const exportService = require('../services/export.service')

/**
 * POST /api/census/upload
 * Accepts Excel file, parses and validates it, returns structured employee data
 */
const uploadCensus = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' })
    }

    // Parse and validate the uploaded Excel buffer
    const result = await censusService.parseAndValidate(req.file.buffer)

    if (!result.valid) {
      return res.status(400).json({
        success: false,
        message: 'Census file has validation errors',
        errors: result.errors,
      })
    }

    res.json({
      success: true,
      message: `${result.employees.length} employee(s) parsed successfully`,
      employees: result.employees,
      warnings: result.warnings,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * GET /api/census/template
 * Generates and returns the census Excel template for download
 */
const downloadTemplate = async (req, res, next) => {
  try {
    const buffer = await exportService.generateCensusTemplate()

    res.setHeader('Content-Disposition', 'attachment; filename="payroll_census_template.xlsx"')
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.send(buffer)
  } catch (error) {
    next(error)
  }
}

module.exports = { uploadCensus, downloadTemplate }
