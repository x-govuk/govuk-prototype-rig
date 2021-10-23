import browserSync from 'browser-sync'

import server from './server.js'
import { findAvailablePort } from './utils/environment.js'

findAvailablePort(server, (port) => {
  if (process.env.NODE_ENV === 'production') {
    console.info(`Listening on port ${port}`)
    server.listen(port)
  } else {
    server.listen(port - 50, () => {
      browserSync({
        proxy: 'localhost:' + (port - 50),
        port: port,
        files: [
          'public/**/*',
          'app/**/*'
        ],
        ignore: [
          'app/assets/**/*'
        ],
        logPrefix: server.locals.serviceName,
        ghostMode: false,
        open: false,
        notify: false,
        ui: false
      })
    })
  }
})
