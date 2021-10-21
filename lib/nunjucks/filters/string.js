import _ from 'lodash'
import { nunjucksUtils } from '../utils.js'

/**
 * Convert a date to a human readable value.
 *
 * @example
 *
 *   {{ "2021-10-19" | date }}
 *
 *   // 19 October 2021
 *
 * @param {String} string Date
 * @return {String} Human readbable date
 */
export function date (string) {
  string = nunjucksUtils.normalize(string, '')

  return new Date(string).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Convert a string to kebab-case.
 *
 * This can be useful to slugify titles for use in URLs or fragment identifers.
 *
 * @example
 *
 *   {{ "Department for Education" | slugify }}
 *
 *   // department-for-education
 *
 * @param {string} string Any type
 * @return {string} String with non-breaking space
 */
export function slugify (string) {
  string = nunjucksUtils.normalize(string, '')

  return _.kebabCase(string)
}

/**
 * Add a non-breaking space between the last two words of a string. This
 * prevents an orphaned word appearing by itself at the end of a paragraph.
 *
 * This can be useful for improving the appearance of headings and titles.
 *
 * @example
 *
 *   {{ "Department for Business, Energy & Industrial Strategy" | noOrphans | safe }}
 *
 *   // Department for Business, Energy & Industrial&nbsp;Strategy
 *
 * @param {string} string Any type
 * @return {string} String with non-breaking space
 */
export function noOrphans (string) {
  string = nunjucksUtils.normalize(string, '')

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
  date,
  slugify,
  noOrphans
}
