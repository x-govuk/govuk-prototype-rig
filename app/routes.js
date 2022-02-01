import express from 'express'
import { exampleWizardPaths, exampleWizardForks, trnWizardPaths, trnWizardForks } from './wizards.js'

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

/**
 * TRN wizard routes
 */
router.get('/start', (req, res) => {
  res.render('start', {
    paths: trnWizardPaths(req)
  })
})

router.get('/:view', (req, res) => {
  res.render(req.params.view, {
    paths: trnWizardPaths(req)
  })
})

router.post('/:view?', (req, res) => {
  const fork = trnWizardForks(req)
  const paths = trnWizardPaths(req)
  fork ? res.redirect(fork) : res.redirect(paths.next)
})

export default router
