/**
 * @file seed.js
 * @description Seeds the database with the two default MoTek users.
 *              Run once with: npm run seed
 *              Safe to re-run — uses upsert to avoid duplicates.
 */
require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const connectDB = require('./db')
const User = require('../models/User.model')

const users = [
  {
    email: 'admin@motek.com',
    password: 'MoTek@2024',
    name: 'Admin User',
    role: 'admin',
  },
  {
    email: 'analyst@motek.com',
    password: 'MoTek@2024',
    name: 'Analyst User',
    role: 'analyst',
  },
]

const seed = async () => {
  await connectDB()

  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, 12)
    await User.findOneAndUpdate(
      { email: userData.email },
      { ...userData, password: hashedPassword },
      { upsert: true, new: true }
    )
    console.log(`✅ Seeded user: ${userData.email}`)
  }

  console.log('✅ Seeding complete')
  mongoose.connection.close()
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err)
  process.exit(1)
})
