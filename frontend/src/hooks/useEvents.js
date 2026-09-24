import { useState, useEffect } from 'react'
import api from '../services/api'

export function useUpcomingEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/events/upcoming')
      .then((r) => setEvents(r.data.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return { events, loading, error }
}
