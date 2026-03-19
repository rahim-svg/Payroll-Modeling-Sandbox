/**
 * @file seed.js
 * @description Database seeder — creates the two default MoTek users.
 *              Run once with: npm run seed
 *              Safe to re-run — uses upsert to avoid duplicates.
 */
require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../models/User.model')

const SEED_USERS = [
  { name: 'Admin', email: 'admin@motek.com', password: 'MoTek@2024', role: 'admin' },
  { name: 'Analyst', email: 'analyst@motek.com', password: 'MoTek@2024', role: 'analyst' },
]

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB — seeding users...')

    for (const user of SEED_USERS) {
      const hashedPassword = await bcrypt.hash(user.password, 12)
      await User.findOneAndUpdate(
        { email: user.email },
        { name: user.name, email: user.email, password: hashedPassword, role: user.role },
        { upsert: true, new: true }
      )
      console.log(`✅ Seeded: ${user.email}`)
    }

    console.log('\n🌱 Seeding complete!')
    console.log('   admin@motek.com / MoTek@2024')
    console.log('   analyst@motek.com / MoTek@2024')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seed failed:', error.message)
    process.exit(1)
  }
}

seed()
