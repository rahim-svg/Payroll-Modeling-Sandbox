/**
 * @file User.model.js
 * @description Mongoose User model for authentication only.
 *              Stores hashed passwords — plain text is never saved.
 */
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'analyst'],
      default: 'analyst',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
