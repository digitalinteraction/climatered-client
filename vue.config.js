//
// @vue/cli-service configuration
// see: https://cli.vuejs.org/config/#global-cli-config
//

// Push the package version into the vue app with an environment variable
process.env.VUE_APP_NAME = require('./package.json').name
process.env.VUE_APP_VERSION = require('./package.json').version

// Add an extra import to all sass imports
module.exports = {
  lintOnSave: true,
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "~@/scss/common.scss";'
      }
    }
  }
}
