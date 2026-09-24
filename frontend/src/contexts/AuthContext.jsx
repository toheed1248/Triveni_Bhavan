import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount: validate session by calling /auth/me (cookie is auto-sent)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/auth/me')
        if (res.data?.admin) {
          setAdmin(res.data.admin)
        }
      } catch {
        // Invalid/expired cookie — clear any stale user data
        setAdmin(null)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    // Cookie is set by browser automatically from Set-Cookie header
    // Store admin data in state for UI
    if (res.data?.admin) {
      setAdmin(res.data.admin)
    }
    return res.data
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // Even if the request fails, clear local state
    }
    setAdmin(null)
  }

  const updateProfile = async ({ name, email }) => {
    const res = await api.put('/auth/profile', { name, email })
    const updated = res.data.admin
    setAdmin(updated)
    return res.data
  }

  const changePassword = async ({ currentPassword, newPassword }) => {
    const res = await api.put('/auth/password', { currentPassword, newPassword })
    return res.data
  }

  return (
    <AuthContext.Provider value={{ admin, login, logout, updateProfile, changePassword, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
