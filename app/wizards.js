import { wizard } from 'govuk-prototype-rig'

export function exampleWizard (req) {
  const journey = {
    '/examples/wizard': {},
    '/examples/wizard/name': {},
    '/examples/wizard/where-do-you-live': {
      // Example fork in the journey
      // Go to nationality page if answer to the question ‘Where do you live?’
      // is not England
      '/examples/wizard/nationality': {
        data: 'wizard.where-do-you-live',
        excludedValue: 'England'
      }
    },
    '/examples/wizard/england': {},
    '/examples/wizard/nationality': {},
    '/examples/wizard/check-answers': {},
    '/examples/wizard/confirm': {},
    '/': {}
  }

  return wizard(journey, req)
}
