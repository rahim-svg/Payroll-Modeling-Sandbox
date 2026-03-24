/**
 * @file db.js
 * @description MongoDB connection configuration using Mongoose.
 *              Handles connection, disconnection, and error handling.
 * @requires    mongoose, dotenv
 */

import mongoose from 'mongoose';

/**
 * Connect to MongoDB Atlas
 * Uses connection string from MONGODB_URI environment variable
 *
 * @async
 * @throws {Error} If connection fails
 */
export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error(
        '❌ MONGODB_URI not defined in .env file. Add your MongoDB connection string.'
      );
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1); // Exit if DB connection fails
  }
};

/**
 * Graceful shutdown — disconnect from DB
 *
 * @async
 */
export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected');
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error.message);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
  process.exit(1);
});
