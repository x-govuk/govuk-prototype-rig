/**
 * @access private
 * @param {string} path - URL path
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware callback
 * @returns {Function} Express middleware
 */
function _renderPath (path, res, next) {
  const usingDefaultEngine = res.app.settings['view engine'] === 'njk'

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

    if (!usingDefaultEngine) {
      if (!path.endsWith('.njk')) {
        // Try `.njk` extension if a different default is being used
        // path becomes path.njk
        _renderPath(`${path}.njk`, res, next)
        return
      }

      if (!path.endsWith('/index.njk')) {
        // Maybe it’s a folder. path.njk becomes path/index
        const indexPath = `${path.replace('.njk', '')}/index`
        _renderPath(indexPath, res, next)
        return
      }
    } else {
      if (!path.endsWith('/index')) {
        // Maybe it’s a folder. path becomes path/index
        const indexPath = `${path}/index`
        _renderPath(indexPath, res, next)
        return
      }
    }

    // Template not found. Call next to trigger 404 page
    next()
  })
}

/**
 * Try to match a request to a template. For example a request for `/test`
 * would look for `/app/views/test.njk` and `/app/views/test/index.njk`.
 *
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware callback
 * @returns {Function} Express middleware
 */
export function matchRoutes (req, res, next) {
  let { path } = req

  // Remove the first slash, render won’t work with it
  path = path.substr(1)

  // If it’s blank, render the root index
  if (path === '') {
    path = 'index'
  }

  _renderPath(path, res, next)
}
