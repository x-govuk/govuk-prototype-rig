import express from 'express'
import { exampleWizard } from './wizards.js'

const router = express.Router()

/**
 * Example routes to demonstrate using wizard helper.
 */
router.all('/examples/wizard/:view?', (req, res, next) => {
  res.locals.paths = exampleWizard(req)
  next()
})

router.post('/examples/wizard/:view?', (req, res) => {
  res.redirect(res.locals.paths.next)
})

export default router
