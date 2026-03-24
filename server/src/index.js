/**
 * @file index.js
 * @description Express application entry point.
 *              Sets up middleware, database connection, routes, and error handling.
 *              This is the main server file that runs on startup.
 * @requires    dotenv, express, mongoose, cors, helmet, morgan
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import errorMiddleware from './middleware/error.middleware.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE SETUP
// ============================================

// Security & Logging
app.use(helmet()); // Secure HTTP headers
app.use(morgan('dev')); // Request logging

// CORS — Allow frontend to communicate
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ============================================
// DATABASE CONNECTION
// ============================================

connectDB();

// ============================================
// ROUTE MOUNTING (To be added in future phases)
// ============================================

// TODO: Mount auth routes
// TODO: Mount census routes
// TODO: Mount run routes
// TODO: Mount export routes

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ============================================
// 404 HANDLER
// ============================================

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method,
  });
});

// ============================================
// GLOBAL ERROR HANDLER (Must be last)
// ============================================

app.use(errorMiddleware);

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`\n✅ Server running on http://localhost:${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health\n`);
});

export default app;
