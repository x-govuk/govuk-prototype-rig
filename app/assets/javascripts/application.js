// Sass entry point for rollup.js
import '../stylesheets/application.scss'

// Import GOV.UK Frontend
import { initAll as GOVUKFrontend } from 'govuk-frontend'

// Import GOV.UK Prototype Rig
import { initAll as GOVUKPrototypeComponents } from 'govuk-prototype-components'

// Initiate scripts on page load
document.addEventListener('DOMContentLoaded', () => {
  GOVUKFrontend()
  GOVUKPrototypeComponents()
})
