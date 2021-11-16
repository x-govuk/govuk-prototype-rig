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
    '/start',
    '/trn-holder',
    '/trn-conditions',
    '/you-have-a-trn',
    '/email',
    '/check-your-email',
    '/name',
    '/dob',
    '/ni-number',
    '/your-trn-is',
    '/'
  ]

  return wizard.nextAndBackPaths(paths, req)
}

export function trnWizardForks (req) {
  // Skip the trn conditions if you know you have a trn
  const forks = [{
    currentPath: '/trn-holder',
    storedData: ['wizard', 'do-you-have-a-trn'],
    excludedValues: ['dont-know'],
    forkPath: '/email'
  },{
    currentPath: '/trn-conditions',
    storedData: ['wizard','trn-conditions'],
    values: ["none"],
    forkPath: '/you-dont-have-a-trn'
  }]
  return wizard.nextForkPath(forks, req)
}
