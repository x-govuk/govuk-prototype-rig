import { DateTime } from 'luxon'

/**
 * Prototype specific filters for use in Nunjucks templates.
 *
 * You can override Prototype Rig filters by creating filter methods
 * with the same name.
 *
 * You can delete this file if you don’t need your own filters.
 */
export default (env) => {
  const filters = {}

  /**
   * Add your methods to the filters object below this comment block.
   *
   * @example
   * filters.sayHello = function (name) {
   *   return `Hello, ${name}!`
   * }
   *
   * Which in your templates would be used as:
   *
   * {{ "World" | sayHello }} => Hello, World!
   *
   * @see https://mozilla.github.io/nunjucks/api#custom-filters
   */

   // example: 7 December 2021
   filters.dateWithYear = params => {
     var datetime = DateTime.local(parseInt(params.year), parseInt(params.month), parseInt(params.day))
     return datetime.toFormat('d MMMM yyyy')
   }

  // Keep the following line to return your filters to the app
  return filters
}
