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
