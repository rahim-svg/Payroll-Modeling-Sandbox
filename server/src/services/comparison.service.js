/**
 * @file comparison.service.js
 * @description Builds the before vs after payroll comparison from Normal and Hybrid Rollfi results.
 *              Generates all data structures needed by the frontend result views.
 */

/**
 * Build full comparison output from Normal and Hybrid payroll results.
 * @param {Array} employees - Original employee records
 * @param {Object} normalPayroll - Rollfi normal payroll output
 * @param {Object} hybridPayroll - Rollfi hybrid payroll output
 * @param {Array} solverResults - Python solver output
 * @returns {Object} - Full results object for UI consumption
 */
const buildComparison = (employees, normalPayroll, hybridPayroll, solverResults) => {
  const normalMap = {}
  const hybridMap = {}

  normalPayroll.paychecks.forEach(p => { normalMap[p.employee_id] = p })
  hybridPayroll.paychecks.forEach(p => { hybridMap[p.employee_id] = p })

  const solverMap = {}
  solverResults.forEach(r => { solverMap[r.employee_id] = r })

  // Build per-employee comparison rows
  const comparisonEmployees = employees.map(emp => {
    const normal = normalMap[emp.employee_id] || {}
    const hybrid = hybridMap[emp.employee_id] || {}
    const solver = solverMap[emp.employee_id] || {}

    const employeeSavings = (hybrid.netPay || 0) - (normal.netPay || 0)
    const erNormalTax = (normal.erSocialSecurity || 0) + (normal.erMedicare || 0)
    const erHybridTax = (hybrid.erSocialSecurity || 0) + (hybrid.erMedicare || 0)
    const employerSavings = erNormalTax - erHybridTax

    return {
      employeeId: emp.employee_id,
      name: `${emp.first_name} ${emp.last_name}`,
      grossWages: emp.gross_wages,
      normalNetPay: normal.netPay || 0,
      hybridNetPay: hybrid.netPay || 0,
      employeeSavings,
      employerSavings,
      solveStatus: solver.status || 'not_run',
    }
  })

  // Aggregate totals
  const totals = comparisonEmployees.reduce((acc, emp) => ({
    normalNetPay: acc.normalNetPay + emp.normalNetPay,
    hybridNetPay: acc.hybridNetPay + emp.hybridNetPay,
    employeeSavings: acc.employeeSavings + emp.employeeSavings,
    employerSavings: acc.employerSavings + emp.employerSavings,
  }), { normalNetPay: 0, hybridNetPay: 0, employeeSavings: 0, employerSavings: 0 })

  // Build payroll register entries
  const registerEntries = employees.map(emp => {
    const normal = normalMap[emp.employee_id] || {}
    const hybrid = hybridMap[emp.employee_id] || {}

    const lineItems = [
      { label: 'Gross Pay', normal: normal.grossPay, hybrid: hybrid.grossPay },
      { label: 'Federal Tax', normal: normal.federalTax, hybrid: hybrid.federalTax },
      { label: 'State Tax', normal: normal.stateTax, hybrid: hybrid.stateTax },
      { label: 'Social Security', normal: normal.socialSecurity, hybrid: hybrid.socialSecurity },
      { label: 'Medicare', normal: normal.medicare, hybrid: hybrid.medicare },
      { label: 'Medical (EE)', normal: normal.medical, hybrid: hybrid.medical },
      { label: 'Dental (EE)', normal: normal.dental, hybrid: hybrid.dental },
      { label: 'Vision (EE)', normal: normal.vision, hybrid: hybrid.vision },
      { label: 'WIMPER (Sec. 125)', normal: 0, hybrid: hybrid.wimper || 0 },
      { label: 'SIMERP (Sec. 105)', normal: 0, hybrid: hybrid.simerp || 0 },
      { label: 'Net Pay', normal: normal.netPay, hybrid: hybrid.netPay },
    ].map(item => ({
      ...item,
      normal: item.normal || 0,
      hybrid: item.hybrid || 0,
      diff: (item.hybrid || 0) - (item.normal || 0),
    }))

    return {
      employeeId: emp.employee_id,
      name: `${emp.first_name} ${emp.last_name}`,
      payFrequency: emp.pay_frequency,
      lineItems,
    }
  })

  // Build paycheck views
  const paychecks = employees.map(emp => ({
    employeeId: emp.employee_id,
    name: `${emp.first_name} ${emp.last_name}`,
    normal: normalMap[emp.employee_id] || {},
    hybrid: hybridMap[emp.employee_id] || {},
  }))

  // Build savings chart data
  const chartData = comparisonEmployees.map(emp => ({
    name: emp.name.split(' ')[0],
    employeeSavings: Math.max(0, emp.employeeSavings),
    employerSavings: Math.max(0, emp.employerSavings),
  }))

  // Build solver results table
  const solverResultsTable = employees.map(emp => {
    const solver = solverMap[emp.employee_id] || {}
    return {
      employeeId: emp.employee_id,
      name: `${emp.first_name} ${emp.last_name}`,
      vcampTarget: emp.vcamp_target,
      wimper: solver.wimper || 0,
      simerp: solver.simerp || 0,
      iterations: solver.iterations || 0,
      status: solver.status || 'not_run',
    }
  })

  return {
    employeeCount: employees.length,
    comparison: { employees: comparisonEmployees, totals },
    register: { entries: registerEntries },
    paychecks: { paychecks },
    savings: {
      totalEmployeeSavings: totals.employeeSavings,
      totalEmployerSavings: totals.employerSavings,
      totalCombinedSavings: totals.employeeSavings + totals.employerSavings,
      chartData,
      solverResults: solverResultsTable,
    },
  }
}

module.exports = { buildComparison }
