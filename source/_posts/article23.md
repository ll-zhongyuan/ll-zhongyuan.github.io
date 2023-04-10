---
title: 冗余导航（路由冗余）解决方式
author: 中元
img: /medias/banner/16.jpg
coverImg: /medias/banner/16.jpg
top: false
cover: false
toc: false
mathjax: false
summary: 重复点击路由，导致提示避免到当前位置的冗余导航
tags: Vue
categories: Vue
abbrlink: 16122
date: 2022-08-10 05:05:30
password:
---

项目中

报错： `NavigationDuplicated: Avoided redundant navigation to current location:`

`（NavigationDuplicated: 避免了对当前位置的冗余导航）`

解决方法：

这个报错的关键是`this.$router.push(...).catch(err => err)`要有后面的`catch`。因为跳转方法返回了一个`promise`对象，要有处理拒绝的方法。

首先检查，路由跳转的时候是不是调用的`push`方法，还是用的`replace`？

打开 router 文件夹下的 index.js（路由文件）文件中添加如下代码：

// pust 方法

    const routerRePush = VueRouter.prototype.push
    VueRouter.prototype.push = function (location) {
      return routerRePush.call(this, location).catch(error => error)
    }

// replace 方法

    const routerReplace = VueRouter.prototype.replace
    VueRouter.prototype.replace = function (location) {
      return routerReplace.call(this, location).catch(error => error)
    }

问题解决，祝我生日快乐好吧
