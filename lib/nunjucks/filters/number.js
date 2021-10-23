import { _normalize } from '../../utils/nunjucks.js'

/**
 * Convert a number into a string formatted as pound sterling.
 *
 * @example
 * sterling(81932) // £81,932
 *
 * @param {number} number - Value to convert
 * @return {string} `number` formatted as pound sterling
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
