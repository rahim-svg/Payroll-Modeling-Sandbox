/**
 * @file db.js
 * @description MongoDB connection configuration.
 *              Exports mongoose connection instance for use in models.
 */
import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ MongoDB connected:', conn.connection.host)
    return conn
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message)
    process.exit(1)
  }
}

export default connectDB
