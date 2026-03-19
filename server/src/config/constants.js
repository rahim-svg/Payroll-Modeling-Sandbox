/**
 * @file constants.js
 * @description Application-wide constants.
 *              Used across models, controllers, and services.
 */

// Payroll run types
export const RUN_TYPES = {
  BULK: 'bulk',
  SINGLE_EMPLOYEE: 'single_employee',
}

// Scenario types
export const SCENARIOS = {
  NORMAL: 'normal',
  HYBRID: 'hybrid',
}

// Solve status
export const SOLVE_STATUS = {
  PENDING: 'pending',
  RUNNING: 'running',
  SUCCESS: 'success',
  FAILED: 'failed',
}

// Run status
export const RUN_STATUS = {
  PENDING: 'pending',
  VALIDATING: 'validating',
  SOLVING: 'solving',
  SUBMITTING: 'submitting',
  COMPLETED: 'completed',
  FAILED: 'failed',
}

// Benefits types
export const BENEFITS = {
  MEDICAL: 'medical',
  DENTAL: 'dental',
  VISION: 'vision',
  DEBIT_CARD: 'debit_card',
  ANCILLARY: 'ancillary',
}

// Tolerance for solver (in dollars)
export const SOLVER_TOLERANCE = 100

// Max iterations for solver per employee
export const MAX_ITERATIONS = 25
