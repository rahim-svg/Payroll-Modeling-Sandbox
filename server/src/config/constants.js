/**
 * @file constants.js
 * @description Application-wide constants and configuration values.
 *              Used by multiple modules to maintain single source of truth.
 */

// ============================================
// CENSUS FILE VALIDATION
// ============================================

export const CENSUS_COLUMNS = [
  'Employee ID',
  'First Name',
  'Last Name',
  'Gross Pay',
  'Pay Frequency',
  'Filing Status',
  'State',
  'Medical',
  'Dental',
  'Vision',
  'Debit Card',
  'Ancillary',
  'VCAMP Target',
];

export const PAY_FREQUENCIES = ['weekly', 'biweekly', 'semimonthly', 'monthly'];

export const FILING_STATUSES = ['single', 'married', 'head_of_household'];

// ============================================
// SOLVER CONSTRAINTS
// ============================================

// WIMPER max as percentage of gross pay
export const WIMPER_MAX_PCT = 0.4; // 40%

// SIMERP max as percentage of gross pay
export const SIMERP_MAX_PCT = 0.3; // 30%

// Combined max WIMPER + SIMERP as percentage of gross
export const COMBINED_MAX_PCT = 0.6; // 60%

// Solver tolerance for matching VCAMP target (±5%)
export const SOLVER_TOLERANCE_PCT = 0.05; // 5%

// Max iterations for solver
export const SOLVER_MAX_ITERATIONS = 25;

// ============================================
// TAX RATES
// ============================================

// FICA rates (Social Security + Medicare)
export const FICA_EMPLOYEE_RATE = 0.0765; // 7.65%
export const FICA_EMPLOYER_RATE = 0.0765; // 7.65%

// Federal income tax brackets (simplified, 2024)
export const FEDERAL_TAX_BRACKETS = {
  single: [
    { limit: 10000, rate: 0.1 },
    { limit: 41000, rate: 0.12 },
    { limit: 89075, rate: 0.22 },
    { limit: 170050, rate: 0.24 },
    { limit: 215950, rate: 0.32 },
    { limit: 539900, rate: 0.35 },
    { limit: Infinity, rate: 0.37 },
  ],
  married: [
    { limit: 20000, rate: 0.1 },
    { limit: 81050, rate: 0.12 },
    { limit: 172750, rate: 0.22 },
    { limit: 329850, rate: 0.24 },
    { limit: 418850, rate: 0.32 },
    { limit: 628300, rate: 0.35 },
    { limit: Infinity, rate: 0.37 },
  ],
  head_of_household: [
    { limit: 14000, rate: 0.1 },
    { limit: 53000, rate: 0.12 },
    { limit: 84550, rate: 0.22 },
    { limit: 160100, rate: 0.24 },
    { limit: 215100, rate: 0.32 },
    { limit: 539900, rate: 0.35 },
    { limit: Infinity, rate: 0.37 },
  ],
};

// State income tax rates (simplified)
export const STATE_TAX_RATES = {
  AL: 0.05,
  AK: 0.0,
  AZ: 0.0545,
  AR: 0.0595,
  CA: 0.093,
  CO: 0.044,
  CT: 0.0699,
  DE: 0.066,
  FL: 0.0,
  GA: 0.055,
  HI: 0.088,
  ID: 0.058,
  IL: 0.0495,
  IN: 0.0365,
  IA: 0.0875,
  KS: 0.057,
  KY: 0.05,
  LA: 0.0425,
  ME: 0.085,
  MD: 0.08175,
  MA: 0.05,
  MI: 0.0425,
  MN: 0.085,
  MS: 0.05,
  MO: 0.053,
  MT: 0.063,
  NE: 0.0684,
  NV: 0.0,
  NH: 0.0,
  NJ: 0.0637,
  NM: 0.059,
  NY: 0.0685,
  NC: 0.0475,
  ND: 0.027,
  OH: 0.0538,
  OK: 0.0475,
  OR: 0.099,
  PA: 0.0307,
  RI: 0.065,
  SC: 0.07,
  SD: 0.0,
  TN: 0.0,
  TX: 0.0,
  UT: 0.0495,
  VT: 0.075,
  VA: 0.057,
  WA: 0.0,
  WV: 0.065,
  WI: 0.0765,
  WY: 0.0,
};

// ============================================
// RUN STATUSES
// ============================================

export const RUN_STATUSES = {
  PENDING: 'pending',
  SOLVING: 'solving',
  SOLVED: 'solved',
  COMPARING: 'comparing',
  DONE: 'done',
  FAILED: 'failed',
};

// ============================================
// SOLVER STATUSES
// ============================================

export const SOLVER_STATUSES = {
  SOLVED: 'solved',
  PARTIAL: 'partial',
  UNSOLVABLE: 'unsolvable',
};

// ============================================
// FILE STORAGE
// ============================================

export const FILE_LIMITS = {
  MAX_FILE_SIZE_BYTES: parseInt(process.env.MAX_FILE_SIZE_MB || 10) * 1024 * 1024,
  ALLOWED_MIME_TYPES: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  ALLOWED_EXTENSIONS: ['.xlsx'],
};

// ============================================
// MESSAGES
// ============================================

export const MESSAGES = {
  // Auth
  AUTH_REGISTERED: 'User registered successfully',
  AUTH_LOGIN_SUCCESS: 'Login successful',
  AUTH_LOGOUT_SUCCESS: 'Logged out successfully',
  AUTH_UNAUTHORIZED: 'Unauthorized — invalid or missing token',
  AUTH_INVALID_CREDENTIALS: 'Invalid email or password',
  AUTH_EMAIL_EXISTS: 'Email already registered',
  AUTH_USER_NOT_FOUND: 'User not found',

  // Census
  CENSUS_UPLOADED: 'Census file uploaded successfully',
  CENSUS_INVALID_FILE: 'Invalid file format — only .xlsx allowed',
  CENSUS_PARSE_ERROR: 'Error parsing Excel file',
  CENSUS_VALIDATION_ERROR: 'Census data validation failed',
  CENSUS_NOT_FOUND: 'Census run not found',

  // Solver
  SOLVER_STARTED: 'Solver started',
  SOLVER_RUNNING: 'Solver is running',
  SOLVER_COMPLETED: 'Solver completed',
  SOLVER_FAILED: 'Solver execution failed',

  // Export
  EXPORT_GENERATED: 'Export file generated successfully',
  EXPORT_NOT_FOUND: 'Export file not found',
};

// ============================================
// ERROR CODES
// ============================================

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  FILE_ERROR: 'FILE_ERROR',
  SOLVER_ERROR: 'SOLVER_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
};
