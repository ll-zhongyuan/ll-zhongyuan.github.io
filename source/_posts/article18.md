---
title: ES6 Promise用法
author: 中元
img: /medias/banner/12.jpg
coverImg: /medias/banner/12.jpg
top: false
cover: false
toc: true
mathjax: false
summary: >-
  所谓Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。ES6
  规定，Promise对象是一个构造函数，用来生成Promise实例。
tags:
  - ES6
  - 转载
categories: ES6
abbrlink: 40975
date: 2022-05-08 13:06:30
password:
---

下面代码创造了一个 Promise 实例。

    const promise = new Promise(function(resolve, reject) {
      // ... some code
    
      if (/* 异步操作成功 */){
        resolve(value);
      } else {
        reject(error);
      }
    });

Promise 构造函数接受一个函数作为参数，该函数的两个参数分别是 resolve 和 reject。它们是两个函数，由 JavaScript 引擎提供，不用自己部署。
resolve 函数的作用是，将 Promise 对象的状态从“未完成”变为“成功”（即从 pending 变为 resolved），在异步操作成功时调用，并将异步操作的结果，作为参数传递出去；reject 函数的作用是，将 Promise 对象的状态从“未完成”变为“失败”（即从 pending 变为 rejected），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。
Promise 实例生成以后，可以用 then 方法分别指定 resolved 状态和 rejected 状态的回调函数。

    promise.then(function(value) {
      // success
    }, function(error) {
      // failure
    });

then 方法可以接受两个回调函数作为参数。第一个回调函数是 Promise 对象的状态变为 resolved 时调用，第二个回调函数是 Promise 对象的状态变为 rejected 时调用。其中，第二个函数是可选的，不一定要提供。这两个函数都接受 Promise 对象传出的值作为参数。
下面是一个 Promise 对象的简单例子。

    function timeout(ms) {
      return new Promise((resolve, reject) => {
        setTimeout(resolve, ms, 'done');
      });
    }
    
    timeout(100).then((value) => {
      console.log(value);
    });

上面代码中，timeout 方法返回一个 Promise 实例，表示一段时间以后才会发生的结果。过了指定的时间（ms 参数）以后，Promise 实例的状态变为 resolved，就会触发 then 方法绑定的回调函数。
Promise 新建后就会立即执行。

    let promise = new Promise(function(resolve, reject) {
      console.log('Promise');
      resolve();
    });
    
    promise.then(function() {
      console.log('resolved.');
    });
    
    console.log('Hi!');
    
    // Promise
    // Hi!
    // resolved

上面代码中，Promise 新建后立即执行，所以首先输出的是 Promise。然后，then 方法指定的回调函数，将在当前脚本所有同步任务执行完才会执行，所以 resolved 最后输出。
下面是异步加载图片的例子。

    function loadImageAsync(url) {
      return new Promise(function(resolve, reject) {
        const image = new Image();
    
        image.onload = function() {
          resolve(image);
        };
    
        image.onerror = function() {
          reject(new Error('Could not load image at ' + url));
        };
    
        image.src = url;
      });
    }

上面代码中，使用 Promise 包装了一个图片加载的异步操作。如果加载成功，就调用 resolve 方法，否则就调用 reject 方法。
Promise 是一个构造函数，自己身上有 all、reject、resolve 这几个眼熟的方法，原型上有 then、catch 等同样很眼熟的方法。
那就 new 一个

    var p = new Promise(function(resolve, reject){
        //做一些异步操作
        setTimeout(function(){
            console.log('执行完成');
            resolve('随便什么数据');
        }, 2000);
    });

Promise 的构造函数接收一个参数，是函数，并且传入两个参数：resolve，reject，分别表示异步操作执行成功后的回调函数和异步操作执行失败后的回调函数。其实这里用“成功”和“失败”来描述并不准确，按照标准来讲，resolve 是将 Promise 的状态置为 fullfiled，reject 是将 Promise 的状态置为 rejected。不过在我们开始阶段可以先这么理解，后面再细究概念。

在上面的代码中，我们执行了一个异步操作，也就是 setTimeout，2 秒后，输出“执行完成”，并且调用 resolve 方法。
运行代码，会在 2 秒后输出“执行完成”。注意！我只是 new 了一个对象，并没有调用它，我们传进去的函数就已经执行了，这是需要注意的一个细节。所以我们用 Promise 的时候一般是包在一个函数中，在需要的时候去运行这个函数，如：

    function runAsync(){
        var p = new Promise(function(resolve, reject){
            //做一些异步操作
            setTimeout(function(){
                console.log('执行完成');
                resolve('随便什么数据');
            }, 2000);
        });
        return p;
    }
    runAsync()

这时候你应该有两个疑问：

1.包装这么一个函数有什么用？

2.resolve('随便什么数据');这是干毛的？

我们继续来讲。在我们包装好的函数最后，会 return 出 Promise 对象，也就是说，执行这个函数我们得到了一个 Promise 对象。还记得 Promise 对象上有 then、catch 方法吧？这就是强大之处了，看下面的代码：

    runAsync().then(function(data){
        console.log(data);
        //后面可以用传过来的数据做些其他操作
        //......
    });

在 runAsync()的返回上直接调用 then 方法，then 接收一个参数，是函数，并且会拿到我们在 runAsync 中调用 resolve 时传的的参数。运行这段代码，会在 2 秒后输出“执行完成”，紧接着输出“随便什么数据”。

这时候你应该有所领悟了，原来 then 里面的函数就跟我们平时的回调函数一个意思，能够在 runAsync 这个异步任务执行完成之后被执行。这就是 Promise 的作用了，简单来讲，就是能把原来的回调写法分离出来，在异步操作执行完后，用链式调用的方式执行回调函数。

你可能会不屑一顾，那么牛逼轰轰的 Promise 就这点能耐？我把回调函数封装一下，给 runAsync 传进去不也一样吗，就像这样：

    function runAsync(callback){
        setTimeout(function(){
            console.log('执行完成');
            callback('随便什么数据');
        }, 2000);
    }
    
    runAsync(function(data){
        console.log(data);
    });

效果也是一样的，还费劲用 Promise 干嘛。那么问题来了，有多层回调该怎么办？如果 callback 也是一个异步操作，而且执行完后也需要有相应的回调函数，该怎么办呢？总不能再定义一个 callback2，然后给 callback 传进去吧。而 Promise 的优势在于，可以在 then 方法中继续写 Promise 对象并返回，然后继续调用 then 来进行回调操作。

#### **链式操作的用法**

所以，从表面上看，Promise 只是能够简化层层回调的写法，而实质上，Promise 的精髓是“状态”，用维护状态、传递状态的方式来使得回调函数能够及时调用，它比传递 callback 函数要简单、灵活的多。所以使用 Promise 的正确场景是这样的：

    runAsync1()
    .then(function(data){
        console.log(data);
        return runAsync2();
    })
    .then(function(data){
        console.log(data);
        return runAsync3();
    })
    .then(function(data){
        console.log(data);
    });

这样能够按顺序，每隔两秒输出每个异步回调中的内容，在 runAsync2 中传给 resolve 的数据，能在接下来的 then 方法中拿到。运行结果如下：

![](https://img-blog.csdnimg.cn/20181118110118300.png)

猜猜 runAsync1、runAsync2、runAsync3 这三个函数都是如何定义的？没错，就是下面这样

    function runAsync1(){
        var p = new Promise(function(resolve, reject){
            //做一些异步操作
            setTimeout(function(){
                console.log('异步任务1执行完成');
                resolve('随便什么数据1');
            }, 1000);
        });
        return p;
    }
    function runAsync2(){
        var p = new Promise(function(resolve, reject){
            //做一些异步操作
            setTimeout(function(){
                console.log('异步任务2执行完成');
                resolve('随便什么数据2');
            }, 2000);
        });
        return p;
    }
    function runAsync3(){
        var p = new Promise(function(resolve, reject){
            //做一些异步操作
            setTimeout(function(){
                console.log('异步任务3执行完成');
                resolve('随便什么数据3');
            }, 2000);
        });
        return p;
    }

在 then 方法中，你也可以直接 return 数据而不是 Promise 对象，在后面的 then 中就可以接收到数据了，比如我们把上面的代码修改成这样：

    runAsync1()
    .then(function(data){
        console.log(data);
        return runAsync2();
    })
    .then(function(data){
        console.log(data);
        return '直接返回数据';  //这里直接返回数据
    })
    .then(function(data){
        console.log(data);
    });

那么输出就变成了这样：

![](https://img-blog.csdnimg.cn/20181118110243603.png)

#### **reject 的用法**

到这里，你应该对“Promise 是什么玩意”有了最基本的了解。那么我们接着来看看 ES6 的 Promise 还有哪些功能。我们光用了 resolve，还没用 reject 呢，它是做什么的呢？事实上，我们前面的例子都是只有“执行成功”的回调，还没有“失败”的情况，reject 的作用就是把 Promise 的状态置为 rejected，这样我们在 then 中就能捕捉到，然后执行“失败”情况的回调。看下面的代码。

    function getNumber(){
        var p = new Promise(function(resolve, reject){
            //做一些异步操作
            setTimeout(function(){
                var num = Math.ceil(Math.random()*10); //生成1-10的随机数
                if(num<=5){
                    resolve(num);
                }
                else{
                    reject('数字太大了');
                }
            }, 2000);
        });
        return p;
    }
    
    getNumber()
    .then(
        function(data){
            console.log('resolved');
            console.log(data);
        },
        function(reason, data){
            console.log('rejected');
            console.log(reason);
        }
    );

getNumber 函数用来异步获取一个数字，2 秒后执行完成，如果数字小于等于 5，我们认为是“成功”了，调用 resolve 修改 Promise 的状态。否则我们认为是“失败”了，调用 reject 并传递一个参数，作为失败的原因。

运行 getNumber 并且在 then 中传了两个参数，then 方法可以接受两个参数，第一个对应 resolve 的回调，第二个对应 reject 的回调。所以我们能够分别拿到他们传过来的数据。多次运行这段代码，你会随机得到下面两种结果：

![](https://img-blog.csdnimg.cn/20181118110405487.png)![](https://img-blog.csdnimg.cn/20181118110346440.png)

#### **catch 的用法**

我们知道 Promise 对象除了 then 方法，还有一个 catch 方法，它是做什么用的呢？其实它和 then 的第二个参数一样，用来指定 reject 的回调，用法是这样：

    getNumber()
    .then(function(data){
        console.log('resolved');
        console.log(data);
    })
    .catch(function(reason){
        console.log('rejected');
        console.log(reason);
    });

效果和写在 then 的第二个参数里面一样。不过它还有另外一个作用：在执行 resolve 的回调（也就是上面 then 中的第一个参数）时，如果抛出异常了（代码出错了），那么并不会报错卡死 js，而是会进到这个 catch 方法中。请看下面的代码：

    getNumber()
    .then(function(data){
        console.log('resolved');
        console.log(data);
        console.log(somedata); //此处的somedata未定义
    })
    .catch(function(reason){
        console.log('rejected');
        console.log(reason);
    });

在 resolve 的回调中，我们 console.log(somedata);而 somedata 这个变量是没有被定义的。如果我们不用 Promise，代码运行到这里就直接在控制台报错了，不往下运行了。但是在这里，会得到这样的结果：

![](https://img-blog.csdnimg.cn/20181118110528999.png)

也就是说进到 catch 方法里面去了，而且把错误原因传到了 reason 参数中。即便是有错误的代码也不会报错了，这与我们的 try/catch 语句有相同的功能。

#### **all 的用法**

Promise 的 all 方法提供了并行执行异步操作的能力，并且在所有异步操作执行完后才执行回调。我们仍旧使用上面定义好的 runAsync1、runAsync2、runAsync3 这三个函数，看下面的例子：

    Promise
    .all([runAsync1(), runAsync2(), runAsync3()])
    .then(function(results){
        console.log(results);
    });

用 Promise.all 来执行，all 接收一个数组参数，里面的值最终都算返回 Promise 对象。这样，三个异步操作的并行执行的，等到它们都执行完后才会进到 then 里面。那么，三个异步操作返回的数据哪里去了呢？都在 then 里面呢，all 会把所有异步操作的结果放进一个数组中传给 then，就是上面的 results。所以上面代码的输出结果就是：

![](https://img-blog.csdnimg.cn/2018111811063113.png)

有了 all，你就可以并行执行多个异步操作，并且在一个回调中处理所有的返回数据，是不是很酷？有一个场景是很适合用这个的，一些游戏类的素材比较多的应用，打开网页时，预先加载需要用到的各种资源如图片、flash 以及各种静态文件。所有的都加载完后，我们再进行页面的初始化。

#### **race 的用法**

all 方法的效果实际上是「谁跑的慢，以谁为准执行回调」，那么相对的就有另一个方法「谁跑的快，以谁为准执行回调」，这就是 race 方法，这个词本来就是赛跑的意思。race 的用法与 all 一样，我们把上面 runAsync1 的延时改为 1 秒来看一下：

    Promise
    .race([runAsync1(), runAsync2(), runAsync3()])
    .then(function(results){
        console.log(results);
    });

这三个异步操作同样是并行执行的。结果你应该可以猜到，1 秒后 runAsync1 已经执行完了，此时 then 里面的就执行了。结果是这样的：

![](https://img-blog.csdnimg.cn/20181118110730499.png)

你猜对了吗？不完全，是吧。在 then 里面的回调开始执行时，runAsync2()和 runAsync3()并没有停止，仍旧再执行。于是再过 1 秒后，输出了他们结束的标志。

这个 race 有什么用呢？使用场景还是很多的，比如我们可以用 race 给某个异步请求设置超时时间，并且在超时后执行相应的操作，代码如下：

    //请求某个图片资源
    function requestImg(){
    var p = new Promise(function(resolve, reject){
    var img = new Image();
    img.onload = function(){
    resolve(img);
    }
    img.src = 'xxxxxx';
    });
    return p;
    }
    
    //延时函数，用于给请求计时
    function timeout(){
        var p = new Promise(function(resolve, reject){
            setTimeout(function(){
                reject('图片请求超时');
            }, 5000);
        });
        return p;
    }
    
    Promise
    .race([requestImg(), timeout()])
    .then(function(results){
        console.log(results);
    })
    .catch(function(reason){
        console.log(reason);
    });

requestImg 函数会异步请求一张图片，我把地址写为"xxxxxx"，所以肯定是无法成功请求到的。timeout 函数是一个延时 5 秒的异步操作。我们把这两个返回 Promise 对象的函数放进 race，于是他俩就会赛跑，如果 5 秒之内图片请求成功了，那么遍进入 then 方法，执行正常的流程。如果 5 秒钟图片还未成功返回，那么 timeout 就跑赢了，则进入 catch，报出“图片请求超时”的信息。运行结果如下：

![](https://img-blog.csdnimg.cn/20181118110835406.png)

转自————[Samve](https://www.cnblogs.com/samve/)promise 用法讲解
