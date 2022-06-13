<!--
 * @Description: 将数据buildBlocks通过组件解析，生成控件
 * @Author: 黄婷
 * @Date: 2021-05-20 18:13:04
 * @LastEditTime: 2021-05-21 14:11:52
 * @LastEditors: 黄婷
 * @FilePath: \misboot-cloud-topvui\src\components\TopVUI\k-portal-design\build\index.vue
-->
<template>
	<div>
		<buildBlocks v-for="(record, index) in value.list" :key="index" :record="record" />
	</div>
</template>
<script>
import buildBlocks from './buildBlocks';
export default {
	props: {
		value: {
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
		buildBlocks,
	},
};
</script>
