const Event = require('../models/Event')

const VENUES = ['Open Hall', 'Closed / Banquet Hall', 'Temple / Mandir', 'Rooms']

exports.checkAvailability = async (req, res, next) => {
  try {
    const { date, venue, startTime, endTime } = req.query

    if (!date || !venue || !startTime || !endTime) {
      return res.status(400).json({ success: false, message: 'Date, venue, startTime, and endTime are required' })
    }

    const eventDate = new Date(date)
    if (isNaN(eventDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid date' })
    }

    const conflict = await Event.findOne({
      venue,
      eventDate,
      status: { $in: ['Pending', 'Confirmed'] },
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    })

    if (conflict) {
      return res.status(200).json({
        success: true,
        available: false,
        message: 'The selected venue is already booked for the requested time.',
      })
    }

    res.status(200).json({
      success: true,
      available: true,
      message: 'The selected venue is available for enquiry.',
    })
  } catch (error) {
    next(error)
  }
}

exports.checkDateAvailability = async (req, res, next) => {
  try {
    const { date, dateFrom, dateTo } = req.query

    const fromDate = dateFrom ? new Date(dateFrom) : (date ? new Date(date) : null)
    const toDate = dateTo ? new Date(dateTo) : fromDate

    if (!fromDate || isNaN(fromDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Date is required' })
    }
    if (toDate && isNaN(toDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid end date' })
    }
    if (toDate && toDate < fromDate) {
      return res.status(400).json({ success: false, message: 'End date cannot be before start date' })
    }

    const isRange = dateFrom && dateTo && dateFrom !== dateTo

    const venues = await Promise.all(
      VENUES.map(async (venue) => {
        let query

        if (isRange) {
          query = {
            venue,
            status: { $in: ['Pending', 'Confirmed'] },
            eventFromDate: { $lte: toDate },
            eventToDate: { $gte: fromDate },
          }
        } else {
          query = {
            venue,
            eventDate: fromDate,
            status: { $in: ['Pending', 'Confirmed'] },
          }
        }

        const hasEvent = await Event.findOne(query)
        return { venue, available: !hasEvent }
      })
    )

    res.status(200).json({
      success: true,
      dateFrom: fromDate.toISOString(),
      dateTo: (toDate || fromDate).toISOString(),
      venues,
    })
  } catch (error) {
    next(error)
  }
}
