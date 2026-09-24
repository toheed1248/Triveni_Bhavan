const express = require('express')
const router = express.Router()
const { checkAvailability, checkDateAvailability } = require('../controllers/availabilityController')
const validate = require('../middleware/validate')
const { availabilitySchemas } = require('../validation/schemas')

router.get('/date', validate(availabilitySchemas.checkDate, 'query'), checkDateAvailability)
router.get('/', validate(availabilitySchemas.check, 'query'), checkAvailability)

module.exports = router
