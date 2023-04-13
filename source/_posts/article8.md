---
title: 基于Vue的天地图入门
author: 中元
img: https://ox.zhongyuan.space/hexo/banner/6.jpg
coverImg: https://ox.zhongyuan.space/hexo/banner/6.jpg
top: false
cover: false
toc: true
mathjax: false
summary: 把天地图这个模块拿出来记录总结一下
tags: Vue
categories: Vue
abbrlink: 60575
date: 2022-01-07 09:06:30
password:
---

### 天地图组件的引用

首先去[天地图官网](https://www.tianditu.gov.cn/)，登录或者注册。
依次点击开发资源-网页 Api-新弹出页面右上角控制台

在控制台页面，单击右上角创建新应用，随便填一填巴拉巴拉。

申请成功后记住你的 key。

我新建了一个 vue 项目，这个项目啥也没有，像丁真一样纯真。

找到 index.html 这个文件 把下列代码复制进去，实现全局引入 （当然你也可以粘贴在某个 vue 页面上来实现按需引入）

`<script src="http://api.tianditu.gov.cn/api?v=4.0&tk=你的密钥" type="text/javascript"></script>`

保存，刷新 Vue 项目，打开 F12 控制台发现请求成功。
新建一个 vue 文件，在你像要防止地图的地方新建一个 div，定义他的大小，id 自己命名，我取名为 map。

<div class="bodyAll">
<div id="map" style="height:100%;width:100%"></div>
</div>
在 methods 书写 initMap()方法并在 mounted 里引用。别忘在 data return 里注入 map:{}

    methods: {
      initMap() {
        let T = window.T;//全局引入后T被注册到window里，在从这儿拿到T。T包含了天地图提供的各种方法等。
        this.map = new T.Map("map");
        this.map.centerAndZoom(new T.LngLat(112, 36), 7);//三个参数分别为经度，纬度，缩放等级。
      },
    },
    mounted() {
      this.initMap();
    },

芜湖~已经能加载出来啦。能加载出来就算成功^^\_

### 图层组件

可以用继承于 TControl 的 MapType 类来构造图层组件。示例代码的参数是个数组，如果什么都不传会有一个默认的图层系列。

以下这些图层都可以在官方的 api 里找到

    //添加切换地图图层的组件
    addCtrl() {
      var ctrl = new T.Control.MapType([
        {
          title: "地图",
          //地图控件上所要显示的图层名称
          icon: "http://api.tianditu.gov.cn/v4.0/image/map/maptype/vector.png",
          //地图控件上所要显示的图层图标（默认图标大小80x80）
          layer: TMAP_NORMAL_MAP, //地图类型对象，即MapType。
        },
        {
          title: "卫星",
          icon: "http://api.tianditu.gov.cn/v4.0/image/map/maptype/satellite.png",
          layer: TMAP_SATELLITE_MAP,
        },
        {
          title: "卫星混合",
          http: "http://api.tianditu.gov.cn/v4.0/image/map/maptype/satellitepoi.png",
          layer: TMAP_HYBRID_MAP,
        },
        {
          title: "地形",
          icon: " http://api.tianditu.gov.cn/v4.0/image/map/maptype/terrain.png",
          layer: TMAP_TERRAIN_MAP,
        },
        {
      title: "地形混合",
      icon: " http://api.tianditu.gov.cn/v4.0/image/map/maptype/terrainpoi.png",
          layer: TMAP_TERRAIN_HYBRID_MAP,
      },
    ]);
    this.map.addControl(ctrl);

### 获取地图中心坐标点

    getMapCenter() {
      this.$message(
        "地图中心坐标点:" +
          this.map.getCenter().getLng() +
          "," +
          this.map.getCenter().getLat()
      );
    },

### 获取地图缩放级别

    getMapZoom() {
      this.$message("地图缩放级别:" + this.map.getZoom());
    },

### 获取地图当前可视范围坐标

    getMapBounds() {
      let bs = this.map.getBounds(); //获取可视区域`
      let bssw = bs.getSouthWest(); //可视区域左下角`
      let bsne = bs.getNorthEast(); //可视区域右上角`
      this.$message(`
        "当前地图可视范围是:" +
          bssw.getLng() +
          "," +
          bssw.getLat() +
          "到" +
          bsne.getLng() +
          "," +
          bsne.getLat()
      );
    },

目前的这些 api 都可以从天地图官网找到，如果你需要要更多需求，官方也许也有现成的 api。建议先熟悉一下官方 api 再进行开发。

### 参考链接

- 天地图官网：https://www.tianditu.gov.cn/
