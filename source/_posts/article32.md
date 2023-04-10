---
title: Vue响应式原理
author: 中元
img: /medias/banner/1.jpg
coverImg: /medias/banner/1.jpg
top: false
cover: false
toc: false
mathjax: false
summary: Vue的响应式是如何实现的？
tags:
  - 前端
  - Vue
categories: Vue
abbrlink: 43846
date: 2023-02-01 18:16:30
password:
---

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/4/24/162f71d7977c8a3f~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

看过Vue官方文档的同学，对这张图应该已然相当熟悉了。

vue的响应式是如何实现的？

听过太多回答，通过`Object.defineProperty`，可是再详细的问时，对方浑然不知。

来看下面这段代码

    const Observer = function(data) {
      // 循环修改为每个属性添加get set
      for (let key in data) {
        defineReactive(data, key);
      }
    }
    
    const defineReactive = function(obj, key) {
      // 局部变量dep，用于get set内部调用
      const dep = new Dep();
      // 获取当前值
      let val = obj[key];
      Object.defineProperty(obj, key, {
        // 设置当前描述属性为可被循环
        enumerable: true,
        // 设置当前描述属性可被修改
        configurable: true,
        get() {
          console.log('in get');
          // 调用依赖收集器中的addSub，用于收集当前属性与Watcher中的依赖关系
          dep.depend();
          return val;
        },
        set(newVal) {
          if (newVal === val) {
            return;
          }
          val = newVal;
          // 当值发生变更时，通知依赖收集器，更新每个需要更新的Watcher，
          // 这里每个需要更新通过什么断定？dep.subs
          dep.notify();
        }
      });
    }
    
    const observe = function(data) {
      return new Observer(data);
    }
    
    const Vue = function(options) {
      const self = this;
      // 将data赋值给this._data，源码这部分用的Proxy所以我们用最简单的方式临时实现
      if (options && typeof options.data === 'function') {
        this._data = options.data.apply(this);
      }
      // 挂载函数
      this.mount = function() {
        new Watcher(self, self.render);
      }
      // 渲染函数
      this.render = function() {
        with(self) {
          _data.text;
        }
      }
      // 监听this._data
      observe(this._data);  
    }
    
    const Watcher = function(vm, fn) {
      const self = this;
      this.vm = vm;
      // 将当前Dep.target指向自己
      Dep.target = this;
      // 向Dep方法添加当前Wathcer
      this.addDep = function(dep) {
        dep.addSub(self);
      }
      // 更新方法，用于触发vm._render
      this.update = function() {
        console.log('in watcher update');
        fn();
      }
      // 这里会首次调用vm._render，从而触发text的get
      // 从而将当前的Wathcer与Dep关联起来
      this.value = fn();
      // 这里清空了Dep.target，为了防止notify触发时，不停的绑定Watcher与Dep，
      // 造成代码死循环
      Dep.target = null;
    }
    
    const Dep = function() {
      const self = this;
      // 收集目标
      this.target = null;
      // 存储收集器中需要通知的Watcher
      this.subs = [];
      // 当有目标时，绑定Dep与Wathcer的关系
      this.depend = function() {
        if (Dep.target) {
          // 这里其实可以直接写self.addSub(Dep.target)，
          // 没有这么写因为想还原源码的过程。
          Dep.target.addDep(self);
        }
      }
      // 为当前收集器添加Watcher
      this.addSub = function(watcher) {
        self.subs.push(watcher);
      }
      // 通知收集器中所的所有Wathcer，调用其update方法
      this.notify = function() {
        for (let i = 0; i < self.subs.length; i += 1) {
          self.subs[i].update();
        }
      }
    }
    
    const vue = new Vue({
      data() {
        return {
          text: 'hello world'
        };
      }
    })
    
    vue.mount(); // in get
    vue._data.text = '123'; 
    // in watcher update /n in get


这里用不到100行的代码，实现了一个简易的vue响应式。当然，这里如果不考虑期间的过程，我相信，40行代码之内可以搞定。但是我这里不想省略，为什么呢？我怕你把其中的过程自动忽略掉，怕别人问你相关东西的时候，明明自己看过了，却被怼的哑口无言。总之，我是为了你好，多喝热水。

#### Dep的作用是什么？

 `依赖收集器，这不是官方的名字蛤，我自己起的，为了好记。 `

用两个例子来看看依赖收集器的作用吧。

- 例子1，毫无意义的渲染是不是没必要？

        const vm = new Vue({
            data() {
                return {
                    text: 'hello world',
                    text2: 'hey',
                }
            }
        })

    当`vm.text2`的值发生变化时，会再次调用`render`，而`template`中却没有使用`text2`，所以这里处理`render`是不是毫无意义？

    针对这个例子还记得我们上面模拟实现的没，在`Vue`的`render`函数中，我们调用了本次渲染相关的值，所以，与渲染无关的值，并不会触发`get`，也就不会在依赖收集器中添加到监听(`addSub`方法不会触发)，即使调用`set`赋值，`notify`中的`subs`也是空的。OK，继续回归demo，来一小波测试去印证下我说的吧。

        const vue = new Vue({
          data() {
            return {
              text: 'hello world',
              text2: 'hey'
            };
          }
        })
        
        vue.mount(); // in get
        vue._data.text = '456'; // in watcher update /n in get
        vue._data.text2 = '123'; // nothing

- 例子2，多个Vue实例引用同一个data时，通知谁？是不是应该俩都通知？ 

        let commonData = {
          text: 'hello world'
        };
        
        const vm1 = new Vue({
          data() {
            return commonData;
          }
        })
        
        const vm2 = new Vue({
          data() {
            return commonData;
          }
        })
        
        vm1.mount(); // in get
        vm2.mount(); // in get
        commonData.text = 'hey' // 输出了两次 in watcher update /n in get

希望通过这两个例子，你已经大概清楚了`Dep`的作用，有没有原来就那么回事的感觉？有就对了。总结一下吧(以下依赖收集器实为`Dep`)：

- `vue`将`data`初始化为一个`Observer`并对对象中的每个值，重写了其中的`get`、`set`，`data`中的每个`key`，都有一个独立的依赖收集器。
- 在`get`中，向依赖收集器添加了监听
- 在mount时，实例了一个`Watcher`，将收集器的目标指向了当前`Watcher`
- 在`data`值发生变更时，触发`set`，触发了依赖收集器中的所有监听的更新，来触发`Watcher.update`




