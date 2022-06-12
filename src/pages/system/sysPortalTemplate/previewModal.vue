<!--
 * @Description: 门户拖拽设计
 * @Author: 黄婷
 * @Date: 2021-05-21 17:19:40
 * @LastEditTime: 2021-05-21 19:03:28
 * @LastEditors: 黄婷
 * @FilePath: \misboot-cloud-topvui\src\pages\system\sysPortalTemplate\previewModal.vue
-->
<template>
	<t-drawer
		class="k-dr"
		:visible="visible"
		:closable="false"
		:fullscreen="fullscreen"
		:switchFullscreen="fullscreen"
		@close="
			() => {
				$emit('cancel');
			}
		"
	>
		<KPortalDesign
			:json-data="jsonData"
			@close="
				() => {
					$emit('cancel');
				}
			"
			@save="
				(value) => {
					handleOk(value);
				}
			"
		></KPortalDesign>
	</t-drawer>
</template>

<script>
import KPortalDesign from '@/components/TopVUI/k-portal-design/preview/index';

export default {
	props: { visible: { type: Boolean }, templateUuid: { type: String, default: '' } },
	components: { KPortalDesign },
	data() {
		return {
			fullscreen: true,
			jsonData: {},
		};
	},
	methods: {
		getPreviewData(val) {
			this.jsonData = val.templateJsonData ? JSON.parse(val.templateJsonData) : {};
		},
	},
};
</script>

<style lang="scss">
.k-dr {
	.ant-drawer-body {
		padding: 0 !important;
	}
}
</style>
