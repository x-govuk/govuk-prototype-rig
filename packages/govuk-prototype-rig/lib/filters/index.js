import { arrayFilters } from './array.js'
import { dateFilters } from './date.js'
import { numberFilters } from './number.js'
import { objectFilters } from './object.js'
import { stringFilters } from './string.js'

// Nunjucks filter functions
export const filters = {
  ...arrayFilters,
  ...dateFilters,
  ...numberFilters,
  ...objectFilters,
  ...stringFilters
}
