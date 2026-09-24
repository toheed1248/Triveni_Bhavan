const mongoose = require('mongoose')

const SOURCES = ['Google', 'Facebook', 'Direct', 'Other']

const reviewSchema = new mongoose.Schema(
  {
    reviewerName: {
      type: String,
      required: [true, 'Reviewer name is required'],
      trim: true,
      maxlength: [100, 'Reviewer name must be at most 100 characters'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must be at most 5'],
    },
    reviewText: {
      type: String,
      required: [true, 'Review text is required'],
      trim: true,
      maxlength: [2000, 'Review text must be at most 2000 characters'],
    },
    source: {
      type: String,
      required: [true, 'Source is required'],
      enum: {
        values: SOURCES,
        message: 'Invalid source',
      },
    },
    sourceUrl: {
      type: String,
      trim: true,
      default: '',
    },
    reviewDate: {
      type: Date,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    archivedAt: {
      type: Date,
      default: null,
    },
    archivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
  },
  { timestamps: true }
)

reviewSchema.index({ isPublished: 1 })
reviewSchema.index({ isArchived: 1 })
reviewSchema.index({ source: 1 })
reviewSchema.index({ rating: 1 })
reviewSchema.index({ reviewDate: -1 })
reviewSchema.index({ isPublished: 1, isArchived: 1, reviewDate: -1 })

module.exports = mongoose.model('Review', reviewSchema)
module.exports.SOURCES = SOURCES
