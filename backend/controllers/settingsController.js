const Settings = require('../models/Settings')

const ALLOWED_FIELDS = [
  'businessName', 'tagline', 'description', 'capacity',
  'yearsExperience', 'eventsHosted', 'customers', 'googleRating',
  'contact', 'socialLinks', 'facilities',
]

const getPublicSettings = async (req, res, next) => {
  try {
    const settings = await Settings.findOne({ settingsKey: 'business' })
    if (!settings) {
      return res.status(200).json({ success: true, configured: false, data: null })
    }

    res.status(200).json({
      success: true,
      configured: true,
      data: {
        businessName: settings.businessName,
        tagline: settings.tagline,
        description: settings.description,
        capacity: settings.capacity,
        yearsExperience: settings.yearsExperience,
        eventsHosted: settings.eventsHosted,
        customers: settings.customers,
        googleRating: settings.googleRating,
        contact: settings.contact,
        socialLinks: settings.socialLinks,
        facilities: settings.facilities,
      },
    })
  } catch (error) {
    next(error)
  }
}

const getAdminSettings = async (req, res, next) => {
  try {
    const settings = await Settings.findOne({ settingsKey: 'business' }).populate('updatedBy', 'name email')
    if (!settings) {
      return res.status(200).json({ success: true, configured: false, data: null })
    }

    res.status(200).json({ success: true, data: settings })
  } catch (error) {
    next(error)
  }
}

const updateSettings = async (req, res, next) => {
  try {
    const allowed = {}
    for (const field of ALLOWED_FIELDS) {
      if (req.body[field] !== undefined) {
        allowed[field] = req.body[field]
      }
    }

    if (allowed.capacity !== undefined && (allowed.capacity < 0 || !Number.isInteger(allowed.capacity))) {
      return res.status(400).json({ success: false, message: 'Capacity must be a non-negative integer' })
    }

    if (allowed.yearsExperience !== undefined && (allowed.yearsExperience < 0 || !Number.isInteger(allowed.yearsExperience))) {
      return res.status(400).json({ success: false, message: 'Years experience must be a non-negative integer' })
    }

    if (allowed.eventsHosted !== undefined && (allowed.eventsHosted < 0 || !Number.isInteger(allowed.eventsHosted))) {
      return res.status(400).json({ success: false, message: 'Events hosted must be a non-negative integer' })
    }

    if (allowed.customers !== undefined && (allowed.customers < 0 || !Number.isInteger(allowed.customers))) {
      return res.status(400).json({ success: false, message: 'Customers must be a non-negative integer' })
    }

    if (allowed.googleRating !== undefined && (allowed.googleRating < 0 || allowed.googleRating > 5)) {
      return res.status(400).json({ success: false, message: 'Google rating must be between 0 and 5' })
    }

    if (allowed.contact && allowed.contact.email && allowed.contact.email !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(allowed.contact.email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format' })
      }
    }

    if (allowed.contact && allowed.contact.googleMapsUrl && allowed.contact.googleMapsUrl !== '') {
      try {
        new URL(allowed.contact.googleMapsUrl)
      } catch {
        return res.status(400).json({ success: false, message: 'Invalid Google Maps URL' })
      }
    }

    const urlFields = ['instagram', 'facebook', 'youtube']
    if (allowed.socialLinks) {
      for (const field of urlFields) {
        if (allowed.socialLinks[field] && allowed.socialLinks[field] !== '') {
          try {
            new URL(allowed.socialLinks[field])
          } catch {
            return res.status(400).json({ success: false, message: 'Invalid ' + field + ' URL' })
          }
        }
      }
    }

    if (allowed.facilities) {
      const { FACILITIES } = require('../models/Settings')
      const invalid = allowed.facilities.filter((f) => !FACILITIES.includes(f))
      if (invalid.length > 0) {
        return res.status(400).json({ success: false, message: 'Invalid facility: ' + invalid.join(', ') })
      }
      allowed.facilities = [...new Set(allowed.facilities)]
    }

    allowed.updatedBy = req.user._id

    let settings = await Settings.findOne({ settingsKey: 'business' })

    if (!settings) {
      settings = await Settings.create({ settingsKey: 'business', ...allowed })
    } else {
      Object.assign(settings, allowed)
      await settings.save()
    }

    res.status(200).json({ success: true, message: 'Settings updated successfully', data: settings })
  } catch (error) {
    next(error)
  }
}

module.exports = { getPublicSettings, getAdminSettings, updateSettings }
