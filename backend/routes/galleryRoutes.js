const express = require('express')
const router = express.Router()
const {
  uploadGalleryImage,
  getGalleryImages,
  getGalleryImageById,
  updateGalleryImage,
  archiveGalleryImage,
  restoreGalleryImage,
  deleteGalleryImage,
} = require('../controllers/galleryController')
const { protect } = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')
const validate = require('../middleware/validate')
const { gallerySchemas } = require('../validation/schemas')

router.post('/', protect, upload.single('image'), validate(gallerySchemas.upload), uploadGalleryImage)
router.get('/', validate(gallerySchemas.listQuery, 'query'), getGalleryImages)
router.get('/:id', validate(gallerySchemas.idParam, 'params'), getGalleryImageById)
router.patch('/:id', protect, validate(gallerySchemas.idParam, 'params'), validate(gallerySchemas.update), updateGalleryImage)
router.delete('/:id', protect, validate(gallerySchemas.idParam, 'params'), archiveGalleryImage)
router.patch('/:id/restore', protect, validate(gallerySchemas.idParam, 'params'), restoreGalleryImage)
router.delete('/:id/permanent', protect, validate(gallerySchemas.idParam, 'params'), deleteGalleryImage)

module.exports = router
