module.exports = {
  publicPath: '',
  outputDir: 'dist',
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
    },
  },
  configureWebpack: config => {
    return {
      plugins: [],
    };
  },
  devServer: {},
  productionSourceMap: process.env.VUE_APP_DEBUG === 'debug',
};
