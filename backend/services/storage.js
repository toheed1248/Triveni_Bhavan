const path = require('path')
const fs = require('fs')

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads', 'gallery')

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

const uploadImage = async (file, folder = '') => {
  ensureDir(path.join(UPLOADS_DIR, folder))
  const dest = folder ? folder + '/' + file.filename : file.filename
  return {
    url: '/uploads/gallery/' + dest,
    filename: file.filename,
    size: file.size,
    mimetype: file.mimetype,
  }
}

const deleteImage = async (filePath) => {
  try {
    const fullPath = path.join(__dirname, '..', '..', filePath)
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath)
    }
  } catch (err) {
    console.error('Delete error:', err.message)
  }
}

module.exports = { uploadImage, deleteImage, UPLOADS_DIR, ensureDir }
