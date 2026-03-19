/**
 * @file validate.middleware.js
 * @description Express validator middleware.
 *              Validates request body/query based on validation chain.
 */
import { validationResult } from 'express-validator'

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    })
  }
  next()
}

export default validateRequest
