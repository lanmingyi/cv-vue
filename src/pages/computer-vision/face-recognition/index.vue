<template>
  <a-tabs default-active-key="1">
    <a-tab-pane key="1" tab="识别">
      <recognition ref="detect"></recognition>
    </a-tab-pane>
    <a-tab-pane key="2" tab="训练">
      <train ref="train"></train>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import recognition from "./recognition";
import train from "./train";
export default {
  name: "index",
  components: {
    recognition,
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