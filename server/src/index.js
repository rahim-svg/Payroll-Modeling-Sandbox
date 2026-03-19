/**
 * @file index.js
 * @description Express application entry point.
 *              Sets up middleware chain, mounts all routes, and starts the server.
 *              Connects to MongoDB before accepting requests.
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

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ─── Routes ──────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/census', censusRoutes)
app.use('/api/run', runRoutes)
app.use('/api/export', exportRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MoTek Payroll Engine running', timestamp: new Date().toISOString() })
})

// ─── Error Handler ────────────────────────────────────────────
app.use(errorMiddleware)

// ─── Start ───────────────────────────────────────────────────
const start = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`)
    console.log(`🔧 Rollfi mock mode: ${process.env.ROLLFI_MOCK === 'true' ? 'ON' : 'OFF'}`)
  })
}

start()
