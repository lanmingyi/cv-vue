<template>
  <div :style="'height:'+ height">
    <iframe ref="previewPage" :src="src" frameborder="no" style="width: 100%;height: 100%;" scrolling="auto" />
  </div>
</template>
<script>
	import Vue from 'vue'
	import {
	  ACCESS_TOKEN
	} from '@/store/mutation-types'
	import { getQueryString } from '@/services/common'
  export default {
    data () {
      return {
        src: '',
        height: document.documentElement.clientHeight - 150 + 'px'
      }
    },
    mounted(){
			var uuid = getQueryString('uuid')
      const that = this
			that.src = `view.html?uuid=${uuid}&token=${Vue.ls.get(ACCESS_TOKEN)}`
      window.onresize = function temp () {
        that.height = document.documentElement.clientHeight - 150 + 'px'
      }
    },
    methods: {
    }
  }
</script>
