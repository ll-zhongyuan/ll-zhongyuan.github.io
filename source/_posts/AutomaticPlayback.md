---
title: 音视频自动播放
author: 中元
img: https://ox.zhongyuan.space/hexo/featureimages/20.jpg
coverImg: https://ox.zhongyuan.space/hexo/featureimages/20.jpg
top: false
cover: false
toc: false
mathjax: false
summary: 音视频自动播放策略
tags: JavaScript
categories: JavaScript
abbrlink: 1
date: 2023-05-20 08:06:30
password:
---

前端音视频自动播放一直都是一个玄学问题

无论是 B 站还是抖音，都可以实现打开视频自动播放，但是在我写的页面中就不行

无论是使用`autoplay`还是 js 调用`play`方法都不能实现

后来了解到一个相关知识——浏览器自动播放策略
以谷歌为例
![自动播放策略](https://ox.zhongyuan.space/hexo/articleIllustrations/other/%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E7%AD%96%E7%95%A5.jpg)

也很容易理解，避免恶意广告之类的东西打扰到用户嘛

要实现浏览器自动播放也不是完全不允许
![自动播放前提条件](https://ox.zhongyuan.space/hexo/articleIllustrations/other/%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E5%89%8D%E6%8F%90%E6%9D%A1%E4%BB%B6.jpg)

这里提到一个叫做媒体参与度的东西
特意去查了相关资料
![媒体参与度](https://ox.zhongyuan.space/hexo/articleIllustrations/other/%E5%AA%92%E4%BD%93%E5%8F%82%E4%B8%8E%E5%BA%A60.jpg)

下面是我的媒体参与度指数
![](https://ox.zhongyuan.space/hexo/articleIllustrations/other/%E5%AA%92%E4%BD%93%E5%8F%82%E4%B8%8E%E5%BA%A6.jpg)

可以看到B站的指数是 0.88 而常用开发地址 localhost:52330 只有0.2

我也尝试寻找相关方法修改这个指数，结果很明显，这玩意儿是不可修改的

那只有退而求其次，这里提供两个解决方案

![解决方案](https://ox.zhongyuan.space/hexo/articleIllustrations/other/%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88.jpg)

方案一：引导用户进行交互操作，进而播放
这里是通过添加一个播放按钮来实现的

    <div>
        <video src="test.mp4" autoplay></video>
        <div class="modal">
            <button class="play">开始播放</button>
        </div>
    </div>
        <script>
            // 方案一：互动后播放
            const vdo = document.querySelector('video');
            const modal = document.querySelector('modal');
            const btn = document.querySelector('btn');
            async function palay() {
                try {
                    await vdo.play();
                    modal.style.display = 'none';
                    btn.removeEventListener('click', play);
                } catch (err) {
                    modal.style.display = 'flex';
                    btn.addEventListener('click', play);
                }
            }
            play()
        </script>

方案二：静音播放，根据条件判断是否打开声音

    <div>
        <video src="test.mp4" autoplay></video>
        <div class="modal">
            <button class="play">打开声音</button>
        </div>
    </div>
    <script>
        // 方案二：互动后出声
        const vdo = document.querySelector('video');
        const modal = document.querySelector('modal');
        const btn = document.querySelector('btn');
        function play(){
            vdo.muted = true ;  //静音
            vdo.play();
            const ctx = new AudioContext();
            const canAutoPlay = ctx.state === 'running';
            ctx.close();
            if(canAutoPlay){
                vdo.muted = false;
                modal.style.display = 'none';
                btn.removeEventListener('click',play);
            }else{
                modal.style.display = 'flex';
                btn.addEventListener('click',play);
            }
        }
        play()
        </script>

解释下方案二
这里用`AudioContext`来创建了一个音频上下文
通过判断`AudioContext.state`的值来判断当前状态
 *`AudioContext.state`* 有三个返回值

- suspended： audio 被阻塞了
- running：audio 正常运行
- closed：audio 被关闭了

详情可以查看
[mdn AudioContext](https://developer.mozilla.org/zh-CN/docs/Web/API/AudioContext)
[mdn AudioContext.state](https://developer.mozilla.org/zh-CN/docs/Web/API/AudioContext)