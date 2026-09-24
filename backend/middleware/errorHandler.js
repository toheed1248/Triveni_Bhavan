const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode
  let message = err.message

  if (err.name === 'SyntaxError' && err.status === 400 && 'body' in err) {
    statusCode = 400
    message = 'Invalid JSON in request body'
  }

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404
    message = 'Resource not found'
  }

  if (err.name === 'ValidationError') {
    statusCode = 400
    message = Object.values(err.errors).map((val) => val.message).join(', ')
  }

  if (err.type === 'entity.too.large') {
    statusCode = 413
    message = 'Request body too large'
  }

  res.status(statusCode).json({
    success: false,
    message,
  })
}

module.exports = errorHandler
