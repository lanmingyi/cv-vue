<!--
 * @Description: 角色
 * @Author: 黄婷
 * @Date: 2021-01-18 15:17:27
 * @LastEditTime: 2021-05-21 14:29:41
 * @LastEditors: 黄婷
 * @FilePath: \misboot-cloud-topvui\src\components\TopVUI\custom\TSelectRole.vue
-->
<template>
	<t-select-biz-component
		ref="TSelectRole"
		:value="value"
		name="角色"
		displayKey="roleName"
		:returnKeys="returnKeys"
		:paramList="paramsList"
		:listUrl="url.list"
		:columns="columns"
		queryParamText="角色编码"
		v-on="$listeners"
		v-bind="$attrs"
		:showBtn="showBtn"
	/>
</template>

<script>
import TSelectBizComponent from './TSelectBizComponent';

export default {
	name: 'TSelectRole',
	components: {
		TSelectBizComponent,
	},
	// props: [
	// 	'value'
	// ],
	props: {
		paramsList: {
			type: Array,
			default: () => [],
		},
		showBtn: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			value: '',
			returnKeys: ['uuid', 'userNameId'],
			url: {
				list: '/mdata/user/getPageSet',
			},
			columns: [
				{
					title: '姓名',
					dataIndex: 'userName',
					align: 'left',
					width: 160,
				},
				{
					title: '工号',
					dataIndex: 'userNameId',
					align: 'left',
				},
			],
		};
	},
	methods: {
		show(e) {
			this.$refs.TSelectRole.show(e);
		},
	},
};
</script>

<style lang="less" scoped></style>
