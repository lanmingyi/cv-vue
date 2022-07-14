<!--
 * @Description: 
 * @Author: lmy
 * @Date: 2021-06-02 13:38:08
 * @LastEditTime: 2021-08-02 09:53:24
 * @LastEditors: lmy
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\document\oss\viewFile.vue
-->
<template>
  <div id="viewFile"></div>
</template>
<script>
import { mapGetters } from "vuex";
import util from "@/utils/util";
import store from "@/store";
export default {
  data() {
    return {
      // 是否开启简易模式
      simpleMode: false,
    };
  },
  computed: {
    ...mapGetters(["wpsUrl", "token"]),
  },
  mounted() {
    // util.$on('getUrl', (url) => {
    // 	store.commit('SET_WPSURL', url)
    // })
    this.src = localStorage.getItem("wpsUrl");
    console.log(this.wpsUrl, this.token);
    this.openWps(this.src, this.token);
  },
  methods: {
    openWps(url, token) {
      let _this = this;
      const wps = _this.wps.config({
        mode: _this.simpleMode ? "simple" : "normal",
        mount: document.querySelector("#app"),
        wpsUrl: url,
      });
      wps.setToken({ token });
      let app = wps.Application;
    },
  },
};
</script>
<style>
#wps-iframe {
  height: calc(100vh - 5px);
}
</style>
