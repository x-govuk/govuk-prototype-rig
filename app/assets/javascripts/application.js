// Sass entry point for rollup.js
import '../stylesheets/application.scss'

// Import GOV.UK Frontend
import GOVUKFrontend from 'govuk-frontend'

// Import GOV.UK Prototype Rig
import GOVUKPrototypeComponents from 'govuk-prototype-components'

// Initiate scripts on page load
document.addEventListener('DOMContentLoaded', () => {
  GOVUKFrontend.initAll()
  GOVUKPrototypeComponents.initAll()
})
