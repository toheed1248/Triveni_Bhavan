import { useState, useEffect } from 'react'
import api from '../services/api'

export function useGallery(category = '', page = 1, limit = 20) {
  const [images, setImages] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    const params = { page, limit }
    if (category) params.category = category
    api.get('/gallery', { params })
      .then((r) => { setImages(r.data.data); setPagination(r.data.pagination) })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [category, page, limit])

  return { images, pagination, loading, error }
}
