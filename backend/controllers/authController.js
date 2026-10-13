const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')

const COOKIE_NAME = process.env.COOKIE_NAME || 'tb_admin_token'
const isProduction = process.env.NODE_ENV === 'production'

const generateToken = (admin) => {
  return jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

const setTokenCookie = (res, token) => {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  })
}

exports.loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      })
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password')
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    const isMatch = await admin.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    const token = generateToken(admin)

    // Set HttpOnly cookie
    setTokenCookie(res, token)

    res.status(200).json({
      success: true,
      message: 'Login successful',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    })
  } catch (error) {
    next(error)
  }
}

exports.logoutAdmin = async (req, res, next) => {
  try {
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    })

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error) {
    next(error)
  }
}

exports.getCurrentAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.user._id)
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      })
    }

    res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    })
  } catch (error) {
    next(error)
  }
}

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required' })
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email is required' })
    }

    const admin = await Admin.findById(req.user._id)
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' })
    }

    const emailLower = email.toLowerCase().trim()
    if (emailLower !== admin.email) {
      const existing = await Admin.findOne({ email: emailLower })
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email already in use' })
      }
    }

    admin.name = name.trim()
    admin.email = emailLower
    await admin.save()

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    })
  } catch (error) {
    next(error)
  }
}

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' })
    }

    const admin = await Admin.findById(req.user._id).select('+password')
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' })
    }

    const isMatch = await admin.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' })
    }

    admin.password = newPassword
    await admin.save()

    // Issue new token after password change
    const token = generateToken(admin)
    setTokenCookie(res, token)

    res.status(200).json({ success: true, message: 'Password changed successfully' })
  } catch (error) {
    next(error)
  }
}
