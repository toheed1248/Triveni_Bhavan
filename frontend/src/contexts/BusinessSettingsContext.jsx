import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'

const BusinessSettingsContext = createContext(null)

export function BusinessSettingsProvider({ children }) {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSettings = useCallback(async () => {
    try {
      const res = await api.get('/settings/public')
      setSettings(res.data.data)
      setError(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'tb_settings_updated') {
        fetchSettings()
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [fetchSettings])

  const refreshSettings = useCallback(async () => {
    await fetchSettings()
  }, [fetchSettings])

  return (
    <BusinessSettingsContext.Provider value={{ settings, loading, error, refreshSettings }}>
      {children}
    </BusinessSettingsContext.Provider>
  )
}

export const useBusinessSettings = () => useContext(BusinessSettingsContext)
