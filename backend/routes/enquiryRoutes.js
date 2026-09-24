const express = require('express')
const rateLimit = require('express-rate-limit')
const router = express.Router()
const {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  archiveEnquiry,
  sendWhatsApp,
  deleteEnquiry,
  getEnquiriesReport,
} = require('../controllers/enquiryController')
const { protect } = require('../middleware/authMiddleware')
const validate = require('../middleware/validate')
const { enquirySchemas } = require('../validation/schemas')

const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many enquiries. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

router.post('/', enquiryLimiter, validate(enquirySchemas.create), createEnquiry)
router.get('/', protect, validate(enquirySchemas.listQuery, 'query'), getEnquiries)
router.get('/report', protect, getEnquiriesReport)
router.get('/:id', protect, validate(enquirySchemas.idParam, 'params'), getEnquiryById)
router.patch('/:id', protect, validate(enquirySchemas.idParam, 'params'), validate(enquirySchemas.update), updateEnquiry)
router.put('/:id/archive', protect, validate(enquirySchemas.idParam, 'params'), archiveEnquiry)
router.delete('/:id', protect, validate(enquirySchemas.idParam, 'params'), deleteEnquiry)
router.post('/:id/send-whatsapp', protect, validate(enquirySchemas.idParam, 'params'), validate(enquirySchemas.whatsapp), sendWhatsApp)

module.exports = router
