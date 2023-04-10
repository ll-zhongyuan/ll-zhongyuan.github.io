---
title: 13 行 JavaScript 代码让你看起来像是高手
author: 中元
img: /medias/banner/15.jpg
coverImg: /medias/banner/15.jpg
top: false
cover: false
toc: true
mathjax: false
summary: 有趣的13 行 JavaScript 代码
tags:
  - JavaScript
  - 转载
categories: JavaScript
abbrlink: 3289
date: 2022-06-22 18:06:30
password:
---

JavaScript 可以做许多神奇的事情，也有很多东西需要学习，今天我们介绍几个短小精悍的代码段。

### 获取随机布尔值（True/False）

使用 `Math.random()` 会返回 0 到 1 的随机数，之后判断它是否大于 0.5，将会得到一个 50% 概率为 `True` 或 `False` 的值

    const randomBoolean = () => Math.random() >= 0.5;
    console.log(randomBoolean());

### 判断一个日期是否是工作日

    const isWeekday = (date) => date.getDay() % 6 !== 0;
    console.log(isWeekday(new Date(2021, 0, 11)));
    // Result: true (周一)
    console.log(isWeekday(new Date(2021, 0, 10)));
    // Result: false (周日)

### 反转字符串

有许多反转字符串的方法，这里使用一种最简单的，使用了 `split()`，`reverse()` 和 `join()`

    const reverse = str => str.split('').reverse().join('');
    reverse('hello world');
    // Result: 'dlrow olleh'

### 判断当前标签页是否为可视状态

浏览器可以打开很多标签页，下面 👇🏻 的代码段就是判断当前标签页是否是激活的标签页

    const isBrowserTabInView = () => document.hidden;
    isBrowserTabInView();

### 判断数字为奇数或者偶数

取模运算符 `%` 可以很好地完成这个任务

    const isEven = num => num % 2 === 0;
    console.log(isEven(2));
    // Result: true
    console.log(isEven(3));
    // Result: false

### 从 Date 对象中获取时间

使用 `Date` 对象的 `.toTimeString()` 方法转换为时间字符串，之后截取字符串即可

    const timeFromDate = date => date.toTimeString().slice(0, 8);
    console.log(timeFromDate(new Date(2021, 0, 10, 17, 30, 0)));
    // Result: "17:30:00"
    console.log(timeFromDate(new Date()));
    // Result: 返回当前时间

### 保留指定的小数位

    const toFixed = (n, fixed) => ~~(Math.pow(10, fixed) * n) / Math.pow(10, fixed);
    // Examples
    toFixed(25.198726354, 1);       // 25.1
    toFixed(25.198726354, 2);       // 25.19
    toFixed(25.198726354, 3);       // 25.198
    toFixed(25.198726354, 4);       // 25.1987
    toFixed(25.198726354, 5);       // 25.19872
    toFixed(25.198726354, 6);       // 25.198726

### 检查指定元素是否处于聚焦状态

可以使用 `document.activeElement` 来判断元素是否处于聚焦状态

    const elementIsInFocus = (el) => (el === document.activeElement);
    elementIsInFocus(anyElement)
    // Result: 如果处于焦点状态会返回 True 否则返回 False

### 检查当前用户是否支持触摸事件

    const touchSupported = () => {
      ('ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch);
    }
    console.log(touchSupported());
    // Result: 如果支持触摸事件会返回 True 否则返回 False

### 检查当前用户是否是苹果设备

可以使用 `navigator.platform` 判断当前用户是否是苹果设备

    const isAppleDevice = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
    console.log(isAppleDevice);
    // Result: 是苹果设备会返回 True

### 滚动至页面顶部

`window.scrollTo()` 会滚动至指定的坐标，如果设置坐标为（0，0），就会回到页面顶部

    const goToTop = () => window.scrollTo(0, 0);
    goToTop();
    // Result: 将会滚动至顶部

### 获取所有参数的平均值

可以使用 `reduce()` 函数来计算所有参数的平均值

    const average = (...args) => args.reduce((a, b) => a + b) / args.length;
    average(1, 2, 3, 4);
    // Result: 2.5

### 转换华氏/摄氏

再也不怕处理温度单位了，下面两个函数是两个温度单位的相互转换。

    const celsiusToFahrenheit = (celsius) => celsius * 9/5 + 32;
    const fahrenheitToCelsius = (fahrenheit) => (fahrenheit - 32) * 5/9;
    // Examples
    celsiusToFahrenheit(15);    // 59
    celsiusToFahrenheit(0);     // 32
    celsiusToFahrenheit(-20);   // -4
    fahrenheitToCelsius(59);    // 15
    fahrenheitToCelsius(32);    // 0

