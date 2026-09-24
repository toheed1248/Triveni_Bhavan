const express = require('express')
const router = express.Router()
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getUpcomingEvents,
  getEventsReport,
} = require('../controllers/eventController')
const { protect } = require('../middleware/authMiddleware')
const validate = require('../middleware/validate')
const { eventSchemas } = require('../validation/schemas')

router.get('/upcoming', getUpcomingEvents)
router.get('/report', protect, getEventsReport)
router.get('/', protect, validate(eventSchemas.listQuery, 'query'), getEvents)
router.get('/:id', protect, validate(eventSchemas.idParam, 'params'), getEventById)
router.post('/', protect, validate(eventSchemas.create), createEvent)
router.put('/:id', protect, validate(eventSchemas.idParam, 'params'), validate(eventSchemas.update), updateEvent)
router.delete('/:id', protect, validate(eventSchemas.idParam, 'params'), deleteEvent)

module.exports = router
