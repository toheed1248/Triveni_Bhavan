const { z } = require('zod')
const { isValidObjectId } = require('../utils/sanitize')

const trimStr = z.string().trim()

const email = trimStr.email('Invalid email format').max(255, 'Email too long').optional().or(z.literal(''))

const phoneRegex = /^\+?[0-9\s\-().]{7,20}$/
const phone = trimStr.regex(phoneRegex, 'Invalid phone number format').max(20, 'Phone too long')

const objectId = trimStr.refine(isValidObjectId, 'Invalid ID format')

const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
const timeStr = trimStr.regex(timeRegex, 'Invalid time format (use HH:MM)')

const EVENT_TYPES = ['Wedding', 'Reception', 'Family Celebration', 'Religious Event', 'Corporate Event', 'Other']
const ENQUIRY_EVENT_TYPES = EVENT_TYPES
const VENUES = ['Open Hall', 'Closed / Banquet Hall', 'Temple / Mandir', 'Rooms', 'Other']
const ENQUIRY_VENUES = ['Open Hall', 'Closed / Banquet Hall', 'Temple / Mandir', 'No Preference']
const FACILITIES = ['Open Hall', 'Closed / Banquet Hall', 'Rooms', 'Parking']
const EVENT_STATUSES = ['Pending', 'Confirmed', 'Completed', 'Cancelled']
const ENQUIRY_STATUSES = ['New', 'Contacted', 'Quoted', 'Confirmed', 'Closed', 'Cancelled']
const GALLERY_CATEGORIES = ['Exterior', 'Open Hall', 'Closed / Banquet Hall', 'Mandir', 'Interiors', 'Events & Decoration', 'Rooms']
const REVIEW_SOURCES = ['Google', 'Facebook', 'Direct', 'Other']

const maxStr = (max) => trimStr.max(max, `Must be at most ${max} characters`)

const textBlock = (max = 2000) => trimStr.max(max, `Must be at most ${max} characters`)

const positiveInt = z.coerce.number().int().positive('Must be a positive number')
const nonNegInt = z.coerce.number().int().nonnegative('Must be zero or more')
const ratingNum = z.coerce.number().min(1, 'Minimum rating is 1').max(5, 'Maximum rating is 5')

const urlField = trimStr
  .url('Invalid URL format')
  .max(2000, 'URL too long')
  .optional()
  .or(z.literal(''))

const dateStr = z.coerce.date({ invalid_type_error: 'Invalid date' })

const sanitizeFields = (shape) => {
  const cleaned = {}
  for (const [key, val] of Object.entries(shape)) {
    cleaned[key] = val
  }
  return cleaned
}

const authSchemas = {
  login: z.object({
    email: trimStr.email('Invalid email format').max(255),
    password: z.string().min(1, 'Password is required').max(128),
  }),

  updateProfile: z.object({
    name: trimStr.min(1, 'Name is required').max(100, 'Name too long'),
    email: trimStr.email('Invalid email format').max(255, 'Email too long'),
  }),

  changePassword: z.object({
    currentPassword: z.string().min(1, 'Current password is required').max(128),
    newPassword: z.string().min(6, 'Password must be at least 6 characters').max(128, 'Password too long'),
  }),
}

const eventSchemas = {
  create: z.object({
    eventName: trimStr.min(2, 'Event name must be at least 2 characters').max(200, 'Event name too long'),
    eventType: z.enum(EVENT_TYPES, { errorMap: () => ({ message: 'Invalid event type' }) }),
    eventDate: dateStr.optional().nullable(),
    eventFromDate: dateStr.optional().nullable(),
    eventToDate: dateStr.optional().nullable(),
    startTime: timeStr,
    endTime: timeStr,
    venue: z.enum(VENUES, { errorMap: () => ({ message: 'Invalid venue' }) }),
    guestCount: positiveInt.max(100000, 'Guest count too high'),
    description: textBlock(2000).optional().default(''),
    coverImage: trimStr.max(2000, 'URL too long').optional().default(''),
    status: z.enum(EVENT_STATUSES).optional().default('Pending'),
  }),

  update: z.object({
    eventName: trimStr.min(2, 'Event name must be at least 2 characters').max(200, 'Event name too long').optional(),
    eventType: z.enum(EVENT_TYPES).optional(),
    eventDate: dateStr.optional().nullable(),
    eventFromDate: dateStr.optional().nullable(),
    eventToDate: dateStr.optional().nullable(),
    startTime: timeStr.optional(),
    endTime: timeStr.optional(),
    venue: z.enum(VENUES).optional(),
    guestCount: positiveInt.max(100000, 'Guest count too high').optional(),
    description: textBlock(2000).optional(),
    coverImage: trimStr.max(2000).optional(),
    status: z.enum(EVENT_STATUSES).optional(),
  }),

  listQuery: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    status: z.enum(EVENT_STATUSES).optional(),
    venue: z.enum(VENUES).optional(),
    eventType: z.enum(EVENT_TYPES).optional(),
    fromDate: z.coerce.date().optional(),
    toDate: z.coerce.date().optional(),
  }),

  idParam: z.object({
    id: objectId,
  }),
}

const enquirySchemas = {
  create: z.object({
    name: trimStr.min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
    phone: phone,
    email: email,
    eventType: z.enum(ENQUIRY_EVENT_TYPES, { errorMap: () => ({ message: 'Invalid event type' }) }),
    bookingFrom: dateStr,
    bookingTo: dateStr,
    guestCount: positiveInt.max(100000, 'Guest count too high'),
    preferredVenue: z.enum(ENQUIRY_VENUES, { errorMap: () => ({ message: 'Invalid venue' }) }),
    requiredFacilities: z.array(z.enum(FACILITIES)).optional().default([]),
    message: textBlock(1000).optional().default(''),
  }),

  update: z.object({
    status: z.enum(ENQUIRY_STATUSES).optional(),
    adminNotes: textBlock(5000).optional(),
  }),

  listQuery: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    status: z.enum(ENQUIRY_STATUSES).optional(),
    eventType: z.enum(ENQUIRY_EVENT_TYPES).optional(),
    preferredVenue: z.enum(ENQUIRY_VENUES).optional(),
    fromDate: z.coerce.date().optional(),
    toDate: z.coerce.date().optional(),
    search: trimStr.max(200).optional().default(''),
  }),

  whatsapp: z.object({
    message: trimStr.min(1, 'Message is required').max(1000, 'Message too long'),
  }),

  idParam: z.object({
    id: objectId,
  }),
}

const gallerySchemas = {
  upload: z.object({
    title: trimStr.min(1, 'Title is required').max(200, 'Title too long'),
    category: z.enum(GALLERY_CATEGORIES, { errorMap: () => ({ message: 'Invalid category' }) }),
    altText: trimStr.min(1, 'Alt text is required').max(300, 'Alt text too long'),
    description: textBlock(500).optional().default(''),
    sortOrder: z.coerce.number().int().nonnegative().default(0),
    isPublished: z.coerce.boolean().default(true),
  }),

  update: z.object({
    title: trimStr.min(1).max(200).optional(),
    category: z.enum(GALLERY_CATEGORIES).optional(),
    altText: trimStr.min(1).max(300).optional(),
    description: textBlock(500).optional(),
    sortOrder: z.coerce.number().int().nonnegative().optional(),
    isPublished: z.coerce.boolean().optional(),
  }),

  listQuery: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
    category: z.enum(GALLERY_CATEGORIES).optional(),
    all: z.coerce.boolean().optional(),
  }),

  idParam: z.object({
    id: objectId,
  }),
}

const reviewSchemas = {
  create: z.object({
    reviewerName: trimStr.min(1, 'Reviewer name is required').max(100, 'Name too long'),
    rating: ratingNum,
    reviewText: trimStr.min(10, 'Review must be at least 10 characters').max(2000, 'Review too long'),
    source: z.enum(REVIEW_SOURCES, { errorMap: () => ({ message: 'Invalid source' }) }),
    sourceUrl: urlField,
    reviewDate: dateStr.optional().nullable(),
    isVerified: z.coerce.boolean().default(false),
    isPublished: z.coerce.boolean().default(false),
  }),

  update: z.object({
    reviewerName: trimStr.min(1).max(100).optional(),
    rating: ratingNum.optional(),
    reviewText: trimStr.min(10).max(2000).optional(),
    source: z.enum(REVIEW_SOURCES).optional(),
    sourceUrl: urlField,
    reviewDate: dateStr.optional().nullable(),
    isVerified: z.coerce.boolean().optional(),
    isPublished: z.coerce.boolean().optional(),
  }),

  listQuery: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
  }),

  idParam: z.object({
    id: objectId,
  }),
}

const settingsSchemas = {
  update: z.object({
    businessName: trimStr.max(200, 'Name too long').optional(),
    tagline: trimStr.max(300, 'Tagline too long').optional(),
    description: textBlock(2000).optional(),
    capacity: nonNegInt.optional(),
    yearsExperience: nonNegInt.optional(),
    eventsHosted: nonNegInt.optional(),
    customers: nonNegInt.optional(),
    googleRating: z.coerce.number().min(0).max(5).optional(),
    contact: z
      .object({
        phone: trimStr.max(20).optional(),
        whatsapp: trimStr.max(20).optional(),
        email: trimStr.email().max(255).optional().or(z.literal('')),
        address: textBlock(500).optional(),
        googleMapsUrl: urlField,
      })
      .partial()
      .optional(),
    socialLinks: z
      .object({
        instagram: urlField,
        facebook: urlField,
        youtube: urlField,
      })
      .partial()
      .optional(),
    facilities: z.array(z.enum(['Parking', 'AC', 'Non-AC', 'Sound System', 'Stage', 'Power Backup', 'Catering Kitchen', 'Outdoor Space'])).optional(),
  }),
}

const availabilitySchemas = {
  check: z.object({
    date: dateStr,
    venue: z.enum(VENUES.filter((v) => v !== 'Other'), { errorMap: () => ({ message: 'Invalid venue' }) }),
    startTime: timeStr,
    endTime: timeStr,
  }),

  checkDate: z.object({
    date: dateStr.optional(),
    dateFrom: dateStr.optional(),
    dateTo: dateStr.optional(),
  }),
}

module.exports = {
  authSchemas,
  eventSchemas,
  enquirySchemas,
  gallerySchemas,
  reviewSchemas,
  settingsSchemas,
  availabilitySchemas,
  objectId,
  trimStr,
  maxStr,
  textBlock,
  phone,
  email,
  urlField,
  timeStr,
  dateStr,
  positiveInt,
  nonNegInt,
  ratingNum,
}
