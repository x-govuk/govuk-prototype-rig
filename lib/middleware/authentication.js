import process from 'node:process'
import { encryptString } from '../utils.js'

const publicPaths = [
  '/govuk/assets',
  '/prototype-password',
  '/public',
  // A google site verification file such as
  // googleabcde123456.html
  '/google'
]

/**
 * Redirect to the password page.
 *
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @returns {Function} Express redirect response
 */
const redirectToPasswordPage = (req, res) => {
  const base = `${req.protocol}://${req.get('host')}`
  const passwordPageUrl = new URL('prototype-password', base)
  passwordPageUrl.searchParams.append('returnUrl', req.originalUrl)

  res.redirect(passwordPageUrl.href)
}

/**
 * Simple authentication middleware.
 *
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware callback
 * @returns {Function} Express middleware requiring the given credentials
 */
export function authentication (req, res, next) {
  // Don’t authenticate public paths or the password page
  if (publicPaths.some(path => req.path.startsWith(path))) {
    return next()
  }

  // Show custom error page if password hasn’t been set
  if (!process.env.PASSWORD) {
    return res.status(501).render('no-password-set.njk', { status: 501 })
  }

  // Password is encrypted because we store it in a cookie
  // We store the password to compare in case it is changed server-side
  // changing the password should require users to re-authenticate
  const encryptedPassword = encryptString(process.env.PASSWORD)
  if (req.cookies.authentication === encryptedPassword) {
    next()
  } else {
    redirectToPasswordPage(req, res)
  }
}
