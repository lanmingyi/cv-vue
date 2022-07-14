<!--
 * @Description: 页面预览时使用递归组件调用自己，生成布局结构及组件
 * @Author: lmy
 * @Date: 2021-05-20 18:13:04
 * @LastEditTime: 2021-07-21 15:20:31
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
	<!-- 标签页布局 -->
	<a-tabs
		v-if="record.type === 'tabs'"
		class="grid-row"
		:default-active-key="0"
		:tabBarGutter="record.options.tabBarGutter"
		:type="record.options.type"
		:size="record.options.size"
		:tabPosition="record.options.tabPosition"
		:animated="record.options.animated"
	>
		<a-tab-pane v-for="(tabItem, index) in record.columns" :key="index" :tab="tabItem.label">
			<buildBlocks
				ref="nestedComponents"
				@handleReset="$emit('handleReset')"
				@change="handleChange"
				v-for="item in tabItem.list"
				:key="item.key"
				:record="item"
			/>
		</a-tab-pane>
	</a-tabs>
	<a-row v-else-if="record.type === 'grid'" :gutter="[record.options.gutters, record.options.vgutters]">
		<a-col class="grid-col" v-for="(colItem, idnex) in record.columns" :key="idnex" :span="colItem.span || 0">
			<buildBlocks
				ref="nestedComponents"
				@handleReset="$emit('handleReset')"
				@change="handleChange"
				v-for="item in colItem.list"
				:key="item.key"
				:record="item"
			/>
		</a-col>
	</a-row>
	<div v-else>
		<klistItem
			ref="nestedComponents"
			@handleReset="$emit('handleReset')"
			@change="handleChange"
			:key="record.key"
			:record="record"
		>
		</klistItem>
	</div>
</template>
<script>
import klistItem from '../component/listItem';
export default {
	name: 'buildBlocks',
	props: {
		record: {
			type: Object,
			required: true,
		},
	},
	components: {
		klistItem,
	},
	mounted() {
		// console.log(this.record,'view====')
	},
	methods: {
		validationSubform() {
			// 验证动态表格
			let nestedComponents = this.$refs.nestedComponents;
			if (typeof nestedComponents === 'object' && nestedComponents instanceof Array) {
				for (let i = 0; nestedComponents.length > i; i++) {
					if (!nestedComponents[i].validationSubform()) {
						return false;
					}
				}
				return true;
			} else if (typeof nestedComponents !== 'undefined') {
				return nestedComponents.validationSubform();
			} else {
				return true;
			}
		},
		handleChange(value, key) {
			this.$emit('change', value, key);
		},
	},
};
</script>
