import express from 'express'
import { exampleWizardPaths, exampleWizardForks, trnWizardPaths, trnWizardForks} from './wizards.js'

const router = express.Router()

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
