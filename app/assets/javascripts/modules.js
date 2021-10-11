/**
 * Get module name
 *
 * @example _getModuleName(selectable-table) => to SelectableTable
 *
 * @private
 * @param {String} string Original value
 * @returns {String} data Updated data
 */
const _getModuleName = (string) => {
  // Convert string to camel case
  string = string.replace(/-([a-z])/g, (g) => g.charAt(1).toUpperCase())

  // Capitalise first letter
  string = string.charAt(0).toUpperCase() + string.slice(1)

  return string
}

/**
 * Find and initiate component modules
 *
 * @example [data-module="foo-bar"] initiates PrototypeRig.Modules.FooBar()
 */
export default (function () {
  const PrototypeRig = window.PrototypeRig || {}
  PrototypeRig.Modules = PrototypeRig.Modules || {}

  PrototypeRig.modules = {
    find: function (container) {
      container = container || document.documentElement
      return container.querySelectorAll('[data-module]')
    },

    start: function (container) {
      const modules = this.find(container)

      modules.forEach((module, i) => {
        const element = modules[i]
        const name = _getModuleName(element.dataset.module)
        const started = element.dataset.moduleStarted

        if (typeof PrototypeRig.Modules[name] === 'function' && !started) {
          module = new PrototypeRig.Modules[name]()
          module.start(element)
          element.dataset.moduleStarted = true
        }
      })
    }
  }

  window.PrototypeRig = PrototypeRig
})()
