<!--
 * @Description: 数据表格尺寸
 * @Author: lmy
 * @Date: 2021-06-02 13:38:08
 * @LastEditTime: 2021-07-02 16:42:19
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
	<div class="action-size" ref="root">
		<a-tooltip title="密度">
			<a-dropdown placement="bottomCenter" :trigger="['click']" :get-popup-container="() => $refs.root">
				<a-icon class="action" type="column-height" />
				<a-menu :selected-keys="[value]" slot="overlay" @click="onClick">
					<a-menu-item key="default">
						默认
					</a-menu-item>
					<a-menu-item key="middle">
						中等
					</a-menu-item>
					<a-menu-item key="small">
						紧密
					</a-menu-item>
				</a-menu>
			</a-dropdown>
		</a-tooltip>
	</div>
</template>

<script>
export default {
	name: 'ActionSize',
	props: ['value'],
	inject: ['table'],
	data() {
		return {
			selectedKeys: ['middle'],
		};
	},
	methods: {
		onClick({ key }) {
			this.$emit('input', key);
		},
	},
};
</script>

<style scoped lang="less">
.action-size {
	display: inline-block;
}
</style>
