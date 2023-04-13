---
title: Linux基础学习
author: 中元
img: https://ox.zhongyuan.space/hexo/banner/img/0009.jpg
coverImg: https://ox.zhongyuan.space/hexo/banner/img/0009.jpg
top: true
cover: true
toc: true
mathjax: true
summary: Linux基础学习
tags: Linux
categories: Linux
abbrlink: 43339
date: 2022-01-16 20:06:30
password:
---

# Linux 发行版

以软件包格式：
rpm：
Red Hat Enterprise Linux
CentOS
openSUSE
Fedora
deb：
Debian
Ubuntu
linux mint
安全测试系统：
kali

# 安装 centos

在虚拟机里创建 centos

选择语言，默认为英语

在此界面设置系统相关选项，时区、软件、硬盘、网络等

设置时区

选择 minimal 安装

硬盘分区

开始安装并设置 root 密码，创建普通用户

登录系统

# history 记录命令执行时间

]$ export HISTTIMEFORMAT='%F %T '
注：在当前登录 shell 中生效
编辑.bashrc 文件，在文件中加入会永久有效

# Linux 哲学思想

1：一切皆文件
硬件也是文件
2：由众多功能单一的程序组成；一个程序只做一件事，并且做好；
组合小程序完成复杂任务；
3：尽量避免跟用户交互；
目标：易于以编程的方式实现自动化任务
4：使用文本文件保存配置信息

# Linux 常用命令：

    cat
    cat [OPTION]... [FILE]...
    date
    date [OPTION]... [+FORMAT]
    date [-u|--utc|--universal] [MMDDhhmm[[CC]YY][.ss]]
    ifconfig
    ifconfig [-v] [-a] [-s] [interface]
    ifconfig [-v] interface [aftype] options | address ...
    ls
    ls [OPTION]... [FILE]...

# Linux 文件目录

    Filesystem Hierarchy Standard
    /bin: 所有用户可用的基本命令程序文件；
    /sbin: 供系统管理工作使用的工具程序；
    /boot: 引导加载器必须用到的各静态文件：kernel，initramfs(initrd)，grub等；
    /dev: 存储特殊文件或设备文件；
    设备有两种类型：字符设备(线性设备)，块设备(随机设备)；
    /etc: 系统程序的配置文件，只能为静态文件；
    /home: 普通用户的家目录的集中位置；一般每个普通用户的家目录默认此目录下与用户同名的子目录，/home/USERNAME
    /lib: 为系统启动或根文件系统上的应用程序(/bin, /sbin)提供共享库，以及为内核提供内核模块
    libc.so.*: 动态链接的C库；
    ld*: 运行时链接器/加载器；
    modules: 用于存储内核模块的目录；
    /lib64: 64位系统特有的存放共享库的路径；
    /media: 便携式设备挂载点，cdrom，floppy等；
    /mnt: 其它文件系统的临时挂载点；
    /opt: 附加应用程序的安装位置；可选路径；
    /srv: 当前主机为服务提供的数据；
    /tmp: 为那些会产生临时文件的程序提供的用于存储临时文件的目录；
    /usr: User Hierarchy，全局共享的只读数据路径；
    bin
    sbin
    lib
    lib64
    include: C程序头文件
    share：命令手册页和自带文档等架构特有的文件的存储位置
    local：另一个层级目录
    X11R6: X-Window程序的安装位置
    src：程序源码文件的存储位置
    /usr/lcoal: Local Hierarchy，让系统管理员安装本地应用程序；
    /var: 存储常发生变化的数据的目录；
    /proc: 虚拟文件系统，用于为内核及进程存储其相关信息；它们多为内核参数；
    /sys: sysfs虚拟文件系统提供了一种比proc更为理想的访问内核数据的途径；
