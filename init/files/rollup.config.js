import commonJs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import scss from 'rollup-plugin-scss'
import copy from 'rollup-plugin-copy'

export default [{
  input: [
    'app/assets/javascripts/application.js'
  ],
  output: {
    dir: 'public/javascripts',
    sourcemap: true
  },
  plugins: [
    // Copy all assets other than scripts and styles to public folder
    copy({
      targets: [{
        src: 'app/assets/!(javascripts|stylesheets)',
        dest: 'public'
      }]
    }),
    // Resolve modules imported from node_modules
    nodeResolve(),
    // Convert CommonJS modules to ES6
    commonJs(),
    // Concatenate govuk-frontend, application and component styles
    scss({
      includePaths: ['node_modules'],
      output: 'public/stylesheets/application.css',
      quietDeps: true,
      sourceMap: true,
      verbose: false,
      watch: ['app/assets/stylesheets', 'node_modules/govuk-prototype-components/x-govuk']
    })
  ]
}]
