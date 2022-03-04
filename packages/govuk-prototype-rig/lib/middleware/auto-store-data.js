/**
 * @access private
 * @param {Object} input - Original data
 * @param {Object} data - Data to update
 * @returns {Object} Updated data
 */
const _storeData = (input, data) => {
  for (const i in input) {
    // Prevent prototype pollution
    if (!Object.prototype.hasOwnProperty.call(input, i)) continue
    if (i === '__proto__' || i === 'constructor') continue

    // Any input where the name starts with `_` is ignored
    if (i.indexOf('_') === 0) {
      continue
    }

    const value = input[i]

    // Delete values when users unselect checkboxes
    if (value === '_unchecked' || value === ['_unchecked']) {
      delete data[i]
      continue
    }

    // Remove `_unchecked` from arrays of checkboxes
    if (Array.isArray(value) && typeof value !== 'string') {
      const index = value.indexOf('_unchecked')
      if (index !== -1) {
        value.splice(index, 1)
      }
    } else if (typeof value === 'object') {
      // Store nested objects that aren’t arrays
      if (typeof data[i] !== 'object') {
        data[i] = {}
      }

      // Add nested values
      _storeData(value, data[i])
      continue
    }

    data[i] = value
  }
}

/**
 * Store any data sent in session, and pass it to all views.
 *
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware callback
 * @returns {Function} Express middleware
 */
export async function autoStoreData (req, res, next) {
  // Get session default data from file
  let sessionDataDefaults = {}
  const sessionDataDefaultsFile = `${process.cwd()}/app/data.js`

  try {
    sessionDataDefaults = await import(sessionDataDefaultsFile)

    // Session data can be an (async) function object
    if (typeof sessionDataDefaults.default === 'function') {
      sessionDataDefaults = await sessionDataDefaults.default()
    } else {
      sessionDataDefaults = sessionDataDefaults.default
    }
  } catch (error) {
    console.error('Could not load the session data defaults from app/data.js')
    console.error(error)
  }

  if (!req.session.data) {
    req.session.data = {}
  }

  req.session.data = Object.assign({}, sessionDataDefaults, req.session.data)

  _storeData(req.body, req.session.data)
  _storeData(req.query, req.session.data)

  // Send session data to all views
  res.locals.data = {}
  for (const object in req.session.data) {
    res.locals.data[object] = req.session.data[object]
  }

  next()
}
