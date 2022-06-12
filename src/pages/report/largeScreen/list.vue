<template>
	<div :style="'height:' + height">
		<iframe ref="previewPage" :src="src" frameborder="no" style="width: 100%;height: 100%;" scrolling="auto" />
	</div>
</template>
<script>
import Vue from 'vue';
import { ACCESS_TOKEN } from '@/store/mutation-types';
export default {
	data() {
		return {
			src: '',
			height: document.documentElement.clientHeight - 150 + 'px',
		};
	},
	mounted: function() {
		const that = this;
		that.src = `../../list.html`;
		window.onresize = function temp() {
			that.height = document.documentElement.clientHeight - 150 + 'px';
		};
	},
	methods: {},
};
</script>
