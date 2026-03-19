/**
 * @file formatters.js
 * @description Utility functions for formatting payroll data in the UI.
 *              Covers currency, percentages, and employee field display.
 */

/**
 * Format a number as USD currency
 * @param {number} value
 * @returns {string} e.g. "$1,234.56"
 */
export function formatCurrency(value) {
  if (value === null || value === undefined || isNaN(value)) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value)
}

/**
 * Format a number as a percentage
 * @param {number} value — e.g. 0.25 or 25
 * @param {boolean} isDecimal — true if value is 0.25, false if already 25
 * @returns {string} e.g. "25.00%"
 */
export function formatPercent(value, isDecimal = false) {
  if (value === null || value === undefined || isNaN(value)) return '0.00%'
  const pct = isDecimal ? value * 100 : value
  return `${pct.toFixed(2)}%`
}

/**
 * Format savings as a positive currency with + prefix
 * @param {number} value
 * @returns {string} e.g. "+$1,234.56"
 */
export function formatSavings(value) {
  if (!value || value <= 0) return formatCurrency(0)
  return `+${formatCurrency(value)}`
}

/**
 * Capitalize first letter of a string
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Format an employee's full name
 * @param {string} firstName
 * @param {string} lastName
 * @returns {string}
 */
export function formatName(firstName, lastName) {
  return `${capitalize(firstName)} ${capitalize(lastName)}`.trim()
}
