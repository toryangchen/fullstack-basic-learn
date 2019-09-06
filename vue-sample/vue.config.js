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
  runtimeCompiler: true,
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
  // 支持webpack-dev-server的所有选项
  devServer: {
    host: 'localhost',
    port: 8080,
    https: false,
    open: false, //自动启动浏览器
    // proxy: 'http://localhost:4000' // 配置跨域处理，一个代理
  },
  /**
   * 如果是对象：会通过webpack-merge合并到最终的配置中去
   * 如果是函数：会接受被解析的配置作为参数，该函数及可以修改配置并不返回任何东西，也可以返回一个被克隆或合并过的配置版本
   */
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置…
    } else {
      // 为开发环境修改配置…
    }
  },
  /**
   *
   */
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        // 修改它的选项…
        return options;
      });
  },
  // css相关配置
  css: {
    // 启用 CSS modules
    modules: false,
    // 是否使用css分离插件
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {},
  },
};
