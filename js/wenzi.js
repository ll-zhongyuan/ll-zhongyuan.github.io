/* 鼠标点击文字特效 */
var a_idx = 0;
jQuery(document).ready(function ($) {
  $("body").click(function (e) {
    // var a = new Array("❤富强❤","❤民主❤","❤文明❤","❤和谐❤","❤自由❤","❤平等❤","❤公正❤","❤法治❤","❤爱国❤","❤敬业❤","❤诚信❤","❤友善❤");
      var a = new Array("遇事不决", "可问春风", "当时明月在", "曾照彩云归","金风玉露一相逢","便胜却人间无数","执子之手", "与子偕老", "看世间美景", "赏人间绝色", "雪是大浪漫", "你是小人间", "最是人间留不住", "朱颜辞镜花辞树", "把酒祝东风", "且共从容", "垂杨紫陌洛城东");
    var $i = $("<span></span>").text(a[a_idx]);
    a_idx = (a_idx + 1) % a.length;
    var x = e.pageX,
      y = e.pageY;
    $i.css({
      "z-index": 999999999999999999999999999999999999999999999999999999999999999999999,
      "top": y - 20,
      "left": x,
      "position": "absolute",
      "font-weight": "bold",
      "color": "rgb(" + ~~(255 * Math.random()) + "," + ~~(255 * Math.random()) + "," + ~~(255 * Math.random()) + ")"
    });
    $("body").append($i);
    $i.animate({
      "top": y - 180,
      "opacity": 0
    },
      1500,
      function () {
        $i.remove();
      });
  });
});
