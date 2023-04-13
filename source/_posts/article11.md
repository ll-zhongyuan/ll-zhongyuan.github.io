---
title: 使用 CSS 轻松实现一些高频出现的奇形怪状按钮
author: 中元
img: https://ox.zhongyuan.space/hexo/banner/img/0008.jpg
coverImg: https://ox.zhongyuan.space/hexo/banner/img/0008.jpg
top: false
cover: true
toc: true
mathjax: true
summary: >-
  总会有人问相关的问题，怎么样使用 CSS 实现一个内切角按钮呢、怎么样实现一个带箭头的按钮呢？本文基于一些高频出现在设计稿中的，使用 CSS
  实现稍微有点难度和技巧性的按钮，讲解使用 CSS 如何尽可能的实现它们。
tags: CSS
categories: CSS
abbrlink: 22588
date: 2022-02-09 11:26:30
password:
---

先让我们来看看这些经常会出现的按钮形状：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f865a6b485941fb83b85a857e8a4a08~tplv-k3u1fbpfcp-zoom-1.image)

## 矩形与圆角按钮

正常而言，我们遇到的按钮就这两种 -- 矩形和圆角：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/213bdbde25cd419985affcdd034ca2d0~tplv-k3u1fbpfcp-zoom-1.image)

它们非常的简单，宽高和圆角和背景色。

    <div class='btn rect'>rect</div>
    <div class='btn circle'>circle</div>
    .btn {
       margin: 8px auto;
       flex-shrink: 0;
       width: 160px;
       height: 64px;
    }
    .rect {
        background: #f6ed8d;
    }

    .circle {
        border-radius: 64px;
        background: #7de3c8;
    }

## 梯形与平行四边形

接下来，基于矩形的变形，经常会出现**梯形与平行四边形**的按钮。

实现它们主要使用 `transform` 即可，但是要注意一点，使用了 `transform` 之后，标签内的文字也会同样的变形，所以，我们通常使用元素的伪元素去实现造型，这样可以做到不影响按钮内的文字。

### 平行四边形

使用 `transform: skewX()` 即可，注意上述说的，利用元素的伪元素实现平行四边形，做到不影响内部的文字。

   <div class='btn parallelogram'>Parallelogram</div>
   .parallelogram {
       position: relative;
       width: 160px;
       height: 64px;

       &::before {
           content: "";
           position: absolute;
           top: 0;
           left: 0;
           bottom: 0;
           right: 0;
           background: #03f463;
           transform: skewX(15deg);
       }

}

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d02e72e6e0af4b23b5c5bbf2fbcb63c1~tplv-k3u1fbpfcp-zoom-1.image)

如果不想使用伪元素，除了 `transform: skewX()`，平行四边形使用渐变也是可以实现的。

大概就是这样：

    {
        background: linear-gradient(45deg, transparent 22%, #04e6fb 22%, #9006fb 78%, transparent 0);
    }

### 梯形

梯形比平行四边形稍微复杂一点，它多借助了 `perspective`，其实是利用了一定的 3D 变换。原理就是一个矩形，绕着 X 轴旋转，像是这样：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/083a479bed964814a78600c567e005d7~tplv-k3u1fbpfcp-zoom-1.image)

使用 `perspective` 和 `transform: rotateX()` 即可，当然，它们可以合在一起写：

    <div class='btn trapezoid'>Trapezoid</div>
    .parallelogram {
        position: relative;
        width: 160px;
        height: 64px;

        &::after {
              content:"";
              position: absolute;
              top: 0; right: 0; bottom: 0; left: 0;
              transform: perspective(40px) rotateX(10deg);
              transform-origin: bottom;
              background: #ff9800;
        }
    }

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b10e95e7278e464489034261e4634f75~tplv-k3u1fbpfcp-zoom-1.image)

## 切角 -- 纯色背景与渐变色背景

接下来是切角图形，最常见的方法主要是借助渐变 `linear-gradient` 实现，来看这样一个图形

    <div></div>
    .notching {
        background: linear-gradient(135deg, transparent 10px, #ff1493 0);
        background-repeat: no-repeat;
    }

结果如下，

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/403085aae53a472787da5b0b8a82bab3~tplv-k3u1fbpfcp-zoom-1.image)

基于此，我们只需要利用多重渐变，实现 4 个这样的图形即可，并且，利用 `background-position` 定位到四个角：

    <div class="notching">notching</div>
    .notching {
        background:
            linear-gradient(135deg, transparent 10px, #ff1493 0) top left,
            linear-gradient(-135deg, transparent 10px, #ff1493 0) top right,
            linear-gradient(-45deg, transparent 10px, #ff1493 0) bottom right,
            linear-gradient(45deg, transparent 10px, #ff1493 0) bottom left;
        background-size: 50% 50%;
        background-repeat: no-repeat;
    }

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e185404519245bc9548693c1b514cb4~tplv-k3u1fbpfcp-zoom-1.image)

### 利用 clip-path 实现渐变背景的切角图形

当然，这个技巧有个问题，当要求底色是渐变色的时候，这个方法就比较笨拙了。

好在，我们还有另外一种方式，借助 `clip-path` 切出一个切角图形，这样，背景色可以是任意定制的颜色，无论是渐变还是纯色都不在话下：

    <div class="clip-notching">notching</div>
    .clip-notching {
        background: linear-gradient(
            45deg,
            #f9d9e7,
            #ff1493
        );
        clip-path: polygon(
            15px 0,
            calc(100% - 15px) 0,
            100% 15px,
            100% calc(100% - 15px),
            calc(100% - 15px) 100%,
            15px 100%,
            0 calc(100% - 15px),
            0 15px
        );
    }

简单的实现一个渐变背景，接着核心就是，在渐变矩形图形的基础上，利用 `clip-path: polygon()` 切出我们想要的形状（一个 8 边形）：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/035df81ad9754fdcb59bc13e65c9275b~tplv-k3u1fbpfcp-zoom-1.image)

当然，上述代码非常容易联想到下述这种 6 边形，使用渐变和 `clip-path` 都可以轻松得到：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0185c3e6db894ea1a4e4a561124cc843~tplv-k3u1fbpfcp-zoom-1.image)

## 箭头按钮

接下来是箭头按钮，仔细观察上面的切角按钮，当两边的角被切掉的足够多的时候，就变成了一个箭头的形状。

我们可以利用两重渐变，实现一个单箭头按钮：

    <div class="arrow">arrow</div>
    &.arrow {
        background: linear-gradient(
                    -135deg,
                    transparent 22px,
                    #04e6fb 22px,
                    #65ff9a 100%
                )
                top right,
            linear-gradient(
                    -45deg,
                    transparent 22px,
                    #04e6fb 22px,
                    #65ff9a 100%
                )
                bottom right;
        background-size: 100% 50%;
        background-repeat: no-repeat;
    }

    一个箭头就出来了：

    ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc39ca54f91d47a88c429fe2b0047df6~tplv-k3u1fbpfcp-zoom-1.image)

    它是由上下两个渐变块组合得到的，换个颜色立马就能明白：

    ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ca4903b269f64c75ab51ebffdc341e19~tplv-k3u1fbpfcp-zoom-1.image)

    那如果是这样一个箭头造型呢？

    ![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aed4f085c4f84b41b5ac95ad6672161b~tplv-k3u1fbpfcp-zoom-1.image)

    一样的，它也是两个渐变的叠加，渐变的颜色是**透明 --> 颜色A --> 颜色B --> 透明**。当然，同样在这里也可以使用 `clip-path`：

    这里给出 `clip-path` 的解法：

    ```CSS
    {
        background: linear-gradient(45deg, #04e6fb, #65ff9a);
        clip-path: polygon(
            0 0,
            30px 50%,
            0 100%,
            calc(100% - 30px) 100%,
            100% 50%,
            calc(100% - 30px) 0
        );
    }

## 内切圆角

下面这个按钮形状，多出现于优惠券，最常见的解法，也是使用渐变，当然，与切角不同，这里使用的径向渐变。

首先，看这样一个简单的例子：

    <div></div>
    div {
        background-image: radial-gradient(circle at 100% 100%, transparent 0, transparent 12px, #2179f5 12px);
    }

可以得到这样一个图形：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fad928ea83d8461ab604dea37f590321~tplv-k3u1fbpfcp-zoom-1.image)

所以，只需控制下 `background-size`，在 4 个角实现 4 个这样的图形即可：

    <div class="inset-circle">inset-circle</div>
    &.inset-circle {
        background-size: 70% 70%;
        background-image: radial-gradient(
                circle at 100% 100%,
                transparent 0,
                transparent 12px,
                #2179f5 13px
            ),
            radial-gradient(
                circle at 0 0,
                transparent 0,
                transparent 12px,
                #2179f5 13px
            ),
            radial-gradient(
                circle at 100% 0,
                transparent 0,
                transparent 12px,
                #2179f5 13px
            ),
            radial-gradient(
                circle at 0 100%,
                transparent 0,
                transparent 12px,
                #2179f5 13px
            );
        background-repeat: no-repeat;
        background-position: right bottom, left top, right top, left bottom;
    }

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a950088d1edd4b05aba575854aeed0c5~tplv-k3u1fbpfcp-zoom-1.image)

### 借助 mask 实现渐变的内切圆角按钮

如果背景色要求渐变怎么办呢？

假设我们有一张矩形背景图案，我们只需要使用 `mask` 实现一层遮罩，利用 `mask` 的特性，把 4 个角给遮住即可。

`mask` 的代码和上述的圆角切角代码非常类似，简单改造下即可得到渐变的内切圆角按钮：

    <div class="mask-inset-circle">inset-circle</div>
    .mask-inset-circle {
        background: linear-gradient(45deg, #2179f5, #e91e63);
        mask: radial-gradient(
                circle at 100% 100%,
                transparent 0,
                transparent 12px,
                #2179f5 13px
            ),
            radial-gradient(
                circle at 0 0,
                transparent 0,
                transparent 12px,
                #2179f5 13px
            ),
            radial-gradient(
                circle at 100% 0,
                transparent 0,
                transparent 12px,
                #2179f5 13px
            ),
            radial-gradient(
                circle at 0 100%,
                transparent 0,
                transparent 12px,
                #2179f5 13px
            );
        mask-repeat: no-repeat;
        mask-position: right bottom, left top, right top, left bottom;
        mask-size: 70% 70%;
    }

这样，我们就得到了这样一个图形：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aef32f16930d4091bd6d3cdef2e79dec~tplv-k3u1fbpfcp-zoom-1.image)

当然，读懂上述代码，你需要首先弄清楚 CSS `mask` 属性的原理，如果你对它还有些陌生，可以看看我的这篇文章：

[奇妙的 CSS MASK](https://github.com/chokcoco/iCSS/issues/80)

## 圆角不规则矩形

下面这个按钮形状，也是最近被问到最多的，先来看看它的造型：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3cd059aca5a84f45b756bac650452fca~tplv-k3u1fbpfcp-zoom-1.image)

不太好给它起名，一侧是规则的带圆角直角，另外一侧则是带圆角的斜边。

其实，它就是由**圆角矩形** + **圆角平行四边形组成**：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/56619c01c9234ff1aeeb3a83a6c6c3ce~tplv-k3u1fbpfcp-zoom-1.image)

所以，借助两个伪元素，可以轻松的实现它们：

    <div class="skew">Skew</div>
    .skew {
        position: relative;
        width: 120px;

        &::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 10px;
            background: orange;
            transform: skewX(15deg);
        }
        &::before {
            content: "";
            position: absolute;
            top: 0;
            right: -13px;
            width: 100px;
            height: 64px;
            border-radius: 10px;
            background: orange;
        }
    }

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6d4f471820794d58a80f81f5c4c00052~tplv-k3u1fbpfcp-zoom-1.image)

由于一个伪元素叠加在另外一个之上，所以对其中一个使用渐变，一个则是纯色，其颜色是可以完美衔接在一起的，这样就实现了渐变色的该图形：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c4bb1de4018421a9eb142d7b7590cfa~tplv-k3u1fbpfcp-zoom-1.image)

## 外圆角按钮

接下来这个按钮形状，常见于 Tab 页上，类似于 Chrome 的分页：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d516c287fa9a40738b77f91ea92fc152~tplv-k3u1fbpfcp-zoom-1.image)

我们对这个按钮形状拆解一下，这里其实是 3 块的叠加：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1b933f02fc54a34a36a0430254b4a12~tplv-k3u1fbpfcp-zoom-1.image)

只需要想清楚如何实现两侧的弧形三角即可。这里还是借助了渐变 -- **径向渐变**，其实他是这样，如下图所示，我们只需要把黑色部分替换为透明即可， 两个伪 元素即可：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/851ef119668d4670b14989db2ad105a0~tplv-k3u1fbpfcp-zoom-1.image)

代码如下：

    <div class="outside-circle">outside-circle</div>
    .outside-circle {
        position: relative;
        background: #e91e63;
        border-radius: 10px 10px 0 0;

        &::before {
            content: "";
            position: absolute;
            width: 20px;
            height: 20px;
            left: -20px;
            bottom: 0;
            background: #000;
            background:radial-gradient(circle at 0 0, transparent 20px, #e91e63 21px);
        }
        &::after {
            content: "";
            position: absolute;
            width: 20px;
            height: 20px;
            right: -20px;
            bottom: 0;
            background: #000;
            background:radial-gradient(circle at 100% 0, transparent 20px, #e91e63 21px);
        }
    }

即可得到：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cf23b36595f14f4ca3bc77e107525226~tplv-k3u1fbpfcp-zoom-1.image)

上述的所有图形的完整代码，你可以在这里看到：[CodePen Demo -- CSS Various Button Shapes | CSS 各种造型按钮](https://codepen.io/Chokcoco/pen/QWMoBGO?editors=1100)

## 总结一下

基于上述的实现，我们不难发现，一些稍微特殊的按钮，无非都通过拼接、障眼法、遮罩等方式实现。

而在其中：

- 渐变（线性渐变 `linear-gradient`、径向渐变 `radial-gradient`、多重渐变）
- 遮罩 `mask`
- 裁剪 `clip-path`
- 变形 `transform`

发挥了重要的作用，熟练使用它们，我们对于这些图形就可以信手拈来，基于它们的变形也能从容面对。

上述的图形，再配合 `filter: drop-shadow()`，基本都能实现不规则阴影。

再者，更为复杂的图形，如下所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/22c9c459077b48b79fd91fea13ef94e4~tplv-k3u1fbpfcp-zoom-1.image)

还是切图吧，CSS 虽好，实际使用中也需要考虑投入产出比。
