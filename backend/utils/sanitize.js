const sanitizeHtml = (str) => {
  if (typeof str !== 'string') return str
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

const escapeRegex = (str) => {
  if (typeof str !== 'string') return ''
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const isValidObjectId = (val) => /^[0-9a-fA-F]{24}$/.test(val)

const sanitizeObject = (obj, fields) => {
  if (!obj || typeof obj !== 'object') return obj
  const cleaned = { ...obj }
  for (const field of fields) {
    if (typeof cleaned[field] === 'string') {
      cleaned[field] = sanitizeHtml(cleaned[field])
    }
  }
  return cleaned
}

module.exports = { sanitizeHtml, escapeRegex, isValidObjectId, sanitizeObject }
