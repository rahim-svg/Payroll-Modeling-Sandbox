/**
 * @file error.middleware.js
 * @description Global error handling middleware.
 *              Catches all errors and returns consistent error responses.
 */
export const errorMiddleware = (err, req, res, next) => {
  console.error('\u274c Error:', err.message)

  // Multer file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File size exceeds 10MB limit' })
  }
  if (err.message && err.message.includes('Only Excel files')) {
    return res.status(400).json({ error: err.message })
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ')
    return res.status(400).json({ error: 'Validation error', details: messages })
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0]
    return res.status(400).json({ error: `${field} already exists` })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' })
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' })
  }

  // Default error
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  })
}

export default errorMiddleware
