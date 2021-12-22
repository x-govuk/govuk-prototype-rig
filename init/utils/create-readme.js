export function createReadme (serviceName, nodeVersion) {
  return `# ${serviceName} prototype

> This prototype is built using the [GOV.UK Prototype Rig](https://x-govuk.github.io/govuk-prototype-rig/).

## Requirements

* Node.js v${nodeVersion}

## Installation

1. Clone this repository

2. Install the dependencies: \`npm install\`

3. Start the application: \`npm start\`

## Developing locally

To automatically refresh the browser upon updating a file, use \`npm run dev\`.

To lint JavaScript and CSS files, use \`npm run lint\`.
`
}
