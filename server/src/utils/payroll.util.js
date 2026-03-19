/**
 * @file payroll.util.js
 * @description Payroll formatting and calculation helper utilities.
 */

/**
 * Formats a number as USD currency string
 * @param {number} amount
 * @returns {string} e.g. "$1,234.56"
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount || 0)
}

/**
 * Rounds a number to 2 decimal places (safe for currency)
 * @param {number} value
 * @returns {number}
 */
const roundCurrency = (value) => Math.round((value || 0) * 100) / 100

/**
 * Calculates the difference and percentage change between two values
 * @param {number} before
 * @param {number} after
 * @returns {{ diff: number, pct: number }}
 */
const calcDiff = (before, after) => {
  const diff = roundCurrency(after - before)
  const pct = before !== 0 ? roundCurrency((diff / before) * 100) : 0
  return { diff, pct }
}

module.exports = { formatCurrency, roundCurrency, calcDiff }
