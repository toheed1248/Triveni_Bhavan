const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Admin = require('../models/Admin')

dotenv.config({ path: require('path').join(__dirname, '..', '.env') })

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('MongoDB connected')

    const name = process.env.ADMIN_NAME
    const email = process.env.ADMIN_EMAIL
    const password = process.env.ADMIN_PASSWORD

    if (!name || !email || !password) {
      console.error('Please set ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD in .env')
      process.exit(1)
    }

    const existing = await Admin.findOne({ email: email.toLowerCase() })
    if (existing) {
      console.log('Admin with this email already exists')
      process.exit(0)
    }

    const admin = await Admin.create({ name, email, password })
    console.log('Admin created successfully:', admin.email)
    process.exit(0)
  } catch (error) {
    console.error('Error creating admin:', error.message)
    process.exit(1)
  }
}

createAdmin()
