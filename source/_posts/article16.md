---
title: Vue3项目搭建规范
author: 中元
img: /medias/banner/10.jpg
coverImg: /medias/banner/10.jpg
top: false
cover: false
toc: true
mathjax: false
summary: 在之前的开发中主要用的是vue2，最近空闲时间比较多，接下来有新项目，本着偷懒的本能，自己打算看下vue3基础以备后期开发应用，并对其进行性能优化和配置。
tags: Vue
categories: Vue
abbrlink: 35566
date: 2022-04-04 16:06:30
password:
---

## 一. 代码规范

### 1.1 集成 editorconfig 配置

EditorConfig 有助于为不同 IDE 编辑器上维护一致的编码风格
安装插件：EditorConfig for VS Code 后会读取.editorconfig 文件

# http://editorconfig.org

    root = true
    [*] # 表示所有文件适用
    charset = utf-8 # 设置文件字符集为 utf-8
    indent_style = space # 缩进风格（tab | space）
    indent_size = 2 # 缩进大小
    end_of_line = lf # 控制换行类型(lf | cr | crlf)
    trim_trailing_whitespace = true # 去除行首的任意空白字符
    insert_final_newline = true # 始终在文件末尾插入一个新行
    [*.md] # 表示仅 md 文件适用以下规则

    max_line_length = off
    trim_trailing_whitespace = false

### 1.2 使用 prettier 工具

Prettier 是一款强大的格式化工具

1.安装开发式（-D）依赖 prettier
`npm install prettier -D`

1. 配置.prettierrc 文件：

- useTabs：使用 tab 缩进还是空格缩进，选择 false；
- tabWidth：tab 是空格的情况下，是几个空格，选择 2 个；
- printWidth：当行字符的长度，推荐 80，也有人喜欢 100 或者 120；
- singleQuote：使用单引号还是双引号，选择 true，使用单引号；
- trailingComma：在多行输入的尾逗号是否添加，设置为 none；
- semi：语句末尾是否要加分号，默认值 true，选择 false 表示不加；

      {
        "useTabs": false,
        "tabWidth": 2,
        "printWidth": 80,
        "singleQuote": true,
        "trailingComma": "none",
        "semi": false
      }

  3.创建.prettierignore 忽略文件

      /dist/*
      .local
      .output.js
      /node_modules/**

      **/*.svg
      **/*.sh

      /public/*

  4.VSCode 需要安装 prettier 的插件：`Prettier-Code formatter`

  5.在 package.json 中配置一个 scripts

`"prettier": "prettier --write ."`

6.执行脚本：

    `npm run prettier`

### 1.3 使用 ESLint 检测[#](https://www.cnblogs.com/Acyang/p/15649095.html#13-使用eslint检测)

1. VSCode 安装 ESLint 插件：`ESLint`
2. 解决 eslint 和 prettier 冲突的问题
   `npm i eslint-plugin-prettier eslint-config-prettier -D`
3. 添加 prettier 插件

   extends: [
   "plugin:vue/vue3-essential",
   "eslint:recommended",
   "@vue/typescript/recommended",
   "@vue/prettier",
   "@vue/prettier/@typescript-eslint",
   'plugin:prettier/recommended'
   ],

## 二、项目搭建规范-第三方库集成

### 2.1 vue.config.js 配置（修改 vue-cli 封装好的内部 webpack）

node 接受 commonJS 模板规范

    const path require('path')
    module.exports = {
        // 1. 配置方式一： CLI提供的属性
        outputDir: './build',
        publicPath: './', // 打包后文件是相对路径
        // 2. 配置方式二： 和Webpack属性完全一致，最后会进行合并
        configureWebpack: {
            resolve: {
                alias: {
                    components: '@/components'
                }
            }
        },
        // configure是函数形式：直接覆盖原Webpack配置
        configureWebpack: (config) => {
            config.resolve.alias = {
                "@": path.resolve(__dirname, 'src'),
                components: '@/components'
            }
        },
        // 3. 配置方式三：chainWebpack链式形式
        chainWebpack: (config) => {
            config.resolve.alias.set('@', path.resolve(__dirname, 'src').set('components', '@/components'))
        }
    }

### 2.2 vue-router 集成

1. 安装 vue-router 最新版本

   ` npm install vue-router@next`

   `defineComponent`：定义组件，更好的支持 ts

2. 创建 router 对象

   import { createRouter, createWebHashHistory } from 'vue-router';
   import type { RouteRecordRaw } from 'vue-router'; // 声明导入的是一个 type，可不加

   const routes: RouteRecordRaw[] = [
   {
   path: '/',
   redirect: '/login'
   },
   {
   path: '/login',
   component: () => import('@/views/login/index.vue')
   },
   {
   path: '/main',
   component: () => import('@/views/main/index.vue')
   }
   ]

   const router = createRouter({
   routes,
   history: createWebHashHistory()
   })

   export default router

### 2.3 element-plus 集成

1.  全局引用：所有组件全部集成

    优点：集成简单，方便使用
    缺点：全部会打包

    import ElementPlus from 'element-plus';
    import 'element-plus/theme-chalk/index.css';
    app.use(ElementPlus)

2.  按需引用

    优点：包会小一些
    缺点：引用麻烦

        <el-button type="primary">哈哈哈哈</el-button>

    import { ElButton } from 'element-plus'
    import 'element-plus/theme-chalk/base.css';
    import 'element-plus/theme-chalk/el-button.css';

    components: {
    ElButton
    }

以上方法太麻烦，可以添加 babel-plugin-import 工具进行按需引入，并进行配置

`npm install babel-plugin-import -D`

    // babel.config.js
    module.exports = {
      plugins: [
        [
          'import',
          {
            libraryName: 'element-plus',
            // 引入组件
            customName: (name) => {
              name = name.slice(3)
              return `element-plus/lib/components/${name}`
            },
            // 引入样式
            customStyleName: (name) => {
              name = name.slice(3)
              // 如果你需要引入 [name].scss 文件，你需要用下面这行
              // return `element-plus/lib/components/${name}/style`
              // 引入 [name].css
              return `element-plus/lib/components/${name}/style/css`
            }
          }
        ]
      ],
      presets: ['@vue/cli-plugin-babel/preset']
    }

- main.ts 入口文件存放主要逻辑
- 把共性的逻辑进行抽取

  // main.ts
  import { createApp, App } from 'vue'
  import { globalRegister } from './global'
  import rootApp from './App.vue'

  const app: App = createApp(rootApp)

  /\*\* app.use()有传入函数的两种方式
  app.use(function(app: App) {

        })
        app.use({
            install: function(app: App) {

            }
        })

  \*/

  // 方式一：
  globalRegister(app)
  // 方式二：更优雅
  app.use(globalRegister)

  // global/index.ts
  import { App } from 'vue'
  import registerElement from './regiserElement'
  export function globalRegister(app: App): void {
  registerElement(app)
  }

  // global/registerELement
  import { App } from 'vue'
  import 'element-plus/theme-chalk/base.css';
  import { ElButton, ElForm } from 'element-plus'

  const components = [
  ElButton,
  ElForm
  ]

  export default function (app: App): void {
  for (const component of components) {
  app.component(component.name, component)
  }
  }

## 三、其他文件

### 1. browserslistrc - 帮助我们做浏览器适配

- 帮助我们做浏览器适配
- css 查询文件
- babel：ES6 TS -> JS

> 1% // 市场份额大于百分之一的浏览器
> last 2 versions // 适配主流浏览器的最新的两个版本
> not dead // 目前浏览器处于维护状态的 xxxxxxxxxx > 1% // 市场份额大于百分之一的浏览器 last 2 versions // 适配主流浏览器的最新的两个版本 not dead // 目前浏览器处于维护状态的 onload：当页面或图像加载完后立即触发 onblur：元素失去焦点 onfocus：元素获得焦点 onclick：鼠标点击某个对象 onchange：用户改变域的内容 onmouseover：鼠标移动到某个元素上 onmouseout：鼠标从某个元素上离开 onkeyup：某个键盘的键被松开 onkeydown：某个键盘的键被按下

### 2.tsconfig.json - TS 配置文件

    {
      "compilerOptions": { // 编译选项
        // 目标代码（ts -> js(es5/6/7)）
        "target": "esnext",
        // 目标代码需要使用的模块化方案(commonjs require/module.exports/es module import/export)，常写umd，代表支持多种模块化
        "module": "esnext",
        // 严格的检查(any)
        "strict": true,
        // 对jsx进行怎样的处理，不转化preserve保留
        "jsx": "preserve",
        // 辅助导入功能
        "importHelpers": true,
        // 按照node方式去解析模块 import "/index.node .json .js"
        "moduleResolution": "node",
        // 跳过一些库的类型检测(axios本身会定义很多类型，提高性能，有可能多个库的类型命名会冲突)
        "skipLibCheck": true,
        // export default/module.exports = {}是否能混合使用
        // es module / commonjs 是否能混合使用
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true,
        // 要不要生成映射文件(ts -> js)
        "sourceMap": true,
        // 文件路径在解析时的基本的url
        "baseUrl": ".",
        // 指定具体要解析使用的类型，不传时target写的什么类型在这里就可以使用
        "types": ["webpack-env"],
        // 编译的路径解析，使用@/components会在src/components中寻找
        "paths": {
          "@/*": ["src/*"],
          "components/*": ["src/components/*"] // (我们自己新增的)
        },
        // 可以指定在项目中可以使用哪些库的类型(Proxy/Window/Document)
        "lib": ["esnext", "dom", "dom.iterable", "scripthost"]
      },
      // 哪些文件需要被约束和解析
      "include": [
        "src/**/*.ts",
        "src/**/*.tsx",
        "src/**/*.vue",
        "tests/**/*.ts",
        "tests/**/*.tsx"
      ],
      // 排除哪些文件被约束和解析
      "exclude": ["node_modules"]
    }

### 3.shims-vue.d.ts 声明，防止报错

    declare module '*.vue' {
      import type { DefineComponent } from 'vue'
      const component: DefineComponent<{}, {}, any>
      export default component
    }

// 声明一下$store，防止报错
`declare let $store: any`
