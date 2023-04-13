---
title: webapck
author: 中元
img: https://ox.zhongyuan.space/hexo/banner/13.jpg
coverImg: https://ox.zhongyuan.space/hexo/banner/13.jpg
top: false
cover: false
toc: true
mathjax: false
summary: webapck搭建环境，让你知道vue中的h函数的作用和虚拟节点如何上树！
tags:
  - webapck
  - Vue
categories: webapck
abbrlink: 640
date: 2022-05-26 09:06:30
password:
---

#### 搭建环境

npm init 初始化项目
`npm i -D snabbdom 安装`
`npm i -D webpack@5 webpack-cli@3 webpack-dev-server@3 `

#### 简单介绍

snabbdom 是一个 DOM 库.[重要]
不能够直接运行在 Node 环境中，
我们需要搭建一个 webpack 和 webpack-dev-server 的开发环境
需要注意的是必须安装 webpck5. 不能够安装 webpack4.
因为 webpck4 中没有读取 exports 的能力哈
然后安装：目的是搭建开发的运行环境

`npm i -D webpack@5 webpack-cli@3 webpack-dev-server@3 `
这个千万不忘记配置呀

#### 创建 webpack.config 文件

    //这个webpack.config文件在项目的根目录下
    // 安装官网配置直接复制 https://webpack.js.org/ 然后做简单的修改
    const path = require('path');
    module.exports = {
        // 入口，需要靠你去创建
        entry: './src/index.js',
        // 出口
        output: {
          // path: path.resolve(__dirname, 'dist'),
          //虚拟的打包路径 也就是说文件夹不会真正的生成，而是在8080端口虚拟生成的
          // xuni 这个不会真正的生成，在内存中，打包后的文件名是 bundle
          publicPath:'xuni',
          filename: 'bundle.js',
        },
        <!-- 配置的是 开发服务 -->
        devServer: {
            port: 8080, //端口
            // 静态资源文件夹,你创建一个，跟src 同级，
            contentBase:'www'
        }
    };

#### 需要创建的文件

根据上面的配置要求。
我们需要在项目的跟目录下创建 src 文件夹，src 下有 index.js 文件
我们需要在项目的跟目录下创建 www 文件夹，src 下有 index.html 文件

我们在 index.js 文件中写
console.log("你好啊，环境已经搭建 ok,我好高兴")
这个文件打包后对应的虚拟文件是 bundle.js

我们在 index.html 文件中写

    <body>

    <h1>你好啊！</h1>

      <!--
        这个container 在我们等会使用snabbdom的时候需要，
        我们现在就将他创建好
        -->

      <div id="container"></div>
    </body>

    <!--
     bundle.js 是我们生成在内存中的，在物理上看不见。
     我们等会写的xuni/bundle.js 是打包后的。
     它打包前的是 src下有index.js文件
     -->

    <script src="xuni/bundle.js"></script>
    </html>

#### 更改 package.json 文件配置

在 package.json 文件中。
我们需要更改一下配置

    "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
    },
    更改为
    "scripts": {
    "dev": "webpack-dev-server"
    },

这样我们执行 npm run dev 就会将,
我们下载的 webpack-dev-server 服务启动起来

#### 然后简单去走一下 snabbdom 的流程

snabbdom 的地址：https://github.com/snabbdom/snabbdom
复制 Example。到我们的 index.js 文件中

我们会发现有
`const container = document.getElementById("container");`
所以我们需要在 index.html 中去创建
这就解释了为啥我们的 index.html 需要有一个 id 为 container
不过我们刚刚已经创建了

然后我们会发现有两个函数报错
`someFn is not undefined`
`anotherEventHandler is not undefined`
我们将这两个函数更改为普通函数 就 ok 了

#### index.js 简单使用 h 函数

    import {
    init,
    classModule,
    propsModule,
    styleModule,
    eventListenersModule,
    h,
    } from "snabbdom";

    let myVnode1 = h
    (
    'a',
    { props:
    { href: 'https://www.cnblogs.com/IwishIcould/' }
    },
    '我的博客'
    )
    console.log("myVnode1", myVnode1) //输出来的内容就是虚拟 dom 节点
    这行代码说明了: h 函数产生虚拟 dom 节点

#### 区别

    <div>
        <p>123</p>
    </div>
    转化为这个
    let obj={
      'tag':'div',
      'child':[
          'tag':'p',
          'text':'123'
      ]
    }

不是 h 函数做的。
而是模板编译原理做的

#### 使用 patch 函数让虚拟 dom 节点上树

    import {
    init,
    classModule,
    propsModule,
    styleModule,
    eventListenersModule,
    h,
    } from "snabbdom";

    let myVnode1 = h('a', { props: { href: 'https://www.cnblogs.com/IwishIcould/' } }, '我的博客')
    console.log("myVnode1", myVnode1) //输出来的内容就是虚拟 dom 节点

    // 使用 init 函数创建 patch 函数
    const patch = init([classModule, propsModule, styleModule, eventListenersModule])
    const container = document.getElementById('container')
    // 让虚拟节点上树
    patch(container,myVnode1)

#### init 函数创建 patch 函数

使用 init 函数创建 patch 函数 ,init 函数接受 4 个参数。
`const patch = init([classModule, propsModule, styleModule, eventListenersModule])`
[类模块，属性模块，style 模块，事件模块 ]

#### patch 函数让虚拟 dom 节点上树

    // 让虚拟节点上树
    patch(container,myVnode1)
    patch 函数接受两个参数，上树到哪一个容器下，上树的虚拟节点

    #### 一个容器让多个虚拟节点上树，可以使用 h 函数的嵌套

    let myVnode1 = h('ul', {}, [
    h('li', {}, '姓名'),
    h('li', {}, '年龄'),
    h('li', {}, '爱好'),
    ])
    console.log("myVnode1", myVnode1) //输出来的内容就是虚拟 dom 节点

    // 使用 init 函数创建 patch 函数
    const patch = init([classModule, propsModule, styleModule, eventListenersModule])
    const container = document.getElementById('container')
    // 让虚拟节点上树
    patch(container, myVnode1)
    console.log("上树后", myVnode1) //输出来的内容就是虚拟 dom 节点
