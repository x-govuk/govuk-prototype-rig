import validator from 'express-validator'
const { check } = validator

/**
 * Validation checks
 *
 * Uses validators from validator.js
 * @see See https://github.com/validatorjs/validator.js
 */
export const exampleValidation = [
  check('full-name')
    .not()
    .isEmpty()
    .withMessage('Enter your full name'),
  check('email')
    .isEmail()
    .withMessage('Enter an email address in the correct format, like name@example.com')
]
