const Enquiry = require('../models/Enquiry')
const Event = require('../models/Event')
const Gallery = require('../models/Gallery')
const Review = require('../models/Review')
const Settings = require('../models/Settings')

exports.getSummary = async (req, res, next) => {
  try {
    const [
      enquiryTotal,
      enquiriesByStatus,
      recentEnquiries,
      eventTotal,
      eventUpcoming,
      upcomingList,
      galleryTotal,
      galleryPublished,
      galleryArchived,
      reviewTotal,
      reviewPublished,
      reviewVerified,
      avgResult,
      ratingBreakdown,
      settingsExists,
    ] = await Promise.all([
      Enquiry.countDocuments({ isArchived: false }),
      Enquiry.aggregate([
        { $match: { isArchived: false } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Enquiry.find({ isArchived: false }).sort({ createdAt: -1 }).limit(5).select('name eventType status createdAt'),
      Event.countDocuments({ status: { $ne: 'Cancelled' } }),
      Event.countDocuments({ eventDate: { $gte: new Date() }, status: { $in: ['Pending', 'Confirmed'] } }),
      Event.find({ eventDate: { $gte: new Date() }, status: { $in: ['Pending', 'Confirmed'] } })
        .sort({ eventDate: 1 })
        .limit(5)
        .select('eventName eventDate startTime endTime venue status'),
      Gallery.countDocuments({ isArchived: false }),
      Gallery.countDocuments({ isPublished: true, isArchived: false }),
      Gallery.countDocuments({ isArchived: true }),
      Review.countDocuments({ isArchived: false }),
      Review.countDocuments({ isPublished: true, isArchived: false }),
      Review.countDocuments({ isVerified: true, isArchived: false }),
      Review.aggregate([
        { $match: { isArchived: false } },
        { $group: { _id: null, avg: { $avg: '$rating' } } },
      ]),
      Review.aggregate([
        { $match: { isArchived: false } },
        { $group: { _id: '$rating', count: { $sum: 1 } } },
      ]),
      Settings.findOne({ settingsKey: 'business' }).select('businessName'),
    ])

    const byStatus = {}
    enquiriesByStatus.forEach((s) => { byStatus[s._id] = s.count })

    const breakdown = {}
    ratingBreakdown.forEach((r) => { breakdown[r._id] = r.count })

    const recentActivity = []
    recentEnquiries.forEach((e) => {
      recentActivity.push({
        type: 'Enquiry',
        title: `${e.name} — ${e.eventType}`,
        date: e.createdAt,
      })
    })
    upcomingList.forEach((e) => {
      recentActivity.push({
        type: 'Event',
        title: `${e.eventName} — ${e.venue}`,
        date: e.eventDate,
      })
    })
    recentActivity.sort((a, b) => new Date(b.date) - new Date(a.date))

    res.json({
      success: true,
      data: {
        enquiries: {
          total: enquiryTotal,
          byStatus,
          recent: recentEnquiries,
        },
        events: {
          total: eventTotal,
          upcoming: eventUpcoming,
          upcomingList,
        },
        gallery: {
          total: galleryTotal,
          published: galleryPublished,
          archived: galleryArchived,
        },
        reviews: {
          total: reviewTotal,
          published: reviewPublished,
          verified: reviewVerified,
          averageRating: avgResult[0]?.avg ? Math.round(avgResult[0].avg * 10) / 10 : null,
          ratingBreakdown: breakdown,
        },
        settings: {
          configured: !!settingsExists,
          businessName: settingsExists?.businessName || '',
        },
        recentActivity,
      },
    })
  } catch (err) {
    next(err)
  }
}
