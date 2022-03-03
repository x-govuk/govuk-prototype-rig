const events = require('eventslibjs')

module.exports = function () {
  this.start = (element) => {
    const nodes = element.querySelectorAll('a[href="#"]')
    nodes.forEach(node => { events.on('click', node, alertUser) })

    function alertUser (event) {
      event.preventDefault()
      const message = event.target.dataset.message || 'Sorry, this hasn’t been built yet'

      window.alert(message)
    }
  }
}
