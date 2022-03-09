module.exports = function (eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(require('govuk-eleventy-plugin'), {
    homeKey: 'GOV.UK Prototype Rig',
    searchIndex: '/search.json'
  })

  // Pass through
  eleventyConfig.addPassthroughCopy('./docs/images')

  // Config
  return {
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    dir: {
      input: 'docs',
      layouts: '../node_modules/govuk-eleventy-plugin/app/layouts',
      // govukEleventyPlugin requires `output` to save compiled assets
      output: 'public'
    },
    templateFormats: ['njk', 'md']
  }
}
