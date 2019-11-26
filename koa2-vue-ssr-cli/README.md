# Vue SSR（二）—— 使用koa2搭建Vue项目SSR框架

[原文链接](https://www.toryang.top/archives/231)

[上一篇文章](https://www.toryang.top/archives/94)介绍了Vue下实现SSR的相关概念问题的同时也简单说了有两种方法来实现Vue的SSR，今天的这一篇将会介绍在不使用任何脚手架的前提下，仅仅使用koa2(无NuxtJS)来一步步构建SSR框架；
今天的方法是一个过时又麻烦的方法，但是通过自行搭建的框架的讲述，我们会循序渐进地了解SSR的项目结构，以及如何去实现SSR；其实最新版本的NuxtJS已经发布了脚手架让用户可以快速初始化项目，同时功能也非常完善，不需要像今天一样我们自己一步一步来安装。

下面代码托管到我的[Github](https://github.com/toryangchen/fullstack-basic-learn/tree/master/koa2-vue-ssr-cli)：

## 一、创建项目

1、创建一个空文件夹，并在该文件夹下初始化`package.json`（各选项暂时默认）：

```powershell
> mkdir koa2-vue-ssr-cli
> cd koa2-vue-ssr-cli && npm init
```

2、添加`package.json`依赖：

```
# dependencies
npm install
    axios chokidar cross-env html-minifier
    koa koa-body koa-compress koa-send
    lru-cache memory-fs readline
    vue vue-router vue-server-renderer vue-template-compiler
    vuex vuex-router-sync

# devDependencies
npm install -D
    @babel/core  @babel/plugin-syntax-dynamic-import
    @babel/plugin-syntax-jsx @babel/polyfill
    @babel/preset-env babel-helper-vue-jsx-merge-props
    babel-loader babel-plugin-syntax-jsx
    babel-plugin-transform-vue-jsx
    case-sensitive-paths-webpack-plugin chalk
    copy-webpack-plugin css-loader
    execa file-loader  friendly-errors-webpack-plugin
    json-loader mini-css-extract-plugin opn
    url-loader vue-html-loader vue-loader
    vue-style-loader webpack webpack-cli
    webpack-dev-middleware webpack-hot-middleware
    webpack-merge webpack-node-externals
```

创建项目目录如下：

```
koa2-vue-ssr-cli
    | -- config  # 配置文件
    | —— public  # 静态资源
    | --  src
    |       | -- api # 后端代码
    |       | -- web # 前端代码
    |
    | -- package.json
    |
```


## 二、配置文件

1、修改 `package.json` 的启动脚本：

```json
"scripts": {
    "serve": "cross-env NODE_ENV=development node config/server.js",
    "start": "cross-env NODE_ENV=production node config/server.js",
    ...
 },
```
2、这里我们使用了koa2作为调试时和正式环境服务器框架，配置服务器启动脚本 `config/server.js`

```javascript
const path = require('path');
const Koa = require('koa');
const koaCompress = require('koa-compress');
const compressible = require('compressible');
const koaStatic = require('./koa/static');
const conf = require('./app');
const SSR = require('./ssr');

const isProd = process.env.NODE_ENV === 'production';
const app = new Koa();
// 压缩数据
app.use(koaCompress({
    filter: type => !(/event\-stream/i.test(type) && compressible(type)),
  }),);
// 使用中间件配置静态资源的目录
app.use(
  koaStatic(isProd ?
  path.resolve(__dirname, '../dist/web'):
  path.resolve(__dirname, '../public'),
  { maxAge: 30 * 24 * 60 * 60 * 100 },),
);
// ssr
SSR(app).then(server => {
  server.listen(conf.app.port, '0.0.0.0', () => {
    console.log(`server is starting ...`);
  });
});
```
上述根据是否为开发环境配置了对应的静态资源目录，约定编译后的API文件位于`dist/api`，前端代码位于`dist/web`。

3、SSR相关配置 `config/ssr.js`（下为部分代码）

```javascript
...
if (isProd) {
  // prod mode
  const template = HtmlMinifier(
    fs.readFileSync(pathResolve('../public/index.html'), 'utf-8'),
    {
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      removeComments: false,
    },
  );
  const bundle = require(pathResolve(
    '../dist/web/vue-ssr-server-bundle.json',
  ));
  const clientManifest = require(pathResolve(
    '../dist/web/vue-ssr-client-manifest.json',
  ));
  renderer = createRenderer(bundle, {
    template,
    clientManifest,
  });
} else {
  // dev mode
  setUpDevServer(app, (bundle, options, apiMain, apiOutDir) => {
    try {
      const API = eval(apiMain).default;
      const server = API(app);
      renderer = createRenderer(bundle, options);
      resolve(server);
    } catch (e) {
      console.log(chalk.red('\nServer error'), e);
    }
  });
}
...
```
SSR配置主要分为`prod mode`和`dev mode`。在生产环境下，使用了`html-minifier`模块来压缩生产环境的index.html文件，在dev环境下，则用`setup-dev-server`来处理数据；同时拦截了`/api`开头的请求，交由koa2来处理。SSR返回一个Promise使全局使用同一个koa2实例；

4、开发环境中，数据处理的核心文件 `config/setup-dev-server.js`， 文件中有三个webpack配置的处理：

```
Server for API // 用于处理`/api`开头下的API接口，提供非首屏API接入的能力
Web server for SSR // 用于服务器端对API的代理请求，实现SSR
WEB // 进行常规静态资源的处理
```

## 三、前后端代码

1、后端代码：`src/api/app.js`，使用koa2开启一个node服务器，为前端提供数据接口，这里后端接口与SSR使用同一个koa2实例：

``` javascript
export default app => {
  app.proxy = true;
  const server = require('http').createServer(app.callback());
  app
    .use((ctx, next) => {
      // 跨域 设置
      ...
      return next();
    })
    .use(
      KoaBody({
        multipart: true,
        ...
      }),
    )
    .use((ctx, next) => {
      // 简单实现api接口
      if (/^\/api/.test(ctx.url)) {
        ctx.body = 'World';
      }
      next();
    });
  if (env === 'development') {
    // dev 环境打印信息
    app.use((ctx, next) => {
      const start = new Date();
      return next().then(() => {
        const ms = new Date() - start;
        console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
      });
    });
  }
  return server;
};
```

2、前端代码：`src/web`，前端代码与`@vue/cli`脚手架初始化的项目相同，均使用vue全家桶(`vue+vue-router+vuex`)来实现前端页面，不同的是需要提供`server`和`client`两端webpack配置文件的入口，两个文件主要使用路由守卫在进入页面之前对数据进行提前加载；

**entery-client.js**：设置了全局的路由守卫，将请求的数据存入store中，以供entery-server来获取数据；

```javascript
...
// 设置全局mixin，在进入路由之前请求数据；
Vue.mixin({
  beforeRouteUpdate(to, from, next) {
    const { asyncData } = this.$options;
    if (asyncData) {
      asyncData({
        store: this.$store,
        route: to,
      })
        .then(next)
        .catch(next);
    } else {
      next();
    }
  },
});
```
**entery-server.js**：服务端请求路由时，数据从store中获取，而非直接请求。因此拿到的页面组件是带有数据的；

```javascript
// onReady 有效可以确保 SSR是 服务端和客户端输出一致
router.onReady(() => {
  // 返回目标位置或是当前路由匹配的组件数组
  const matchedComponents = router.getMatchedComponents();
  if (!matchedComponents.length) {
    return reject(new Error('404'));
  }
  Promise.all(
    matchedComponents.map(
      // asyncData是在每个Component中写
      ({ asyncData }) =>
        asyncData &&
        asyncData({
          store,
          route: router.currentRoute,
        }),
    ),
  )
    .then(() => {
      isDev && console.log(`data pre-fetch: ${Date.now() - s}ms`);
      context.state = store.state;
      resolve(app);
    })
    .catch(reject);
}, reject);
```

## 四、webpack打包配置

在package.json中添加打包脚本：

```json
"scripts": {
    ...
    "build": "rimraf dist && npm run build:web && npm run build:server && npm run build:api",
    "build:web": "cross-env NODE_ENV=production webpack --config config/webpack.web.config.js --progress --hide-modules",
    "build:server": "cross-env NODE_ENV=production webpack --config config/webpack.server.config.js --progress --hide-modules",
    "build:api": "cross-env NODE_ENV=production webpack --config config/webpack.api.config.js --progress --hide-modules"
},
```

webpack配置文件：

```
config
    |-- webpack.api.config.js // Server for API
    |-- webpack.base.config.js // webpack基础配置
    |-- webpack.serve.config.js // web server for SSR
    |-- webpack.web.config.js // 前端常规资源打包
```

api、serve、web三个配置属于常规配置，可直接查看源码；

通过webpack打包后，生成dist文件夹：

```
dist
  | -- api # 后端api接口代码打包
  | -- web
  |     | -- vue-ssr-client-manifest.json # 为浏览器提供的入口
  |     | -- vue-ssr-server-manifest.json # 为服务端提供的渲染入口
```

## 五、参考链接

[Vue SSR（Vue2 + Koa2 + Webpack4）配置指南](https://juejin.im/post/5be85c7af265da612909b436)
