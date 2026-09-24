const Enquiry = require('../models/Enquiry')
const { escapeRegex } = require('../utils/sanitize')

const EVENT_TYPES = ['Wedding', 'Reception', 'Family Celebration', 'Religious Event', 'Corporate Event', 'Other']
const VENUES = ['Open Hall', 'Closed / Banquet Hall', 'Temple / Mandir', 'No Preference']
const FACILITIES = ['Open Hall', 'Closed / Banquet Hall', 'Rooms', 'Parking']
const STATUSES = ['New', 'Contacted', 'Quoted', 'Confirmed', 'Closed', 'Cancelled']

exports.createEnquiry = async (req, res, next) => {
  try {
    const { name, phone, email, eventType, bookingFrom, bookingTo, guestCount, preferredVenue, requiredFacilities, message } = req.body

    if (!name || !phone || !eventType || !bookingFrom || !bookingTo || !guestCount || !preferredVenue) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided' })
    }

    if (name.length < 2) {
      return res.status(400).json({ success: false, message: 'Name must be at least 2 characters' })
    }

    if (!EVENT_TYPES.includes(eventType)) {
      return res.status(400).json({ success: false, message: 'Invalid event type' })
    }

    if (!VENUES.includes(preferredVenue)) {
      return res.status(400).json({ success: false, message: 'Invalid venue preference' })
    }

    const bookingFromObj = new Date(bookingFrom)
    const bookingToObj = new Date(bookingTo)
    if (isNaN(bookingFromObj.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid booking start date' })
    }
    if (isNaN(bookingToObj.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid booking end date' })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (bookingFromObj < today) {
      return res.status(400).json({ success: false, message: 'Booking start date cannot be in the past' })
    }

    if (bookingToObj < bookingFromObj) {
      return res.status(400).json({ success: false, message: 'Booking end date cannot be before start date' })
    }

    if (guestCount < 1) {
      return res.status(400).json({ success: false, message: 'Guest count must be at least 1' })
    }

    if (requiredFacilities && requiredFacilities.length > 0) {
      const invalid = requiredFacilities.filter((f) => !FACILITIES.includes(f))
      if (invalid.length > 0) {
        return res.status(400).json({ success: false, message: 'Invalid facility: ' + invalid.join(', ') })
      }
    }

    const recentDuplicate = await Enquiry.findOne({
      phone,
      createdAt: { $gte: new Date(Date.now() - 60000) },
    })
    if (recentDuplicate) {
      return res.status(200).json({ success: true, message: 'Your enquiry has been received successfully.' })
    }

    await Enquiry.create({
      name,
      phone,
      email: email || '',
      eventType,
      bookingFrom: bookingFromObj,
      bookingTo: bookingToObj,
      guestCount,
      preferredVenue,
      requiredFacilities: requiredFacilities || [],
      message: message || '',
    })

    res.status(201).json({ success: true, message: 'Your enquiry has been received successfully.' })
  } catch (error) {
    next(error)
  }
}

exports.getEnquiries = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, eventType, preferredVenue, fromDate, toDate, search } = req.query
    const pageNum = Math.max(1, parseInt(page))
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)))

    const query = { isArchived: false }
    if (status) query.status = status
    if (eventType) query.eventType = eventType
    if (preferredVenue) query.preferredVenue = preferredVenue
    if (fromDate || toDate) {
      query.createdAt = {}
      if (fromDate) query.createdAt.$gte = new Date(fromDate)
      if (toDate) query.createdAt.$lte = new Date(toDate)
    }
    if (search) {
      const safeSearch = escapeRegex(search)
      query.$or = [
        { name: { $regex: safeSearch, $options: 'i' } },
        { phone: { $regex: safeSearch, $options: 'i' } },
        { email: { $regex: safeSearch, $options: 'i' } },
      ]
    }

    const total = await Enquiry.countDocuments(query)
    const enquiries = await Enquiry.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)

    res.status(200).json({
      success: true,
      data: enquiries,
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

exports.getEnquiryById = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id).select('+adminNotes')
    if (!enquiry || enquiry.isArchived) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' })
    }
    res.status(200).json({ success: true, data: enquiry })
  } catch (error) {
    next(error)
  }
}

exports.updateEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id)
    if (!enquiry || enquiry.isArchived) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' })
    }

    const { status, adminNotes } = req.body

    if (status) {
      if (!STATUSES.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' })
      }
      enquiry.status = status
    }

    if (adminNotes !== undefined) {
      enquiry.adminNotes = adminNotes
    }

    await enquiry.save()

    res.status(200).json({ success: true, message: 'Enquiry updated successfully', data: enquiry })
  } catch (error) {
    next(error)
  }
}

exports.archiveEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id)
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' })
    }

    enquiry.isArchived = true
    enquiry.archivedAt = new Date()
    enquiry.archivedBy = req.user._id
    await enquiry.save()

    res.status(200).json({ success: true, message: 'Enquiry archived successfully' })
  } catch (error) {
    next(error)
  }
}

exports.sendWhatsApp = async (req, res, next) => {
  try {
    const { message } = req.body
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' })
    }

    const enquiry = await Enquiry.findById(req.params.id)
    if (!enquiry || enquiry.isArchived) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' })
    }

    enquiry.whatsappMessages.push({
      message: message.trim(),
      sentAt: new Date(),
      sentBy: req.user._id,
    })

    if (enquiry.status === 'New') {
      enquiry.status = 'Contacted'
    }

    await enquiry.save()

    const phone = enquiry.phone.replace(/[^0-9]/g, '')
    const waPhone = phone.length > 10 ? phone : '91' + phone
    const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(message.trim())}`

    res.status(200).json({
      success: true,
      message: 'Message logged. Opening WhatsApp.',
      data: { waUrl, phone: waPhone },
    })
  } catch (error) {
    next(error)
  }
}

exports.deleteEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id)
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' })
    }

    res.status(200).json({ success: true, message: 'Enquiry deleted successfully' })
  } catch (error) {
    next(error)
  }
}

exports.getEnquiriesReport = async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find({ isArchived: false })
      .sort({ createdAt: -1 })
      .select('name phone email eventType bookingFrom bookingTo guestCount preferredVenue requiredFacilities message status createdAt')

    const statusCounts = {}
    enquiries.forEach((e) => {
      statusCounts[e.status] = (statusCounts[e.status] || 0) + 1
    })

    res.status(200).json({
      success: true,
      data: enquiries,
      summary: {
        total: enquiries.length,
        statusCounts,
      },
    })
  } catch (error) {
    next(error)
  }
}
