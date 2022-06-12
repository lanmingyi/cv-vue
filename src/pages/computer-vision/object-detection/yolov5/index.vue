<template>
  <a-tabs default-active-key="1">
    <a-tab-pane key="1" tab="检测">
      <detect ref="detect"></detect>
    </a-tab-pane>
    <a-tab-pane key="2" tab="训练">
      <train ref="train"></train>
    </a-tab-pane>
  </a-tabs>
</template>


<script>
import detect from './detect'
import train from './train'
export default{
  components: {
    detect,
    train,
  },
  data() {
    return {
    }
  },

  methods: {

  },

};

</script>

<style scoped>

</style>