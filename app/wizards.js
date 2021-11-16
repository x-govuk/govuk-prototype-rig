import { wizard } from 'govuk-prototype-rig'

export function exampleWizardPaths (req) {
  const paths = [
    '/examples/wizard',
    '/examples/wizard/name',
    '/examples/wizard/where-do-you-live',
    '/examples/wizard/england',
    '/examples/wizard/nationality',
    '/examples/wizard/check-answers',
    '/examples/wizard/confirm',
    '/'
  ]

  return wizard.nextAndBackPaths(paths, req)
}

export function exampleWizardForks (req) {
  // Example fork:
  // Skip the England question if an answer other than England
  // is given for where you live
  const forks = [{
    currentPath: '/examples/wizard/where-do-you-live',
    storedData: ['wizard', 'where-do-you-live'],
    excludedValues: ['England'],
    forkPath: '/examples/wizard/nationality'
  }]
  return wizard.nextForkPath(forks, req)
}

export function trnWizardPaths (req) {
  const paths = [
    '/wizard',
    '/wizard/trn-holder',
    '/wizard/trn-conditions',
    '/wizard/you-have-a-trn',
    '/wizard/email',
    '/wizard/otp',
    '/wizard/name',
    '/wizard/dob',
    '/wizard/ni-number',
    '/wizard/your-trn-is',
    '/'
  ]

  return wizard.nextAndBackPaths(paths, req)
}

export function trnWizardForks (req) {
  // Skip the trn conditions if you know you have a trn
  const forks = [{
    currentPath: '/wizard/trn-holder',
    storedData: ['wizard', 'do-you-have-a-trn'],
    excludedValues: ["No, I'm not sure if I have a TRN"],
    forkPath: '/wizard/email'
  }]
  return wizard.nextForkPath(forks, req)
}
