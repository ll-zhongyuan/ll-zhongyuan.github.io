---
title: JavaScript事件、事件类型、事件流和事件模型
author: 中元
img: https://ox.zhongyuan.space/hexo/banner/11.jpg
coverImg: https://ox.zhongyuan.space/hexo/banner/11.jpg
top: false
cover: false
toc: false
mathjax: false
summary: >-
  当我们与浏览器中 Web 页面进行某些类型的交互时，事件就发生了。事件可能是用户在某些内容上的点击、鼠标经过某个特定元素或按下键盘上的某些按键。事件还可能是
  Web 浏览器中发生的事情，比如说某个 Web 页面加载完成，或者是用户滚动窗口或改变窗口大小。通过使用 JavaScript
  ，你可以监听特定事件的发生，并规定让某些事件发生以对这些事件做出响应。
tags: JavaScript
categories: JavaScript
abbrlink: 4903
date: 2022-04-26 11:06:30
password:
---

### 一、事件是什么？

事件 (Event) 是 JavaScript 应用跳动的心脏 ，进行交互，使网页动起来。当我们与浏览器中 Web 页面进行某些类型的交互时，事件就发生了。事件可能是用户在某些内容上的点击、鼠标经过某个特定元素或按下键盘上的某些按键。事件还可能是 Web 浏览器中发生的事情，比如说某个 Web 页面加载完成，或者是用户滚动窗口或改变窗口大小。

通过使用 JavaScript ，你可以监听特定事件的发生，并规定让某些事件发生以对这些事件做出响应。

### 1、事件作用

（1）验证用户输入的数据。

（2）增加页面的动感效果。

（3）增强用户的体验度

### 2、事件中的几个名词

-事件源: 谁触发的事件 -事件名: 触发了什么事件 -事件监听: 谁管这个事情，谁监视？ -事件处理:发生了怎么办

例如

-闯红灯 事件源:车 ; 事件名: 闯红灯; 监听：摄像头、交警 ; 处理:扣分罚款 -单击按钮 事件源:按钮; 事件名: 单击; 监听:窗口 ; 处理:执行函数

当我们用户在页面中进行的点击动作，鼠标移动的动作，网页页面加载完成的动作等，都可以称之为事件名称，即：click、mousemove、load 等都是事件名称，具体的执行代码处理，响应某个事件的函数。

    <body onload="loadWindow();"></body>
    <script>
        function loadWindow(){
            alert("加载窗体");
        }
    </script>

### 二、事件类型

JavaScript 可以处理的事件类型为：鼠标事件、键盘事件、HTML 事件。

http://www.w3school.com.cn/tags/html_ref_eventattributes.asp 用+查

Window 事件属性：针对 window 对象触发的事件（应用到 <body> 标签）

Form 事件：由 HTML 表单内的动作触发的事件（应用到几乎所有 HTML 元素，但最常用在 form 元素中）

Keyboard 事件 : 键盘事件

Mouse 事件：由鼠标或类似用户动作触发的事件

Media 事件：由媒介（比如视频、图像和音频）触发的事件（适用于所有 HTML 元素，但常见于媒介元素中，比如 <audio>、<embed>、<img>、<object> 以及 <video>）

几个常用的事件：

onclick 、onblur 、onfocus 、onload 、onchange

onmouseover、onmouseout、onkeyup、onkeydown

onload：当页面或图像加载完后立即触发
onblur：元素失去焦点
onfocus：元素获得焦点
onclick：鼠标点击某个对象
onchange：用户改变域的内容
onmouseover：鼠标移动到某个元素上
onmouseout：鼠标从某个元素上离开
onkeyup：某个键盘的键被松开
onkeydown：某个键盘的键被按下

### 三、事件流和事件模型

我们的事件最后都有一个特定的事件源，暂且将事件源看做是 HTML 的某个元素，那么当一个 HTML 元素产生一个事件时，该事件会在元素节点与根节点之间按特定的顺序传播，路径所经过的节点都会受到该事件，这个传播过程称为 DOM 事件流。

事件顺序有两种类型：事件捕获 和 事件冒泡。

冒泡和捕获其实都是事件流的不同表现，这两者的产生是因为 IE 和 Netscape 两个大公司完全不同的事件流概念产生的。（事件流：是指页面接受事件的顺序）IE 的事件流是事件冒泡，Netscape 的事件流是事件捕获流。

### 1、事件冒泡

IE 的事件流叫做事件冒泡，即事件开始时由最具体的元素接受，然后逐级向上传播到较为不具体的节点（文档）。例如下面的：

    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8">
    <title>JavaScript</title>
    </head>
    <body>
      <div id="myDiv">Click me</div>
    </body>
    </html>

如果点击了页面中的<div>元素，那么这个 click 事件会按照如下顺序传播：

`1、<div>`

`2、<body>`

`3、<html>`

`4、document`

也就是说，click 事件首先在 div 元素上发生，而这个元素就是我们单击的元素。然后，click 事件沿 DOM 树向上传播，在每一级节点上都会发生，直到传播到 document 对象。

所有现代浏览器都支持事件冒泡，但在具体实现上还是有一些差别。

### 2、事件捕获

Netscape 提出的另一种事件流叫做事件捕获，事件捕获的思想是不太具体的节点应该更早接收到事件，而最具体的节点应该最后接收到事件。事件捕获的用意在于在事件到达预定目标之前捕获它。还以前面的例子为例。那么单击<div>元素就会按下列顺序触发 click 事件：

`1、document`

`2、<html>`

`3、<body>`

`4、<div>`

在事件捕获过程中，document 对象首先接收到 click 事件，然后沿 DOM 树依次向下，一直传播到事件的实际目标，即<div>元素。

虽然事件捕获是 Netscape 唯一支持的事件流模式，但很多主流浏览器目前也都支持这种事件流模型。尽管“DOM2 级事件”规范要求事件应该从 document 对象开始时传播，但这些浏览器都是从 window 对象开始捕获的。
