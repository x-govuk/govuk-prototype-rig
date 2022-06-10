export const robotsRoutes = router => {
  /**
   * Prevent pages being indexed even if indexed pages link to them
   */
  router.use((req, res, next) => {
    res.setHeader('X-Robots-Tag', 'noindex')
    next()
  })

  /**
   * Add robots.txt
   */
  router.get('/robots.txt', (req, res) => {
    res.type('text/plain')
    res.send('User-agent: *\nDisallow: /')
  })

  return router
}
