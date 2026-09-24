const express = require('express')
const router = express.Router()
const {
  createReview,
  getAdminReviews,
  getReviewById,
  updateReview,
  archiveReview,
  restoreReview,
  permanentlyDeleteReview,
  getPublicReviews,
  getReviewSummary,
} = require('../controllers/reviewController')
const { protect } = require('../middleware/authMiddleware')
const validate = require('../middleware/validate')
const { reviewSchemas } = require('../validation/schemas')

router.get('/summary', getReviewSummary)
router.get('/admin', protect, validate(reviewSchemas.listQuery, 'query'), getAdminReviews)
router.post('/', protect, validate(reviewSchemas.create), createReview)
router.get('/', validate(reviewSchemas.listQuery, 'query'), getPublicReviews)
router.get('/:id', protect, validate(reviewSchemas.idParam, 'params'), getReviewById)
router.patch('/:id', protect, validate(reviewSchemas.idParam, 'params'), validate(reviewSchemas.update), updateReview)
router.delete('/:id', protect, validate(reviewSchemas.idParam, 'params'), archiveReview)
router.patch('/:id/restore', protect, validate(reviewSchemas.idParam, 'params'), restoreReview)
router.delete('/:id/permanent', protect, validate(reviewSchemas.idParam, 'params'), permanentlyDeleteReview)

module.exports = router
