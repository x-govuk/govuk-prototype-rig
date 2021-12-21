import Autocomplete from './autocomplete/autocomplete.js'
import Edge from './edge/edge.js'

/**
 * Get module name.
 *
 * @example
 * _getModuleName(selectable-table) // SelectableTable
 *
 * @access private
 * @param {string} string - Original value
 * @returns {string} data Updated data
 */
const _getModuleName = (string) => {
  // Convert string to camel case
  string = string.replace(/-([a-z])/g, (g) => g.charAt(1).toUpperCase())

  // Capitalise first letter
  string = string.charAt(0).toUpperCase() + string.slice(1)

  return string
}

/**
 * Find and initiate component modules.
 *
 * @example
 * [data-module="foo-bar"] initiates GOVUKPrototypeRig.FooBar()
 */
export const components = (function () {
  const GOVUKPrototypeRig = window.GOVUKPrototypeRig || {}

  // Initiate all component modules
  GOVUKPrototypeRig.initAll = function (container) {
    container = container || document.documentElement
    const modules = container.querySelectorAll('[data-module]')

    modules.forEach((module, i) => {
      const element = modules[i]
      const name = _getModuleName(element.dataset.module)
      const started = element.dataset.moduleStarted

      if (typeof GOVUKPrototypeRig[name] === 'function' && !started) {
        module = new GOVUKPrototypeRig[name]()
        module.start(element)
        element.dataset.moduleStarted = true
      }
    })
  }

  // Add component modules to GOVUKPrototypeRig object
  GOVUKPrototypeRig.Autocomplete = Autocomplete
  GOVUKPrototypeRig.Edge = Edge

  // Add GOVUKPrototypeRig to window global
  window.GOVUKPrototypeRig = GOVUKPrototypeRig

  return GOVUKPrototypeRig
})()
