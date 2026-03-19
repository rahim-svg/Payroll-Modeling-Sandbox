/**
 * @file constants.js
 * @description Application-wide constants.
 *              All magic numbers and fixed values live here — never hardcoded.
 */

module.exports = {
  // Benefits types supported in census
  BENEFITS_TYPES: ['Medical', 'Dental', 'Vision', 'DebitCard', 'Ancillary'],

  // Pay schedule options
  PAY_SCHEDULES: ['weekly', 'biweekly', 'semimonthly', 'monthly'],

  // Solver constraints
  SOLVER: {
    MAX_ITERATIONS: 25,
    MIN_ITERATIONS: 5,
    TOLERANCE: 0.01, // $0.01 tolerance for VCAMP target match
    MIN_WIMPER: 0,
    MIN_SIMERP: 0,
  },

  // Required census columns
  REQUIRED_CENSUS_COLUMNS: [
    'EmployeeID',
    'FirstName',
    'LastName',
    'GrossPay',
    'PaySchedule',
    'FilingStatus',
    'State',
    'VCAMP',
    'Medical',
    'Dental',
    'Vision',
    'DebitCard',
    'Ancillary',
  ],

  // Run statuses
  RUN_STATUS: {
    PENDING: 'pending',
    VALIDATING: 'validating',
    SOLVING: 'solving',
    SUBMITTING: 'submitting',
    PROCESSING: 'processing',
    COMPLETE: 'complete',
    FAILED: 'failed',
  },

  // Solve statuses per employee
  SOLVE_STATUS: {
    SOLVED: 'solved',
    PARTIAL: 'partial',
    FAILED: 'failed',
  },
}
