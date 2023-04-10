---
title: React框架-总结
author: 中元
img: /medias/banner/5.jpg
coverImg: /medias/banner/5.jpg
top: false
cover: false
toc: true
mathjax: false
summary: React，Vue和Angular已占领了前端的大部分市场，因此也要学习和了解这些主流框架方面的知识。
tags: React
categories: React
abbrlink: 2376
date: 2021-12-07 06:06:30
password:
---

**创建项目**

1.静态页面创建

页面直接引入 React，ReactDOM 的 js 文件：react.js，react-dom.js，

页面 CDN 引入：

React：https://cdn.bootcdn.net/ajax/libs/react/16.14.0/umd/react.development.js

ReactDOM：https://cdn.bootcdn.net/ajax/libs/react-dom/16.14.0/cjs/react-dom.development.js

2.通过脚手架创建

全局安装：`npm install -g create-react-app`

创建项目：`create-react-app react-demo`

有了 vue 的基础，我们直接通过脚手架创建项目，开始我们 React 的学习旅程。

**目录结构**

    react-demo
    --node_modules   // 项目依赖包
    --public   // 公共资源文件，如：图片，json文件等
    --src        // 项目页面组件，样式，脚本文件，路由等
    --package.json  // 项目webpack配置和包管理文件
    --README.md  // 项目说明文件

运行：`npm run start`

项目模板的初始页面就可以访问了：http://localhost:3000/

**渲染组件**

文件 src/index.js

可以看到 ReactDOM.render() ，渲染组件（App），把模板转换成 html 语言并插入到指定的节点。

导入 react（import React from 'react'），react-dom（import ReactDOM from 'react-dom'）

文件 src/App.js

这里使用了 JSX 语法写 html 页面，遇到 html 标签（例如：<>）就用 html 解析，遇到代码块（例如：{ }）就用 javascript 规则解析。

可以尝试修改里面的内容，预览效果。

**数据绑定**

React 里面没有像 Vue 里面那么简单的数据绑定功能，这里需要我们自己去完成表单控件的数据绑定的功能。

使用状态 state 存储输入控件的值，使用 onChange 的回调函数，通过 this.setState 修改 state 里面的值，每次修改完会自动调用 **this.render** 方法，再次渲染组件。这样就可以实现输入框的数据绑定。

    import React, { Component } from 'react'

    export default class AddUser extends Component {
        // 定义状态
        state = {
            userName: "",
            userAge: ""
        }
        // 定义表单控件输入框事件
        handleChange = (event)=>{
            // 获取控件名称 name
            const name = event.target.name;
            this.setState({
                [name]: event.target.value   // 获取控件的值
            });
        }
        // 定义按钮事件
        handleAddUser = () => {
            console.log("用户名和年龄：", this.state)
        }
        render() {
            return (
                <div>
                    <div><input name="userName" value={this.state.userName} onChange={this.handleChange} placeholder="请输入用户名" /></div>
                    <div><input name="userAge" value={this.state.userAge} onChange={this.handleChange} placeholder="请输入年龄" /></div>
                    <div><input onClick={this.handleAddUser} value="添加"/></div>
                </div>
            )
        }
    }

**生命周期**

React 中组件的生命周期分为三个状态，**Mounting**是已经插入真实 DOM，**Updating**是正在被重新渲染，**Unmounting**是已移出真实 DOM。每个状态都有两种处理函数，**will**函数是进入状态之前，**did**函数是进入状态之后，共有五个函数如下：

`componentWillMount()`
`componentDidMount()，一般会在这个里面请求数据`
`componentWillUpdate(object nextProps,object nextState)`
`componentWillUpdate(object prevState, object prevState)`
`componentWillUnMount()，这里面一般会清除定时器，清空对象`

**唯一 ID 生成器**

nanoid 是一个非常小巧，安全友好的 JavaScript 唯一 ID 生成器，比 uuid 更可靠和易用，源码地址：https://github.com/ai/nanoid

在模拟添加数据的时候，一般都会需要一个唯一 ID 值，那么我们就使用 nanoid 来生成这个 ID 值。

安装：`npm install nanoid --save`

导入：`import { nanoid } from 'nanoid'`

使用：`const id = nanoid();`

其它使用方法参考文档：https://www.npmjs.com/package/nanoid

**Props**

Props 是只读的，不能修改自身的 props，父子组件传值就要通过 props 来完成。

Props 验证使用 propTypes，它可以保证我们的应用组件被正确使用。参考：https://www.npmjs.com/package/prop-types

安装：`npm install prop-types --save`

**发布订阅（pubsub-js）**

React 的父子组件之间可以通过 props 传递值，如果组件和组件之间需要传值的话要借助它们的父组件进行传值，这样父组件需要定义 state 和写好多回调函数。如果想在任意组件传递数据可以使用 pubsub-js 来完成。

安装：`npm install pubsub-js --save`

导入：`import PubSub from 'pubsub-js'`

使用：

    PubSub.publish('name', param)  // 发布订阅，name: 发布的消息名，param：提供给订阅者的参数

    PubSub.subscribe('name', func) // 订阅消息，name: 发布的消息名，func：事件的监听函数

    var func = function(msg, data) {

      console.log(msg,data);

    }

    PubSub.unsubscribe('name') // 取消订阅

有关 pubsub-js 的其它用法，可以参考文档：https://www.npmjs.com/package/pubsub-js

**调试工具**

谷歌浏览器安装插件：react developer tools，打开开发者工具，调试窗口如下图：

![](https://bbs-img.huaweicloud.com/blogs/img/20210917/1631858840239098687.png)

**温馨提示**

文章内容如果写的存在问题欢迎留言指出，让我们共同交流，共同探讨，共同进步~~~
