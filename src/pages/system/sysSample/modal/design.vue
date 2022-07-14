<!--
 * @Description: APP拖拽设计界面
 * @Author: lmy
 * @Date: 2021-07-08 16:36:05
 * @LastEditTime: 2021-07-08 19:57:20
 * @LastEditors: lmy
 * @FilePath: \misboot-cloud-vue\src\pages\system\sysSample\modal\design.vue
-->
<template>
	<a-drawer class="t-drf" :visible="visible" :closable="false" width="100%">
		<template slot="title">
			<a-steps
				v-model="currentIndex"
				type="navigation"
				size="default"
				:style="{
					boxShadow: '0px -1px 0 0 #e8e8e8 inset',
				}"
			>
				<a-step title="表单设计" />
				<a-step title="列表设计" />
			</a-steps>
			<a-button
				@click="
					() => {
						$emit('cancel');
					}
				"
			></a-button>
		</template>
		<iframe
			v-if="currentIndex === 0"
			src="http://192.168.1.252:8080"
			frameborder="no"
			style="width: 100%;height: 100%;"
			scrolling="auto"
		></iframe>
	</a-drawer>
</template>

<script>
export default {
	props: {
		visible: {
			type: Boolean,
			required: true,
		},
		model: {
			type: Object,
			default: () => null,
		},
		loading: {
			type: Boolean,
			required: false,
		},
	},
	data() {
		return {
			fullscreen: true,
			currentIndex: 0,
		};
	},
};
</script>

<style lang="scss" scoped>
.t-drf {
	padding: 0 !important;
}
</style>
