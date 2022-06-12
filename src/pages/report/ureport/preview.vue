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
	import { getQueryString } from '@/services/common.js'
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
      console.log(111111,getQueryString('_u'),this.$route.path)
      const that = this
      that.getToken()
			
      window.onresize = function temp () {
        that.height = document.documentElement.clientHeight - 94.5 + 'px'
      }
    },
    methods: {
      getToken () {
        // this.src = baseUrl + this.$route.path + '&token='+Vue.ls.get(ACCESS_TOKEN)
				// console.log("src========",this.src)
				window.open(baseUrl + this.$route.path + '&token='+Vue.ls.get(ACCESS_TOKEN) + '&token='+Vue.ls.get(ACCESS_TOKEN), '_blank')
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
