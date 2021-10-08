import express from 'express'
import validator from 'express-validator'
import * as validations from './validations.js'

const router = express.Router()

/**
 * Example route which validates a form submission
 */
router.post('/examples/validation-errors', validations.exampleValidation, (req, res) => {
  const errors = validator.validationResult(req)
  res.render('examples/validation-errors', {
    errors: errors.isEmpty() ? false : errors.mapped()
  })
})

export default router
