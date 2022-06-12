<template>
  <a-tabs default-active-key="1">
    <a-tab-pane key="1" tab="风格化图像">
      <stylize ref="stylize"></stylize>
    </a-tab-pane>
    <a-tab-pane key="2" tab="结合两种风格">

    </a-tab-pane>
  </a-tabs>

</template>

<script>
import stylize from "./stylize";
export default {
  name: "index",
  components: {
    stylize
  },
}
</script>

<style scoped>

</style>