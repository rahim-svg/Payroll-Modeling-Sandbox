/**
 * @file constants.js
 * @description Application-wide constants.
 *              Centralises magic strings and config values used across the app.
 */

// Supported pay frequencies
const PAY_FREQUENCIES = ['weekly', 'biweekly', 'semimonthly', 'monthly']

// Number of pay periods per year per frequency
const PAY_PERIODS_PER_YEAR = {
  weekly: 52,
  biweekly: 26,
  semimonthly: 24,
  monthly: 12,
}

// Filing statuses
const FILING_STATUSES = ['single', 'married', 'head_of_household']

// Solver constraints
const SOLVER = {
  MAX_ITERATIONS: 25,
  MIN_ITERATIONS: 5,
  TOLERANCE: 0.01, // $0.01 tolerance for convergence
}

// Benefit types supported in the census
const BENEFIT_TYPES = ['medical', 'dental', 'vision', 'debit_card', 'ancillary']

// Required census columns
const REQUIRED_CENSUS_COLUMNS = [
  'employee_id',
  'first_name',
  'last_name',
  'pay_frequency',
  'gross_wages',
  'filing_status',
  'state',
  'federal_allowances',
  'medical_ee',
  'medical_er',
  'dental_ee',
  'dental_er',
  'vision_ee',
  'vision_er',
  'debit_card',
  'ancillary',
  'vcamp_target',
]

module.exports = {
  PAY_FREQUENCIES,
  PAY_PERIODS_PER_YEAR,
  FILING_STATUSES,
  SOLVER,
  BENEFIT_TYPES,
  REQUIRED_CENSUS_COLUMNS,
}
