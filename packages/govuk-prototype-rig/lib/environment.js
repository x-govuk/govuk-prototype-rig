import fs from 'node:fs'
import _ from 'lodash'
import inquirer from 'inquirer'
import portScanner from 'portscanner'

/**
 * Get environment variable as a Boolean value, defaulting to value
 * in configuration.
 *
 * @example "true" => true
 * @example "TRUE" => true
 * @example "false" => false
 * @example "foo" => false
 *
 * @param {Object|Array} name - Name of variable
 * @param {Object} config - Package configuration
 * @returns {boolean} Returns `true` if `name` evaluates to true
 */
export const getEnvBoolean = (name, config) => {
  let value
  if (config) {
    value = process.env[name] || config[_.camelCase(name)]
  } else {
    value = process.env[name]
  }

  return String(value).toLowerCase() === 'true'
}

/**
 * Find an available port to run the server on.
 *
 * @param {Function} app - Express application
 * @param {Function} callback - Callback
 * @returns {number} Port number
 */
export function findAvailablePort (app, callback) {
  let port = null
  const tmpFile = new URL('../.port.tmp', import.meta.url).pathname

  // When the server starts, we store the port in .port.tmp so it tries to
  // restart on the same port
  try {
    port = Number(fs.readFileSync(tmpFile))
  } catch (error) {
    port = Number(process.env.PORT || 3000)
  }

  console.log('')

  // Check port is free, else offer to change
  portScanner.findAPortNotInUse(port, port + 50, '127.0.0.1', async (error, availablePort) => {
    if (error) {
      throw error
    }

    if (port === availablePort) {
      // Port is free, return it via the callback
      callback(port)
    } else {
      // Port in use - offer to change to available port
      console.error(`ERROR: Port ${port} in use - you may have another prototype running.\n`)

      // Ask user if they want to change port
      const answers = await inquirer.prompt([{
        name: 'changePort',
        message: 'Change to an available port?',
        type: 'confirm'
      }])

      if (answers.changePort) {
        // User answers yes
        port = availablePort
        fs.writeFileSync(tmpFile, port.toString())
        console.info(`Changed to port ${port}`)

        callback(port)
      } else {
        // User answers no - exit
        console.info('\nYou can set a new default port in server.js, or by running the server with PORT=XXXX')
        console.info('\nExit by pressing ‘ctrl + c’')
        process.exit(0)
      }
    }
  })
}
