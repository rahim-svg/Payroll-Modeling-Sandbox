/**
 * @file validate.middleware.js
 * @description Express-validator result handler middleware.
 *              Checks for validation errors and returns 422 if any are found.
 *              Used after express-validator chains on routes.
 */
const { validationResult } = require('express-validator')

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed',
      errors: errors.array(),
    })
  }
  next()
}

module.exports = validate
