---
title: 个人博客搭建（三）
author: 中元
img: https://ox.zhongyuan.space/hexo/banner/img/0004.jpg
coverImg: https://ox.zhongyuan.space/hexo/banner/img/0004.jpg
top: false
cover: false
toc: true
mathjax: true
summary: Hexo+Github:个人博客网站搭建完全教程（三：优化）
tags: Hexo
categories: Hexo
abbrlink: 21996
date: 2022-03-05 14:06:30
password:
---

## 网站SEO优化

网站推广是一个比较烦人的事情，特别是对于专心搞技术的来说，可能就不是很擅长，那么怎么才能让别人知道我们网站呢？也就是说我们需要想办法让别人通过搜索就可以搜索到博客的内容，给我们带来自然流量，这就需要`seo`优化,让我们的站点变得对搜索引擎友好

`SEO`是由英文`Search Engine Optimization`缩写而来， 中文意译为“搜索引擎优化”。`SEO`是指通过站内优化比如网站结构调整、网站内容建设、网站代码优化等以及站外优化。

### 百度收录

首先要做的就是让各大搜索引擎收录你的站点，我们在刚建站的时候各个搜索引擎是没有收录我们网站的，在搜索引擎中输入`site:<域名>`查看站点是否被百度收录

#### 验证网站所有权

登录百度站长搜索资源平台：[http://zhanzhang.baidu.com](http://zhanzhang.baidu.com/)， 只要有百度旗下的账号就可以登录，登录成功之后在站点管理中点击[添加网站](http://zhanzhang.baidu.com/site/siteadd)然后输入你的站点地址。

注意，这里需要输入我们自己购买的域名,不能使用`xxx.github.io`之类域名.因为`github`是不允许百度的`spider`（蜘蛛）爬取`github`上的内容的，所以如果想让你的站点被百度收录，只能使用自己购买的域名

在填完网址选择完网站的类型之后需要验证网站的所有权，验证网站所有权的方式有三种：

- 文件验证
- `html`标签验证
- `CNAME`解析验证

其实使用哪一种方式都可以，都是比较简单的。

但是一定要注意，使用文件验证文件存放的位置需要放在`sourc`文件夹下，如果是`html`文件那么`hexo`就会将其编译，所以必须要在`html`头部加上的`layout:false`，这样就不会被`hexo`编译。（如果验证文件是`txt`格式的就不需要）

#### 生成网站地图

我们需要使用`npm`自动生成网站的`sitemap`，然后将生成的`sitemap`提交到百度和其他搜索引擎

#### 安装sitemap插件

```
npm install hexo-generator-sitemap --save     
npm install hexo-generator-baidu-sitemap --save
```

#### 修改博客配置文件

在根目录配置文件`.yml`中修改`url`为你的站点地址

```
# URL
## If your site is put in a subdirectory, set url as 'http://yoursite.com/child' and root as '/child/'
# url: https://shw2018.github.io/
url: https://sunhwee.com
root: /
permalink: :year/:month/:day/:title/
permalink_defaults:
```

执行完`hexo g`命令之后就会在网站根目录生成`sitemap.xml`文件和`baidusitemap.xml文件`，可以通过：https://sunhwee.com/baidusitemap.xml, 查看该文件是否生成，其中`sitemap.xml`文件是搜索引擎通用的文件，`baidusitemap.xml`是百度专用的`sitemap`文件。

#### 向百度提交链接

然后我们就可以将我们生成的`sitemap`文件提交给百度，还是在百度站长平台，找到链接提交，有两种提交方式，自动提交和手动提交，自动提交又分为主动推送、自动推送和`sitemap`

从效率上来说：

主动推送>自动推送>sitemap

### 优化url

```
seo`搜索引擎优化认为，网站的最佳结构是**用户从首页点击三次就可以到达任何一个页面**，但是我们使用`hexo`编译的站点打开文章的`url`是：`sitename/year/mounth/day/title`四层的结构，这样的`url`结构很不利于`seo`，爬虫就会经常爬不到我们的文章，于是，我们需要优化一下网站文章`url
```

方案一：

可以将`url`直接改成`sitename/title`的形式，并且`title`最好是用英文，在根目录的配置文件下修改`permalink`如下：

```
url: https://sunhwee.com
root: /
permalink: :title.html
permalink_defaults:
```

方案二：

使用插件优化`url`

插件`hexo-abbrlink`实现了这个功能，它将原来的`URL`地址重新进行了进制转换和再编码。

安装`hexo-abbrlink`。

`npm install hexo-abbrlink --save`

配置博客根目录下的_config.yml文件。

```
# permalink: :title/
permalink: archives/:abbrlink.html
abbrlink:
  alg: crc32  # 算法：crc16(default) and crc32
  rep: hex    # 进制：dec(default) and hex
```

运行`hexo clean`和`hexo g`命令来重新生成文件看看，可以清楚的看到，`URL`结构成功变为了3层。

### 其他seo优化

`seo`优化应该说是一个收益延迟的行为，可能你做的优化短期内看不到什么效果，但是一定要坚持，`seo`优化也是有很深的可以研究的东西，从我们最初的网站设计，和最基础的标签的选择都有很大的关系，网站设计就如我们刚刚说的，要让用户点击三次可以到达网站的任何一个页面，要增加高质量的外链，增加相关推荐（比如说我们经常见到右侧本站的最高阅读的排名列表），然后就是给每一个页面加上`keyword`和描述

在代码中，我们应该写出能让浏览器识别的语义化`HTML`，这样有助于爬虫抓取更多的有效信息：爬虫依赖于标签来确定上下文和各个关键字的权重；并且对外链设置`nofollow`标签，避免`spider`爬着爬着就爬出去了（减少网站的跳出率），并且我们要尽量在一些比较大的网站增加我们站点的曝光率，因为`spider`会经常访问大站，比如我们在掘金等技术社区发表文章中带有我们的站点，这样`spider`是很有可能爬到我们中的站点的，so....

- 网站**外链**的推广度、数量和质量
- 网站的**内链**足够强大
- 网站的**原创**质量
- 网站的**年龄**时间
- 网站的**更新频率**（更新次数越多越好）
- 网站的**服务器**
- 网站的**流量**：流量越高网站的权重越高
- 网站的**关键词排名**：关键词排名越靠前，网站的权重越高
- 网站的**收录**数量：网站百度收录数量越多，网站百度权重越高
- 网站的浏览量及深度：**用户体验**越好，网站的百度权重越高

### 优化图片加载

`issue`问题：
优化网站加载逻辑问题：图片最后加载，加入图片懒加载方法

hexo-lazyload-image的作用原理是讲你博客里面img标签的src属性替换为一个loading image，把真实的图片地址放在data-origin属性下面。然后当你的网页翻到那张图片时（也就是图片在窗口中完全可见时），他会有一段js用data-origin的内容替换src，打到懒加载的目的。

一般情况下懒加载和gallery插件会发生冲突，比如按照我上面所说，最终结果就会变成，可能只有第一张图片在gallery中打开是原图，右翻左翻都会是那张loading image，需要你掌握js，可以修改matery.js里面的内容，甚至可能换一个gallery，比如photosiwpe之类的

解决方法：修改`/themes/matery/source/js`中的`matery.js`文件

第103行：

```
$('#articleContent, #myGallery').lightGallery({
    selector: '.img-item',
    // 启用字幕
    subHtmlSelectorRelative: true,
    showThumbByDefault: false   //这句加上
});
```

后面加上：

```
$(document).find('img[data-original]').each(function(){
    $(this).parent().attr("href", $(this).attr("data-original"));
});
```

再装个插件，https://github.com/Troy-Yang/hexo-lazyload-image
在博客根目录配置.yml文件加入对应字段，如下：

```
# lazyload configuration  2019.08.23
lazyload:
  enable: true 
  onlypost: false
  loadingImg:     # eg ./images/loading.gif
```

好了，这样实现了博客网站的图片懒加载。

### Gulp实现代码压缩

`Gulp`实现代码压缩，以提升网页加载速度。

首先我们需要安装Gulp插件和5个功能模块，依次运行下面的两条命令。

```
npm install gulp -g  #安装gulp
# 安装功能模块
npm install gulp-htmlclean gulp-htmlmin gulp-minify-css gulp-uglify gulp-imagemin --save
# 额外的功能模块
npm install gulp-debug gulp-clean-css gulp-changed gulp-if gulp-plumber gulp-babel babel-preset-es2015 del --save
```

接下来在博客的根目录下新建gulpfile.js文件，并复制下面的内容到文件中。

```
var gulp = require("gulp");
var debug = require("gulp-debug");
var cleancss = require("gulp-clean-css"); //css压缩组件
var uglify = require("gulp-uglify"); //js压缩组件
var htmlmin = require("gulp-htmlmin"); //html压缩组件
var htmlclean = require("gulp-htmlclean"); //html清理组件
var imagemin = require("gulp-imagemin"); //图片压缩组件
var changed = require("gulp-changed"); //文件更改校验组件
var gulpif = require("gulp-if"); //任务 帮助调用组件
var plumber = require("gulp-plumber"); //容错组件（发生错误不跳出任务，并报出错误内容）
var isScriptAll = true; //是否处理所有文件，(true|处理所有文件)(false|只处理有更改的文件)
var isDebug = true; //是否调试显示 编译通过的文件
var gulpBabel = require("gulp-babel");
var es2015Preset = require("babel-preset-es2015");
var del = require("del");
var Hexo = require("hexo");
var hexo = new Hexo(process.cwd(), {}); // 初始化一个hexo对象

// 清除public文件夹
gulp.task("clean", function() {
  return del(["public/**/*"]);
});

// 下面几个跟hexo有关的操作，主要通过hexo.call()去执行，注意return
// 创建静态页面 （等同 hexo generate）
gulp.task("generate", function() {
  return hexo.init().then(function() {
    return hexo
      .call("generate", {
        watch: false
      })
      .then(function() {
        return hexo.exit();
      })
      .catch(function(err) {
        return hexo.exit(err);
      });
  });
});

// 启动Hexo服务器
gulp.task("server", function() {
  return hexo
    .init()
    .then(function() {
      return hexo.call("server", {});
    })
    .catch(function(err) {
      console.log(err);
    });
});

// 部署到服务器
gulp.task("deploy", function() {
  return hexo.init().then(function() {
    return hexo
      .call("deploy", {
        watch: false
      })
      .then(function() {
        return hexo.exit();
      })
      .catch(function(err) {
        return hexo.exit(err);
      });
  });
});

// 压缩public目录下的js文件
gulp.task("compressJs", function() {
  return gulp
    .src(["./public/**/*.js", "!./public/libs/**"]) //排除的js
    .pipe(gulpif(!isScriptAll, changed("./public")))
    .pipe(gulpif(isDebug, debug({ title: "Compress JS:" })))
    .pipe(plumber())
    .pipe(
      gulpBabel({
        presets: [es2015Preset] // es5检查机制
      })
    )
    .pipe(uglify()) //调用压缩组件方法uglify(),对合并的文件进行压缩
    .pipe(gulp.dest("./public")); //输出到目标目录
});

// 压缩public目录下的css文件
gulp.task("compressCss", function() {
  var option = {
    rebase: false,
    //advanced: true,               //类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
    compatibility: "ie7" //保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
    //keepBreaks: true,             //类型：Boolean 默认：false [是否保留换行]
    //keepSpecialComments: '*'      //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
  };
  return gulp
    .src(["./public/**/*.css", "!./public/**/*.min.css"]) //排除的css
    .pipe(gulpif(!isScriptAll, changed("./public")))
    .pipe(gulpif(isDebug, debug({ title: "Compress CSS:" })))
    .pipe(plumber())
    .pipe(cleancss(option))
    .pipe(gulp.dest("./public"));
});

// 压缩public目录下的html文件
gulp.task("compressHtml", function() {
  var cleanOptions = {
    protect: /<\!--%fooTemplate\b.*?%-->/g, //忽略处理
    unprotect: /<script [^>]*\btype="text\/x-handlebars-template"[\s\S]+?<\/script>/gi //特殊处理
  };
  var minOption = {
    collapseWhitespace: true, //压缩HTML
    collapseBooleanAttributes: true, //省略布尔属性的值  <input checked="true"/> ==> <input />
    removeEmptyAttributes: true, //删除所有空格作属性值    <input id="" /> ==> <input />
    removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
    removeComments: true, //清除HTML注释
    minifyJS: true, //压缩页面JS
    minifyCSS: true, //压缩页面CSS
    minifyURLs: true //替换页面URL
  };
  return gulp
    .src("./public/**/*.html")
    .pipe(gulpif(isDebug, debug({ title: "Compress HTML:" })))
    .pipe(plumber())
    .pipe(htmlclean(cleanOptions))
    .pipe(htmlmin(minOption))
    .pipe(gulp.dest("./public"));
});

// 压缩 public/uploads 目录内图片
gulp.task("compressImage", function() {
  var option = {
    optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
    progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
    interlaced: false, //类型：Boolean 默认：false 隔行扫描gif进行渲染
    multipass: false //类型：Boolean 默认：false 多次优化svg直到完全优化
  };
  return gulp
    .src("./public/medias/**/*.*")
    .pipe(gulpif(!isScriptAll, changed("./public/medias")))
    .pipe(gulpif(isDebug, debug({ title: "Compress Images:" })))
    .pipe(plumber())
    .pipe(imagemin(option))
    .pipe(gulp.dest("./public"));
});
// 执行顺序： 清除public目录 -> 产生原始博客内容 -> 执行压缩混淆 -> 部署到服务器
gulp.task(
  "build",
  gulp.series(
    "clean",
    "generate",
    "compressHtml",
    "compressCss",
    "compressJs",
    "compressImage",
    gulp.parallel("deploy")
  )
);

// 默认任务
gulp.task(
  "default",
  gulp.series(
    "clean",
    "generate",
    gulp.parallel("compressHtml", "compressCss", "compressImage", "compressJs")
  )
);
//Gulp4最大的一个改变就是gulp.task函数现在只支持两个参数，分别是任务名和运行任务的函数
```

最后 `hexo clean` && `hexo g` && `gulp` && `hexo d` 就可以了。

注意，很可能会运行到第三步，也就是运行`gulp`压缩命令时会报错：

那是因为gulp安装的本地版本和hexo自带的版本不对应导致，第三步gulp压缩可以用下面命令强制使用本地版本：

`node ./node_modules/gulp/bin/gulp.js`
