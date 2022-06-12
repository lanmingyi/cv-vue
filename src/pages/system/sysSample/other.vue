<template>
	<a-spin :spinning="loading" :style="'height:'+ height">
		<div :style="'height:'+ height">
			<iframe :src="src" frameborder="no" style="width: 100%;height: 100%" scrolling="auto" />
		</div>
	</a-spin>
</template>
<script>
	export default {
		data() {
			return {
				src: 'https://www.misboot.com/',
				height: document.documentElement.clientHeight - 94.5 + 'px',
				loading: true
			}
		},
		mounted: function() {
			setTimeout(() => {
				this.loading = false
			}, 230)
			const that = this
			window.onresize = function temp() {
				that.height = document.documentElement.clientHeight - 94.5 + 'px'
			}
		}
	}
</script>
