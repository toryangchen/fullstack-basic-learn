# Vue SSR（三）—— 使用NuxtJS实现Vue项目的SSR

[原文链接](https://www.toryang.top/archives/233)

[上一篇](https://www.toryang.top/archives/231)是从零开始构建一个基于koa2的Vue SSR框架。本文将使用NuxtJS，这是一种很简单的方式，因为它提供了很完善的脚手架使项目初始化的配置更加简单：
NuxtJS是Vue的SSR框架，它都做了哪些事情呢？
1. 基于Vue2版本的框架；
2. 包含Vue-router（整合路由，而非插件）；
3. 支持Vuex；
4. 支持Vue-Server-Render（SSR）；
5. 支持Vue-meta；

## 一、NuxtJS工作流

![](http://img.toryang.top/common/nuxtjs_flow.png)

如上NuxtJS工作流：

1. Incoming Request 指从浏览器发出请求；
2. 检查是否有nuxtServerInit这个配置项，如果有就先执行该函数。（Store action是操作Vuex的）；
3. `middleware`是一些中间件的配置，来实现一些用户自定义的功能；
4. validate()：配合高级动态路由做限制（类似于路由守卫的功能）；
5. 数据获取的两个函数：asyncData()和fetch()，区别在于asyncData()获取的数据是渲染Vue组件的，fetch通常是修改vuex的store的；
6. Render：渲染，有数据进行选择；
7. \<nuxt-link\> ，与\<router-link\>相同；


## 二、Installation

使用脚手架初始化项目

```powershell
> npm init nuxt-app <project-name>
```
如下图，在执行命令后，可以选择内置UI框架、服务器框架等：

![](http://img.toryang.top/common/nuxt_config.png)

自动安装完成后，即可运行项目：

```powershell
> cd <project-name>
> npm run dev
```

## 三、目录结构

```
-----
  | -- assets/          # 资源文件夹
  | -- components/      # vue组件文件夹
  | -- layouts/         # vue页面结构
  | -- middleware/      # koa中间件
  | -- pages/           # 路由页面
  | -- plugin/          # 插件，如iview
  | -- server/          # koa服务器端代码
  | -- static/          # 静态文件
  | -- store/           # vuex
  | -- nuxt.config.js   # 配置文件
  |
```
上述目录结构文件夹，除了`pages`和`server`是必须存在的外，其余可以按需添加or删除；

几个值得借鉴的地方：

1. 路由自动生成：在NuxtJS框架中，可不需要写路由配置信息，会自动扫描`pages`文件夹，然后自动生成路由信息；
2. 组件化与模块化：
    **layouts**：该目录下为页面的公共模板，如果想要使用该模板，需要在`pages`下具体页面的script中配置layout属性，来指向某个模板；
    **pages**：路由页面，只关注动态部分，将动态部分注入模板中；
    **components**：路由页面的组件抽离，简化page中的代码；

    ![](http://img.toryang.top/common/nuxt_folder.png)

    如上图，按照以往的路由的配置，layout的应该是路由，但是这里的路由是page，将page去依赖layout中的页面模板，更大化地对公共组件进行了抽离，使逻辑更加清晰；


## 四、参考链接

[NuxtJS](https://zh.nuxtjs.org/guide/installation)
