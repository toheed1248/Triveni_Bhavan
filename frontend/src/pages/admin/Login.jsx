import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-admin-bg px-4">
      <div className="w-full max-w-[400px]">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-admin-maroon flex items-center justify-center mx-auto mb-4 shadow-lg shadow-admin-maroon/20">
            <span className="font-heading text-xl font-bold text-white">TB</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-admin-text-primary">Welcome Back</h1>
          <p className="text-sm text-admin-text-secondary mt-1">Sign in to Triveni Bhavan Admin</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-admin-border shadow-sm p-6 sm:p-8">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-admin-danger-light border border-red-200 rounded-xl text-admin-danger text-sm mb-5">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-admin-text-primary mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-admin-border rounded-xl text-sm text-admin-text-primary placeholder:text-admin-text-muted focus:outline-none focus:border-admin-maroon focus:ring-1 focus:ring-admin-maroon/20 transition-colors"
                  placeholder="admin@trivenibhavan.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-admin-text-primary mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-muted" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-admin-border rounded-xl text-sm text-admin-text-primary placeholder:text-admin-text-muted focus:outline-none focus:border-admin-maroon focus:ring-1 focus:ring-admin-maroon/20 transition-colors"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-admin-maroon text-white font-semibold rounded-xl text-sm hover:bg-admin-maroon-dark transition-colors disabled:opacity-50 shadow-sm shadow-admin-maroon/20"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-admin-text-muted mt-6">
          Triveni Bhavan Management System
        </p>
      </div>
    </div>
  )
}
