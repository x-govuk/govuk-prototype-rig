/**
 * @private
 * @param {object} input Original data
 * @param {object} data Updated data
 */
const _storeData = (input, data) => {
  for (const i in input) {
    // Any input where the name starts with `_` is ignored
    if (i.indexOf('_') === 0) {
      continue
    }

    const val = input[i]

    // Delete values when users unselect checkboxes
    if (val === '_unchecked' || val === ['_unchecked']) {
      delete data[i]
      continue
    }

    // Remove `_unchecked` from arrays of checkboxes
    if (Array.isArray(val)) {
      const index = val.indexOf('_unchecked')
      if (index !== -1) {
        val.splice(index, 1)
      }
    } else if (typeof val === 'object') {
      // Store nested objects that aren‘t arrays
      if (typeof data[i] !== 'object') {
        data[i] = {}
      }

      // Add nested values
      _storeData(val, data[i])
      continue
    }

    data[i] = val
  }
}

/**
 * Store any data sent in session, and pass it to all views
 *
 * @param {object} req Express request
 * @param {object} res Express response
 * @param {Function} next Next middleware callback
 * @returns {object} Express response
 */
export default async (req, res, next) => {
  // Get session default data from file
  let sessionDataDefaults = {}
  const sessionDataDefaultsFile = new URL('../../app/data.js', import.meta.url).pathname

  try {
    sessionDataDefaults = await import(sessionDataDefaultsFile)
  } catch (error) {
    console.error('Could not load the session data defaults from app/data.js')
    console.error(error)
  }

  if (!req.session.data) {
    req.session.data = {}
  }

  req.session.data = Object.assign({}, sessionDataDefaults.default, req.session.data)

  _storeData(req.body, req.session.data)
  _storeData(req.query, req.session.data)

  // Send session data to all views
  res.locals.data = {}
  for (const j in req.session.data) {
    res.locals.data[j] = req.session.data[j]
  }

  next()
}
