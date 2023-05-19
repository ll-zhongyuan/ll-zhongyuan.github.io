---
title: 个人图床
author: 中元
img: https://ox.zhongyuan.space/hexo/banner/10.jpg
coverImg: https://ox.zhongyuan.space/hexo/banner/10.jpg
top: true
cover: true
toc: true
mathjax: true
summary: 七牛云个人图床
tags: 博客
categories: 博客
abbrlink: 2
date: 2023-03-15 14:06:30
password:
---

### 什么是图床

图床一般是指储存图片的服务器，有国内和国外之分。国外的图床由于有空间距离等因素决定访问速度很慢影响图片显示速度。国内也分为单线空间、多线空间和cdn加速三种。

个人图床其实是互联网中存储图片的空间，作为一个人的云端图片链接

### 为什么要图床

 大部分人写博客都用`markdown`，而`markdown`的图片是通过链接的方式进行传输的的，因此，如果是在本电脑上直接嵌入的文件没办法在网络上访问（除非你把电脑长时间开机并且开放~极其危险）。

 因此一个云图片链接就很有必要了，而网上直接找到的链接不具有可靠性，可能哪天就挂了（自己搭图床也不知道什么时候挂），因此搭建自己的图床还是很有必要的。

### 图床种类

#### 图床分类

- 公共图床
- 自建图床:云服务(如：七牛云、阿里云oss、腾讯云cos等)
- 自建图床:开源方案（如：Lychee、树洞外链）

目前图床可以分为两种，即公共图床和自建图床

公共图床也就是利用公共服务的图片上传接口，来提供图片外链的服务，如微博图床等

自建图床，也就是利用各大云服务商提供的存储空间或者自己在 VPS 上使用开源软件来搭建图床，存储图片，生成外链提供访问，比如七牛云、Lychee 开源自建图床方案。

目前自建图床方案有两种，一种是利用云服务商提供的存储服务来作为图床，通过 API 来管理图片，另一种是在 VPS 上安装开源的图片或文件管理程序，只要能提供外链，基本都可以作为图床来用。

#### 图床工具

虽然图床选择好，但是对普通用户来说，直接使用图床 API 很麻烦，我们可以借助一些工具方便的上传图片，下面就根据 macOS、Windows、Web 分别推荐几款工具。

macOS：

- [iPic - Markdown 图床、文件上传工具](https://link.juejin.cn/?target=https%3A%2F%2Fitunes.apple.com%2Fcn%2Fapp%2Fid1101244278%3Fls%3D1%26mt%3D12)
- [MWeb](https://link.juejin.cn/?target=https%3A%2F%2Fzh.mweb.im%2F)（Markdown 写作工具，也支持上传图片）

Windows：

- [MPic-图床神器](https://link.juejin.cn/?target=http%3A%2F%2Fmpic.lzhaofu.cn%2F)

Web：

- 比如「极简图床」插件、「微博图床」等等

### 七牛云图床

关于七牛云的介绍：七牛是一个云存储服务商，注册并实名认证之后，你将免费享有 10GB 存储空间，每月 10GB 下载流量、100 万次 GET 请求、 10 万次 PUT/DELETE 请求。七牛的定位不是像百度云一样的网盘 ，也不是同坚果云一般的同步云 ，而是 CDN，让你在浏览网页的时候最快的接收到页面中的图片、音频等文件，所以非常适合个人、企业用户用来储存站点资源。对于个人博主来说，你可以把博客中的图片、音频、视频等媒体上传到七牛，在博客中引用；也可以将站点需要加载的 CSS、JS 等文件上传到七牛，以加速网站。

- 注册七牛云并实名认证

- 注册完成后打开控制管理台>对象存储

- 新建一个公开的空间

  ![新建空间](https://ox.zhongyuan.space/hexo/articleIllustrations/drawing-bed/3.jpg)

- 国内常用存储区域对应的编码：
  - 华东：z0
  - 华北：z1
  - 华南：z2

- 秘钥配置

  鼠标移入 控制台的头像 显示下拉列表 找到 秘钥管理

  ![密钥配置](https://ox.zhongyuan.space/hexo/articleIllustrations/drawing-bed/4.jpg)

​		注意这里的`accessKey` 和 `secretKey`

- 存储空间域名，这里七牛云提供了`30天`的测试域名，使用测试域名需注意时间

  ![存储空间域名](https://ox.zhongyuan.space/hexo/articleIllustrations/drawing-bed/6.jpg)

如果有自己的域名，也可以使用自己的，文章末尾有使用个人域名的相关配置方法

### Typora 

- 下载Typora，使用**PicGo-Core**

- 点击图像设置，进行一些简单的配置，配置如下：

  ![typora配置](https://ox.zhongyuan.space/hexo/articleIllustrations/drawing-bed/1.jpg)

- 点击下载**PicGo-Core**

  ![下载picgo-core](https://ox.zhongyuan.space/hexo/articleIllustrations/drawing-bed/2.jpg)

- 然后打开配置文件

  ```json
  {
    "picBed": {
      "uploader": "qiniu",
      "qiniu": {
        "accessKey": "",
        "secretKey": "",
        "bucket": "",
        "url": "",
        "area":  "",
        "options": "",
        "path": ""
      }
    },
    "picgoPlugins": {}
  }
  ```

  配置：

  - **accessKey** 秘钥
  - **secretKey** 秘钥
  - **bucket** 存储空间名称
  - **url** 存储空间地址
  - **area** 存储区域编号
  - **options** 网站后缀（选填）
  - **path** 自定义存储路径（选填）

然后使用**CV**大法，将对应配置填入

- 测试上传

  - 回到偏好设置

    ![验证上传](https://ox.zhongyuan.space/hexo/articleIllustrations/drawing-bed/7.jpg)  
  - 测试成功如下，如果没有，请检查配置文件是否保存，或者哪个步骤遗漏了

    ![测试成功](https://ox.zhongyuan.space/hexo/articleIllustrations/drawing-bed/8.jpg)

### 为七牛云配置个人域名

这里以腾讯云为例

- 首先将注册的域名进行备案（需提交资料到相关部门审核，此过程耗时较长，具体以管局审核为准）我的已经通过备案了，这里使用的是二级域名

- 找到七牛云[域名管理](https://portal.qiniu.com/cdn/domain)>添加域名

  ![添加域名](https://ox.zhongyuan.space/hexo/articleIllustrations/drawing-bed/10.jpg)

  这里没有ssl证书可以选择http（创建完成后在HTTPS`配置中开启`HTTPS`），然后选择创建

- 创建完成复制`CNAME`，使用cdn加速服务

  ![创建完成](https://ox.zhongyuan.space/hexo/articleIllustrations/drawing-bed/11.jpg)

- 然后返回腾讯云对域名进行解析

  ![域名解析](https://ox.zhongyuan.space/hexo/articleIllustrations/drawing-bed/9.jpg)

- 再返回七牛云对象存储 > 空间管理 > 点击创建的空间 > 文件管理 > 外链域名选择自己创建的域名。
