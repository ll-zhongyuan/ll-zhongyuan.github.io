---
title: JS设计模式之建造者模式
author: 中元
img: https://ox.zhongyuan.space/hexo/banner/2.jpg
coverImg: https://ox.zhongyuan.space/hexo/banner/2.jpg
top: false
cover: false
toc: false
mathjax: false
summary: >-
  建造者模式（builder
  pattern）属于创建型模式的一种，提供一种创建复杂对象的方式。它将一个复杂的对象的构建与它的表示分离，使得同样的构建过程可以创建不同的表示。建造者模式是一步一步的创建一个复杂的对象，它允许用户只通过指定复杂的对象的类型和内容就可以构建它们，用户不需要指定内部的具体构造细节。
tags: JavaScript
categories: JavaScript
abbrlink: 1580
date: 2021-09-27 21:03:30
password:
---

## 使用场景

日常生活中，比如组装电脑，生产汽车，都是有多个步骤来一步一步构建的，这时候就可以使用建造者模式来解决这个问题。下面以组装电脑为例子，比如组装游戏电脑，组装办公电脑。步骤都是一样的，最终都会出一个成品出来。


    function gameComputerBuilder() {
      this.buildMainboard = function() {
        console.log('游戏主板');
      };
      this.buildCPU = function() {
        console.log('游戏CPU');
      };
      this.buildHardDisk = function() {
        console.log('游戏硬盘');
      };
      this.getComputer = function() {
        return '游戏电脑';
      };
    }
    
    function officeComputerBuilder() {
      this.buildMainboard = function() {
        console.log('办公主板');
      };
      this.buildCPU = function() {
        console.log('办公CPU');
      };
      this.buildHardDisk = function() {
        console.log('办公硬盘');
      };
      this.getComputer = function() {
        return '办公电脑';
      };
    }
    
    function Operator() {
      this.startBuild = function(builder) {
        builder.buildMainboard();
        builder.buildCPU();
        builder.buildHardDisk();
        return builder.getComputer();
      };
    }
    
    const op = new Operator();
    const gameComputer = new gameComputerBuilder();
    const officeComputer = new officeComputerBuilder();
    const gc = op.startBuild(gameComputer);
    console.log(gc)
    const oc = op.startBuild(officeComputer);{}
    console.log(oc)
