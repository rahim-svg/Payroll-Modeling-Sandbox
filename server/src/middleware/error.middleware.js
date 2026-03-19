/**
 * @file error.middleware.js
 * @description Global error handler middleware.
 *              Catches all errors passed via next(error) and returns consistent JSON responses.
 */
const errorMiddleware = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`)

  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal server error'

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

module.exports = errorMiddleware
