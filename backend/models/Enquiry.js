const mongoose = require('mongoose')

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name must be at most 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    eventType: {
      type: String,
      required: [true, 'Event type is required'],
      enum: {
        values: ['Wedding', 'Reception', 'Family Celebration', 'Religious Event', 'Corporate Event', 'Other'],
        message: 'Invalid event type',
      },
    },
    bookingFrom: {
      type: Date,
      required: [true, 'Booking start date is required'],
    },
    bookingTo: {
      type: Date,
      required: [true, 'Booking end date is required'],
    },
    guestCount: {
      type: Number,
      required: [true, 'Guest count is required'],
      min: [1, 'Guest count must be at least 1'],
    },
    preferredVenue: {
      type: String,
      required: [true, 'Preferred venue is required'],
      enum: {
        values: ['Open Hall', 'Closed / Banquet Hall', 'Temple / Mandir', 'No Preference'],
        message: 'Invalid venue preference',
      },
    },
    requiredFacilities: {
      type: [String],
      default: [],
      enum: {
        values: ['Open Hall', 'Closed / Banquet Hall', 'Rooms', 'Parking'],
        message: 'Invalid facility',
      },
    },
    message: {
      type: String,
      trim: true,
      maxlength: [1000, 'Message must be at most 1000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['New', 'Contacted', 'Quoted', 'Confirmed', 'Closed', 'Cancelled'],
        message: 'Invalid status',
      },
      default: 'New',
    },
    adminNotes: {
      type: String,
      default: '',
      select: false,
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
    whatsappMessages: [
      {
        message: { type: String, required: true },
        sentAt: { type: Date, default: Date.now },
        sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
      },
    ],
  },
  { timestamps: true }
)

enquirySchema.index({ createdAt: -1 })
enquirySchema.index({ bookingFrom: 1 })
enquirySchema.index({ status: 1 })
enquirySchema.index({ phone: 1 })
enquirySchema.index({ email: 1 })
enquirySchema.index({ isArchived: 1 })

module.exports = mongoose.model('Enquiry', enquirySchema)
