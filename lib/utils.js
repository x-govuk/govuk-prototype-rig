import fs from 'node:fs'
import inquirer from 'inquirer'
import getKeypath from 'keypather/get.js'
import portScanner from 'portscanner'

/**
 * Get data value
 *
 * @param {object|Array} data All object properties
 * @param {String|Array} keyPath Path to key (using dot/bracket notation)
 * @returns {any} Value of key
 */
export const getDataValue = (data, keyPath) => {
  keyPath = Array.isArray(keyPath) ? keyPath : [keyPath]
  return getKeypath(data, keyPath.map(s => `['${s}']`).join(''))
}

/**
 * Get environment variable as a Boolean value
 *
 * @example "true" => true
 * @example "TRUE" => true
 * @example "false" => false
 * @example "foo" => false
 *
 * @param {object|Array} name Name of variable
 * @param {String|Array} appJson App manifest
 * @returns {Boolean} Variable value as a Boolean
 */
export const getEnvBoolean = (name, appJson) => {
  return (process.env[name] || appJson.env[name].value).toLowerCase() === 'true'
}

/**
 * Find an available port to run the server on
 *
 * @param {Function} app Express application
 * @param {Function} callback Callback
 * @returns {Number} Number of available port
 */
export const findAvailablePort = (app, callback) => {
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
        console.log(`Changed to port ${port}`)

        callback(port)
      } else {
        // User answers no - exit
        console.log('\nYou can set a new default port in server.js, or by running the server with PORT=XXXX')
        console.log("\nExit by pressing 'ctrl + c'")
        process.exit(0)
      }
    }
  })
}
