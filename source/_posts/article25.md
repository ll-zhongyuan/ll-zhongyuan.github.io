---
title: Vite
author: 中元
img: /medias/banner/18.jpg
coverImg: /medias/banner/18.jpg
top: false
cover: false
toc: true
mathjax: false
summary: 前端新玩具
tags: Vite
categories: Vite
abbrlink: 48934
date: 2022-09-30 13:06:30
password:
---

## Vite 的定义

面向现代浏览器的一个更轻、更快的 Web 应用开发工具，基于 ECMAScript 标准原生模块系统（ES Modules）实现。

## Vite 的特点

- 闪电般快速的冷服务器启动
- 即时热模块更换（HMR）
- 真正的按需编译

实际上，刚接触这个这个框架给人最直观的感受就是轻巧、利落，冷启动速度可以说是秒开，开发体验极度舒适，真应了尤大发表的感言让人再也不想用 webpack。

## 为什么 Vite 启动速度快？

vite 利用现代浏览器原生支持 ESM 特性，省略了对模块的打包，只有具体去请求某个文件时才会按需编译，vite 会根据 import 导入替换路径在前面加上@modules，然后去 node_modules 寻找相关依赖，再分别对 template、script、style 进行处理；而 webpack 会提前把所有模块进行编译，所以随着项目越来越大，启动速度也就越慢。下面进入图解环节：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f8ac94ecc23449d9b2928f5123767d85~tplv-k3u1fbpfcp-watermark.awebp)

![img](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cbc4e55ef0824e8d9c44329a6ba2d770~tplv-k3u1fbpfcp-watermark.awebp)

## 创建项目

`npm init vite-app demo`

在命令窗口里输入这句命令即可创建一个 vite 的项目，而且还非常贴心的提示了后续操作，所以我这里就不多说了，按照命令窗口的提示安装依赖就好。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/82663442c8e94716b4d4e5c054bfd055~tplv-k3u1fbpfcp-watermark.awebp)

目录结构还是和以前一样，业务都写在 src 里

然后执行`npm run dev` 启动项目

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/520f439a7d894d7dbc7cc97a2eb68a50~tplv-k3u1fbpfcp-watermark.awebp)

项目启动后你会看到一个这样的页面，和以往的 hello vue 不同，这里简单的实现了一个计数器功能

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c022c5b11fe40e98e5c89172b5ba7ad~tplv-k3u1fbpfcp-watermark.awebp)

这里还是以 vue2 的方式实现的小功能，实际上这里可以用 vue3 的 Composition API 入口 setup 实现，需要注意的是在 setup 里是没有实例对象 this 的，声明的变量必须在函数底部统一返回才能使用，并且他的执行是在旧生命函数里面的 beforeCreate 和 created 之间。

## Vite 与 TypeScript

前端应用的复杂度不断飙升，这带来的问题就是维护性以及扩展性会变差，使用 ts 编写代码会大大降低调试 bug 的时间，安装 ts 依赖后，在 vue3 里你只需要在 script 标签上加一个`lang='ts'`就可以引入 ts 愉快的编码了。

在 vite 项目里使用 ts 是再合适不过了，vite 目前就只适用于 vue3 的版本（这里不考虑其余框架），而 vue3 就是用 ts 写的，所以对 ts 开发者非常友好，如果没有用过 ts 也没关系，vue3 只是对 ts 使用者更友好，而不是只能用 ts（当然这里还是推荐大家用 ts）。

## Vite 打包

vite 打包内部采用的是 Rollup 完成的应用打包，因为 vite 高度依赖 ES Modules 特性所以只支持现代浏览器，抛弃 IE 市场，如果你需要兼容 IE 需要另做处理，详情可以参考[这里。](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FGuide%2FModules)

你只需要在终端执行 `npm run build` 打包过程轻松又愉快，先不要高兴的太早，这时候如果你打开 dist 文件下的打包文件会发现页面显示不出来，一拍脑门想起来在`vue.config.js`里面配置一下`publicPath: './'`，不过当你做完这一切之后发现并没有解决问题，why？在这里先不要慌，只需要继续向下看。

解决办法：

这是因为 vue 打包后的路径默认是根路径，而在 vite 里面的配置文件是`vite.config.js`，所以同理，你只需要在配置里写上`base: './'`即可轻松解决。

## 配置路由和状态管理

路由配置

    // router/index
    import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
    const routes: Array<RouteRecordRaw> =
    [
     {
        path: '/',
        name: 'Home',
        component: import('/@views/Home')
     },
     {
        path: '/user',
        name: 'User',
        component: () => import('/@views/User')
     }
    ]
    const router = createRouter({
        history: createWebHistory(process.env.BASE_URL),
        routes
    })
    export default router

vuex 配置

    // store/index
    import { createStore } from 'vuex'
    export default createStore({
        state: {},
        mutations: {},
        actions: {},
        modules: {}
    })

更轻量的依赖注入工具 provide、inject 函数可以替代 vuex，两者可根据个人习惯二选一。

    import { provide, inject } from 'vue'
    const Ancestor = {
      setup() {
        provide("name", "我是父组件向子组件传递的值");
      }
    }

    const Descendent = {
      setup() {
        const name = inject("name")
        return {
          name
        }
      }
    }

## 结语

经过介绍大家应该对 vite 有一个初步的理解了，值得一说的是 vite 开发体验真的舒适，快一秒也是快啊，更何况不止快一秒呢，有时候不就差那几秒 😊

