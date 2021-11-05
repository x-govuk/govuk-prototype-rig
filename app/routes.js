import express from 'express'
import validator from 'express-validator'
import { exampleValidation } from './validations.js'

const router = express.Router()

/**
 * Example route to demonstrate form validation.
 */
router.post('/examples/validation-errors', exampleValidation, (req, res) => {
  const errors = validator.validationResult(req)
  res.render('examples/validation-errors', {
    errors: errors.isEmpty() ? false : errors.mapped()
  })
})

export default router
