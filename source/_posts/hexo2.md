---
title: 个人博客搭建（二）
author: 中元
img: /medias/banner/img/0004.jpg
coverImg: /medias/banner/img/0004.jpg
top: false
cover: false
toc: false
mathjax: false
summary: Hexo+Github:个人博客网站搭建完全教程（二：定制）
tags: Hexo
categories: Hexo
abbrlink: 21996
date: 2022-03-03 14:06:30
password:
---

## 定制

我们要定制自己的博客的话，首先就要来了解一下`Hexo`博客的一些目录和文件的作用，以及如何平滑更换漂亮的主题模板并加入自己的定制源代码实现个性化定制

### 博客目录构成介绍

博客的目录结构如下：

```
- node_modules
- public
- scaffolds
- source
    - _data
    - _posts
    - about
    - archives
    - categories
    - friends
    - tags
- themes
```

`node_modules`是`node.js`各种库的目录，`public`是生成的网页文件目录，`scaffolds`里面就三个文件，存储着新文章和新页面的初始设置，`source`是我们最常用到的一个目录，里面存放着文章、各类页面、图像等文件，`themes`存放着主题文件，一般也用不到。

平时写文章只需要关注`source/_posts`这个文件夹就行了。

### hexo基本配置

在文件根目录下的`_config.yml`，就是整个`hexo`框架的配置文件了。可以在里面修改大部分的配置。详细可参考官方的[配置描述](https://hexo.io/zh-cn/docs/configuration)。

#### 网站

参数描述`title`网站标题`subtitle`网站副标题`description`网站描述`author`您的名字`language`网站使用的语言`timezone`网站时区。`Hexo` 默认使用您电脑的时区。时区列表。比如说：`America/New_York, Japan`, 和 `UTC` 。

其中，`description`主要用于`SEO`，告诉搜索引擎一个关于您站点的简单描述，通常建议在其中包含您网站的关键词。`author`参数用于主题显示文章的作者。

#### 网址

参数描述`url`网址`root`网站根目录 `permalink`文章的[永久链接](https://hexo.io/zh-cn/docs/permalinks)格式`permalink_defaults`永久链接中各部分的默认值

在这里，你需要把`url`改成你的**网站域名**。

`permalink`，也就是你生成某个文章时的那个链接格式。

比如我新建一个文章叫`temp.md`，那么这个时候他自动生成的地址就是`http://yoursite.com/2018/09/05/temp`。

以下是官方给出的示例，关于链接的变量还有很多，需要的可以去官网上查找 [永久链接](https://hexo.io/zh-cn/docs/permalinks) 。

`参数结果:year/:month/:day/:title/2019/08/10/hello-world :year-:month-:day-:title.html 2019-08-10-hello-world.html :category/:titlefoo/bar/hello-world`

再往下翻，中间这些都默认就好了。

`theme: landscap`

`theme`就是选择什么主题，也就是在`themes`这个文件夹下，在官网上有很多个主题，默认给你安装的是`lanscape`这个主题。当你需要更换主题时，在官网上下载，把主题的文件放在`themes`文件夹下，再修改这个主题参数就可以了。

#### Front-matter

`Front-matter` 是`md`文件最上方以 `---`分隔的区域，用于指定个别文件的变量，举例来说：

```
title: Hexo+Github博客搭建记录
date: 2019-08-10 21:44:44
```

下是预先定义的参数，您可在模板中使用这些参数值并加以利用。

参数描述`layout`布局`title`标题`date`建立日期`updated`更新日期`comments`开启文章的评论功能`tags`标签（不适用于分页）`categories`分类（不适用于分页）`permalink`覆盖文章网址

其中，分类和标签需要区别一下，分类具有顺序性和层次性，也就是说`Foo`，`Bar`不等于`Bar`，`Foo`；而标签没有顺序和层次。

```
---
title: Hexo博客搭建
date: 2022-03-05 21:44:44
author: 中元
img: /banner/7.jpg
coverImg: /banner/7.jpg
top: true
cover: true
toc: true
password: 
mathjax: true
summary: 这是你自定义的文章摘要内容，如果这个属性有值，文章卡片摘要就显示这段文字，否则程序会自动截取文章的部分内容作为摘要
tags:
- Hexo
- Github
- 博客
categories:
---
```

#### layout（布局）

当你每一次使用代码

`hexo new XXX`

它其实默认使用的是`post`这个布局，也就是在`source`文件夹下的`_post`里面。

`Hexo`有三种默认布局：`post`、`page`和`draft`，它们分别对应不同的路径，而您自定义的其他布局和`post`相同，都将储存到`source/_posts`文件夹。

而new这个命令其实是：

`hexo new [layout] <title>`

只不过这个`layout`默认是`post`罢了。

如果你想另起一页，那么可以使用

`hexo new page newpage`

系统会自动给你在`source`文件夹下创建一个`newpage`文件夹，以及`newpage`文件夹中的`index.md`，这样你访问的`newpage`对应的链接就是http://xxx.xxx/newpage

`draft`是草稿的意思，也就是你如果想写文章，又不希望被看到，那么可以

`hexo new draft newdraft`

这样会在`source/_draft`中新建一个`newdraft.md`文件，如果你的草稿文件写的过程中，想要预览一下，那么可以使用

`hexo server --draft`

在本地端口中开启服务预览。

如果你的草稿文件写完了，想要发表到`post`中，

`hexo publish draft newdraft`

就会自动把`newdraft.md`发送到`post`中。

### 更换主题

我们在了解`Hexo`博客文件基础之后，知道主题文件就放在`themes`文件下，那么我们就可以去Hexo官网下载喜欢的主题，复制进去然后修改参数即可。
网上大多数主题都是github排名第一的`Next`主题，但是我个人不是很喜欢，我在网上看到一个主题感觉还不错：[hexo-theme-matery](https://github.com/blinkfox/hexo-theme-matery)，地址在[传送门](https://github.com/blinkfox/hexo-theme-matery)。这个主题看着比较漂亮，并且响应式比较友好，点起来很舒服，功能也比较很多。

当然，人各有异，这个主题风格也不一定是你喜欢，那么你也可以跟着这教程类似的方法替换成你喜欢的就行了。

- 简单漂亮，文章内容美观易读
- [Material Design](https://material.io/) 设计
- 响应式设计，博客在桌面端、平板、手机等设备上均能很好的展现
- 首页轮播文章及每天动态切换 `Banner` 图片
- 瀑布流式的博客文章列表（文章无特色图片时会有 `24` 张漂亮的图片代替）
- 瀑布流式的博客文章列表（文章无特色图片时会有 `24` 张漂亮的图片代替）
- **词云**的标签页和**雷达图**的分类页
- 丰富的关于我页面（包括关于我、文章统计图、我的项目、我的技能、相册等）
- 可自定义的数据的友情链接页面
- 支持 `MathJax`
- `TOC` 目录
- 可设置复制文章内容时追加版权信息
- 可设置阅读文章时做密码验证
- 集成了[不蒜子统计](http://busuanzi.ibruce.info/)、谷歌分析（`Google Analytics`）和文章字数统计等功能
- 支持在首页的音乐播放和视频播放功能

他的介绍文档写得非常的详细，还有中英文两个版本。

首先先按照文档教程安装一遍主题，然后是可以正常打开的，如果你是一般使用的话，基本没啥问题了。不过有些地方有些地方可以根据你自己的习惯和喜好修改一下， 下面记录一下我这个博客修改了的一些地方。

首先为了新建文章方便，我们可以修改一下文章模板，建议将`/scaffolds/post.md`修改为如下代码：

```
---
title: {{ title }}
date: {{ date }}
author: 
img: 
coverImg: 
top: false
cover: false
toc: true
mathjax: false
password:
summary:
tags:
categories:
---
```

这样新建文章后 一些`Front-matter`参数不用你自己补充了，修改对应信息就可以了。

原来的主题没有`404`页面，我们加一个。首先在`/source/`目录下新建一个`404.md`，内容如下：

```
title: 404
date: 2019-08-5 16:41:10
type: "404"
layout: "404"
description: "Oops～，我崩溃了！找不到你想要的页面 :("
```

然后在`/themes/matery/layout/`目录下新建一个`404.ejs`文件，内容如下：

```
<style type="text/css">
    /* don't remove. */
    .about-cover {
        height: 75vh;
    }
</style>

<div class="bg-cover pd-header about-cover">
    <div class="container">
        <div class="row">
            <div class="col s10 offset-s1 m8 offset-m2 l8 offset-l2">
                <div class="brand">
                    <div class="title center-align">
                        404
                    </div>
                    <div class="description center-align">
                        <%= page.description %>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    // 每天切换 banner 图.  Switch banner image every day.
    $('.bg-cover').css('background-image', 'url(/medias/banner/' + new Date().getDay() + '.jpg)');
</script>
```

修改`/themes/matery/layout/_partial`中的`footer.ejs`，在最后加上：

```
<script language=javascript>
    function siteTime() {
        window.setTimeout("siteTime()", 1000);
        var seconds = 1000;
        var minutes = seconds * 60;
        var hours = minutes * 60;
        var days = hours * 24;
        var years = days * 365;
        var today = new Date();
        var todayYear = today.getFullYear();
        var todayMonth = today.getMonth() + 1;
        var todayDate = today.getDate();
        var todayHour = today.getHours();
        var todayMinute = today.getMinutes();
        var todaySecond = today.getSeconds();
        /* Date.UTC() -- 返回date对象距世界标准时间(UTC)1970年1月1日午夜之间的毫秒数(时间戳)
        year - 作为date对象的年份，为4位年份值
        month - 0-11之间的整数，做为date对象的月份
        day - 1-31之间的整数，做为date对象的天数
        hours - 0(午夜24点)-23之间的整数，做为date对象的小时数
        minutes - 0-59之间的整数，做为date对象的分钟数
        seconds - 0-59之间的整数，做为date对象的秒数
        microseconds - 0-999之间的整数，做为date对象的毫秒数 */
        var t1 = Date.UTC(2017, 09, 11, 00, 00, 00); //北京时间2018-2-13 00:00:00
        var t2 = Date.UTC(todayYear, todayMonth, todayDate, todayHour, todayMinute, todaySecond);
        var diff = t2 - t1;
        var diffYears = Math.floor(diff / years);
        var diffDays = Math.floor((diff / days) - diffYears * 365);
        var diffHours = Math.floor((diff - (diffYears * 365 + diffDays) * days) / hours);
        var diffMinutes = Math.floor((diff - (diffYears * 365 + diffDays) * days - diffHours * hours) / minutes);
        var diffSeconds = Math.floor((diff - (diffYears * 365 + diffDays) * days - diffHours * hours - diffMinutes * minutes) / seconds);
        document.getElementById("sitetime").innerHTML = "本站已运行 " +diffYears+" 年 "+diffDays + " 天 " + diffHours + " 小时 " + diffMinutes + " 分钟 " + diffSeconds + " 秒";
    }
    siteTime();
</script>
```

然后在合适的地方（比如`copyright`声明后面）加上下面的代码就行了：

`<span id="sitetime"></span>`

####  修改不蒜子初始化计数

因为不蒜子至今未开放注册，所以没办法在官网修改初始化，只能自己动手了。和上一条一样，我们在`/themes/matery/layout/_partial`里的`footer.ejs`文件最后加上：

```
<script>
    $(document).ready(function () {

        var int = setInterval(fixCount, 50);  // 50ms周期检测函数
        var pvcountOffset = 80000;  // 初始化首次数据
        var uvcountOffset = 20000;

        function fixCount() {
            if (document.getElementById("busuanzi_container_site_pv").style.display != "none") {
                $("#busuanzi_value_site_pv").html(parseInt($("#busuanzi_value_site_pv").html()) + pvcountOffset);
                clearInterval(int);
            }
            if ($("#busuanzi_container_site_pv").css("display") != "none") {
                $("#busuanzi_value_site_uv").html(parseInt($("#busuanzi_value_site_uv").html()) + uvcountOffset); // 加上初始数据 
                clearInterval(int); // 停止检测
            }
        }
    });
</script>
```

然后把上面几行有段代码：

```
<% if (theme.busuanziStatistics && theme.busuanziStatistics.totalTraffic) { %>
    <span id="busuanzi_container_site_pv">
        <i class="fa fa-heart-o"></i>
        本站总访问量 <span id="busuanzi_value_site_pv" class="white-color"></span>
    </span>
<% } %>
<% if (theme.busuanziStatistics && theme.busuanziStatistics.totalNumberOfvisitors) { %>
    <span id="busuanzi_container_site_uv">
        人次,&nbsp;访客数 <span id="busuanzi_value_site_uv" class="white-color"></span> 人.
    </span>
<% } %>
```

修改为：

```
<% if (theme.busuanziStatistics && theme.busuanziStatistics.totalTraffic) { %>
    <span id="busuanzi_container_site_pv" style='display:none'>
        <i class="fa fa-heart-o"></i>
        本站总访问量 <span id="busuanzi_value_site_pv" class="white-color"></span>
    </span>
<% } %>
<% if (theme.busuanziStatistics && theme.busuanziStatistics.totalNumberOfvisitors) { %>
    <span id="busuanzi_container_site_uv" style='display:none'>
        人次,&nbsp;访客数 <span id="busuanzi_value_site_uv" class="white-color"></span> 人.
    </span>
<% } %>
```

其实就是增加了两个`style='display:none'`而已。

####  添加动漫人物

`npm install --save hexo-helper-live2d`

`npm install live2d-widget-model-wanko`

这里的动漫模型可以改，只需要下载对应模型就行了，你可以官方仓库去看有哪些模型，下载你喜欢的就行。

在根目录配置文件中添加如下代码：

```
live2d:
    enable: true
    scriptFrom: local
    pluginRootPath: live2dw/
    pluginJsPath: lib/
    pluginModelPath: assets/
    tagMode: false
    log: false
    model:
        use: live2d-widget-model-shizuku
    display:
        position: right
        width: 150
        height: 300
    mobile:
        show: false
    react:
        opacity: 0.7
```

然后`hexo g`再`hexo s`就能预览出效果了，但是有个注意的地方，**这个动漫人物最好不要和不蒜子同时使用**，不然不蒜子会显示不出来。
