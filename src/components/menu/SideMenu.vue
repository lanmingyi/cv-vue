<template>
  <a-layout-sider :theme="sideTheme" :class="['side-menu', 'beauty-scroll', isMobile ? null : 'shadow']" width="256px" :collapsible="collapsible" v-model="collapsed" :trigger="null">
    <div :class="['logo', theme]">
      <router-link to="/system/portal/index">
	   <img :src="companyPlatformIcon" alt="logo">
	   <h1 v-if="!isShowTitle">{{systemNameShort}}</h1>
      </router-link>
    </div>
    <i-menu :theme="themes" :collapsed="collapsed" :menu="menuData" @select="onSelect" class="menu"/>
  </a-layout-sider>
</template>

<script>
import IMenu from './menu'
import {mapState,mapGetters} from 'vuex'
export default {
  name: 'SideMenu',
  components: {IMenu},
  props: {
    collapsible: {
      type: Boolean,
      required: false,
      default: false
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    menuData: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
	isShowTitle:{
		type: Boolean,
		required: false,
		default: false
	}
  },
  data(){
	  return{
		  themes:'dark'
	  }
  },
  computed: {
    sideTheme() {
      return this.themes = (this.theme == 'light' ? this.theme : 'dark')
    },
    ...mapState('setting', ['isMobile', 'systemName']),
	...mapGetters(['configData']),
	systemNameShort(){
		let index = this.configData.findIndex(item => item.code === 'systemNameShort')
		if(index>=0){
			return this.configData[index].value
		} else {
			return '智能运输管理ERP系统'
		}
	},
	companyPlatformIcon(){
		let index = this.configData.findIndex(item => item.code === 'companyPlatformIcon')
		if(index>=0){
			return this.configData[index].value
		} else {
			return 'https://zysd-shanghai.oss-cn-shanghai.aliyuncs.com/emis/logo.png'
		}
	}
  },
  methods: {
    onSelect (obj) {
      this.$emit('menuSelect', obj)
    }
  }
}
</script>

<style lang="less" scoped>
@import "index";
.logo a{
    height: 54px !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
  }
</style>
