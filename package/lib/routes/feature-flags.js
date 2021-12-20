export const featureFlagRoutes = router => {
  /**
   * View feature flags
   */
  router.get('/feature-flags', (req, res) => {
    res.render('feature-flags.njk')
  })

  /**
   * Update feature flags
   */
  router.post('/feature-flags', (req, res) => {
    for (const key in req.body.features) {
      const flag = req.body.features[key]
      if (flag.on === 'true') {
        req.session.data.features[key].on = true
      } else {
        req.session.data.features[key].on = false
      }
    }

    res.render('feature-flags.njk', {
      success: true
    })
  })

  return router
}
