---
title: HTML5时钟
author: 中元
img: https://ox.zhongyuan.space/hexo/banner/4.jpg
coverImg: https://ox.zhongyuan.space/hexo/banner/4.jpg
top: false
cover: false
toc: true
mathjax: false
summary: 用新的HTML规范搞事情...
tags: HTML
categories: HTML
abbrlink: 28556
date: 2020-11-19 21:06:30
password:
---

Canvas：https://developer.mozilla.org/en/Canvas_tutorial、http://www.w3.org/TR/2dcontext/
三角函数：[http://zh.wikipedia.org/zh/%E4%B8%89%E8%A7%92%E5%87%BD%E6%95%B0](http://zh.wikipedia.org/zh/三角函数)
JavaScript：https://developer.mozilla.org/en/JavaScript、http://www.w3school.com.cn/js/index.asp

# 源代码

    <!DOCTYPE html>
    <html>
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>超酷HTML5时钟(作者：http://www.cnblogs.com/jscode/)</title>
    <style type="text/css">
        .time {
            text-align: center;
            width:400px;
            font-family: "Book Antiqua",Palatino,serif;
            font-size: 40px;
            font-weight: bold;
            text-shadow: 1px 1px 3px #333;
            position:absolute;
        }
        .time em {
            background: white;
            position: absolute;
            top: 5px;
            left: 130px;
            height: 18px;
            width: 140px;
            opacity: 0.4;
        }
    </style>
    <script type="text/javascript">
        var canvas, context;
        function DrawClock() {
            canvas = document.getElementById("canvas");
            context = canvas.getContext("2d");
            setInterval("drawbackground()", 1000);
        }
        function drawbackground() {
            var radius = Math.min(canvas.width / 2, canvas.height / 2) - 15;
            var centerx = canvas.width / 2;
            var centery = canvas.height / 2;
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.save();
            context.lineWidth = 15;
            context.fillStyle = "#EFEFEF";
            context.strokeStyle = "#000";
            context.beginPath();
            context.arc(centerx, centery, radius, 0, Math.PI * 2, 0);
            context.fill();
            context.stroke();
            context.closePath();
            context.restore();
            for (var i = 0; i < 60; i++) {
                context.save();
                context.fillStyle = "#EFEFEF";
                context.strokeStyle = "#000";
                if (i % 5 == 0) {
                    context.lineWidth = 3;
                }
                context.beginPath();
                context.moveTo(centerx, centery);
                context.lineTo(centerx + (radius-6) * Math.cos(i * 6 * Math.PI / 180), centery - (radius-5) * Math.sin(i * 6 * Math.PI / 180));
                context.fill();
                context.stroke();
                context.closePath();
                context.restore();
            }
            context.moveTo(centerx, centery);
            context.save();
            context.fillStyle = "#EFEFEF";
            context.strokeStyle = "#EFEFEF";
            context.beginPath();
            context.arc(centerx, centery, radius-15, 0, Math.PI * 2, 0);
            context.fill();
            context.stroke();
            context.closePath();
            context.restore();

            var r = radius - 25;
            context.font = "bold 20px 宋体";
            Drawtext("1", centerx + (Math.cos(60 * Math.PI / 180) * r), centery - (Math.sin(60 * Math.PI / 180) * r));
            Drawtext("2", centerx + (Math.cos(30 * Math.PI / 180) * r), centery - (Math.sin(30 * Math.PI / 180) * r));
            Drawtext("3", centerx + (Math.cos(0 * Math.PI / 180) * r), centery - (Math.sin(0 * Math.PI / 180) * r));
            Drawtext("4", centerx + (Math.cos(330 * Math.PI / 180) * r), centery - (Math.sin(330 * Math.PI / 180) * r));
            Drawtext("5", centerx + (Math.cos(300 * Math.PI / 180) * r), centery - (Math.sin(300 * Math.PI / 180) * r));
            Drawtext("6", centerx + (Math.cos(270 * Math.PI / 180) * r), centery - (Math.sin(270 * Math.PI / 180) * r));
            Drawtext("7", centerx + (Math.cos(240 * Math.PI / 180) * r), centery - (Math.sin(240 * Math.PI / 180) * r));
            Drawtext("8", centerx + (Math.cos(210 * Math.PI / 180) * r), centery - (Math.sin(210 * Math.PI / 180) * r));
            Drawtext("9", centerx + (Math.cos(180 * Math.PI / 180) * r), centery - (Math.sin(180 * Math.PI / 180) * r));
            Drawtext("10", centerx + (Math.cos(150 * Math.PI / 180) * r), centery - (Math.sin(150 * Math.PI / 180) * r));
            Drawtext("11", centerx + (Math.cos(120 * Math.PI / 180) * r), centery - (Math.sin(120 * Math.PI / 180) * r));
            Drawtext("12", centerx + (Math.cos(90 * Math.PI / 180) * r), centery - (Math.sin(90 * Math.PI / 180) * r));
            context.save();
            context.fillStyle="black";
            context.beginPath();
            context.arc(centerx,centery,10,0,Math.PI*2,0);
            context.fill();
            context.stroke();
            context.closePath();
            context.restore();

            drawpoint(centerx, centery, radius);

        }

        function drawpoint(centerx, centery, radius) {
            var date = new Date();
            var h = date.getHours();
            h = h < 13 ? h : h - 12;
            var m = date.getMinutes();
            var s = date.getSeconds();

            var th = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
            var tm = m < 10 ? "0" + m : m;
            var ts = s < 10 ? "0" + s : s;
            document.getElementById("currtime").innerHTML = th + ":" + tm + ":" + ts;

            var hr = h * 30 * Math.PI / 180 + (m / 60) * 30 * Math.PI / 180 + 90 * Math.PI / 180;
            var mr = m * 6 * Math.PI / 180 + s / 60 * 6 * Math.PI / 180 + 90 * Math.PI / 180;
            var sr = s * 6 * Math.PI / 180 + 90 * Math.PI / 180;
            context.save();
            context.lineWidth = 5;
            context.fillStyle = "darkgray";
            context.strokeStyle = "black";
            context.beginPath();
            context.moveTo(centerx + 20 * Math.cos(hr), centery + 20 * Math.sin(hr));
            context.lineTo(centerx - (radius - 120) * Math.cos(hr), centery - (radius - 120) * Math.sin(hr));

            context.moveTo(centerx + 20 * Math.cos(mr), centery + 20 * Math.sin(mr));
            context.lineTo(centerx - (radius - 80) * Math.cos(mr), centery - (radius - 80) * Math.sin(mr));


            context.moveTo(centerx + 20 * Math.cos(sr), centery + 20 * Math.sin(sr));
            context.lineTo(centerx - (radius - 50) * Math.cos(sr), centery - (radius - 50) * Math.sin(sr));

            context.closePath();
            context.fill();
            context.stroke();
            context.restore();
        }

        function Drawtext(text, x, y) {
            context.save();
            x -= (context.measureText(text).width / 2);
            y += 9;
            context.beginPath();
            context.translate(x, y);
            context.fillText(text, 0, 0);
            context.restore();
        }

        window.onload = DrawClock;
    </script>
    </head>
    <body>
        <h1>超酷HTML5时钟(作者：http://www.cnblogs.com/jscode/)</h1>
        <canvas id="canvas" width="400px" height="400px"></canvas>
        <div class="time"><span id="currtime">00:00:00</span><em></em></div>
    </body>
    </html>

方法作用解释：

DrawClock 方法取得 Canvas 上下文

drawbackground 方法主要是画时钟的背景部分：边框、文字、刻度线

drawpoint 方法用来画时、分、秒线

Drawtext 方法是添加文字的
