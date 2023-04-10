---
title: 数组扁平化
author: 中元
img: /medias/banner/img/0004.jpg
coverImg: /medias/banner/img/0004.jpg
top: true
cover: true
toc: true
mathjax: true
summary: 将一个多维数组转化为一个一维数组。
tags: JavaScript
categories: JavaScript
abbrlink: 21996
date: 2021-08-18 14:06:30
password:
---

例：将下面数组扁平化处理。

`const arr = [1, [2, 3, [4, 5]]] // ---> [ 1, 2, 3, 4, 5 ]`

### 1.使用 flat()

> `flat()` 方法是 ES10 提出的，它会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。（flat 意为“水平的；平坦的”）

    const result1 = arr.flat(Infinity) // 指定深度为无限
    console.log(result1) // [ 1, 2, 3, 4, 5 ]

    const result2 = arr.flat(1) // 指定深度为1
    console.log(result2) // [ 1, 2, 3, [ 4, 5 ] ]

    const result3 = arr.flat(2) // 指定深度为2
    console.log(result3) // [ 1, 2, 3, 4, 5 ]

### 2.使用正则

- 以下做法得到的数组元素都会变成字符串，不建议使用；

  const result1 = JSON.stringify(arr).replace(/\[|\]/g, '').split(',')
  console.log(result1) // [ '1', '2', '3', '4', '5' ] 数组元素都变成了字符串

- 对以上方法进行优化处理；

  const result2 = JSON.parse('[' + JSON.stringify(arr).replace(/\[|\]/g, '') + ']')
  console.log(result2) // [ 1, 2, 3, 4, 5 ]

### 3.使用 reduce()+concat()

> 使用 reduce 拿到数组的当前值和前一项值，判断当前值是否为数组，初始值设置为`[]`，然后使用 concat 进行数组合并。

- reduce()方法：对数组中的每个元素执行一个由您提供的 reducer 函数(升序执行)，将其结果汇总为单个返回值。
- concat()方法：用于合并两个或多个数组。此方法不会更改现有数组，而是返回一个新数组。

  function flatten(arr) {
  return arr.reduce((pre, current) => {
  return pre.concat(Array.isArray(current) ? flatten(current) : current)
  }, [])
  }

  const result = flatten(arr)
  console.log(result) // [ 1, 2, 3, 4, 5 ]

### 4.使用函数递归

> 循环遍历数组，发现含有数组元素就进行递归处理，最终将数组转为一维数组。

    const result = []
    function exec(arr) {
      arr.forEach(item => {
        if (Array.isArray(item)) {
          exec(item)
        } else {
          result.push(item)
        }
      })
    }

    exec(arr)
    console.log(result) // [ 1, 2, 3, 4, 5 ]

### 5.使用扩展运算符+concat()

> ES6 新推出的扩展运算符能对数组进行降维处理（一次降一维），循环判断是否含有数组，进行 concat 合并。

- some()方法：测试数组中是不是至少有 1 个元素通过了被提供的函数测试（它返回的是一个 Boolean 类型的值）。

  function flatten(arr) {
  while (arr.some(item => Array.isArray(item))) {
  arr = [].concat(...arr)
  }

  return arr
  }

  const result = flatten(arr)
  console.log(result) // [ 1, 2, 3, 4, 5 ]
