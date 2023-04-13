---
title: 欲罢不能的node.js
author: 中元
img: https://ox.zhongyuan.space/hexo/banner/img/0005.jpg
coverImg: https://ox.zhongyuan.space/hexo/banner/img/0005.jpg
top: true
cover: true
toc: true
mathjax: true
summary: 从来没有一门语言让我像对node.js一样的着迷
tags: Node
categories: Node
abbrlink: 35788
date: 2021-10-23 13:47:30
password:
---

### 什么是 node.js

到底什么是 node.js 呢？看看[官网](http://www.nodejs.org/)对 nodejs 的描述：

Node.js is a platform built on Chrome's JavaScript runtime for easily building fast, scalable network applications. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient, perfect for data-intensive real-time applications that run across distributed devices.

我们可以对此总结出几点

1. node.js 是一个构建在 Chrome JavaScript 运行环境的平台，这是很重要的一点，**node.js 并不是一门语言，而是一个平台**
2. node.js 致力于使构建速度快、稳定的网络程序更简单
3. node.js 具有事件驱动和非阻塞 I/O 的特色，使之轻量级并且高效率
4. node.js 非常适合在分布式设备运行数据密集型实时应用程序

### **服务器端运行的 JavaScript？**

Chrome JavaScript runtime 也就是我们常说的 Chrome 的 V8 JavaScript Engine，也就是 Goole 开发的一个用于 Chrome 浏览器的底层 JavaScript 引擎，用于解析 JavaScript 语句创建其运行环境，保证我们写的语句在浏览器上的表现和我们预期的一致。

那么为什么说 node.js 是服务器端运行的 JavaScript？好好地 nodejs 干嘛要和 V8 扯上关系？除了 Google 搞的 V8 解释 JavaScript 十分的快，十分重要的一个原因是 V8 JavaScript 引擎并不仅限于在浏览器中运行，可以嵌入任何应用程序中运行。Node.js 和.net framework 类似是一个平台（这里有些搞不明白，望大神们指点一二），但它没有像.net 一样创造了一门语言——C#在这个平台上运行，而是很巧妙的借用了 web 开发人员已经非常熟悉的 JavaScript 语法，使用 V8 引擎来解析语句，并将其重建可在服务器上使用。所以严格上说 node.js 并不是服务器端运行的 Javascript，而是可以在服务器端运行 JavaScript 语法的平台。

### 为什么要用 node.js

搞了半天就是一个新瓶装旧酒的东西，看起来除了一个新鲜的可以使用 JavaScript 语法，node.js 没什么长处，为什么要用它而不是同样可以在服务器端运行的 Java 或 C#呢？这要从 node.js 事件驱动和非阻塞 I/O 的特色谈起。关于事件驱动熟悉 JavaScript 的同学应该很熟悉了，node.js 采用一系列“非阻塞”库来支持事件循环的方式。本质上就是为文件系统、数据库之类的资源提供接口，比如一个数据库访问，采用事件机制,发起请求之后,立即将进程交出,当数据返回后触发事件,再继续处理数据。

在传统的阻塞 I/O 中其运行过程是这样的

    int num=query('select * from ......');

    print(num);...................//无关语句

print 方法必须等待 query 方法返回结果，如果数据库出现网络连接故障，那么 print 方法就要等到超时才能执行，然后后面一些无关语句才能一次执行，而在非阻塞 I/O 中是这样的

    query('select * from...',callback(data){
      .............//相关语句
      print();
    });

    ..............//无关语句

跟我们使用 ajax，在回调函数中处理结果，但是不影响下面语句执行。 怪不得 node.js 要借用 JavaScript 来做此事，JavaScript 的几个特性使它很胜任这项工作

1. 事件机制
2. 函数式编程，支持匿名函数，函数参数

Node.js 中代码是单进程、单线程执行的（我们写的代码是，但 node.js 本身不是有兴趣同学可以看看[这个](http://rickgaribay.net/archive/2012/01/28/node-is-not-single-threaded.aspx)进一步了解），使用事件轮询机制和非阻塞 I/O，在不新增额外线程的情况下对任务进行并行处理 。node.js 解决了阻塞式编程浪费大量进程资源只是在等待,导致的大量内存和 cpu 的浪费问题，所以才敢宣称自己 perfect for 数据密集型的实时 web 应用程序。

### 如何安装

nodejs 的安装还是很简单的，尤其是现在安装包都把 npm 集成了进去，不用单独安装了，下载下安装包运行就可以了，另外想完整使用 nodejs 的话需要有 C 语言的编译环境、git 和 python，使用 window 的同学很能会稍微麻烦一些，需要搞定这些。对命令行情有独钟的同学可以看看[How to Install Node.js](http://howtonode.org/how-to-install-nodejs)

**npm 是什么**

npm 是 node packaged modules 的缩写，其实是一个 nodejs 的 module 的管理工具

**什么是 module**

所谓 module 和 java 中的包的概念很类似，一些解决方案的集合，官方会提供核心的几个，第三方的很多

**如何安装第三方 module**

因为 nodejs 的社区很活跃，有很多好用的第三方的包，我们可以在终端中使用 npm 的命令安装

- _npm install [-g] <name>:使用 install 指令可以把 nodule 下载安装的 nodejs 的全局的 path 处，不加的话会安装到当前路径_
- _npm remove <name>:移除 module_
- _npm update <name>:更新 module_

还有一些常用命令可以看看[npm 常用命令](http://blog.csdn.net/haidaochen/article/details/8546796)

### 第一个 demo

这些都搞定后我们就可以写传说中的 hello world 了。在任意目录建一个 test.js 文件

console.log('Hello, World!');

简单的一句话就可以，然后使用 node 命令运行

![](https://images0.cnblogs.com/blog/349217/201312/14180746-9e477b3401c84b5f9aa964344aa6a15f.png)

这这这。。。太没技术含量了，看看官方给的 demo，使用 nodejs 创建一个 web server 有多简单

    var http=require('http');//引入http module
    http.createServer(function(request,response){//创建一个web server
        //回调函数，这样创建server方法就不会阻塞了
        response.writeHead(200,{'contentType':'text/plain'});
        response.end('Hello World!\n');
    }).listen(8124);
    console.log('Server running at http://127.0.0.1:8124/');

先运行一下服务器，按两次 Ctrl+C 退出

![img](https://images0.cnblogs.com/blog/349217/201312/14181624-c88df45c5236483aa49cf4af3f140868.png)

使用浏览器访问一下

![img](https://images0.cnblogs.com/blog/349217/201312/14181637-8fc77389050a4fa0818a3672bf528ed1.png)

就这么简单

### 如何学习

看到上面的 demo 是不是也对 nodejs 产生兴趣了呢，可是像我这样的懒人接触一门新语言的时候不知道该如何下手，难道又要去做个无聊的购物车神马的嘛，学习 nodejs 不用，nodejs 为我们提供了一个小游戏一样的教程，就像个寻宝过程从零开始，没步都有一个任务和一下提示让你走的更远，上[nodeschool](http://nodeschool.io/)下载然后开始寻宝吧，我就是被这小游戏迷住了，顺便秀一下我一天的战绩，每个任务都完成了

![img](https://images0.cnblogs.com/blog/349217/201312/14182240-ea57a8c1ac1c4c50b1d927071f5f6e21.png)

看看解释就知道怎么做了，不过建议最开始 run 和 verify 结合使用，verify 告诉你执行结果和预期结果，run 会告诉你有哪些错误

当然除了这些小游戏帮我们熟悉 nodejs 语法及使用，一些优秀的社区也可以帮我们很多

[CNode](http://cnodejs.org/)

[开源中国](http://www.oschina.net/p/nodejs/)
