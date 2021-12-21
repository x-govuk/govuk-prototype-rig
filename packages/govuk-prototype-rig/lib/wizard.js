import _ from 'lodash'

/**
 * @access private
 * @param {Object} req - Express request
 * @returns {string} Original query
 */
function _originalQuery (req) {
  const originalQueryString = req.originalUrl.split('?')[1]
  return originalQueryString ? `?${originalQueryString}` : ''
}

/**
 * Get next, back and current paths in user journey.
 *
 * @param {Array} paths - Sequence of paths in user journey
 * @param {Object} req - Express request
 * @returns {Object} Next and back paths
 */
export const nextAndBackPaths = (paths, req) => {
  const currentPath = req.path
  const query = _originalQuery(req)
  const data = req.session.data
  const index = paths.indexOf(currentPath)
  const next = paths[index + 1] || ''
  let back = paths[index - 1] || ''

  // Point back to where we forked from
  if (currentPath === data['forked-to']) {
    back = data['forked-from']
  }

  // Remove the saved fork if we return to it
  if (currentPath === data['forked-from'] && req.method === 'GET') {
    delete data['forked-from']
    delete data['forked-to']
  }

  return {
    next: next + query,
    back: back + query,
    current: currentPath + query
  }
}

/**
 * Get next path if at a fork in the user journey.
 *
 * @param {Array} forks - List of forks in user journey
 * @param {Object} req - Express request
 * @returns {Object} Next path in the user journey
 */
export const nextForkPath = (forks, req) => {
  const currentPath = req.path
  const { data } = req.session

  // Detect if current path is a fork
  const fork = forks.find(obj => obj.currentPath === currentPath)

  if (fork) {
    if (fork.skipTo) {
      data['forked-from'] = currentPath
      data['forked-to'] = fork.skipTo

      return fork.skipTo
    }

    const storedData = _.get(data, _.toPath(fork.storedData))
    const storedValues = Array.isArray(storedData) ? storedData : [storedData]
    const forkPath = (typeof fork.forkPath === 'function' ? fork.forkPath(storedData) : fork.forkPath)

    if (fork.values) {
      const values = Array.isArray(fork.values) ? fork.values : [fork.values]

      if (values.some(v => storedValues.indexOf(v) >= 0)) {
        data['forked-from'] = currentPath
        data['forked-to'] = forkPath

        return forkPath
      }
    }

    if (fork.excludedValues) {
      const excludedValues = Array.isArray(fork.excludedValues) ? fork.excludedValues : [fork.excludedValues]

      if (!excludedValues.some(v => storedValues.indexOf(v) >= 0)) {
        data['forked-from'] = currentPath
        data['forked-to'] = forkPath

        return forkPath
      }
    }
  }

  return false
}

export const wizard = {
  nextAndBackPaths,
  nextForkPath
}
