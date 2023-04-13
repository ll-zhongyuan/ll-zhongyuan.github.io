---
title: 个人博客搭建
author: 中元
img: https://ox.zhongyuan.space/hexo/banner/img/0004.jpg
coverImg: https://ox.zhongyuan.space/hexo/banner/img/0004.jpg
top: false
cover: false
toc: true
mathjax: true
summary: Hexo+Github:个人博客网站搭建完全教程
tags: Hexo
categories: Hexo
abbrlink: 21996
date: 2022-03-01 14:06:30
password:
---

## 阅读须知

这篇文章篇幅较长，主要针对新手，每一步很详细，所以可能会显得比较啰嗦，建议基础比较好小伙伴根据右侧目录选择自己感兴趣的部分跳着看

## 博客开源

本博客基于`Hexo`框架搭建，用到[hexo-theme-matery](https://github.com/shw2018/hexo-theme-matery)主题,并在此基础之上做了很多修改，修复了一些bug，增加了一些新的特性和功能

## 搭建

`hexo`的初级搭建还有部署到`github page`上，以及个人域名的绑定。

### Hexo搭建步骤

1. 安装`git`
2. 安装 `nodejs`
3. 安装`hexo`
4. `github`创建个人仓库
5. 生成`ssh`添加到`github`
6. 设置个人域名
7. 发布文章

#### 安装git

为了把本地的网页文件上传到`github`上面去，需要用到工具———[Git](https://git-scm.com/download)`Git`是目前世界上最先进的分布式版本控制系统，可以有效、高速的处理从很小到非常大的项目版本管理。`Git`非常强大，建议每个人都去了解一下。廖雪峰老师的`Git`教程写的非常好，大家可以看一下。[Git教程](https://www.liaoxuefeng.com/wiki/896043488029600)

**windows：**到`git`官网上下载`.exe`文件,[Download git](https://git-scm.com/download/win),安装选项还是全部默认，只不过最后一步添加路径时选择`Use Git from the Windows Command Prompt`，这样我们就可以直接在命令提示符里打开`git`了。

**linux：**对`linux`来说实在是太简单了，因为最早的`git`就是在`linux`上编写的，只需要一行代码

`sudo apt-get install git`

安装完成后在命令提示符中输入`git --version`来查看一下版本验证是否安装成功。

#### 安装nodejs

**windows：**下载稳定版或者最新版都可以[Node.js](http://nodejs.cn/download/)，安装选项全部默认，一路点击`Next`。
最后安装好之后，按`Win+R`打开命令提示符，输入`node -v`和`npm -v`，如果出现版本号，那么就安装成功了。

**linux：**命令行安装：

`sudo apt-get install nodejs `

`sudo apt-get install npm`

安装完后，检查是否安装成功，输入:

```bash
node -v
npm -v
```

#### 安装hexo

输入`npm install -g hexo-cli`安装`Hexo`

安装完后输入`hexo -v`验证是否安装成功。

初始化hexo

`hexo init 项目名称`

安装相关依赖

`npm install`

常用`hexo`相关指令

|     命令      |              说明              |
| :-----------: | :----------------------------: |
|   hexo init   |             初始化             |
|   hexo new    |            新建文章            |
| hexo publish  |            发表草稿            |
| hexo generate | 生成静态文件。可简写为 hexo g  |
|  hexo server  |  启动服务器。可简写为 hexo s   |
|  hexo deploy  |   部署网站。可简写为 hexo d    |
|  hexo render  |           渲染文件。           |
|  hexo clean   | 清除缓存文件和已生成的静态文件 |

#### 创建`github`个人仓库

新建一个项目仓库`New repository`，如下所示：

然后如下图所示，输入自己的项目名字，后面一定要加`.github.io`后缀，`README`初始化也要勾上。

要创建一个和你用户名相同的仓库，后面加.[http://github.io](http://github.io/)，只有这样，将来要部署到`GitHub page`的时候，才会被识别

#### 生成SSH添加到GitHub

生成`SSH`添加到`GitHub`，连接`Github`与本地。
右键打开`git bash`，然后输入下面命令：

`git config --global user.name "yourname" `

`git config --global user.email "youremail"`

这里的`yourname`输入你的`GitHub`用户名，`youremail`输入你`GitHub`的邮箱。这样`GitHub`才能知道你是不是对应它的账户。

可以用以下两条，检查一下你有没有输对

`git config user.name `

`git config user.email`

然后创建`SSH`,一路回车

`ssh`，简单来讲，就是一个秘钥，其中，`id_rsa`是你这台电脑的私人秘钥，不能给别人看的，`id_rsa.pub`是公共秘钥，可以随便给别人看。把这个公钥放在`GitHub`上，这样当你链接`GitHub`自己的账户时，它就会根据公钥匹配你的私钥，当能够相互匹配时，才能够顺利的通过`git`上传你的文件到`GitHub`上。

`ssh-keygen -t rsa -C "youremail"`

这个时候它会告诉你已经生成了`.ssh`的文件夹。在你的电脑中找到这个文件夹。或者`git bash`中输入

`cat ~/.ssh/id_rsa.pub`

将输出的内容复制到框中，点击确定保存。

打开[github](http://github.com/)，在头像下面点击`settings`，再点击`SSH and GPG keys`，新建一个`SSH`，名字随便取一个都可以，把你的`id_rsa.pub`里面的信息复制进去。

在`git bash`输入`ssh -T git@github.com`，如果如下图所示，出现你的用户名，那就成功了。

#### 将hexo部署到GitHub

这一步，我们就可以将`hexo`和`GitHub`关联起来，也就是将`hexo`生成的文章部署到`GitHub`上，打开博客根目录下的`_config.yml`文件，这是博客的配置文件，在这里你可以修改与博客配置相关的各种信息。

修改最后一行的配置：

```
deploy:
  type: git
  repository: 你的项目地址
  branch: master
```

`repository`修改为你自己的`github`项目地址即可，就是部署时，告诉工具，将生成网页通过`git`方式上传到你对应的链接仓库中。

这个时候需要先安装`deploy-git` ，也就是部署的命令,这样你才能用命令部署到`GitHub`。

`npm install hexo-deployer-git --save`