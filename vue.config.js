const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  publicPath: './',
  lintOnSave: false,
  productionSourceMap: false,
  configureWebpack: {
    optimization: {
      splitChunks: false,
    },
  },
  chainWebpack: config => {
    config.module
      .rule('images')
      .set('parser', {
        dataUrlCondition: {
          maxSize: 1024 * 1024
        }
      })
  }
})
