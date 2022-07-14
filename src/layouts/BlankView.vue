<!--
 * @Description: 空白视图
 * @Author: lmy
 * @Date: 2021-06-02 13:38:08
 * @LastEditTime: 2021-09-15 10:48:28
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <page-toggle-transition
    :disabled="animate.disabled"
    :animate="animate.name"
    :direction="animate.direction"
  >
    <route-view />
  </page-toggle-transition>
</template>

<script>
import PageToggleTransition from "../components/transition/PageToggleTransition";
import RouteView from "./RouteView.vue";
import { mapState } from "vuex";

export default {
  name: "BlankView",
  components: { PageToggleTransition, RouteView },
  computed: {
    ...mapState("setting", ["multiPage", "animate"]),
  },
};
</script>

<style scoped></style>
