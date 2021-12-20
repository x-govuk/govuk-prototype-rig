import { getBreadcrumbItems, getSideNavigationItems, markdownPages } from '../markdown-pages.js'

export const documentationRoutes = router => {
  /**
   * View documentation
   */
  router.get('/docs/:view?*', markdownPages.middleware, async (req, res) => {
    // Use promo layout for documentation landing page
    const view = req.params.view ? 'documentation.njk' : 'promo.njk'
    const { page, navigation } = res.locals.markdownPages

    res.render(view, {
      breadcrumbItems: getBreadcrumbItems(navigation),
      sideNavigationItems: await getSideNavigationItems(),
      page,
      current: navigation.current
    })
  })

  return router
}
