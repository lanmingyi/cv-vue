<!--
 * @Description: 门户拖拽设计
 * @Author: lmy
 * @Date: 2021-05-21 17:19:40
 * @LastEditTime: 2021-05-21 19:43:45
 * @LastEditors: lmy
 * @FilePath: \misboot-cloud-topvui\src\pages\system\sysPortalTemplate\designModal.vue
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
import KPortalDesign from '@/components/TopVUI/k-portal-design/index';

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
		handleOk(value) {
			this.$post('/system/sysPortalTemplate/update', {
				uuid: this.templateUuid,
				templateJsonData: value,
			}).then((res) => {
				if (res.statusCode === 200) {
					this.$message.success(res.message ? res.message : '操作成功', 1.5);
					this.$emit('ok');
				} else {
					this.$message.error(res.message, 1.5);
				}
			});
		},
		getDesignData(val) {
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
