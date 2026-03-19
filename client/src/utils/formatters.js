/**
 * @file formatters.js
 * @description Utility functions for formatting currency, percentages,
 *              and payroll-specific numbers throughout the UI.
 */

// Format a number as USD currency
export function formatCurrency(value) {
  if (value === null || value === undefined) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

// Format a number as a percentage
export function formatPercent(value) {
  if (value === null || value === undefined) return '0.00%'
  return `${Number(value).toFixed(2)}%`
}

// Format a savings value with + sign for positive
export function formatSavings(value) {
  if (!value) return '$0.00'
  const formatted = formatCurrency(Math.abs(value))
  return value >= 0 ? `+${formatted}` : `-${formatted}`
}

// Format pay frequency label
export function formatPayFrequency(freq) {
  const map = {
    weekly: 'Weekly',
    biweekly: 'Bi-Weekly',
    semimonthly: 'Semi-Monthly',
    monthly: 'Monthly',
  }
  return map[freq] || freq
}

// Truncate long employee names
export function truncateName(name, max = 25) {
  if (!name) return ''
  return name.length > max ? `${name.substring(0, max)}...` : name
}
