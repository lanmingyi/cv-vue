<!--
 * @Description: 
 * @Author: lmy
 * @Date: 2021-06-02 13:38:08
 * @LastEditTime: 2021-07-26 13:46:39
 * @LastEditors: lmy
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\exception\403.vue
-->
<template>
  <exception-page
    home-route="/system/portal/index"
    :style="`min-height: ${minHeight}`"
    type="403"
  />
</template>

<script>
import ExceptionPage from "@/components/exception/ExceptionPage";
import { mapState } from "vuex";
export default {
  name: "Exp403",
  components: { ExceptionPage },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
    minHeight() {
      return this.pageMinHeight ? this.pageMinHeight + "px" : "100vh";
    },
  },
};
</script>

<style scoped lang="less"></style>
