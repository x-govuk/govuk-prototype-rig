import _ from 'lodash'
import { nunjucksUtils } from '../utils.js'

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
 * @module filters
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
 * @module filters
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
  slugify,
  noOrphans
}
