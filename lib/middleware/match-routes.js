/**
 * @private
 * @param {String} path URL path
 * @param {object} res Express response
 * @param {Function} next Next middleware callback
 * @returns {object} Express response
 */
const _renderPath = (path, res, next) => {
  // Try to render the path
  res.render(path, (error, html) => {
    if (!error) {
      // Success - send the response
      res.set({ 'Content-type': 'text/html; charset=utf-8' })
      res.end(html)
      return
    }

    if (!error.message.startsWith('template not found')) {
      // We got an error other than template not found. Call next with the error
      next(error)
      return
    }

    if (!path.endsWith('/index')) {
      // Maybe it’s a folder. Try to render [path]/index.njk
      _renderPath(path + '/index', res, next)
      return
    }

    // Template not found. Call next to trigger 404 page
    next()
  })
}

/**
 * Try to match a request to a template. For example a request for /test
 * would look for /app/views/test.njk and /app/views/test/index.njk
 *
 * @param {object} req Express request
 * @param {object} res Express response
 * @param {Function} next Next middleware callback
 * @returns {object} Express response
 */
export default (req, res, next) => {
  let { path } = req

  // Remove the first slash, render won’t work with it
  path = path.substr(1)

  // If it’s blank, render the root index
  if (path === '') {
    path = 'index'
  }

  _renderPath(path, res, next)
}
