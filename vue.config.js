module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  // 执行run build命令时，生成文件的目录名称
  outputDir: 'dist',
  // 用于防止生成的静态资源，如 js,css,image,fonts
  assetsDir: 'assets',
  // 指定生成的index.html的输出路径（可改变系统默认的index.html的文件名）
  indexPath: 'index.html',
  //是否关闭文件名的hash，好控制缓存

  lintOnSave: process.env.NODE_ENV !== 'production', // 在生产构建时禁用 eslint
  //false，加速构建，无法生成map文件，一般在在生产环境设为false
  productionSourceMap: process.env.VUE_APP_DEBUG === 'debug',
  filenameHashing: true,
  pages: {
    index: {
      entry: 'src/main.js',
      // 模板来源
      template: 'public/index.html',
      // dist/index.html 的输出
      filename: 'index.html',
      title: 'index page', // template中 <title> <%= htmlWebpackPlugin.options.title %> </title>
      // 在这个页面包含的块
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
    },
  },
  configureWebpack: () => {
    return {
      plugins: [],
    };
  },
  // 支持webpack-dev-server的所有选项
  devServer: {
    host: 'localhost',
    port: 8080,
    https: false,
    open: false, //自动启动浏览器
    // proxy: 'http://localhost:4000' // 配置跨域处理，一个代理
  },
};
