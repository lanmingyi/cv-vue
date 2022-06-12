<!--
 * @Description: 页面视图
 * @Author: 黄婷
 * @Date: 2021-06-02 13:38:08
 * @LastEditTime: 2021-09-15 12:00:31
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\layouts\PageView.vue
-->
<template>
  <page-layout :desc="desc" :linkList="linkList">
    <div v-if="this.extraImage && !isMobile" slot="extra" class="extraImg">
      <img :src="extraImage" />
    </div>
    <page-toggle-transition
      :disabled="animate.disabled"
      :animate="animate.name"
      :direction="animate.direction"
    >
      <route-view ref="page" />
      <!-- <RouteView></RouteView> -->
    </page-toggle-transition>
  </page-layout>
</template>

<script>
import PageLayout from "./PageLayout";
import PageToggleTransition from "../components/transition/PageToggleTransition";
import RouteView from "./RouteView.vue";
import { mapState } from "vuex";

export default {
  name: "PageView",
  components: { PageToggleTransition, PageLayout, RouteView },
  data() {
    return {
      page: {},
    };
  },
  computed: {
    ...mapState("setting", ["isMobile", "multiPage", "animate"]),
    desc() {
      return this.page.desc;
    },
    linkList() {
      return this.page.linkList;
    },
    extraImage() {
      return this.page.extraImage;
    },
  },
  mounted() {
    this.page = this.$refs.page;
  },
  updated() {
    this.page = this.$refs.page;
  },
};
</script>

<style lang="less" scoped>
.extraImg {
  margin-top: -60px;
  text-align: center;
  width: 195px;
  img {
    width: 100%;
  }
}
</style>
