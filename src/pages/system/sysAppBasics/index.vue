<!--
 * @Description:移动在线开发
 * @Author: lmy
 * @Date: 2021-07-08 16:34:28
 * @LastEditTime: 2021-08-06 09:25:19
 * @LastEditors: lmy
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\system\sysAppBasics\index.vue
-->
<template>
  <a-spin :spinning="loading" :style="'height:' + height">
    <div :style="'height:' + height">
      <iframe
        id="iframeID"
        :src="src"
        frameborder="no"
        style="width: 100%;height: 100%;"
        scrolling="auto"
      />
    </div>
  </a-spin>
</template>
<script>
import { getToken } from "@/utils/TopVUI";
import { mobileUrl } from "@/services/baseUrl";
export default {
  data() {
    return {
      src: mobileUrl + "?token=" + getToken(),
      height: document.documentElement.clientHeight - 94.5 + "px",
      loading: true,
    };
  },
  mounted: function() {
    const that = this;
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 94.5 + "px";
    };

    window.addEventListener(
      "message",
      function(e) {
        // window.document.getElementById('message').innerHTML = e.data.msg
        if (e.data.msg === "open") {
          window.document
            .getElementById("iframeID")
            .setAttribute("class", "fullScreen");
        } else {
          window.document
            .getElementById("iframeID")
            .classList.remove("fullScreen");
        }
      },
      false
    );

    const iframe = document.querySelector("#iframeID");
    // 处理兼容行问题
    if (iframe.attachEvent) {
      iframe.attachEvent("onload", function() {
        // iframe加载完毕以后执行操作
        that.loading = false;
      });
    } else {
      iframe.onload = function() {
        // iframe加载完毕以后执行操作
        that.loading = false;
      };
    }
  },
  methods: {},
};
</script>
<style>
.fullScreen {
  width: 100vw !important;
  height: 100vh !important;
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
}
</style>
