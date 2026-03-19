/**
 * @file index.js
 * @description Express application entry point.
 *              Configures middleware chain, mounts all route groups,
 *              connects to MongoDB, and starts the HTTP server.
 */
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const connectDB = require('./config/db')
const errorMiddleware = require('./middleware/error.middleware')

// Route imports
const authRoutes = require('./routes/auth.routes')
const censusRoutes = require('./routes/census.routes')
const runRoutes = require('./routes/run.routes')
const exportRoutes = require('./routes/export.routes')

const app = express()
const PORT = process.env.PORT || 5000

// ─── Middleware Chain ───────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/census', censusRoutes)
app.use('/api/run', runRoutes)
app.use('/api/export', exportRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV, rollfiMock: process.env.ROLLFI_MOCK === 'true' })
})

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use(errorMiddleware)

// ─── Start Server ─────────────────────────────────────────────────────────
const start = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`✅ MoTek Payroll Engine running on port ${PORT}`)
    console.log(`📊 Rollfi mode: ${process.env.ROLLFI_MOCK === 'true' ? 'MOCK' : 'LIVE'}`)
  })
}

start()
