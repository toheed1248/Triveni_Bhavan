const Event = require('../models/Event')

const VENUES = ['Open Hall', 'Closed / Banquet Hall', 'Temple / Mandir', 'Rooms', 'Other']
const EVENT_TYPES = ['Wedding', 'Reception', 'Family Celebration', 'Religious Event', 'Other']
const STATUSES = ['Pending', 'Confirmed', 'Completed', 'Cancelled']

const parseTime = (timeStr) => {
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}

const hasConflict = async (date, venue, startTime, endTime, excludeId = null) => {
  const startMin = parseTime(startTime)
  const endMin = parseTime(endTime)

  const query = {
    venue,
    eventDate: date,
    status: { $in: ['Pending', 'Confirmed'] },
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
  }

  if (excludeId) {
    query._id = { $ne: excludeId }
  }

  const conflict = await Event.findOne(query)
  return !!conflict
}

exports.createEvent = async (req, res, next) => {
  try {
    const { eventName, eventType, eventDate, eventFromDate, eventToDate, startTime, endTime, venue, guestCount, description, coverImage, status } = req.body

    const fromDate = eventFromDate ? new Date(eventFromDate) : (eventDate ? new Date(eventDate) : null)
    const toDate = eventToDate ? new Date(eventToDate) : (eventDate ? new Date(eventDate) : null)

    if (!eventName || !eventType || !fromDate || !startTime || !endTime || !venue || !guestCount) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided' })
    }

    if (!EVENT_TYPES.includes(eventType)) {
      return res.status(400).json({ success: false, message: 'Invalid event type' })
    }

    if (!VENUES.includes(venue)) {
      return res.status(400).json({ success: false, message: 'Invalid venue' })
    }

    if (status && !STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' })
    }

    if (guestCount < 1) {
      return res.status(400).json({ success: false, message: 'Guest count must be at least 1' })
    }

    if (parseTime(endTime) <= parseTime(startTime)) {
      return res.status(400).json({ success: false, message: 'End time must be after start time' })
    }

    if (isNaN(fromDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid event start date' })
    }
    if (toDate && isNaN(toDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid event end date' })
    }
    if (toDate && fromDate && toDate < fromDate) {
      return res.status(400).json({ success: false, message: 'Event end date cannot be before start date' })
    }

    const conflict = await hasConflict(fromDate, venue, startTime, endTime)
    if (conflict) {
      return res.status(409).json({ success: false, message: 'The selected venue is already booked for the requested time.' })
    }

    const event = await Event.create({
      eventName,
      eventType,
      eventDate: fromDate,
      eventFromDate: fromDate,
      eventToDate: toDate || fromDate,
      startTime,
      endTime,
      venue,
      guestCount,
      description: description || '',
      coverImage: coverImage || '',
      status: status || 'Pending',
      createdBy: req.user._id,
    })

    res.status(201).json({ success: true, message: 'Event created successfully', data: event })
  } catch (error) {
    next(error)
  }
}

exports.getEvents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, venue, eventType, fromDate, toDate } = req.query
    const pageNum = Math.max(1, parseInt(page))
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)))

    const query = {}
    if (status) query.status = status
    if (venue) query.venue = venue
    if (eventType) query.eventType = eventType
    if (fromDate || toDate) {
      query.eventDate = {}
      if (fromDate) query.eventDate.$gte = new Date(fromDate)
      if (toDate) query.eventDate.$lte = new Date(toDate)
    }

    const total = await Event.countDocuments(query)
    const events = await Event.find(query)
      .sort({ eventDate: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate('createdBy', 'name email')

    res.status(200).json({
      success: true,
      data: events,
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

exports.getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email')
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' })
    }
    res.status(200).json({ success: true, data: event })
  } catch (error) {
    next(error)
  }
}

exports.updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' })
    }

    const { eventName, eventType, eventDate, eventFromDate, eventToDate, startTime, endTime, venue, guestCount, description, coverImage, status } = req.body

    if (eventType && !EVENT_TYPES.includes(eventType)) {
      return res.status(400).json({ success: false, message: 'Invalid event type' })
    }

    if (venue && !VENUES.includes(venue)) {
      return res.status(400).json({ success: false, message: 'Invalid venue' })
    }

    if (status && !STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' })
    }

    if (guestCount !== undefined && guestCount < 1) {
      return res.status(400).json({ success: false, message: 'Guest count must be at least 1' })
    }

    const newStart = startTime || event.startTime
    const newEnd = endTime || event.endTime

    if (parseTime(newEnd) <= parseTime(newStart)) {
      return res.status(400).json({ success: false, message: 'End time must be after start time' })
    }

    if (eventFromDate) event.eventFromDate = new Date(eventFromDate)
    if (eventToDate) event.eventToDate = new Date(eventToDate)
    if (eventDate) {
      event.eventDate = new Date(eventDate)
      if (!eventFromDate) event.eventFromDate = new Date(eventDate)
      if (!eventToDate) event.eventToDate = new Date(eventDate)
    }

    if (event.eventFromDate && event.eventToDate && event.eventToDate < event.eventFromDate) {
      return res.status(400).json({ success: false, message: 'Event end date cannot be before start date' })
    }

    const newDate = event.eventFromDate || event.eventDate
    const newVenue = venue || event.venue
    const newStatus = status || event.status

    if (newDate && !isNaN(newDate.getTime())) {
      if (newStatus !== 'Cancelled') {
        const conflict = await hasConflict(newDate, newVenue, newStart, newEnd, event._id)
        if (conflict) {
          return res.status(409).json({ success: false, message: 'The selected venue is already booked for the requested time.' })
        }
      }
    }

    if (eventName) event.eventName = eventName
    if (eventType) event.eventType = eventType
    if (startTime) event.startTime = startTime
    if (endTime) event.endTime = endTime
    if (venue) event.venue = venue
    if (guestCount !== undefined) event.guestCount = guestCount
    if (description !== undefined) event.description = description
    if (coverImage !== undefined) event.coverImage = coverImage
    if (status) event.status = status

    await event.save()

    res.status(200).json({ success: true, message: 'Event updated successfully', data: event })
  } catch (error) {
    next(error)
  }
}

exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' })
    }

    event.status = 'Cancelled'
    await event.save()

    res.status(200).json({ success: true, message: 'Event cancelled successfully' })
  } catch (error) {
    next(error)
  }
}

exports.getUpcomingEvents = async (req, res, next) => {
  try {
    const now = new Date()
    const events = await Event.find({
      eventDate: { $gte: now },
      status: { $in: ['Pending', 'Confirmed'] },
    })
      .sort({ eventDate: 1 })
      .limit(10)
      .select('eventName eventType eventDate eventFromDate eventToDate startTime endTime venue guestCount coverImage status')

    res.status(200).json({ success: true, data: events })
  } catch (error) {
    next(error)
  }
}

exports.getEventsReport = async (req, res, next) => {
  try {
    const events = await Event.find({})
      .sort({ eventDate: -1 })
      .select('eventName eventType eventDate eventFromDate eventToDate startTime endTime venue guestCount status createdAt')

    const statusCounts = {}
    events.forEach((e) => {
      statusCounts[e.status] = (statusCounts[e.status] || 0) + 1
    })

    res.status(200).json({
      success: true,
      data: events,
      summary: {
        total: events.length,
        statusCounts,
      },
    })
  } catch (error) {
    next(error)
  }
}
