const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')

const protect = async (req, res, next) => {
  let token

  // 1. Check Authorization header (for API clients / backward compatibility)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  // 2. Check HttpOnly cookie (for browser-based auth)
  if (!token && req.cookies && req.cookies[process.env.COOKIE_NAME || 'tb_admin_token']) {
    token = req.cookies[process.env.COOKIE_NAME || 'tb_admin_token']
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await Admin.findById(decoded.id)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, admin not found',
      })
    }
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token invalid or expired',
    })
  }
}

const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no user found',
    })
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden, admin access required',
    })
  }

  next()
}

module.exports = { protect, requireAdmin }
