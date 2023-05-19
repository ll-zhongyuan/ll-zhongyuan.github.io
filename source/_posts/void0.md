---
title: 使用void 0 替代 undefined
author: 中元
img: https://ox.zhongyuan.space/hexo/featureimages/3.jpg
coverImg: https://ox.zhongyuan.space/hexo/featureimages/3.jpg
top: false
cover: false
toc: false
mathjax: false
summary: 为什么要使用void 0 替代 undefined
tags: JavaScript
categories: JavaScript
abbrlink: 1
date: 2023-05-12 22:06:30
password:
---

某厂有一条规定：不要直接使用 *`undefined`* 关键字，而要使用 *`void 0`* 来替代 *`undefined`* 

起初看到这个规定是很不理解的
![疑惑](https://ox.zhongyuan.space/hexo/articleIllustrations/other/%E7%96%91%E6%83%91.jpg)
为什么会有这么奇葩的规定

众所周知，定义变量的时候，像关键字：`null`、`true`、`false`都是不能定义的
![](https://ox.zhongyuan.space/hexo/articleIllustrations/other/0.jpg)
但是 `undefined` 可以直接定义
![](https://ox.zhongyuan.space/hexo/articleIllustrations/other/undefined.jpg)
因为`undefined`不是一个关键字，它只是全局对象`window`中的一个属性
![](https://ox.zhongyuan.space/hexo/articleIllustrations/other/undefinedInWindow.jpg)
这就意味着可以直接定义一个变量名为`undefined`，并且重新赋值
这并不意味着就能直接修改`undefined`的值，相反`undefined`虽然是window的一个属性，但是这个属性是只读的，并不能更改

这样问题又来了，既然无法更改，为什么又会有这样一条规定

看下面这个代码

![](https://ox.zhongyuan.space/hexo/articleIllustrations/other/1.jpg)

也就是说，在函数内部声明一个名为`undefined`的变量是可以的，并且可以对它重新赋值

虽然这种情况几乎不可能发生，可能某厂也是担心`undefined`会带来的一些安全隐患吧

而他们使用的规避方法就是使用 *`void 0`* 而不是直接使用 *`undefined`*

那 *`void 0`* 是什么意思呢？

首先 `void` 是个关键字，它后面可以跟一个表达式，无论表达式是什么，最终整个表达式返回一个 `undefined`
也就是说写 `void 0`和 `void 3.1415926`
返回结果是一样的
