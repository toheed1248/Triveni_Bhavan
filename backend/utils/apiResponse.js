const sendSuccess = (res, statusCode, data = null, message = 'Success') => {
  const response = { success: true, message }
  if (data !== null) response.data = data
  return res.status(statusCode).json(response)
}

const sendError = (res, statusCode, message = 'Something went wrong') => {
  return res.status(statusCode).json({ success: false, message })
}

module.exports = { sendSuccess, sendError }
