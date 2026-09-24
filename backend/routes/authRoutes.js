const express = require('express')
const rateLimit = require('express-rate-limit')
const router = express.Router()
const {
  loginAdmin,
  logoutAdmin,
  getCurrentAdmin,
  updateProfile,
  changePassword,
} = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')
const validate = require('../middleware/validate')
const { authSchemas } = require('../validation/schemas')

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

router.post('/login', loginLimiter, validate(authSchemas.login), loginAdmin)
router.post('/logout', protect, logoutAdmin)
router.get('/me', protect, getCurrentAdmin)
router.put('/profile', protect, validate(authSchemas.updateProfile), updateProfile)
router.put('/password', protect, validate(authSchemas.changePassword), changePassword)

module.exports = router
