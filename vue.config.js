const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  // Mengubah publicPath menjadi path relatif ('./') untuk production build.
  // Ini membuat build lebih portabel dan mengatasi masalah path di sub-direktori.
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/',

  transpileDependencies: true,
  
  devServer: {
    proxy: {
      '/api': {
        target: 'http://37.44.244.19',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api_desaonline',
        },
      },
    },
  }
});
