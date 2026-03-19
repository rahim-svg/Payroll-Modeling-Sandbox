/**
 * @file comparison.service.js
 * @description Generates before vs after payroll comparison.
 *              Calculates employee tax savings and employer cost impact.
 */
const { roundCurrency, calcDiff } = require('../utils/payroll.util')

/**
 * Compares normal vs hybrid payroll results per employee
 * @param {Array} normalResults - Rollfi normal payroll results
 * @param {Array} hybridResults - Rollfi hybrid payroll results
 * @param {Array} solverResults - Python solver WIMPER/SIMERP values
 * @returns {Object} Full comparison object with summary and per-employee breakdown
 */
const compare = (normalResults, hybridResults, solverResults) => {
  const employeeComparisons = normalResults.map((normal) => {
    const hybrid = hybridResults.find((h) => h.employeeId === normal.employeeId)
    const solved = solverResults.find((s) => s.employeeId === normal.employeeId) || {}

    if (!hybrid) return null

    const employeeTaxSavings = roundCurrency(normal.totalEmployeeTax - hybrid.totalEmployeeTax)
    const employerTaxSavings = roundCurrency(normal.totalEmployerTax - hybrid.totalEmployerTax)
    const netPayDiff = calcDiff(normal.netPay, hybrid.netPay)

    return {
      employeeId: normal.employeeId,
      solveStatus: solved.status || 'unknown',
      solveIterations: solved.iterations || 0,
      normal: {
        grossPay: normal.grossPay,
        federalTax: normal.federalTax,
        stateTax: normal.stateTax,
        socialSecurity: normal.socialSecurity,
        medicare: normal.medicare,
        totalEmployeeTax: normal.totalEmployeeTax,
        totalEmployerTax: normal.totalEmployerTax,
        netPay: normal.netPay,
      },
      hybrid: {
        grossPay: hybrid.grossPay,
        wimper: hybrid.wimper || 0,
        simerp: hybrid.simerp || 0,
        taxableGross: hybrid.taxableGross || hybrid.grossPay,
        federalTax: hybrid.federalTax,
        stateTax: hybrid.stateTax,
        socialSecurity: hybrid.socialSecurity,
        medicare: hybrid.medicare,
        totalEmployeeTax: hybrid.totalEmployeeTax,
        totalEmployerTax: hybrid.totalEmployerTax,
        netPay: hybrid.netPay,
      },
      savings: {
        employeeTaxSavings,
        employerTaxSavings,
        totalSavings: roundCurrency(employeeTaxSavings + employerTaxSavings),
        netPayChange: netPayDiff.diff,
        netPayChangePct: netPayDiff.pct,
      },
    }
  }).filter(Boolean)

  // Aggregate summary totals
  const summary = employeeComparisons.reduce(
    (acc, emp) => ({
      totalEmployeeTaxSavings: roundCurrency(acc.totalEmployeeTaxSavings + emp.savings.employeeTaxSavings),
      totalEmployerTaxSavings: roundCurrency(acc.totalEmployerTaxSavings + emp.savings.employerTaxSavings),
      totalSavings: roundCurrency(acc.totalSavings + emp.savings.totalSavings),
      totalEmployees: acc.totalEmployees + 1,
      solvedCount: acc.solvedCount + (emp.solveStatus === 'solved' ? 1 : 0),
    }),
    { totalEmployeeTaxSavings: 0, totalEmployerTaxSavings: 0, totalSavings: 0, totalEmployees: 0, solvedCount: 0 }
  )

  return { summary, employees: employeeComparisons }
}

module.exports = { compare }
