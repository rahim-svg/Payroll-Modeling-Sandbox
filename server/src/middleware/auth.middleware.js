/**
 * @file auth.middleware.js
 * @description JWT authentication middleware.
 *              Extracts and validates JWT token from Authorization header.
 *              Attaches decoded user info to req.user.
 */
import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
  try {
    // Extract token from 'Bearer <token>' header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' })
    }

    const token = authHeader.slice(7) // Remove 'Bearer '

    // Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token', details: err.message })
  }
}

export default authMiddleware
