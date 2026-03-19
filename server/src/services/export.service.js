/**
 * @file export.service.js
 * @description Generates Excel outputs using SheetJS (xlsx).
 *              Creates the census template and the results summary workbook.
 */
const XLSX = require('xlsx')
const { formatCurrency } = require('../utils/payroll.util')

/**
 * Generates the downloadable census template Excel file
 * @returns {Buffer} Excel file buffer
 */
const generateCensusTemplate = async () => {
  const workbook = XLSX.utils.book_new()

  // Header row with all required columns
  const headers = [
    'EmployeeID', 'FirstName', 'LastName', 'GrossPay',
    'PaySchedule', 'FilingStatus', 'State', 'VCAMP',
    'Medical', 'Dental', 'Vision', 'DebitCard', 'Ancillary',
  ]

  // Sample row to guide users
  const sampleRow = [
    'EMP001', 'John', 'Doe', 5000,
    'biweekly', 'single', 'TX', 200,
    150, 25, 10, 50, 30,
  ]

  const data = [headers, sampleRow]
  const sheet = XLSX.utils.aoa_to_sheet(data)

  // Set column widths
  sheet['!cols'] = headers.map(() => ({ wch: 16 }))

  XLSX.utils.book_append_sheet(workbook, sheet, 'Census Template')

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
}

/**
 * Generates the results Excel workbook with 3 sheets:
 *   1. Summary — aggregate savings
 *   2. Payroll Register — per employee before/after
 *   3. Employee Paychecks — detailed paycheck view
 * @param {Object} results - Comparison results from comparison.service.js
 * @param {string} runId
 * @returns {Buffer} Excel file buffer
 */
const generateResultsExcel = async (results, runId) => {
  const workbook = XLSX.utils.book_new()

  // ─── Sheet 1: Summary ──────────────────────────────────────────
  const summaryData = [
    ['MoTek Payroll Modeling Summary'],
    ['Run ID', runId],
    ['Generated', new Date().toLocaleString()],
    [],
    ['Metric', 'Value'],
    ['Total Employees', results.summary.totalEmployees],
    ['Successfully Solved', results.summary.solvedCount],
    ['Total Employee Tax Savings', formatCurrency(results.summary.totalEmployeeTaxSavings)],
    ['Total Employer Tax Savings', formatCurrency(results.summary.totalEmployerTaxSavings)],
    ['Total Combined Savings', formatCurrency(results.summary.totalSavings)],
  ]
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
  summarySheet['!cols'] = [{ wch: 30 }, { wch: 20 }]
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')

  // ─── Sheet 2: Payroll Register ────────────────────────────────────
  const registerHeaders = [
    'Employee ID',
    'Gross Pay',
    'Normal - Net Pay', 'Normal - Total Tax',
    'Hybrid - WIMPER', 'Hybrid - SIMERP', 'Hybrid - Net Pay', 'Hybrid - Total Tax',
    'Employee Tax Savings', 'Employer Tax Savings', 'Total Savings',
    'Solve Status',
  ]
  const registerRows = results.employees.map((emp) => [
    emp.employeeId,
    emp.normal.grossPay,
    emp.normal.netPay, emp.normal.totalEmployeeTax,
    emp.hybrid.wimper, emp.hybrid.simerp, emp.hybrid.netPay, emp.hybrid.totalEmployeeTax,
    emp.savings.employeeTaxSavings, emp.savings.employerTaxSavings, emp.savings.totalSavings,
    emp.solveStatus,
  ])
  const registerSheet = XLSX.utils.aoa_to_sheet([registerHeaders, ...registerRows])
  registerSheet['!cols'] = registerHeaders.map(() => ({ wch: 18 }))
  XLSX.utils.book_append_sheet(workbook, registerSheet, 'Payroll Register')

  // ─── Sheet 3: Employee Paychecks ─────────────────────────────────
  const paycheckHeaders = [
    'Employee ID', 'Scenario',
    'Gross Pay', 'WIMPER', 'SIMERP', 'Taxable Gross',
    'Federal Tax', 'State Tax', 'Social Security', 'Medicare',
    'Total Employee Tax', 'Total Employer Tax', 'Net Pay',
  ]
  const paycheckRows = []
  results.employees.forEach((emp) => {
    paycheckRows.push([
      emp.employeeId, 'Normal',
      emp.normal.grossPay, '-', '-', emp.normal.grossPay,
      emp.normal.federalTax, emp.normal.stateTax, emp.normal.socialSecurity, emp.normal.medicare,
      emp.normal.totalEmployeeTax, emp.normal.totalEmployerTax, emp.normal.netPay,
    ])
    paycheckRows.push([
      emp.employeeId, 'Hybrid',
      emp.hybrid.grossPay, emp.hybrid.wimper, emp.hybrid.simerp, emp.hybrid.taxableGross,
      emp.hybrid.federalTax, emp.hybrid.stateTax, emp.hybrid.socialSecurity, emp.hybrid.medicare,
      emp.hybrid.totalEmployeeTax, emp.hybrid.totalEmployerTax, emp.hybrid.netPay,
    ])
  })
  const paycheckSheet = XLSX.utils.aoa_to_sheet([paycheckHeaders, ...paycheckRows])
  paycheckSheet['!cols'] = paycheckHeaders.map(() => ({ wch: 16 }))
  XLSX.utils.book_append_sheet(workbook, paycheckSheet, 'Employee Paychecks')

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
}

module.exports = { generateCensusTemplate, generateResultsExcel }
