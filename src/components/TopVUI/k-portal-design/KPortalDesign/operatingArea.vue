<!--
 * @Description: 头部操作按钮
 * @Author: 黄婷
 * @Date: 2021-05-20 18:13:04
 * @LastEditTime: 2021-05-21 13:58:08
 * @LastEditors: 黄婷
 * @FilePath: \misboot-cloud-topvui\src\components\TopVUI\k-portal-design\component\operatingArea.vue
-->
<template>
	<div class="operating-area">
		<!-- 头部操作按钮区域 start -->
		<!-- 操作左侧区域 start -->
		<div class="left-btn-box">
			<a-button icon="play-circle" type="link" @click="$emit('handleSave')">
				保存
			</a-button>
			<a-button icon="play-circle" type="link" @click="$emit('handlePreview')">
				预览
			</a-button>
			<a-button class="delete-btn" icon="delete" type="link" @click="$emit('handleReset')">
				清空
			</a-button>
			<!-- 按钮左侧插槽 start -->
			<slot name="left-action"></slot>
			<!-- 按钮左侧插槽 end -->
		</div>
		<!-- 操作左侧区域 end -->
		<!-- 操作右侧区域 start -->
		<div class="right-btn-box">
			<!-- 按钮右侧插槽 start -->
			<slot name="right-action"></slot>
			<!-- 按钮右侧插槽 end -->
			<a-tooltip title="关闭">
				<a v-if="toolbars.includes('close')" @click="$emit('handleClose')">
					<a-icon type="close" />
				</a>
			</a-tooltip>
		</div>
		<!-- 操作右侧区域 end -->
		<!-- 头部操作按钮区域 end -->
	</div>
	<!-- 操作区域 start -->
</template>
<script>
export default {
	props: {
		toolbars: {
			type: Array,
			default: () => ['save', 'preview', 'reset', 'close'],
		},
		showToolbarsText: {
			type: Boolean,
			default: false,
		},
	},
	methods: {
		handleDownload() {
			console.log(12345);
			this.$emit('handleDownloads');
		},
	},
};
</script>
