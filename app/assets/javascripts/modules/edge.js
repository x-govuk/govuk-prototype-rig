import Delegate from 'ftdomdelegate/main.js'

export default (function (global) {
  const PrototypeRig = global.PrototypeRig || {}
  PrototypeRig.Modules = PrototypeRig.Modules || {}

  PrototypeRig.Modules.Edge = function () {
    this.start = (element) => {
      const delegate = new Delegate(element)
      delegate.on('click', 'a[href="#"]', alertUser)

      function alertUser (event) {
        event.preventDefault()
        const message = event.target.dataset.message || 'Sorry, this hasn’t been built yet'

        window.alert(message)
      }
    }
  }

  global.PrototypeRig = PrototypeRig
})(window)
