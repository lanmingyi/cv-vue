<template>
  <t-drawer class="r-dw" :visible="visible"  :fullscreen="fullscreen" :switchFullscreen="fullscreen" @close="() => { $emit('cancel') }">
    <div class="r-content">
      <iframe :src="src" frameborder="no" style="width: 100%;height: 100%" scrolling="auto" />
    </div>
  </t-drawer>
</template>
<script>
  import { ACCESS_TOKEN } from '@/store/mutation-types'
  import Vue from 'vue'
  import { baseUrl } from '@/services/baseUrl.js'
  export default {
    data () {
      return {
        src: '',
        fullscreen:true,
        height: document.documentElement.clientHeight - 94.5 + 'px'
      }
    },
    props:{
      visible:{
        type:Boolean
      },
      loading:{
        type:Boolean
      },
    },
    mounted: function () {
      console.log(111111)
      const that = this
      that.getToken()
      window.onresize = function temp () {
        that.height = document.documentElement.clientHeight - 94.5 + 'px'
      }
    },
    methods: {
      getToken () {
        this.src = baseUrl+'/report/ureport/designer?token=' + Vue.ls.get(ACCESS_TOKEN)
      }
    }
  }
</script>
<style>
  .r-content{
    height: calc(100vh - 50px);
  }
  .r-dw .ant-drawer-close{
    top: -10px !important;
    width: 48px !important;
    height: 48px !important;
  }
</style>
