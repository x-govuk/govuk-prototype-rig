import dotenv from 'dotenv'
import { cosmiconfig } from 'cosmiconfig'

dotenv.config()

const defaultConfig = {
  promoMode: false,
  serviceName: 'Your service name',
  templateExtension: 'html',
  useAuth: false,
  useAutoStoreData: true,
  useCookieSessionStore: false,
  useHttps: true
}

/**
 * Get user config values from package.json or config file.
 *
 * @see {@link https://github.com/davidtheclark/cosmiconfig#readme}
 *
 * @access private
 * @returns {Object} User config
 */
async function _getUserConfig () {
  const explorer = cosmiconfig('govuk-prototype-rig', {
    packageProp: 'prototype'
  })

  const search = await explorer.search()
  const result = await search
  return result.config
}

/**
 * Get config derived from user and default config values.
 *
 * @returns {Object} Combined config
 */
export async function getConfig () {
  const userConfig = await _getUserConfig()

  return { ...defaultConfig, ...userConfig }
}
