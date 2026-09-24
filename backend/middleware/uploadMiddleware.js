const multer = require('multer')
const path = require('path')
const crypto = require('crypto')

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = (parseInt(process.env.MAX_IMAGE_SIZE_MB) || 10) * 1024 * 1024

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads', 'gallery'))
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    const unique = crypto.randomBytes(16).toString('hex')
    cb(null, unique + ext)
  },
})

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE },
})

module.exports = upload
