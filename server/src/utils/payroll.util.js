/**
 * @file payroll.util.js
 * @description Payroll formatting and calculation helper utilities.
 *              Used across services for consistent number handling.
 */

// Round to 2 decimal places — important for currency
const round2 = (value) => Math.round((value + Number.EPSILON) * 100) / 100

// Annualize a per-period amount
const annualize = (perPeriod, frequency) => {
  const periods = { weekly: 52, biweekly: 26, semimonthly: 24, monthly: 12 }
  return perPeriod * (periods[frequency] || 26)
}

// Convert annual amount to per-period
const perPeriod = (annual, frequency) => {
  const periods = { weekly: 52, biweekly: 26, semimonthly: 24, monthly: 12 }
  return annual / (periods[frequency] || 26)
}

module.exports = { round2, annualize, perPeriod }
