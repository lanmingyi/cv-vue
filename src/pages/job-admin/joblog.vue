<template>
  <div :style="'height:'+ height">
    <iframe :src="src" frameborder="no" style="width: 100%;height: 100%" scrolling="auto" />
  </div>
</template>
<script>
  import { jobUrl } from '@/services/baseUrl.js'
  export default {
    data () {
      return {
        src: '',
        height: document.documentElement.clientHeight - 94.5 + 'px'
      }
    },
    mounted: function () {
      const that = this
      that.getToken()
      window.onresize = function temp () {
        that.height = document.documentElement.clientHeight - 94.5 + 'px'
      }
    },
    methods: {
      getToken () {
        this.src = jobUrl+'/xxl-job-admin/joblog'
      }
    }
  }
</script>
