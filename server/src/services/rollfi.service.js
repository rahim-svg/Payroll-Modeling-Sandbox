/**
 * @file rollfi.service.js
 * @description Rollfi API integration service.
 *              When ROLLFI_MOCK=true, returns realistic mock payroll data.
 *              When ROLLFI_MOCK=false, calls the real Rollfi API.
 *              Switch between modes by changing the .env variable — no code changes needed.
 */
const { PAY_PERIODS_PER_YEAR } = require('../config/constants')

/**
 * Submit employees to Rollfi for payroll calculation.
 * @param {Array} employees - Employee records
 * @param {'normal'|'hybrid'} scenario - Which scenario to run
 * @param {Array} solverResults - WIMPER/SIMERP values (used for hybrid scenario)
 * @returns {Promise<Object>} - Rollfi payroll journal and paycheck data
 */
const runPayroll = async (employees, scenario, solverResults) => {
  const isMock = process.env.ROLLFI_MOCK !== 'false'

  if (isMock) {
    return generateMockPayroll(employees, scenario, solverResults)
  }

  // Real Rollfi API call — implement when credentials are available
  return callRollfiAPI(employees, scenario, solverResults)
}

/**
 * Generate realistic mock payroll data for sandbox testing.
 * Simulates what Rollfi would return for Normal and Hybrid scenarios.
 */
const generateMockPayroll = (employees, scenario, solverResults) => {
  const solverMap = {}
  solverResults.forEach(r => { solverMap[r.employee_id] = r })

  const paychecks = employees.map(emp => {
    const solver = solverMap[emp.employee_id] || { wimper: 0, simerp: 0 }
    const gross = emp.gross_wages
    const periods = PAY_PERIODS_PER_YEAR[emp.pay_frequency] || 26

    // Simplified tax estimates (mock values — Rollfi calculates real values)
    const federalTax = gross * 0.12
    const stateTax = gross * 0.04
    const socialSecurity = gross * 0.062
    const medicare = gross * 0.0145

    const totalBenefits = emp.medical_ee + emp.dental_ee + emp.vision_ee

    let wimper = 0
    let simerp = 0

    if (scenario === 'hybrid') {
      wimper = solver.wimper || 0
      simerp = solver.simerp || 0
    }

    // Pre-tax deductions reduce taxable income
    const pretaxDeductions = totalBenefits + wimper
    const taxableWages = Math.max(0, gross - pretaxDeductions)
    const adjustedFederalTax = taxableWages * 0.12
    const adjustedSS = taxableWages * 0.062
    const adjustedMedicare = taxableWages * 0.0145

    const totalDeductions = adjustedFederalTax + stateTax + adjustedSS + adjustedMedicare + totalBenefits + wimper + simerp
    const netPay = gross - totalDeductions

    return {
      employee_id: emp.employee_id,
      name: `${emp.first_name} ${emp.last_name}`,
      scenario,
      grossPay: gross,
      federalTax: adjustedFederalTax,
      stateTax,
      socialSecurity: adjustedSS,
      medicare: adjustedMedicare,
      medical: emp.medical_ee,
      dental: emp.dental_ee,
      vision: emp.vision_ee,
      wimper,
      simerp,
      totalDeductions,
      netPay: Math.max(0, netPay),
      // Employer side
      erSocialSecurity: taxableWages * 0.062,
      erMedicare: taxableWages * 0.0145,
      erMedical: emp.medical_er,
      erDental: emp.dental_er,
      erVision: emp.vision_er,
    }
  })

  return { scenario, paychecks }
}

/**
 * Real Rollfi API call — implement when API credentials are available.
 * Replace the URL and auth headers with real Rollfi API details.
 */
const callRollfiAPI = async (employees, scenario, solverResults) => {
  // TODO: Implement real Rollfi API integration
  // const response = await axios.post(`${process.env.ROLLFI_API_URL}/payroll/run`, {
  //   employees,
  //   scenario,
  //   solverResults,
  // }, {
  //   headers: { 'Authorization': `Bearer ${process.env.ROLLFI_API_KEY}` }
  // })
  // return response.data
  throw new Error('Real Rollfi API not yet configured. Set ROLLFI_MOCK=true in .env.')
}

module.exports = { runPayroll }
