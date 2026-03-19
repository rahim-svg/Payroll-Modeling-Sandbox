/**
 * @file index.js
 * @description Express server entry point.
 *              Sets up middleware, database connection, routes, and error handling.
 */
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.routes.js'
import censusRoutes from './routes/census.routes.js'
import runRoutes from './routes/run.routes.js'
import exportRoutes from './routes/export.routes.js'
import { errorMiddleware } from './middleware/error.middleware.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// ============================================
// DATABASE
// ============================================
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message)
    process.exit(1)
  })

// ============================================
// ROUTES
// ============================================
app.use('/api/auth', authRoutes)
app.use('/api/census', censusRoutes)
app.use('/api/run', runRoutes)
app.use('/api/export', exportRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// ============================================
// ERROR HANDLING
// ============================================
app.use(errorMiddleware)

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🔒 Rollfi Mock Mode: ${process.env.ROLLFI_MOCK === 'true' ? 'enabled' : 'disabled'}`)
})

export default app
