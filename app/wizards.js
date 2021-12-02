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
    '/name',
    '/dob',
    '/ni-number',
    '/itt-provider',
    '/check-answers',
    '/helpdesk-request-submitted',
    '/trn-sent',
    '/'
  ]

  return wizard.nextAndBackPaths(paths, req)
}

const emailAddressMatchesDQTRecord = (data) => {
  return data['email-address'] === data['dqt_record']['email-address']
}

const nameMatchesDQTRecord = (data) => {
  return data['first-name'] === data['dqt_record']['first-name'] &&
    data['last-name'] === data['dqt_record']['last-name']
}

const dobMatchesDQTRecord = (data) => {
  return data['date-of-birth'] &&
    parseInt(data['date-of-birth'].day) === data['dqt_record']['date-of-birth'].day &&
    parseInt(data['date-of-birth'].month) === data['dqt_record']['date-of-birth'].month &&
    parseInt(data['date-of-birth'].year) === data['dqt_record']['date-of-birth'].year
}

const ninoMatchesDQTRecord = (data) => {
  return data['national-insurance-number'] === data['dqt_record']['national-insurance-number']
}

const ittProviderMatchesDQTRecord = (data) => {
  return (data['itt-provider']) === data['dqt_record']['itt-provider']
}

const numberOfMatchingFieldsAgainstDQTRecord = (data) => {
  var count = 0
  if (nameMatchesDQTRecord(data)) count++
  if (dobMatchesDQTRecord(data)) count++
  if (ninoMatchesDQTRecord(data)) count++
  if (ittProviderMatchesDQTRecord(data)) count++
  return count
}

const userMatchesDQTRecord = (data) => {
  return (emailAddressMatchesDQTRecord(data)) || numberOfMatchingFieldsAgainstDQTRecord(data) >= 3
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
  },{
    currentPath: '/ni-number',
    excludedValues: [],
    forkPath: (value) => {
      if (userMatchesDQTRecord(req.session.data)) {
        return '/trn-sent'
      } else {
        return '/itt-provider'
      }
    }
  },{
    currentPath: '/itt-provider',
    excludedValues: [],
    forkPath: (value) => {
      if (userMatchesDQTRecord(req.session.data)) {
        return '/trn-sent'
      } else {
        return '/check-answers'
      }
    }
  }]
  return wizard.nextForkPath(forks, req)
}
