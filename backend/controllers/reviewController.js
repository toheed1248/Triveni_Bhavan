const Review = require('../models/Review')
const SOURCES = ['Google', 'Facebook', 'Direct', 'Other']

const createReview = async (req, res, next) => {
  try {
    const { reviewerName, rating, reviewText, source, sourceUrl, reviewDate, isVerified, isPublished } = req.body

    if (!reviewerName || !rating || !reviewText || !source) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided' })
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' })
    }

    if (!SOURCES.includes(source)) {
      return res.status(400).json({ success: false, message: 'Invalid source' })
    }

    if (sourceUrl && sourceUrl !== '') {
      try {
        new URL(sourceUrl)
      } catch {
        return res.status(400).json({ success: false, message: 'Invalid source URL' })
      }
    }

    if (reviewDate && isNaN(new Date(reviewDate).getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid review date' })
    }

    const duplicate = await Review.findOne({
      reviewerName: reviewerName.trim(),
      reviewText: reviewText.trim(),
      source,
      reviewDate: reviewDate ? new Date(reviewDate) : null,
    })
    if (duplicate) {
      return res.status(409).json({ success: false, message: 'A similar review already exists' })
    }

    const review = await Review.create({
      reviewerName,
      rating,
      reviewText,
      source,
      sourceUrl: sourceUrl || '',
      reviewDate: reviewDate ? new Date(reviewDate) : null,
      isVerified: isVerified === true,
      isPublished: isPublished === true,
      createdBy: req.user._id,
    })

    res.status(201).json({ success: true, message: 'Review created successfully', data: review })
  } catch (error) {
    next(error)
  }
}

const getAdminReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query
    const pageNum = Math.max(1, parseInt(page))
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)))

    const total = await Review.countDocuments({ isArchived: false })
    const reviews = await Review.find({ isArchived: false })
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    })
  } catch (error) {
    next(error)
  }
}

const getReviewById = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' })
    }
    res.status(200).json({ success: true, data: review })
  } catch (error) {
    next(error)
  }
}

const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' })
    }

    const { reviewerName, rating, reviewText, source, sourceUrl, reviewDate, isVerified, isPublished } = req.body

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' })
    }

    if (source && !SOURCES.includes(source)) {
      return res.status(400).json({ success: false, message: 'Invalid source' })
    }

    if (sourceUrl && sourceUrl !== '') {
      try {
        new URL(sourceUrl)
      } catch {
        return res.status(400).json({ success: false, message: 'Invalid source URL' })
      }
    }

    if (reviewerName !== undefined) review.reviewerName = reviewerName
    if (rating !== undefined) review.rating = rating
    if (reviewText !== undefined) review.reviewText = reviewText
    if (source !== undefined) review.source = source
    if (sourceUrl !== undefined) review.sourceUrl = sourceUrl
    if (reviewDate !== undefined) review.reviewDate = reviewDate ? new Date(reviewDate) : null
    if (isVerified !== undefined) review.isVerified = isVerified
    if (isPublished !== undefined) review.isPublished = isPublished
    review.updatedBy = req.user._id

    await review.save()

    res.status(200).json({ success: true, message: 'Review updated successfully', data: review })
  } catch (error) {
    next(error)
  }
}

const archiveReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' })
    }

    review.isArchived = true
    review.archivedAt = new Date()
    review.archivedBy = req.user._id
    await review.save()

    res.status(200).json({ success: true, message: 'Review archived successfully' })
  } catch (error) {
    next(error)
  }
}

const restoreReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' })
    }

    review.isArchived = false
    review.archivedAt = null
    review.archivedBy = null
    await review.save()

    res.status(200).json({ success: true, message: 'Review restored successfully', data: review })
  } catch (error) {
    next(error)
  }
}

const permanentlyDeleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' })
    }

    await Review.findByIdAndDelete(req.params.id)

    res.status(200).json({ success: true, message: 'Review permanently deleted' })
  } catch (error) {
    next(error)
  }
}

const getPublicReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const pageNum = Math.max(1, parseInt(page))
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)))

    const query = { isPublished: true, isArchived: false }

    const total = await Review.countDocuments(query)
    const reviews = await Review.find(query)
      .sort({ reviewDate: -1, createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .select('reviewerName rating reviewText source sourceUrl reviewDate')

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    })
  } catch (error) {
    next(error)
  }
}

const getReviewSummary = async (req, res, next) => {
  try {
    const result = await Review.aggregate([
      { $match: { isPublished: true, isArchived: false } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          rating5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
          rating4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
          rating3: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
          rating2: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
          rating1: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
        },
      },
    ])

    if (result.length === 0 || result[0].totalReviews === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalReviews: 0,
          averageRating: null,
          ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        },
      })
    }

    const r = result[0]
    res.status(200).json({
      success: true,
      data: {
        totalReviews: r.totalReviews,
        averageRating: Math.round(r.averageRating * 10) / 10,
        ratingBreakdown: {
          5: r.rating5,
          4: r.rating4,
          3: r.rating3,
          2: r.rating2,
          1: r.rating1,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createReview,
  getAdminReviews,
  getReviewById,
  updateReview,
  archiveReview,
  restoreReview,
  permanentlyDeleteReview,
  getPublicReviews,
  getReviewSummary,
}
