import { _normalize } from '../../utils/nunjucks.js'

/**
 * Convert a number into a string formatted as pound sterling.
 *
 * This can be useful for converting numbers into a human readbale price.
 *
 * @example
 *
 *   {{ "81932" | sterling }}
 *
 *   // £81,932
 *
 * @module filters
 * @param {number} number A number
 * @return {string} Number formatted as pound sterling
 */
export function sterling (number) {
  number = _normalize(number, '')

  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP'
  }).format(number)
}

export const numberFilters = {
  sterling
}
