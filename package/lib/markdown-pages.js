import { MarkdownPages } from '@financial-times/express-markdown-pages'

/**
 * Create a new instance of the Markdown pages.
 *
 * @returns {object} Markdown pages instance
 */
export const markdownPages = new MarkdownPages({
  source: './node_modules/govuk-prototype-rig/docs',
  pathPrefix: '/docs'
})

/**
 * Create params for `govukBreadcrumbs` component.
 *
 * @param {object} navigation - Markdown pages navigation
 * @returns {object} Params for `govukBreadcrumbs`
 */
export function getBreadcrumbItems (navigation) {
  const breadcrumbItems = []

  navigation.ancestors.forEach(breadcrumb => {
    breadcrumbItems.push({
      text: breadcrumb.title,
      href: breadcrumb.url
    })
  })

  breadcrumbItems.push({
    text: navigation.current.title,
    href: navigation.current.url
  })

  return breadcrumbItems
}

/**
 * Create nested page data.
 *
 * @access private
 * @param pages - Loki pages database
 * @param page - Parent page
 * @returns {object} Page data
 */
function _getPagesData (pages, page) {
  const items = pages
    .find({
      parentID: { $eq: page.id },
      hidden: { $ne: true }
    })
    .map(item => _getPagesData(pages, item))

  return {
    text: page.title,
    href: page.url,
    theme: page.tags,
    items: items.length > 0 ? items : false
  }
}

/**
 * Create params for `appSideNavigation` component.
 *
 * @returns {object} Params for `appSideNavigation`
 */
export async function getSideNavigationItems () {
  const db = await markdownPages.init()
  const pages = db.getCollection('pages')
  const homepage = pages.by('url', '/docs')

  const pagesData = _getPagesData(pages, homepage)
  return pagesData.items
}
