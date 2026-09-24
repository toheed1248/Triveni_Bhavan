const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
      minlength: [2, 'Event name must be at least 2 characters'],
    },
    eventType: {
      type: String,
      required: [true, 'Event type is required'],
      enum: {
        values: ['Wedding', 'Reception', 'Family Celebration', 'Religious Event', 'Other'],
        message: 'Invalid event type',
      },
    },
    eventDate: {
      type: Date,
      default: null,
    },
    eventFromDate: {
      type: Date,
      default: null,
    },
    eventToDate: {
      type: Date,
      default: null,
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      enum: {
        values: ['Open Hall', 'Closed / Banquet Hall', 'Temple / Mandir', 'Rooms', 'Other'],
        message: 'Invalid venue',
      },
    },
    guestCount: {
      type: Number,
      required: [true, 'Guest count is required'],
      min: [1, 'Guest count must be at least 1'],
    },
    description: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
        message: 'Invalid status',
      },
      default: 'Pending',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
  },
  { timestamps: true }
)

eventSchema.index({ eventDate: 1 })
eventSchema.index({ venue: 1 })
eventSchema.index({ status: 1 })
eventSchema.index({ eventDate: 1, venue: 1, status: 1 })

module.exports = mongoose.model('Event', eventSchema)
