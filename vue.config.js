const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  publicPath: './',
  lintOnSave: false,
  productionSourceMap: false,
  configureWebpack: {
    optimization: {
      splitChunks: false,
    },
  }
})
