const Gallery = require('../models/Gallery')
const { processImage, deleteImageFiles } = require('../services/imageProcessor')

const CATEGORIES = ['Exterior', 'Open Hall', 'Closed / Banquet Hall', 'Mandir', 'Interiors', 'Events & Decoration', 'Rooms']

exports.uploadGalleryImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file is required' })
    }

    const { title, category, altText, description, sortOrder, isPublished } = req.body

    if (!title || !category || !altText) {
      return res.status(400).json({ success: false, message: 'Title, category, and alt text are required' })
    }

    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({ success: false, message: 'Invalid category' })
    }

    let processed
    try {
      processed = await processImage(req.file)
    } catch (err) {
      console.error('Image processing failed:', err.message)
      return res.status(400).json({ success: false, message: 'Image processing failed' })
    }

    const gallery = await Gallery.create({
      title,
      category,
      originalUrl: processed.originalUrl,
      imageUrl: processed.imageUrl,
      thumbnailUrl: processed.thumbnailUrl,
      variants: processed.variants,
      imageWidth: processed.width,
      imageHeight: processed.height,
      imageFormat: processed.format,
      altText,
      description: description || '',
      sortOrder: sortOrder ? parseInt(sortOrder) : 0,
      isPublished: isPublished !== 'false',
      uploadedBy: req.user._id,
    })

    res.status(201).json({ success: true, message: 'Image uploaded successfully', data: gallery })
  } catch (error) {
    next(error)
  }
}

exports.getGalleryImages = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, category, all } = req.query
    const pageNum = Math.max(1, parseInt(page))
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)))

    const query = { isArchived: false }
    if (all !== 'true') {
      query.isPublished = true
    }
    if (category && CATEGORIES.includes(category)) {
      query.category = category
    }

    const total = await Gallery.countDocuments(query)
    const images = await Gallery.find(query)
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .select('-uploadedBy -isArchived -createdAt -updatedAt')

    res.status(200).json({
      success: true,
      data: images,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    })
  } catch (error) {
    next(error)
  }
}

exports.getGalleryImageById = async (req, res, next) => {
  try {
    const image = await Gallery.findOne({ _id: req.params.id, isPublished: true, isArchived: false })
      .select('-uploadedBy -isArchived')
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' })
    }
    res.status(200).json({ success: true, data: image })
  } catch (error) {
    next(error)
  }
}

exports.updateGalleryImage = async (req, res, next) => {
  try {
    const image = await Gallery.findById(req.params.id)
    if (!image || image.isArchived) {
      return res.status(404).json({ success: false, message: 'Image not found' })
    }

    const { title, category, altText, description, sortOrder, isPublished } = req.body

    if (category && !CATEGORIES.includes(category)) {
      return res.status(400).json({ success: false, message: 'Invalid category' })
    }

    if (req.file) {
      try {
        const processed = await processImage(req.file)
        await deleteImageFiles([image.imageUrl, image.thumbnailUrl, image.originalUrl])
        if (image.variants) {
          await deleteImageFiles(Object.values(image.variants))
        }
        image.originalUrl = processed.originalUrl
        image.imageUrl = processed.imageUrl
        image.thumbnailUrl = processed.thumbnailUrl
        image.variants = processed.variants
        image.imageWidth = processed.width
        image.imageHeight = processed.height
        image.imageFormat = processed.format
      } catch (err) {
        console.error('Image reprocessing failed:', err.message)
        return res.status(400).json({ success: false, message: 'Image processing failed' })
      }
    }

    if (title !== undefined) image.title = title
    if (category !== undefined) image.category = category
    if (altText !== undefined) image.altText = altText
    if (description !== undefined) image.description = description
    if (sortOrder !== undefined) image.sortOrder = parseInt(sortOrder)
    if (isPublished !== undefined) image.isPublished = isPublished === 'true' || isPublished === true

    await image.save()

    res.status(200).json({ success: true, message: 'Image updated successfully', data: image })
  } catch (error) {
    next(error)
  }
}

exports.archiveGalleryImage = async (req, res, next) => {
  try {
    const image = await Gallery.findById(req.params.id)
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' })
    }

    image.isArchived = true
    await image.save()

    res.status(200).json({ success: true, message: 'Image archived successfully' })
  } catch (error) {
    next(error)
  }
}

exports.restoreGalleryImage = async (req, res, next) => {
  try {
    const image = await Gallery.findById(req.params.id)
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' })
    }

    image.isArchived = false
    await image.save()

    res.status(200).json({ success: true, message: 'Image restored successfully', data: image })
  } catch (error) {
    next(error)
  }
}

exports.deleteGalleryImage = async (req, res, next) => {
  try {
    const image = await Gallery.findById(req.params.id)
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' })
    }

    const filesToDelete = [image.imageUrl, image.thumbnailUrl, image.originalUrl]
    if (image.variants) {
      filesToDelete.push(...Object.values(image.variants))
    }
    await deleteImageFiles(filesToDelete)

    await Gallery.findByIdAndDelete(req.params.id)

    res.status(200).json({ success: true, message: 'Image permanently deleted' })
  } catch (error) {
    next(error)
  }
}
