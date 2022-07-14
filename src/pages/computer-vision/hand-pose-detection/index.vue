<template>
  <a-tabs default-active-key="1">
    <a-tab-pane key="1" tab="识别">
      <detection ref="detect"></detection>
    </a-tab-pane>
    <a-tab-pane key="2" tab="训练">
      <train ref="train"></train>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import detection from "./detection";
import train from "./train";
export default {
  name: "index",
  components: {
    detection,
    train,
  },
  data() {
    return {
    }
  },

  methods: {

  },
}
</script>

<style scoped>

</style>