import _ from 'lodash'
import { _normalize } from '../../utils/nunjucks.js'

/**
 * Convert a string to kebab-case.
 *
 * @example
 * slugify('Department for Education') // department-for-education
 *
 * @param {string} string - Value to convert
 * @return {string} `string` in kebab-case
 */
export function slugify (string) {
  string = _normalize(string, '')

  return _.kebabCase(string)
}

/**
 * Insert a non-breaking space between the last two words of a string. This
 * prevents an orphaned word appearing by itself at the end of a paragraph.
 *
 * @example
 * noOrphans('Department for Education') // Department for&nbsp;Education
 *
 * @param {string} string - Value to transform
 * @return {string} `string` with non-breaking space inserted
 */
export function noOrphans (string) {
  string = _normalize(string, '')

  const indexOflastSpace = string.lastIndexOf(' ')

  // If there’s only one word, we don’t need this filter
  if (indexOflastSpace === -1) {
    return string
  }

  const begin = string.substring(0, indexOflastSpace)
  const end = string.substring(indexOflastSpace + 1)
  return `${begin}&nbsp;${end}`
}

export const stringFilters = {
  slugify,
  noOrphans
}