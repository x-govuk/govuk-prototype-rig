/**
 * Redirect HTTP requests to HTTPS
 *
 * @param {object} req Express request
 * @param {object} res Express response
 * @param {Function} next Next middleware callback
 * @returns {object} Express response
 */
export default (req, res, next) => {
  let protocol = req.headers['x-forwarded-proto']
  // Glitch returns a comma separated list for x-forwarded-proto
  // We need the first to determine if running on https
  if (protocol) {
    protocol = protocol.split(',').shift()
  }

  if (protocol !== 'https') {
    console.log('Redirecting request to https')
    // 302 temporary. This is a feature that can be disabled
    return res.redirect(302, 'https://' + req.get('Host') + req.url)
  }

  // Mark proxy as secure (allows secure cookies)
  req.connection.proxySecure = true
  next()
}
