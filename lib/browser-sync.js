import browserSync from 'browser-sync'

export function browserSyncConfig (server, port, proxyPort) {
  browserSync({
    proxy: 'localhost:' + proxyPort,
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
}
