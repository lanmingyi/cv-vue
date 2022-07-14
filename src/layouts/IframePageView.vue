<!--
 * @Description: 
 * @Author: lmy
 * @Date: 2021-06-02 13:38:08
 * @LastEditTime: 2021-09-15 10:49:45
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <div :style="'height:' + height">
    <iframe
      :id="id"
      :src="src"
      frameborder="no"
      style="width: 100%;height: 100%;"
      scrolling="auto"
    />
  </div>
</template>

<script>
import Vue from "vue";
import { ACCESS_TOKEN } from "@/store/mutation-types";
export default {
  name: "IframePageContent",
  inject: ["closeCurrent"],
  data() {
    return {
      src: "",
      id: "",
      height: "",
    };
  },
  created() {
    this.goUrl();
  },
  updated() {
    this.goUrl();
  },
  watch: {
    $route(to, from) {
      this.goUrl();
    },
  },
  methods: {
    goUrl() {
      let src = this.$route.fullPath;
      console.log(src, this.$route);
      this.id = src;
      if (src !== null && src !== undefined) {
        this.src = `${src}?token=${Vue.ls.get(ACCESS_TOKEN)}`;
        window.onresize = function temp() {
          this.height = document.documentElement.clientHeight - 150 + "px";
        };
        // window.location.href = this.src
        window.open(this.src, "_blank");
        this.closeCurrent();
      }
    },
  },
};
</script>

<style></style>
