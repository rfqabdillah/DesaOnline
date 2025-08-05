  const { defineConfig } = require('@vue/cli-service');

  module.exports = defineConfig({
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
  