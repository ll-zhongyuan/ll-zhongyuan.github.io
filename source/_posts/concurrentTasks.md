---
title: 并发任务控制
author: 中元
img: https://ox.zhongyuan.space/hexo/banner/16.jpg
coverImg: https://ox.zhongyuan.space/hexo/banner/16.jpg
top: false
cover: false
toc: false
mathjax: false
summary: 并发任务控制
tags: JavaScript
categories: JavaScript
abbrlink: 2
date: 2023-04-09 14:06:30
password:
---

实现一个批量请求函数 `multiRequest()`，要求如下：

- 要求最大并发数 `maxNum`
- 每当有一个请求返回，就留下一个空位，可以增加新的请求
- 所有请求完成后，结果按照 `urls` 里面的顺序依次打出

这道题目我想很多人应该都或多或少都有见过，那符合这个题目的需求的场景都有哪些呢？

假设现在有这么一种场景：现有 30 个异步请求需要发送，但由于某些原因，我们必须将同一时刻并发请求数量控制在 5 个以内，同时还要尽可能快速的拿到响应结果。
应该怎么做？

前天又遇到了，这里放出我的解决方法

现有条件是
- 需要一个最大并发数 `maxNum`
- 还需要一个变量（为了监听正在运行的任务数量） `runningCount`
- 一个任务列表 `tasks`

首先创建一个函数，这个函数主要为了添加任务，添加之后需要返回一个`Promise`

    add(task) {
        return new Promise((resolve, reject) => {
            this.tasks.push({
                task,
                resolve,
                reject
            })
            this._run()
        })
    }

我并没有将`resolve`和`reject`抛出，因为我其实并不知道这个函数是执行成功还是执行失败，那我现在能调用这个函数吗？很明显是不行的，因为很有可能目前正在运行的任务数量已经达到了我们设置的最大并发数`maxNum`，这就意味着现在的任务只能等。所以这里能做什么呢？既然不能调用这个任务，那就把这个任务加到一个集合里边，让它等待被调用

这里写一个辅助函数

    _run() {
        while (this.runningCount < this.maxNum && this.tasks.length) {
            const { task, resolve, reject } = this.tasks.shift()
            this.runningCount++
            task().then(resolve, reject).finally(() => {
                    this.runningCount--
                        // 递归调用辅助方法
                    this._run()
                })
        }
    }

将这些全部封装在一个构造函数里面，创建构造函数实例
`const superTask = new SuperTask()`

然后需要一个`Promise`请求，这里用一个延时函数代替

    function timeout(time) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            }, time)
        })
    }

为了测试构造函数的功能，还需要再写一个辅助函数

    function addTask(time, name) {
        superTask
            add(() => timeout(time))
            .then(() => {
                console.log(`任务${name}完成`);
            })
    }

最后调用测试一下

    addTask(10000, "一")    // 10000ms 后输出：任务一完成
    addTask(5000, "二")     // 5000ms 后输出：任务二完成
    addTask(2000, "三")     // 2000ms 后输出：任务三完成
    addTask(3000, "四")     // 5000ms 后输出：任务四完成
    addTask(8000, "五")     // 13000ms 后输出：任务五完成
    addTask(6000, "六")     // 11000ms 后输出：任务六完成
    addTask(4000, "七")     // 14000ms 后输出：任务七完成

也可以按照要求将请求全部放在数组中，然后调用
这里只模拟七个请求，主要是懒得 CV 了，本来想只写五个的，不过那好像太少了 😁。（我设置的最大并发数量是 3 个）

想要实际测试的朋友可以直接取源码进行测试

代码我放在[GitHub](https://github.com/ll-zhongyuan/informal-essay/blob/main/fore-end-demo/%E5%B9%B6%E5%8F%91%E4%BB%BB%E5%8A%A1%E6%8E%A7%E5%88%B6/%E5%B9%B6%E5%8F%91%E4%BB%BB%E5%8A%A1%E6%8E%A7%E5%88%B6.html)
