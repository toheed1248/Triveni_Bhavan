const mongoose = require('mongoose')

const CATEGORIES = ['Exterior', 'Open Hall', 'Closed / Banquet Hall', 'Mandir', 'Interiors', 'Events & Decoration', 'Rooms']

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title must be at most 200 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: CATEGORIES,
        message: 'Invalid category',
      },
    },
    originalUrl: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    variants: {
      type: Map,
      of: String,
      default: {},
    },
    imageWidth: {
      type: Number,
      default: 0,
    },
    imageHeight: {
      type: Number,
      default: 0,
    },
    imageFormat: {
      type: String,
      default: '',
    },
    altText: {
      type: String,
      required: [true, 'Alt text is required for accessibility'],
      trim: true,
      maxlength: [300, 'Alt text must be at most 300 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description must be at most 500 characters'],
      default: '',
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
  },
  { timestamps: true }
)

gallerySchema.index({ category: 1 })
gallerySchema.index({ isPublished: 1 })
gallerySchema.index({ isArchived: 1 })
gallerySchema.index({ sortOrder: 1 })
gallerySchema.index({ isPublished: 1, isArchived: 1, category: 1, sortOrder: 1 })

module.exports = mongoose.model('Gallery', gallerySchema)
