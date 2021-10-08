import basicAuth from 'basic-auth'

/**
 * Simple basic auth middleware
 *
 * @param {String} req Express request
 * @param {String} res Express response
 * @returns {Function} Express middleware requiring the given credentials
 */
export default (req, res, next) => {
  const { env, useAuth } = res.app.locals
  const username = process.env.USERNAME
  const password = process.env.PASSWORD

  if (env === 'production' && useAuth) {
    if (!username || !password) {
      console.error('Username or password is not set')
      return res.send('Username or password is not set')
    }

    const user = basicAuth(req)

    if (!user || user.name !== username || user.pass !== password) {
      res.set('WWW-Authenticate', 'Basic realm=Authorization Required')
      return res.sendStatus(401)
    }
  }

  next()
}
