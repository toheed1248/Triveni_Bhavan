export const resolveMediaUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  const origin = base.replace(/\/api\/?$/, '')
  return origin + url
}

export const formatStat = (value, suffix = '') => {
  if (value === null || value === undefined || value === 0) return null
  return value + suffix
}
