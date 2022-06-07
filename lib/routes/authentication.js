import process from 'node:process'
import { encryptString } from '../utils.js'

export const authenticationRoutes = router => {
  /**
   * View password page
   */
  router.get('/prototype-password', (req, res) => {
    const returnUrl = req.query.returnUrl || '/'

    res.render('password.njk', { returnUrl })
  })

  /**
   * Check authentication password
   */
  router.post('/prototype-password', (req, res) => {
    const password = process.env.PASSWORD
    const submittedPassword = req.body._password
    const returnUrl = req.body.returnUrl

    if (password === submittedPassword) {
      // See lib/middleware/authentication.js for explanation
      res.cookie('authentication', encryptString(password), {
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        sameSite: 'None', // Allows GET and POST requests from other domains
        httpOnly: true,
        secure: true
      })

      // Validate return URL
      if (!returnUrl.startsWith('/')) {
        throw new Error('Return URL must be a page in this prototype')
      } else {
        res.redirect(returnUrl)
      }
    } else {
      res.status(422).render('password.njk', {
        error: 'The password is not correct',
        returnUrl
      })
    }
  })

  return router
}
