module.exports = function (eleventyConfig) {
  const url = process.env.GITHUB_ACTIONS
    ? 'https://x-govuk.github.io/govuk-prototype-rig/'
    : '/'
  const pathPrefix = process.env.GITHUB_ACTIONS
    ? '/govuk-prototype-rig'
    : '/'

  // Plugins
  eleventyConfig.addPlugin(require('govuk-eleventy-plugin'), {
    brandColour: '#28a',
    fontFamily: 'system-ui, sans-serif',
    icons: {
      mask: 'https://raw.githubusercontent.com/x-govuk/logo/f27cadde0d65ea8d8355fe07eef4988cd1b16c1e/images/x-govuk-mask-icon.svg?raw=true',
      shortcut: 'https://github.com/x-govuk/logo/blob/f27cadde0d65ea8d8355fe07eef4988cd1b16c1e/images/x-govuk-favicon.ico?raw=true',
      touch: 'https://github.com/x-govuk/logo/blob/f27cadde0d65ea8d8355fe07eef4988cd1b16c1e/images/x-govuk-apple-touch-icon.png?raw=true'
    },
    homeKey: 'GOV.UK Prototype Rig',
    parentSite: {
      url: 'https://x-govuk.github.io',
      name: 'X-GOVUK shared projects'
    },
    pathPrefix,
    url,
    header: {
      organisationLogo: 'x-govuk',
      organisationName: 'X-GOVUK',
      productName: 'Prototype Rig',
      search: {
        indexPath: '/search.json',
        sitemapPath: '/sitemap'
      }
    },
    footer: {
      copyright: '© X-GOVUK',
      licence: 'Licensed under the [MIT Licence](https://github.com/x-govuk/govuk-eleventy-plugin/blob/main/LICENSE.txt), except where otherwise stated'
    }
  })

  // Pass through
  eleventyConfig.addPassthroughCopy('./docs/assets')

  // Config
  return {
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    dir: {
      input: 'docs',
      output: 'public',
      layouts: '../node_modules/govuk-eleventy-plugin/layouts'
    },
    pathPrefix
  }
}
