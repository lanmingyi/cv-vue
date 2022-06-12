<!--
 * @Description: 用户选择器 多选
 * @Author: 黄婷
 * @Date: 2021-04-07 15:25:13
 * @LastEditTime: 2021-05-21 14:29:30
 * @LastEditors: 黄婷
 * @FilePath: \misboot-cloud-topvui\src\components\TopVUI\custom\TSelectMultiUser.vue
-->
<template>
	<!-- 定义在这里的参数都是不可在外部覆盖的，防止出现问题 -->
	<t-select-biz-component
		:value="value"
		:ellipsisLength="25"
		:listUrl="url.list"
		:columns="columns"
		:queryParam="queryParam"
		v-on="$listeners"
		v-bind="attrs"
	/>
</template>

<script>
import TSelectBizComponent from './TSelectUserComponent';

export default {
	name: 'JSelectMultiUser',
	components: { TSelectBizComponent },
	props: {
		value: null, // any type
		queryConfig: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			url: { list: '/mdata/user/getPageSet' },
			columns: [
				{ title: '账号', align: 'center', dataIndex: 'userNameId' },
				{ title: '姓名', align: 'center', dataIndex: 'userName' },
				{ title: '性别', align: 'center', dataIndex: 'sex', scopedSlots: { customRender: 'sex' } },
			],
			queryParam: {},
			// 定义在这里的参数都是可以在外部传递覆盖的，可以更灵活的定制化使用的组件
			default: {
				name: '用户',
				width: 1200,
				displayKey: 'userNameId',
				returnKeys: ['userNameId', 'userNameId'],
				queryParamText: '账号',
			},
			// 多条件查询配置
			queryConfigDefault: [
				{
					key: 'sex',
					label: '性别',
					// 如果包含 dictCode，那么就会显示成下拉框
					dictCode: 'sex',
				},
			],
		};
	},
	computed: {
		attrs() {
			return Object.assign(this.default, this.$attrs, {
				queryConfig: this.queryConfigDefault.concat(this.queryConfig),
			});
		},
	},
};
</script>

<style lang="less" scoped></style>
