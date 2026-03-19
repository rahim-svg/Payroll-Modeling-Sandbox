/**
 * @file formatters.js
 * @description UI formatting helpers for currency, percentages, and dates.
 */

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0)

export const formatPercent = (value) =>
  `${value >= 0 ? '+' : ''}${(value || 0).toFixed(2)}%`

export const formatDate = (date) =>
  new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date))
