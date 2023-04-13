---
title: windows注册表自启项
author: 中元
img: https://ox.zhongyuan.space/hexo/banner/7.jpg
coverImg: https://ox.zhongyuan.space/hexo/banner/7.jpg
top: false
cover: false
toc: false
mathjax: false
summary: 如何通过修改Windows注册表项让程序在电脑开机时自动启动，或者删除程序的自动启动
tags: Windows
categories: Windows
abbrlink: 1493
date: 2022-02-01 06:35:30
password:
---

## Run 和 RunOnce 注册表项

## 简介

Windows 的 Run 和 RunOnce 注册表项可以让用户登陆系统时自动启动一些程序。
其中涉及到的注册表项如下：

- HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Run
- HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\RunOnce
- HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run
- HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\RunOnce
  在这四种项中添加的自启动程序的规则不一样：
- HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Run 表示任何账户每一次登陆到 Windows 系统都会自动启动在这个项下面注册的程序
- HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\RunOnce 表示任何账户下一次登陆到 Windows 系统会自动启动在这个项下面注册的程序，以后就不会自启了
- HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run 表示当前账户每一次登陆到 Windows 系统都会自动启动在这个项下面注册的程序
- HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\RunOnce 表示当前账户下一次登陆到 Windows 系统会自动启动在这个项下面注册的程序，以后就不会自启了
  一般来说
  在 HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run 项下注册自启动项就行了，

## 注册方法

### 一.打开注册表编辑器：按下 Win 键盘，输入`注册表`或者`regedit`然后 Enter:

### 二.将上面对应的注册表项粘贴到如下位置按 Enter：

### 三.添加自动启动项：

空白处右击，选择"新建"->"字符串值"：
取个名字：
复制你的程序的路径：按住 Shift 键右击程序，选择"复制文件地址"：
回到注册表编辑器，右击你取的程序的名字，然后选择修改：
在如下位置按 Ctrl+V 粘贴，然后点击确定，就行了：

> 也可以通过右击每一项的名字（键），选择删除某一个程序的自动启项，让程序开机时不自动启动，可以提升开机速度，减少内存消耗
