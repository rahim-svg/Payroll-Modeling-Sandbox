/**
 * @file census.service.js
 * @description Parses and validates uploaded census Excel files.
 *              Returns structured employee objects or field-level validation errors.
 */
const XLSX = require('xlsx')
const { REQUIRED_CENSUS_COLUMNS, BENEFITS_TYPES, PAY_SCHEDULES } = require('../config/constants')

/**
 * Parses an Excel buffer and validates the census data
 * @param {Buffer} buffer - Excel file buffer from Multer
 * @returns {{ valid: boolean, employees: Array, errors: Array, warnings: Array }}
 */
const parseAndValidate = async (buffer) => {
  const errors = []
  const warnings = []

  // Read workbook from buffer
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })

  if (rows.length === 0) {
    return { valid: false, employees: [], errors: [{ field: 'file', message: 'Census file is empty' }], warnings }
  }

  // Validate all required columns are present
  const headers = Object.keys(rows[0])
  const missingColumns = REQUIRED_CENSUS_COLUMNS.filter((col) => !headers.includes(col))
  if (missingColumns.length > 0) {
    return {
      valid: false,
      employees: [],
      errors: missingColumns.map((col) => ({ field: col, message: `Missing required column: ${col}` })),
      warnings,
    }
  }

  // Validate each row
  const employees = []
  rows.forEach((row, index) => {
    const rowNum = index + 2 // Excel row number (1-indexed + header)
    const rowErrors = []

    // Validate EmployeeID
    if (!row.EmployeeID) rowErrors.push({ field: `Row ${rowNum} EmployeeID`, message: 'EmployeeID is required' })

    // Validate GrossPay
    const grossPay = parseFloat(row.GrossPay)
    if (isNaN(grossPay) || grossPay <= 0) {
      rowErrors.push({ field: `Row ${rowNum} GrossPay`, message: 'GrossPay must be a positive number' })
    }

    // Validate PaySchedule
    if (!PAY_SCHEDULES.includes(row.PaySchedule?.toLowerCase())) {
      rowErrors.push({
        field: `Row ${rowNum} PaySchedule`,
        message: `PaySchedule must be one of: ${PAY_SCHEDULES.join(', ')}`,
      })
    }

    // Validate VCAMP
    const vcamp = parseFloat(row.VCAMP)
    if (isNaN(vcamp) || vcamp < 0) {
      rowErrors.push({ field: `Row ${rowNum} VCAMP`, message: 'VCAMP must be a non-negative number' })
    }

    if (rowErrors.length > 0) {
      errors.push(...rowErrors)
    } else {
      // Build clean employee object
      employees.push({
        employeeId: String(row.EmployeeID),
        firstName: String(row.FirstName),
        lastName: String(row.LastName),
        grossPay: parseFloat(row.GrossPay),
        paySchedule: row.PaySchedule.toLowerCase(),
        filingStatus: row.FilingStatus,
        state: row.State,
        vcamp: parseFloat(row.VCAMP),
        benefits: {
          medical: parseFloat(row.Medical) || 0,
          dental: parseFloat(row.Dental) || 0,
          vision: parseFloat(row.Vision) || 0,
          debitCard: parseFloat(row.DebitCard) || 0,
          ancillary: parseFloat(row.Ancillary) || 0,
        },
      })
    }
  })

  return {
    valid: errors.length === 0,
    employees,
    errors,
    warnings,
  }
}

module.exports = { parseAndValidate }
