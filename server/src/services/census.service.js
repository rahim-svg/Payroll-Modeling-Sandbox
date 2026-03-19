/**
 * @file census.service.js
 * @description Parses and validates payroll census Excel files.
 *              Returns structured employee records or field-level validation errors.
 */
const XLSX = require('xlsx')
const { REQUIRED_CENSUS_COLUMNS, PAY_FREQUENCIES, FILING_STATUSES } = require('../config/constants')

/**
 * Parse an Excel buffer and validate all employee rows.
 * @param {Buffer} buffer - The uploaded Excel file buffer
 * @returns {{ employees: Array, validationErrors: Array }}
 */
const parseAndValidate = async (buffer) => {
  // Read workbook from buffer
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })

  if (rows.length === 0) {
    return { employees: [], validationErrors: [{ row: 1, field: 'file', message: 'Census file is empty or has no data rows.' }] }
  }

  // Check required columns exist
  const headers = Object.keys(rows[0])
  const missingColumns = REQUIRED_CENSUS_COLUMNS.filter(col => !headers.includes(col))
  if (missingColumns.length > 0) {
    return {
      employees: [],
      validationErrors: missingColumns.map(col => ({
        row: 'header',
        field: col,
        message: `Required column "${col}" is missing from the file.`,
      })),
    }
  }

  return validateEmployees(rows)
}

/**
 * Validate an array of employee records.
 * @param {Array} employees
 * @returns {{ employees: Array, validationErrors: Array }}
 */
const validateEmployees = (employees) => {
  const validationErrors = []
  const validEmployees = []

  employees.forEach((row, index) => {
    const rowNum = index + 2 // +2 because row 1 is header
    const rowErrors = []

    // Validate required string fields
    if (!row.employee_id) rowErrors.push({ row: rowNum, field: 'employee_id', message: 'Employee ID is required' })
    if (!row.first_name) rowErrors.push({ row: rowNum, field: 'first_name', message: 'First name is required' })
    if (!row.last_name) rowErrors.push({ row: rowNum, field: 'last_name', message: 'Last name is required' })

    // Validate pay frequency
    if (!PAY_FREQUENCIES.includes(row.pay_frequency)) {
      rowErrors.push({ row: rowNum, field: 'pay_frequency', message: `Pay frequency must be one of: ${PAY_FREQUENCIES.join(', ')}` })
    }

    // Validate filing status
    if (!FILING_STATUSES.includes(row.filing_status)) {
      rowErrors.push({ row: rowNum, field: 'filing_status', message: `Filing status must be one of: ${FILING_STATUSES.join(', ')}` })
    }

    // Validate numeric fields
    const numericFields = ['gross_wages', 'medical_ee', 'medical_er', 'dental_ee', 'dental_er', 'vision_ee', 'vision_er', 'debit_card', 'ancillary', 'vcamp_target']
    numericFields.forEach(field => {
      const val = parseFloat(row[field])
      if (isNaN(val) || val < 0) {
        rowErrors.push({ row: rowNum, field, message: `${field} must be a non-negative number` })
      }
    })

    // Validate gross wages is positive
    if (parseFloat(row.gross_wages) <= 0) {
      rowErrors.push({ row: rowNum, field: 'gross_wages', message: 'Gross wages must be greater than 0' })
    }

    if (rowErrors.length > 0) {
      validationErrors.push(...rowErrors)
    } else {
      // Normalize numeric values
      validEmployees.push({
        employee_id: String(row.employee_id),
        first_name: String(row.first_name).trim(),
        last_name: String(row.last_name).trim(),
        ssn_last4: String(row.ssn_last4 || '').trim(),
        pay_frequency: row.pay_frequency,
        gross_wages: parseFloat(row.gross_wages),
        filing_status: row.filing_status,
        federal_allowances: parseInt(row.federal_allowances) || 0,
        state: String(row.state || '').toUpperCase(),
        medical_ee: parseFloat(row.medical_ee) || 0,
        medical_er: parseFloat(row.medical_er) || 0,
        dental_ee: parseFloat(row.dental_ee) || 0,
        dental_er: parseFloat(row.dental_er) || 0,
        vision_ee: parseFloat(row.vision_ee) || 0,
        vision_er: parseFloat(row.vision_er) || 0,
        debit_card: parseFloat(row.debit_card) || 0,
        ancillary: parseFloat(row.ancillary) || 0,
        vcamp_target: parseFloat(row.vcamp_target) || 0,
      })
    }
  })

  return { employees: validEmployees, validationErrors }
}

module.exports = { parseAndValidate, validateEmployees }
