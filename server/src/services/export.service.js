/**
 * @file export.service.js
 * @description Generates Excel workbooks for payroll results and the census template.
 *              Uses SheetJS (xlsx) to build formatted spreadsheets.
 */
const XLSX = require('xlsx')
const { REQUIRED_CENSUS_COLUMNS, PAY_FREQUENCIES, FILING_STATUSES } = require('../config/constants')

/**
 * Generate a full payroll results Excel workbook.
 * @param {Object} results - Full comparison results object
 * @param {string} runId - Run identifier
 * @returns {Buffer} - Excel file buffer
 */
const generateResultsWorkbook = (results, runId) => {
  const wb = XLSX.utils.book_new()

  // Sheet 1: Summary
  const summaryData = [
    ['MoTek Payroll Modeling Sandbox — Results Summary'],
    ['Run ID:', runId],
    ['Generated:', new Date().toLocaleString()],
    ['Employees Processed:', results.employeeCount],
    [],
    ['Metric', 'Amount'],
    ['Total Employee Savings', results.savings?.totalEmployeeSavings || 0],
    ['Total Employer Savings', results.savings?.totalEmployerSavings || 0],
    ['Combined Savings', results.savings?.totalCombinedSavings || 0],
  ]
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary')

  // Sheet 2: Before vs After Comparison
  if (results.comparison?.employees?.length > 0) {
    const compHeaders = ['Employee ID', 'Name', 'Gross Wages', 'Normal Net Pay', 'Hybrid Net Pay', 'EE Savings', 'ER Savings', 'Solve Status']
    const compRows = results.comparison.employees.map(emp => [
      emp.employeeId, emp.name, emp.grossWages, emp.normalNetPay,
      emp.hybridNetPay, emp.employeeSavings, emp.employerSavings, emp.solveStatus,
    ])
    const compSheet = XLSX.utils.aoa_to_sheet([compHeaders, ...compRows])
    XLSX.utils.book_append_sheet(wb, compSheet, 'Before vs After')
  }

  // Sheet 3: Solver Results
  if (results.savings?.solverResults?.length > 0) {
    const solverHeaders = ['Employee ID', 'Name', 'VCAMP Target', 'WIMPER', 'SIMERP', 'Iterations', 'Status']
    const solverRows = results.savings.solverResults.map(r => [
      r.employeeId, r.name, r.vcampTarget, r.wimper, r.simerp, r.iterations, r.status,
    ])
    const solverSheet = XLSX.utils.aoa_to_sheet([solverHeaders, ...solverRows])
    XLSX.utils.book_append_sheet(wb, solverSheet, 'Solver Results')
  }

  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
}

/**
 * Generate the blank census template Excel file.
 * Includes all required columns, a sample row, and instructions.
 * @returns {Buffer} - Excel file buffer
 */
const generateTemplate = () => {
  const wb = XLSX.utils.book_new()

  // Instructions sheet
  const instructions = [
    ['MoTek Payroll Census Template — Instructions'],
    [],
    ['1. Do NOT modify or rename any column headers'],
    ['2. Fill in one employee per row starting from row 3'],
    ['3. All fields are required unless noted'],
    ['4. pay_frequency must be: weekly, biweekly, semimonthly, or monthly'],
    ['5. filing_status must be: single, married, or head_of_household'],
    ['6. state must be a 2-letter state code (e.g. TX, CA, NY)'],
    ['7. All monetary values should be per pay period amounts'],
    ['8. vcamp_target is the desired payroll tax savings target per pay period'],
  ]
  const instrSheet = XLSX.utils.aoa_to_sheet(instructions)
  XLSX.utils.book_append_sheet(wb, instrSheet, 'Instructions')

  // Census template sheet with headers and sample row
  const headers = REQUIRED_CENSUS_COLUMNS
  const sampleRow = [
    'EMP001', 'John', 'Smith', '1234', 'biweekly', 3500.00,
    'single', 1, 'TX', 150.00, 300.00, 25.00, 50.00, 10.00,
    20.00, 50.00, 25.00, 200.00,
  ]

  const censusSheet = XLSX.utils.aoa_to_sheet([headers, sampleRow])
  XLSX.utils.book_append_sheet(wb, censusSheet, 'Census')

  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
}

module.exports = { generateResultsWorkbook, generateTemplate }
