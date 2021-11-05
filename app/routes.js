import express from 'express'
import validator from 'express-validator'
import { exampleValidation } from './validations.js'
import { exampleWizardPaths, exampleWizardForks } from './wizards.js'

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

/**
 * Example routes to demonstrate using wizard helper.
 */
router.get('/examples/wizard', (req, res) => {
  res.render('examples/wizard/index', {
    paths: exampleWizardPaths(req)
  })
})

router.get('/examples/wizard/:view', (req, res) => {
  const { view } = req.params
  const views = [
    'check-answers',
    'confirm',
    'england',
    'name',
    'nationality',
    'where-do-you-live'
  ]

  if (views.includes(view)) {
    res.render(`examples/wizard/${view}`, {
      paths: exampleWizardPaths(req)
    })
  }
})

router.post('/examples/wizard/:view?', (req, res) => {
  const fork = exampleWizardForks(req)
  const paths = exampleWizardPaths(req)
  fork ? res.redirect(fork) : res.redirect(paths.next)
})

export default router
