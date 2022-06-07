import crypto from 'node:crypto'

/**
 * Encrypted a string.
 *
 * @param {string} string - String to encrypt
 * @returns {string} Encrypted string
 */
export const encryptString = (string) => {
  const hash = crypto.createHash('sha256')
  hash.update(string)
  return hash.digest('hex')
}

/**
 * Normalise a value. Checks that a given value exists before performing
 * a transformation.
 *
 * @param {*} value - Input value
 * @param {*} defaultValue - Value to fallback to if no value given
 * @returns defaultValue
 */
export function normalize (value, defaultValue) {
  if (value === null || value === undefined || value === false) {
    return defaultValue
  }

  return value
}
