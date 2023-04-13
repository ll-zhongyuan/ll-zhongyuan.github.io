---
title: html完整语法学习
author: 中元
img: https://ox.zhongyuan.space/hexo/banner/8.jpg
coverImg: https://ox.zhongyuan.space/hexo/banner/8.jpg
top: false
cover: false
toc: true
mathjax: false
summary: >-
  超文本标记语言（英语：HyperText Markup Language，简称：HTML）是一种用于创建网页的标准标记语言。可以使用 HTML 来建立自己的
  WEB 站点，HTML 运行在浏览器上，由浏览器来解析。
tags: HTML
categories: HTML
abbrlink: 39652
date: 2022-02-22 15:49:30
password:
---

### 一个 html

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <!--meta  描述性标签，用来描述网站的一些信息-->
        <!--meta 标签一般用来做SEO-->
        <meta charset="UTF-8">
        <meta name="key" content="第一个网站，学html">
        <meta name="description" content="学习html">
        <title>第一个网站</title>
    </head>
    <body>
    Hello,World!
    </body>
    </html>

### 基本标签

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>基本标签学习</title>
    </head>
    <body>
    <!--标题标签-->
    <h1>一级标签</h1>
    <h2>二级标签</h2>
    <h3>三级标签</h3>
    <h4>四级标签</h4>
    <h5>五级标签</h5>
    <h6>六级标签</h6>

    <!--段落标签  将文字分为一个个段落-->
    <p>两只老虎，两只老虎</p>
    <P>跑得快，跑得快</P>
    <P>一只没有眼睛</P>
    <P>一只没有尾巴</P>
    <P>真奇怪！真奇怪！</P>

    <!--水平线标签-->
    <hr/>

    <!--换行标签  只是换了一行，但是还是一段-->
    两只老虎，两只老虎<br/>
    跑得快，跑得快<br/>
    一只没有眼睛<br/>
    一只没有尾巴<br/>
    真奇怪！真奇怪<br/>

    <!--粗体，斜体-->
    <h1>字体样式标签</h1>
    粗体：<strong>i love you</strong>  <br/>
    斜体：<em>i love you</em>  <br/>
    粗体：<B>i love you</B>    <br/>
    斜体：<I>i love you</I>    <br/>
    <hr/>
    <!--特殊符号-->
    空       格；  <br/>
    <!--&nbsp;代表一个空格-->
    空&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格    <br/>
    <!--&gt; 代表大于号  &lt;代表小于号-->
    &gt;
    &lt;    <br/>
    <!--版权符号-->
    &copy;
    </body>
    </html>

### 图片标签

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>图片标签</title>
    </head>
    <body>
    <!--
    src:图片的地址
    绝对地址：使用盘符找到的文件   D:\代码\HTML\resources\image\2.png
    相对地址：相对于当前项目的文件  ../resources/image/2.png
    ../返回上一级目录
    alt ： 如果src路径下的文件未找到，就用这里名的内容替代
    title  ： 将鼠标放置在这个图片上面会显示title里卖弄的内容
    width  : 图片显示的宽度
    height  ： 图片显示的高度
    -->
    <img src="../resources/image/2.png" alt="桌面壁纸" title="悬停文字" width="255" height="255">
    <!--从这里可以直接跳转到下面这个链接的down这个锚标记处-->
    <a href="4.链接标签.html#down">跳转</a>
    </body>
    </html>

### 链接标签

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>链接标签</title>
    </head>
    <body>
    <!--使用a标签里面的name属性设置锚链接标记-->
    <a name="top">顶部</a>
    <br/>

    <!--
    a标签：
    href  ： 必填，表示要跳转到哪里去
    target  : 表示窗口在哪里打开
                _blank  ： 在新标签中打开
                _self   : 在自己的网页中打开，属于默认设置

    a标签中间填写链接的文本或图片
    -->
    <a href="1.我的第一个html.html" target="_blank">点击我跳转到页面一</a>
    <a href="https://www.baidu.com" target="_self">点击我跳转到百度</a>
    <br/>

    <a href="1.我的第一个html.html">
        <img src="../resources/image/2.png" alt="桌面壁纸" title="悬停文字" width="255" height="255">
    </a>

    <p>
        <a href="1.我的第一个html.html">
            <img src="../resources/image/2.png" alt="桌面壁纸" title="悬停文字" width="255" height="255">
        </a>
    </p>
    <p>
        <a href="1.我的第一个html.html">
            <img src="../resources/image/2.png" alt="桌面壁纸" title="悬停文字" width="255" height="255">
        </a>
    </p>
    <p>
        <a href="1.我的第一个html.html">
            <img src="../resources/image/2.png" alt="桌面壁纸" title="悬停文字" width="255" height="255">
        </a>
    </p>
    <p>
        <a href="1.我的第一个html.html">
            <img src="../resources/image/2.png" alt="桌面壁纸" title="悬停文字" width="255" height="255">
        </a>
    </p>
    <p>
        <a href="1.我的第一个html.html">
            <img src="../resources/image/2.png" alt="桌面壁纸" title="悬停文字" width="255" height="255">
        </a>
    </p>
    <p>
        <a href="1.我的第一个html.html">
            <img src="../resources/image/2.png" alt="桌面壁纸" title="悬停文字" width="255" height="255">
        </a>
    </p>

    <!--
    锚链接 ：
        1.需要一个锚标记
        2.跳转到锚标记
    使用方法为 #+锚链接的标记名
    可以实现页面内的跳转，，也可从一个页面直接跳转到锚链接的标记位置
    -->
    <a href="#top">回到顶部</a>
    <a name="down">down</a>
    <!--
    功能性链接：
        mailto:邮箱地址（可以将内容发送到这个邮箱里面）
      QQL链接
    -->
    <a href="mailto:1713791837@qq.com">点击联系我</a>

    <a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=1713791837&site=qq&menu=yes">
        <img border="0" src="http://wpa.qq.com/pa?p=2:1713791837:52" alt="你好" title="你好"/>
    </a>
    </body>
    </html>

### 列表

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>列表</title>
    </head>
    <body>
    <!--有序列表 ： Orderly list   显示出有顺序的结构，前边用数字显示顺序
    应用范围：试卷，答题卡...
    -->
    <ol>
        <li>Java</li>
        <li>Python</li>
        <li>汇编</li>
        <li>前端</li>
        <li>编译原理</li>
    </ol>
    <!--无序列表   显示出没有顺序的结构，前边用黑点显示
    应用范围：导航，侧边栏...
    -->
    <ul>
        <li>Java</li>
        <li>Python</li>
        <li>汇编</li>
        <li>前端</li>
        <li>编译原理</li>
    </ul>

    <!--自定义列表
    dl : 列表标签
    dt : 列表名称
    dd : 列表内容
    -->
    <dl>
        <dt>学科</dt>
        <dd>java</dd>
        <dd>linux</dd>
        <dd>spring</dd>
        <dd>c</dd>
        <dt>位置</dt>
        <dd>宁夏</dd>
        <dd>西安</dd>
        <dd>甘肃</dd>
    </dl>
    </body>
    </html>

### 表格

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>表格</title>
    </head>
    <body>

    <!--
    表格 ： table
    行 ： tr
    列 ： td
    colspan  : 合并多少列为一列
    rowspan  : 合并多少行为一行
    border : 设置边框宽度
    -->
    <table border="1px">
        <tr>
            <td colspan="3">&nbsp;&nbsp;&nbsp;&nbsp;学生成绩</td>
        </tr>
        <tr>
            <td rowspan="2">小破孩</td>
            <td>语文</td>
            <td>100</td>
        </tr>
        <tr>
            <td>数学</td>
            <td>100</td>
        </tr>
        <tr>
            <td rowspan="2">憨憨</td>
            <td>语文</td>
            <td>100</td>
        </tr>
        <tr>
            <td>数学</td>
            <td>100</td>
        </tr>
    </table>
    </body>
    </html>

### 视频与音频

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>媒体元素</title>
    </head>
    <body>
    <!--视频和音频
    controls  :  控制条
    autoplay  :  设置视频自动播放
    -->
    <video src="../resources/video/2.qlv" controls autoplay></video>
    <br/>
    <audio src="../resources/audio/ai.mp3" controls></audio>
    </body>
    </html>

### 页面结构

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>页面结构</title>
    </head>
    <body>
        <header>
            <h1>网页头部</h1>
        </header>
        <section>
            <h1>网页主体</h1>
        </section>
        <footer>
            <h1>网页脚部</h1>
        </footer>
    </body>
    </html>

### 内联框架

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>内联框架</title>
    </head>
    <body>
    <!--
    iframe : 可以将src里面的网页内容嵌套在本网页内
    src  : 链接地址
    w-h : 宽和高
    还可以使用name属性：
            将a标签里面的链接内容放置到iframe里面
    -->
    <iframe src="" name="hello" width="855px" height="512px"></iframe>

    <a href="https://www.bilibili.com/" target="hello">点击跳转</a>
    </body>
    </html>
    ```

    ### form表单

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>表单</title>
    </head>
    <body>
    <!--表单form
    action : 提交到哪个位置，可以是网站也可以是请求处理地址
    method : 提交方式，，有post与get
            get方式提交，数据可以在url里面看到，不安全，但高效
            post方式提交：比较安全，能够提交数据量较大的文件
    -->
    <h1>注册</h1>
    <form action="1.我的第一个html.html" method="get">
        <!--文本输入框  ： type="text"
         value="你好帅"   默认初始值
         maxlength="8"   最多能输入几个字符
         size="30"       文本框的长度
         readonly  只读
         placeholder  提示的默认信息 只能用在输入框上
         required  非空判断，表示此字段必须填写  只能用在输入框上
        -->
        <p>名字：<input type="text" name="userName" placeholder="请输入用户名" required> </p>
        <!--密码框 ： type="password"
         hidden 隐藏，将这个框用户看不到，但是却是存在的，可以放置默认值
         -->
        <p>密码：<input type="password" name="pwd" hidden value="123456"> </p>
        <p>性别：
            <!--单选框:
            type="radio"
            value:单选框的值
            name : 表示组，name值一样则表示为一组数据，不能同时选择两个
            disabled : 禁用，禁止选择男性
            -->
            <input type="radio" value="boy" name="sex" disabled>男
            <input type="radio" value="girl" name="sex">女
        </p>
        <p>
            <!--多选框
             type="checkbox"
             value:多选框的值
             name : 表示组，name值一样则表示为一组数据
            -->
            <input type="checkbox" value="sleep" name="hobby">睡觉
            <!--checked  : 默认选中-->
            <input type="checkbox" value="code" name="hobby" checked>敲代码
            <input type="checkbox" value="chat" name="hobby">聊天
            <input type="checkbox" value="game" name="hobby">游戏
        </p>

        <p>
            <!--按钮
            type="button"
            name ： 按钮名称
            value : 按钮上显示的内容
             -->
            <input type="button" name="btn1" value="点击按钮">
            <!--图片按钮  相当于提交按钮-->
            <input type="image" src="../resources/image/2.png" width="50px" height="50px">
        </p>

        <p>国家：
            <!--下拉框
            使用select标签
            name ：列表的名称，后台可以获得列表名称
            value ： 传到后端的值
            -->
            <select name="country">
                <option value="china">中国</option>
                <option value="usa">美国</option>
                <!--selected  表示默认选择法国-->
                <option value="fa" selected>法国</option>
                <option value="ying">英国</option>
            </select>
        </p>
        <p>反馈：
            <!--文本域
            textarea标签
            cols  : 默认显示几列
            rows  : 默认显示几行
            -->
            <textarea name="textarea" cols="30" rows="10">默认文本</textarea>
        </p>
        <p>
            <!--文件域-->
            <input type="file" name="files">
        </p>
        <p>
            <!--邮箱验证  输入的值必须添加@并且前后都有值-->
            邮箱：<input type="email" name="email">
        </p>
        <p>
            <!--url验证  输入的值必须是一个网址-->
            url:<input type="url" name="url">
        </p>
        <p>
            <!--数字验证  输入的值必须大于0小于100并且是10的倍数
            max  ： 最大值
            min  ： 最小值
            step  ： 步长，每次加几
            -->
            数字:<input type="number" name="num" max="100" min="0" step="10">
        </p>
        <p>
            <!--滑块
            range 标签
            可以在参数中获取得到的多少数值
            -->
            滑块：<input type="range" name="voice" min="0" max="100" step="2">
        </p>
        <p>
            <!--搜索框-->
            搜索:<input type="search" name="search">
        </p>
        <p>
            <!--增强鼠标可用性
            label标签
            也就是在点击label这个标签里面的内容时，会自动将光标锁定到输入框id为for属性里面的内容
            -->
            <label for="work">你点我逝世：</label>
            <input type="text" id="work">
        </p>
        <p>
            <!--pattern  正则表达式，这里输入的东西必须满足pattern的规则-->
            自定义邮箱：
            <input type="text" name="diyEmail"
                   pattern="^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$">
        </p>
        <p>
            <!--提交按钮 ： type="submit" -->
            <input type="submit">
            <!--重置按钮 ： type="reset"-->
            <input type="reset">
        </p>
    </form>
    </body>
    </html>
