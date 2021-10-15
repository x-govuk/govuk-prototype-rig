/**
 * Prototype specific global functions for use in Nunjucks templates.
 *
 * You can override Prototype Rig globals by creating global methods
 * with the same name.
 *
 * You can delete this file if you don’t need your own globals.
 */
export default () => {
  const globals = {}

  /**
   * Add your methods to the globals object below this comment block.
   *
   * @example
   * globals.sayHello = function (name) {
   *   return `Hello, ${name}!`
   * }
   *
   * Which in your templates would be used as:
   *
   * {{ sayHello("World") }} => Hello, World!
   */

  // Keep the following line to return your globals to the app
  return globals
}
