const mongoose = require('mongoose')

const FACILITIES = [
  'Open Hall',
  'Closed / Banquet Hall',
  'Temple / Mandir',
  '10+ AC Rooms with Ducting',
  'Parking',
  'Sound Facility',
  'Decoration Facility',
  'Catering Facility',
]

const settingsSchema = new mongoose.Schema(
  {
    settingsKey: {
      type: String,
      required: true,
      unique: true,
      default: 'business',
      enum: ['business'],
    },
    businessName: {
      type: String,
      trim: true,
      maxlength: [200, 'Business name must be at most 200 characters'],
      default: '',
    },
    tagline: {
      type: String,
      trim: true,
      maxlength: [300, 'Tagline must be at most 300 characters'],
      default: '',
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description must be at most 2000 characters'],
      default: '',
    },
    capacity: {
      type: Number,
      min: [0, 'Capacity must be non-negative'],
      default: 0,
    },
    yearsExperience: {
      type: Number,
      min: [0, 'Years experience must be non-negative'],
      default: 0,
    },
    eventsHosted: {
      type: Number,
      min: [0, 'Events hosted must be non-negative'],
      default: 0,
    },
    customers: {
      type: Number,
      min: [0, 'Customers must be non-negative'],
      default: 0,
    },
    googleRating: {
      type: Number,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating must be at most 5'],
      default: 0,
    },
    contact: {
      phone: { type: String, trim: true, default: '' },
      whatsapp: { type: String, trim: true, default: '' },
      email: { type: String, trim: true, lowercase: true, default: '' },
      address: { type: String, trim: true, default: '' },
      googleMapsUrl: { type: String, trim: true, default: '' },
    },
    socialLinks: {
      instagram: { type: String, trim: true, default: '' },
      facebook: { type: String, trim: true, default: '' },
      youtube: { type: String, trim: true, default: '' },
    },
    facilities: {
      type: [String],
      default: [],
      validate: {
        validator: function (facilities) {
          return facilities.every((f) => FACILITIES.includes(f))
        },
        message: 'Invalid facility selected',
      },
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Settings', settingsSchema)
module.exports.FACILITIES = FACILITIES
