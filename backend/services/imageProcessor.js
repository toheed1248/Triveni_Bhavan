const sharp = require('sharp')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads', 'gallery')
const ORIGINALS_DIR = path.join(UPLOADS_DIR, 'originals')
const OPTIMIZED_DIR = path.join(UPLOADS_DIR, 'optimized')
const THUMBS_DIR = path.join(UPLOADS_DIR, 'thumbs')

const RESPONSIVE_WIDTHS = [480, 768, 1280, 1920]
const THUMB_WIDTH = 600
const WEBP_QUALITY = 90
const THUMB_QUALITY = 85

const ensureDirs = () => {
  ;[ORIGINALS_DIR, OPTIMIZED_DIR, THUMBS_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  })
}

const generateFilename = (ext) => {
  return crypto.randomBytes(16).toString('hex') + ext
}

const processImage = async (file) => {
  ensureDirs()

  const inputPath = file.path
  const originalName = file.filename
  const ext = path.extname(originalName).toLowerCase()

  const originalFilename = generateFilename(ext)
  const originalDest = path.join(ORIGINALS_DIR, originalFilename)
  fs.copyFileSync(inputPath, originalDest)

  const metadata = await sharp(inputPath).metadata()
  const { width: origWidth, height: origHeight, format } = metadata

  const baseName = path.basename(originalName, ext)
  const results = {
    originalUrl: '/uploads/gallery/originals/' + originalFilename,
    imageUrl: '',
    thumbnailUrl: '',
    width: origWidth,
    height: origHeight,
    format: format,
  }

  const webpBase = baseName + '.webp'

  const webpFull = path.join(OPTIMIZED_DIR, webpBase)
  await sharp(inputPath)
    .rotate()
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toFile(webpFull)
  results.imageUrl = '/uploads/gallery/optimized/' + webpBase

  const thumbPath = path.join(THUMBS_DIR, webpBase)
  await sharp(inputPath)
    .rotate()
    .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
    .webp({ quality: THUMB_QUALITY, effort: 4 })
    .toFile(thumbPath)
  results.thumbnailUrl = '/uploads/gallery/thumbs/' + webpBase

  const variants = {}
  for (const w of RESPONSIVE_WIDTHS) {
    if (origWidth > w) {
      const variantName = baseName + '-' + w + 'w.webp'
      const variantPath = path.join(OPTIMIZED_DIR, variantName)
      await sharp(inputPath)
        .rotate()
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY, effort: 4 })
        .toFile(variantPath)
      variants[w] = '/uploads/gallery/optimized/' + variantName
    }
  }
  results.variants = variants

  try { fs.unlinkSync(inputPath) } catch {}

  return results
}

const deleteImageFiles = async (urls) => {
  const paths = Array.isArray(urls) ? urls : [urls]
  for (const url of paths) {
    if (!url) continue
    try {
      const fullPath = path.join(__dirname, '..', '..', url)
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath)
    } catch {}
  }
}

module.exports = { processImage, deleteImageFiles, ensureDirs }
