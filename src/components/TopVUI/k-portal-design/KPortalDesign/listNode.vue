<!--
 * @Description: 将数据通过listItem组件解析，生成控件
 * @Author: 黄婷
 * @Date: 2021-05-20 18:13:04
 * @LastEditTime: 2021-07-21 15:18:43
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\k-portal-design\KPortalDesign\listNode.vue
-->
<template>
	<div
		class="drag-move-box"
		@click.stop="$emit('handleSelectItem', record)"
		:class="{ active: record.key === selectItem.key }"
	>
		<div class="form-item-box">
			<klistItem :record="record" />
		</div>
		<!-- <div v-if="!hideModel" class="show-key-box" v-text="record.model" /> -->
		<div
			class="copy"
			:class="record.key === selectItem.key ? 'active' : 'unactivated'"
			@click.stop="$emit('handleCopy')"
		>
			<a-icon type="copy" />
		</div>
		<div
			class="delete"
			:class="record.key === selectItem.key ? 'active' : 'unactivated'"
			@click.stop="$emit('handleDelete')"
		>
			<a-icon type="delete" />
		</div>
	</div>
</template>
<script>
import klistItem from '../component/listItem';
export default {
	props: {
		record: {
			type: Object,
			required: true,
		},
		selectItem: {
			type: Object,
			default: () => {},
		},
		hideModel: {
			type: Boolean,
			default: false,
		},
	},
	components: {
		klistItem,
	},
};
</script>
