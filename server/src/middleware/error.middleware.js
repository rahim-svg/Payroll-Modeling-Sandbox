/**
 * @file error.middleware.js
 * @description Global error handler middleware.
 *              Catches all errors thrown in controllers/routes and formats them.
 *              This middleware MUST be registered last in the Express app.
 * @param {Object} error - Error object
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next middleware
 */

import { ERROR_CODES } from '../config/constants.js';

const errorMiddleware = (error, req, res, next) => {
  // Default error properties
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal Server Error';
  let code = error.code || ERROR_CODES.INTERNAL_ERROR;
  let details = error.details || null;

  // ============================================
  // MONGOOSE VALIDATION ERROR (400)
  // ============================================
  if (error.name === 'ValidationError') {
    statusCode = 400;
    code = ERROR_CODES.VALIDATION_ERROR;
    const messages = Object.values(error.errors).map((e) => e.message);
    message = `Validation Error: ${messages.join(', ')}`;
  }

  // ============================================
  // MONGOOSE DUPLICATE KEY ERROR (409)
  // ============================================
  if (error.code === 11000) {
    statusCode = 409;
    code = ERROR_CODES.CONFLICT;
    const field = Object.keys(error.keyPattern)[0];
    message = `${field} already exists`;
  }

  // ============================================
  // MONGOOSE CAST ERROR (400)
  // ============================================
  if (error.name === 'CastError') {
    statusCode = 400;
    code = ERROR_CODES.VALIDATION_ERROR;
    message = `Invalid ${error.path}: ${error.value}`;
  }

  // ============================================
  // JWT ERRORS (401)
  // ============================================
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    code = ERROR_CODES.AUTH_ERROR;
    message = 'Invalid token';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    code = ERROR_CODES.AUTH_ERROR;
    message = 'Token expired';
  }

  // ============================================
  // FILE UPLOAD ERRORS (400)
  // ============================================
  if (error.name === 'MulterError') {
    statusCode = 400;
    code = ERROR_CODES.FILE_ERROR;
    if (error.code === 'FILE_TOO_LARGE') {
      message = `File size exceeds ${error.limit} bytes`;
    } else if (error.code === 'LIMIT_FILE_COUNT') {
      message = 'Too many files uploaded';
    } else {
      message = `File upload error: ${error.message}`;
    }
  }

  // ============================================
  // LOG ERROR (Development only)
  // ============================================
  if (process.env.NODE_ENV === 'development') {
    console.error('\n❌ ERROR:');
    console.error('   Status:', statusCode);
    console.error('   Message:', message);
    console.error('   Code:', code);
    if (error.stack) {
      console.error('   Stack:', error.stack);
    }
    console.error('');
  }

  // ============================================
  // SEND ERROR RESPONSE
  // ============================================
  return res.status(statusCode).json({
    error: {
      code,
      message,
      ...(details && { details }),
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack,
      }),
    },
  });
};

export default errorMiddleware;
