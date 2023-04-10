---
title: 音频可视化
author: 中元
img: https://ox.zhongyuan.space/hexo/banner/myStory.jpg
coverImg: https://ox.zhongyuan.space/hexo/banner/myStory.jpg
top: false
cover: false
toc: false
mathjax: false
summary: 使用canvas完成音频可视化
tags: canvas
categories: canvas
abbrlink: 9
date: 2023-02-27 14:06:30
password:
---

前几天使用canvas完成了基础绘图，今天来整点活

### 最终要实现的效果

![音频可视化效果图](https://ox.zhongyuan.space/hexo/articleIllustrations/canvas/%E9%9F%B3%E9%A2%91%E5%8F%AF%E8%A7%86%E5%8C%96%E6%95%88%E6%9E%9C%E5%9B%BE.jpg)

### 需求分析

- canvas 生成柱状图
- 柱状图不断重新渲染

简单来说只有这两点需求，好像很简单嘛

接下来实操：

    // 还是从获取 dom元素，生成 canvas 上下文开始
    const audioEle = document.querySelector('audio')
    const cvs = document.querySelector('canvas')
    const ctx = cvs.getContext('2d')
    
    // 初始化 canvas 尺寸
     function initCvs() {
        cvs.width = window.innerWidth * devicePixelRatio
        cvs.height = (window.innerHeight / 1.5) * devicePixelRatio
    }
    initCvs()

然后就是音频

- 获取音频（这里直接引入一个本地音频）
- 创建音频上下文
- 创建音频源节点
- 创建分析器节点
- 创建数组接受分析器节点的分析数据
- 连接音频源节点与分析器节点
- 分析器节点连接到输出设备
- 绘制 canvas 画布


    let isInit = false   
    let dataArray, analyser
    audioEle.onplay = function () {
        //判断音频状态
        if (isInit) {
            return
        }
    
        // 初始化
        // 创建音频上下文
        const audCtx = new AudioContext()
        // 创建音频源节点
        const source = audCtx.createMediaElementSource(audioEle)
        // 创建分析器节点
        analyser = audCtx.createAnalyser()
        // 样本的窗口大小 analyser.fftSize 默认值：2048,该数值只能为2的n次幂
        analyser.fftSize = 512
    
        // 创建数组，用于接收分析器节点的分析数据
        // Uint8Array 类型化数组
        dataArray = new Uint8Array(analyser.frequencyBinCount)
    
        // 连接音频源节点与分析器节点
        source.connect(analyser)
        // 分析器节点连接到输出设备
        analyser.connect(audCtx.destination)
        isInit = true
    }
    
    // 把分析出的波形不断的绘制到canvas上
    function draw() {
        requestAnimationFrame(draw)
        // 清空画布
        const { width, height } = cvs
        ctx.clearRect(0, 0, width, height)
    
        // 判断音频是否初始化
        if (!isInit) {
            return
        }
        // 让分析器节点分析出数据到数组中
        analyser.getByteFrequencyData(dataArray)
        // console.log(dataArray);
    
        // 获取到数组长度   /2.5放大前半部分图形
        const len = dataArray.length / 2.5
        // 设置柱状条宽度  /2获得对称图形宽度
        const barWidth = width / len / 2
        ctx.fillStyle = '#e15252'
    
        // 循环数据进行绘制
        for (let i = 0; i < len; i++) {
            const data = dataArray[i];  // <256
            // 设置柱状条高度
            const barHeight = data / 255 * height
            // const x = i * barWidth
            // 计算横坐标
            const x1 = i * barWidth + width / 2
            const x2 = width / 2 - (i + 1) * barWidth
            // 计算纵坐标
            const y = height - barHeight
            // 绘制图形 宽度-2 拉开柱状条间距
            ctx.fillRect(x1, y, barWidth - 2, barHeight)
            ctx.fillRect(x2, y, barWidth - 2, barHeight)
        }
    }
    draw()

来看下最终效果图

![最终效果图](https://ox.zhongyuan.space/hexo/articleIllustrations/canvas/%E9%9F%B3%E9%A2%91%E6%9C%80%E7%BB%88%E6%95%88%E6%9E%9C%E5%9B%BE.jpg)


因为音频主要频率都在前半段，所以截取前半段并根据y轴镜像生成另一半canvas图

因为我觉得生成x轴的镜像图太丑了😂，没有生成x轴的镜像图，需要的可以自行添加，有疑问可以联系我😋