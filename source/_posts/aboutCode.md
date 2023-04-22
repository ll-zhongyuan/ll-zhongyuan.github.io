---
title: 我是怎么看待代码
author: 中元
img: https://ox.zhongyuan.space/hexo/banner/img/0005.jpg
coverImg: https://ox.zhongyuan.space/hexo/banner/img/0005.jpg
top: true
cover: true
toc: false
mathjax: false
summary: 关于我是怎么看待代码这件事
tags: JavaScript
categories: JavaScript
abbrlink: 2
date: 2023-04-23 22:06:30
password:
---


有人问我，你是怎么看待代码这件事的？
关于我是怎么看待代码这件事的......
----------------------------------


比如说有一个数组


`const arr = [1,2,3,4]`

需求：将`arr`的每个值翻倍，并保存到新数组，打印新数组
需求很简单，代码实现起来也很简单


    for(let i = 0; i < arr.length; i++){
    const newItem = arr[i] * 2
    newArr.push(newItem)
    }
    console.log(newArr)


需求就实现了。然后可能会觉得将来会进行多次这样的操作，所以为了避免重复代码，也就需要把这个流程给它封装到一个函数里面去，实现同样的功能


    function print(){
    for(let i = 0; i < arr.length ; i++){
    const newItem = arr[i] * 2
    newArr.push(newItem)
    }
    console.log(newArr)
    }


于是，我们需要的时候就可以调用这个**函数**`print()`，启动这个**流程**，从而得到相同的结果

**函数的本质，就是流程的封装！！！**

如果将来同样的需求，但是数组不一样怎么办呢？
因此，我希望把这个**流程**的目标修改一下，也就是说不是将固定的某一个数组的值翻倍，而是将某个数组的每个值进行翻倍。
这样一来我要完成这个**流程**就缺失了一个必要条件——缺失了一个数组
所以，就有了**参数**，**参数**就是我要完成这个流程所缺失的东西


    function print(arr){
    for(let i = 0; i < arr.length ; i++){
    const newItem = arr[i] * 2
    newArr.push(newItem)
    }
    console.log(newArr)
    }

于是，在调用函数的时候，就可以把参数传过去`print(arr)`，这个函数就变得通用了一些。
继续思考，是一定要将每个值进行翻倍吗？
答案是不一定的，于是继续对这个函数的功能进行修改，希望它变得更加通用。如果说需求是将数组的每个值翻指定的倍数，那就又缺少了一个必要的条件，即——指定的倍数


    function print(arr,rate){
    for(let i = 0; i < arr.length ; i++){
    const newItem = arr[i] * rate
    newArr.push(newItem)
    }
    console.log(newArr)
    }


则调用时`print(arr,2)`
这个函数变得更加通用了一些
继续思考，如果是将来有一天，需求变更为要把原数组的每一项变成一个对象又应该怎么做呢
那函数的需求也就随之改变，就是要**将某个数组的每个值变成一个新的值**
现在，这个函数缺失了什么？
除了缺失一个原数组之外，还缺失了什么？还缺失了一个**过程**
而`JavaScript`中，**过程就是一个函数**

所以要传一个函数做为参数，姑且将这个参数叫做 `how`


    function print(arr,how){
    for(let i = 0; i < arr.length ; i++){
    const newItem = how(arr[i])
    newArr.push(newItem)
    }
    console.log(newArr)
    }

那么将来我在调用这个函数的时候就会把原数组的某一项传入过去，由这个函数来决定新的一项是什么，我拿到之后保存新数组就可以了
`print(arr,n => n * 2)`
如果我要得到一个对象呢
`print(arr,n => ({id:n,name:n}))`

看上去好像这个函数变化挺大的，其实它的本质什么都没有变
之前缺失了数据，所以呢，要把数据通过参数传过去
现在缺失的是过程，所以呢，要把函数作为参数传过去
因为**只有函数才能表示一个过程**

继续思考.....

如果需求继续变更，不再是打印新数组，而是交付新数组


    function print(arr,how){
    for(let i = 0; i < arr.length ; i++){
    const newItem = how(arr[i])
    newArr.push(newItem)
    }
    return newArr
    }


还是很简单就能实现了
于是
`const newArray1 = print(arr,n => n * 2)`
`const newArray2 = print(arr,n => ({id:n,name:n}))`
我可以打印新数组`console.log(newArray1)`
也可以拿到数组之后直接保存到**localStorage**`localStorage.setItem("last",newArray2 )`
我可以做任何想要做的事情，所以说返回表达的是什么，表达的是做完这件事以后的结果可能会有一些后续的处理，但是后续的处理跟这个函数就没什么关系了，只需要把这个结果交付出去就可以了

继续思考......

这个结果就一定是字符串、数字、数组吗？有没有可能是交付一个过程（函数）呢


    unction createMap(arr){
    	return function(how){
    		for(let i = 0; i < arr.length ; i++){
    			const newItem = how(arr[i])
    			newArr.push(newItem)
    			}
    		return newArr
    	}
    }


比如说针对这个数组可能会有很多的映射方式

    const map = createMap(arr) 
    const newArray1 = map(arr,n => n * 2)
    const newArray2 = map(arr,n => ({id:n,name:n}))

于是整个函数的功能又变化了，他要交付的不是转换后的数组，而是交付一个功能。

功能是什么？功能就是一件事。
一件事是什么？一件事就是一个函数。

有区别吗？
其实没多大区别，之前要返回的是一个数组，所以说返回了一个数组
现在调用这个函数要的是一个功能，所以说返回了一个功能
随着不断的深入，发现这个函数越来越复杂，越来越复杂，但是复杂到头的时候，事情突然变得简单起来了
程序就两个东西

**一个是数据，一个是流程**

无论是多复杂的代码，搞来搞去都是在搞这两个东西
而这，就是我对代码的看法