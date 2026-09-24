import { useState, useEffect } from 'react'
import api from '../services/api'

export function usePublicReviews(page = 1, limit = 10) {
  const [reviews, setReviews] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    api.get('/reviews', { params: { page, limit } })
      .then((r) => { setReviews(r.data.data); setPagination(r.data.pagination) })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [page, limit])

  return { reviews, pagination, loading, error }
}

export function useReviewSummary() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/reviews/summary')
      .then((r) => setSummary(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { summary, loading }
}
