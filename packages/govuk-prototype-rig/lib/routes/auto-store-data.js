export const autoStoreDataRoutes = router => {
  /**
   * View session data page
   */
  router.get('/clear-session-data', (req, res) => {
    res.render('clear-session-data.njk')
  })

  /**
   * Clear all data in session
   */
  router.post('/clear-session-data', (req, res) => {
    req.session.data = {}
    res.render('clear-session-data.njk', {
      success: true
    })
  })

  return router
}
