module.exports = {
  assetsDir: 'assets',
  productionSourceMap: false,
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    },
  },
  devServer: {
    open: true,
    host: 'localhost',
    port: 8080,
    https: false,
  },
};
