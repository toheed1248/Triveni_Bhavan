const express = require('express')
const router = express.Router()
const { getPublicSettings, getAdminSettings, updateSettings } = require('../controllers/settingsController')
const { protect } = require('../middleware/authMiddleware')
const validate = require('../middleware/validate')
const { settingsSchemas } = require('../validation/schemas')

router.get('/public', getPublicSettings)
router.get('/', protect, getAdminSettings)
router.patch('/', protect, validate(settingsSchemas.update), updateSettings)

module.exports = router
