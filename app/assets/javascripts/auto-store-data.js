// On form submit, add hidden inputs for checkboxes so the server knows if
// they've been unchecked. This means we can automatically store and update
// all form data on the server, including checkboxes that are checked, then
// later unchecked
const form = document.querySelector('form')

if (form) {
  form.addEventListener('submit', function () {
    const checkboxes = this.querySelectorAll('input[type="checkbox"]')
    const names = {}

    for (const checkbox of checkboxes) {
      const name = checkbox.getAttribute('name')

      if (!names[name]) {
        names[name] = true
        console.log('names', names)
        const input = document.createElement('input')
        input.setAttribute('name', name)
        input.setAttribute('type', 'hidden')
        input.setAttribute('value', '_unchecked')
        this.prepend(input)
      }
    }
  })
}
