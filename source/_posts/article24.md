---
title: 炫酷的 CSS 文字特效
author: 中元
img: /medias/banner/17.jpg
coverImg: /medias/banner/17.jpg
top: false
cover: false
toc: true
mathjax: false
summary: css是前端开发者所必备的技能！那么，在开发过程中你对css效果又了解多少呢？在社区中看到一篇关于css文字特效的文章，摘取部分分享给大家
tags:
  - CSS
  - 转载
categories: CSS
abbrlink: 39265
date: 2022-09-01 11:06:30
password:
---

## 一、实现线性渐变的文字

实例描述：在网页制作时，可以通过对文字颜色的设置来实现网页的特殊效果。本实例将使用 CSS3 实现文字线性渐变的效果。运行实例，在页面中会输出一串线性渐变的文字 `人生苦短，我用Python`，结果如下图所示：

![](https://img2020.cnblogs.com/blog/2423513/202108/2423513-20210813124246315-655954642.png)

技术要点：本实例主要使用了 CSS3 中的 linear-gradient() 函数，该函数用于创建一个线性渐变的图像。语法格式如下：

    background:linear-gradient(direction, color-stop1, color-stop2, …)
    /*参数说明：
    \1. direction：设置渐变的方向，可以使用角度值。
    \2. color-stop1, color-stop2, …：指定渐变的起止颜色。*/

## 二、制作文字阴影效果

![](https://img2020.cnblogs.com/blog/2423513/202108/2423513-20210813124438144-2087509045.png)

技术要点：本实例主要使用了 CSS3 中的 text-shadow 属性，该属性用于向文本设置阴影。语法格式如下：

    text-shadow: h-shadow v-shadow blur color;
    /*参数说明：
    h-shadow：必选参数，用于设置水平阴影的位置，可以为负值。
    v-shadow：必选参数，用于设置垂直阴影的位置，可以为负值。
    blur：可选参数，用于设置模糊的距离。
    color：可选参数，用于设置阴影的颜色。*/

## 三、实现文字的荧光闪烁效果

![](https://img2020.cnblogs.com/blog/2423513/202108/2423513-20210813125627494-376405160.png)

`animation: name duration timing-function delay iteration-count direction;`

参数说明如下表所示：

![](https://img2020.cnblogs.com/blog/2423513/202108/2423513-20210813125716122-1364222231.png)

## 五、制作镂空文字

![](https://img2020.cnblogs.com/blog/2423513/202108/2423513-20210813125131298-1439491023.png)

技术要点：在本实例中，实现文字的镂空效果主要应用了 CSS3 中的 text-stroke 属性，通过该属性可以设置文字的描边效果。语法格式如下：

    text-stroke:[text-stroke-width] || [text-stroke-color]
    /*参数说明： text-stroke-width：设置文字的描边厚度。
    text-stroke-color：设置文字的描边颜色。*/

## 六、实现文字的倾斜效果

![](https://img2020.cnblogs.com/blog/2423513/202108/2423513-20210813125458633-503000637.png)

    text-stroke:[text-stroke-width] || [text-stroke-color]
    /*参数说明： text-stroke-width：设置文字的描边厚度。
    text-stroke-color：设置文字的描边颜色。*/

## 七、实现火焰文字

![](https://img2020.cnblogs.com/blog/2423513/202108/2423513-20210813125826147-1767245020.png)

    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>实现火焰文字</title>
    <style type="text/css">
    body{
    font-size:120px; /*设置字体大小*/
    font-weight:bold; /*设置字体粗细*/
    font-family:'微软雅黑'; /*设置字体*/
    background:#000; /*设置页面背景颜色*/
    color:#fff; /*设置文字颜色*/
    text-align:center/*设置文字居中*/
    }
    div{

    text-shadow:0 0 20px #fefcc9,
    10px -10px 30px #feec85,
    -20px -20px 40px #ffae34,
    20px -40px 50px #ec760c,
    0 -80px 70px #f38e1c; /*设置文字阴影*/
    -webkit-animation: flame 2s infinite; /*设置动画*/

    }

    @-webkit-keyframes flame{ /*创建动画*/
    0%{
    text-shadow:0 0 20px #fefcc9,
    10px -10px 30px #feec85,
    -20px -20px 40px #ffae34,
    20px -40px 50px #ec760c,
    0 -80px 70px #f38e1c;
    }
    30%{
    text-shadow:0 0 20px #fefcc9,
    10px -10px 30px #feec85,
    -20px -20px 40px #ffae34,
    20px -40px 50px #ec760c,
    10px -90px 80px #f38e1c;
    }
    60%{
    text-shadow:0 0 20px #fefcc9,
    10px -10px 30px #feec85,
    -20px -20px 40px #ffae34,
    20px -40px 50px #ec760c,
    0px -80px 100px #f38e1c;
    }
    100%{
    text-shadow:0 0 20px #fefcc9,
    10px -10px 30px #feec85,
    -20px -20px 40px #ffae34,
    20px -40px 50px #ec760c,
    0 -80px 70px #f38e1c;
    }
    }
    </style>
    </head>
    <body>
    <div>星星之火可以燎原</div>
    </body>
    </html>

## 八、使用 SVG 创建空心虚线线条文字

![](https://img2020.cnblogs.com/blog/2423513/202108/2423513-20210813130022598-1290072040.png)

    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>Document</title>
    <style type="text/css">
    text{
    font-family:SimHei; /*定义字体*/
    font-size:56px; /*定义文字大小*/
    font-weight:bolder; /*定义字体粗细*/
    fill:transparent; /*定义文字透明*/
    stroke:#0000FF; /*定义描边颜色*/
    stroke-dasharray:3; /*定义虚线长度和虚线间距*/
    }
    </style>
    </head>
    <body>
    <svg width="600" height="300">
    <text x="30" y="150">人生苦短，我用Python</text>
    </svg>
    </body>
    </html>

## 九、使用 SVG 实现文字沿曲线显示效果

![](https://img2020.cnblogs.com/blog/2423513/202108/2423513-20210813130155895-469616243.png)

    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>使用SVG实现文字沿曲线显示效果</title>
    <style type="text/css">
    text{
    font-family:SimHei;/*定义字体*/
    font-size:33px;/*定义文字大小*/
    fill:url(#linear);/*定义文字颜色线性渐变*/
    }
    </style>
    </head>
    <body>
    <svg width="1000" height="800">
    <defs>
    <path id="textPath" d="M130,140 C130,240 330,240 330,140 S510,60 510,140"/>
    <linearGradient id="linear" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stop-color="#FF0000"></stop>
    <stop offset="50%" stop-color="#00FF00"></stop>
    <stop offset="100%" stop-color="#0000FF"></stop>
    </linearGradient>
    </defs>
    <text dy="10">
    <textPath xlink:href="#textPath">世界会向那些有目标和远见的人让路</textPath>
    </text>
    </svg>
    </body>
    </html>

