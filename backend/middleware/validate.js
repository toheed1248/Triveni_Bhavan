const { ZodError } = require('zod')

const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const data = req[source]
    const result = schema.safeParse(data)

    if (result.success) {
      req[source] = result.data
      return next()
    }

    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }))

    return res.status(400).json({
      success: false,
      message: 'Invalid input',
      errors,
    })
  }
}

module.exports = validate
