import { cosmiconfig } from 'cosmiconfig'

const explorer = cosmiconfig('govuk-prototype-rig', {
  packageProp: 'prototype'
})

export async function getConfig () {
  const search = await explorer.search()
  const result = await search
  return result.config
}
