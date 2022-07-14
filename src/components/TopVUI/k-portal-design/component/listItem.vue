<!--
 * @Description: 传入record数据，通过判断record.type，来渲染对应的组件
 * @Author: lmy
 * @Date: 2021-05-20 18:13:04
 * @LastEditTime: 2021-07-21 15:23:15
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
	<div>
		<template v-if="record.type === 'card'">
			<card-list :record="record"></card-list>
		</template>
		<template v-if="record.type === 'list'">
			<article-card :record="record"></article-card>
		</template>
		<template v-if="record.type === 'timeLine'">
			<time-line :record="record"></time-line>
		</template>
		<template v-if="record.type === 'bar'">
			<barChart :record="record" style="width:100%,height:100%"></barChart>
		</template>
		<template v-if="record.type === 'line'">
			<lineChart :record="record"></lineChart>
		</template>
		<template v-if="record.type === 'pie'">
			<pieChart :record="record"></pieChart>
		</template>
		<template v-if="record.type === 'calendar'">
			<calendar :record="record"></calendar>
		</template>
		<template v-if="record.type === 'weather'">
			<weather :record="record"></weather>
		</template>
		<template v-if="record.type === 'flowCard'">
			<flowCard :record="record"></flowCard>
		</template>
		<template v-if="record.type === 'miniCard'">
			<miniCard :record="record"></miniCard>
		</template>
	</div>
</template>
<script>
// import moment from "moment";
import {
	cardList,
	articleCard,
	timeLine,
	barChart,
	lineChart,
	pieChart,
	calendar,
	weather,
	flowCard,
	miniCard,
} from '../component';
export default {
	name: 'klistItem',
	props: {
		// 表单数组
		record: {
			type: Object,
			required: true,
		},
		dynamicData: {
			type: Object,
			default: () => ({}),
		},
	},
	components: {
		cardList,
		articleCard,
		timeLine,
		barChart,
		lineChart,
		pieChart,
		calendar,
		weather,
		flowCard,
		miniCard,
	},
	computed: {
		customList() {
			if (window.$customComponentList) {
				return window.$customComponentList.map((item) => item.type);
			} else {
				return [];
			}
		},
	},
	watch: {
		record(val) {
			// console.log(val.options.defaultValue)
			val.options.defaultValue = val.options.defaultValue ? val.options.defaultValue : '';
		},
	},
	mounted() {
		// console.log(this.isView,'111111111111')
	},
	methods: {
		validationSubform() {
			// 验证动态表格
			if (!this.$refs.KBatch) return true;
			return this.$refs.KBatch.validationSubform();
		},
		handleChange(value, key) {
			this.record.options.defaultValue = value;
			// change事件
			this.$emit('change', value, key);
		},
	},
};
</script>
<style lang="less" scoped>
.slider-box {
	display: flex;
	> .slider {
		flex: 1;
		margin-right: 16px;
	}
	> .number {
		width: 70px;
	}
}
</style>
