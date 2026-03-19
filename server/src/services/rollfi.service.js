/**
 * @file rollfi.service.js
 * @description Rollfi API integration layer.
 *              When ROLLFI_MOCK=true, returns realistic mock payroll data.
 *              When ROLLFI_MOCK=false, calls the real Rollfi API.
 *              Flip the env var when real API credentials are available.
 */
const { roundCurrency } = require('../utils/payroll.util')

/**
 * Runs normal payroll (no hybrid strategy) through Rollfi
 * @param {Array} employees
 * @returns {Promise<Array>} Normal payroll results per employee
 */
const runNormalPayroll = async (employees) => {
  if (process.env.ROLLFI_MOCK === 'true') {
    return mockNormalPayroll(employees)
  }
  // TODO: Replace with real Rollfi API call when credentials are available
  throw new Error('Real Rollfi API not configured. Set ROLLFI_MOCK=true or add API credentials.')
}

/**
 * Runs hybrid payroll (with WIMPER + SIMERP) through Rollfi
 * @param {Array} employees
 * @param {Array} solverResults - WIMPER/SIMERP values from Python solver
 * @returns {Promise<Array>} Hybrid payroll results per employee
 */
const runHybridPayroll = async (employees, solverResults) => {
  if (process.env.ROLLFI_MOCK === 'true') {
    return mockHybridPayroll(employees, solverResults)
  }
  // TODO: Replace with real Rollfi API call
  throw new Error('Real Rollfi API not configured. Set ROLLFI_MOCK=true or add API credentials.')
}

// ─── Mock Implementations ───────────────────────────────────────────

const mockNormalPayroll = (employees) => {
  return employees.map((emp) => {
    const federalTax = roundCurrency(emp.grossPay * 0.22)
    const stateTax = roundCurrency(emp.grossPay * 0.05)
    const socialSecurity = roundCurrency(emp.grossPay * 0.062)
    const medicare = roundCurrency(emp.grossPay * 0.0145)
    const totalDeductions = roundCurrency(federalTax + stateTax + socialSecurity + medicare)
    const netPay = roundCurrency(emp.grossPay - totalDeductions)

    return {
      employeeId: emp.employeeId,
      scenario: 'normal',
      grossPay: emp.grossPay,
      federalTax,
      stateTax,
      socialSecurity,
      medicare,
      totalEmployeeTax: totalDeductions,
      employerSocialSecurity: roundCurrency(emp.grossPay * 0.062),
      employerMedicare: roundCurrency(emp.grossPay * 0.0145),
      totalEmployerTax: roundCurrency(emp.grossPay * 0.0765),
      netPay,
      benefits: emp.benefits,
    }
  })
}

const mockHybridPayroll = (employees, solverResults) => {
  return employees.map((emp) => {
    // Find solver result for this employee
    const solved = solverResults.find((s) => s.employeeId === emp.employeeId) || {}
    const wimper = solved.wimper || 0
    const simerp = solved.simerp || 0

    // Taxable gross is reduced by WIMPER (Section 125 pre-tax)
    const taxableGross = roundCurrency(emp.grossPay - wimper)

    const federalTax = roundCurrency(taxableGross * 0.22)
    const stateTax = roundCurrency(taxableGross * 0.05)
    const socialSecurity = roundCurrency(taxableGross * 0.062)
    const medicare = roundCurrency(taxableGross * 0.0145)
    const totalDeductions = roundCurrency(federalTax + stateTax + socialSecurity + medicare)
    const netPay = roundCurrency(taxableGross - totalDeductions + simerp)

    return {
      employeeId: emp.employeeId,
      scenario: 'hybrid',
      grossPay: emp.grossPay,
      wimper,
      simerp,
      taxableGross,
      federalTax,
      stateTax,
      socialSecurity,
      medicare,
      totalEmployeeTax: totalDeductions,
      employerSocialSecurity: roundCurrency(taxableGross * 0.062),
      employerMedicare: roundCurrency(taxableGross * 0.0145),
      totalEmployerTax: roundCurrency(taxableGross * 0.0765),
      netPay,
      benefits: emp.benefits,
    }
  })
}

module.exports = { runNormalPayroll, runHybridPayroll }
