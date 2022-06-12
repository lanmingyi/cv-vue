<template>
	<t-modal title="wps" :width="640" :footer="false" :fullscreen="true" :switchFullscreen="true" :visible="visible" @ok="() => { $emit('ok') }" @cancel="() => { $emit('update:visible',false) }">
		<div  v-loading="loading">
			<iframe :src="url" frameborder="no" :style="{width: '100%',height: height}" scrolling="auto" />
		</div>
	</t-modal>
</template>

<script>
	import util from '@/utils/util'
	import store from '@/store'
	import { mapGetters } from 'vuex'
	import loading from '@/directive/loading/index.js';
	export default {
		data() {
			return {
				src: 'https://www.baidu.com/',
				id: 'xxxx',
				height: document.documentElement.clientHeight - 68 + 'px',
				ifamSrc: '',
				loading: false
			}
		},
		props:{
			visible:{
				type:Boolean
			},
			url:{
				type:String
			},
		},
		computed: {
			...mapGetters(['wpsUrl'])
		},
		directives: {
			loading
		},
		mounted() {
			this.timer = setInterval(this.changeLoading, 3000);
			util.$on('getUrl', (url) => {
				store.commit('SET_WPSURL', url)
			})
			this.src = this.wpsUrl
		},
		methods:{
			changeLoading(){
				this.loading = false;
			}
		},
		destroyed() {
			
		}
	}
</script>

<style scoped="scoped">
	.t-modal-box .ant-modal-body{
		margin: 0 !important;
		padding: 0 !important;
	}
</style>
