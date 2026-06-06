const { defineConfig } = require('@vue/cli-service')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = defineConfig({
  publicPath: './',
  lintOnSave: false,
  configureWebpack: {
    optimization: {
      splitChunks: false,
    },
    plugins: [
      new MonacoWebpackPlugin({
        languages: [
          'javascript',
          'typescript',
          'html',
          'css',
          'json',
          'markdown',
          'python',
          'c',
          'cpp',
          'rust',
          'go',
          'java',
          'php',
        ]
      })
    ]
  }
})
