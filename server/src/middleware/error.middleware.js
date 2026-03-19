/**
 * @file error.middleware.js
 * @description Global error handling middleware.
 *              Catches all errors passed via next(error) across the application.
 *              Returns consistent error response format.
 */
const errorMiddleware = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.url}:`, err.message)

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: 'File too large. Maximum size is 10MB.' })
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message })
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(409).json({ message: 'Duplicate entry detected.' })
  }

  // Default server error
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

module.exports = errorMiddleware
