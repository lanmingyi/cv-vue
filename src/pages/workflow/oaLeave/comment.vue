<!--
 * @Description: 审批意见
 * @Author: 黄婷
 * @Date: 2021-05-31 18:44:52
 * @LastEditTime: 2021-05-31 18:58:03
 * @LastEditors: 黄婷
 * @FilePath: \misboot-cloud-topvui\src\pages\workflow\oaLeave\comment.vue
-->
<template>
	<t-modal
		title="审批意见"
		:width="640"
		:visible="visible"
		@ok="
			() => {
				visible = false;
			}
		"
		@cancel="
			() => {
				visible = false;
			}
		"
	>
		<a-table
			bordered
			size="small"
			:rowKey="(record, index) => record.comment.id"
			:columns="columns"
			:data-source="dataList"
			:pagination="false"
		></a-table
	></t-modal>
</template>

<script>
const columns = [
	{
		title: '当前环节',
		dataIndex: 'activityName',
		sorter: false,
		align: 'center',
	},
	{
		title: '执行人',
		dataIndex: 'userName',
		sorter: false,
		align: 'center',
	},
	{
		title: '审批意见',
		dataIndex: 'comment.message',
		sorter: false,
		align: 'center',
	},
	{
		title: '处理时间',
		dataIndex: 'comment.time',
		sorter: false,
		align: 'center',
	},
];
export default {
	data() {
		return {
			columns,
			dataList: [],
			visible: false,
		};
	},
	methods: {
		getCommentList(uuid) {
			this.$post('/workflow/oaLeave/getListCommentsByBusinessKey', {
				businessKey: uuid,
			}).then((res) => {
				if (res.statusCode != 300) {
					this.visible = true;
					this.dataList = res.commentBeans;
				} else {
					this.$message.error(res.message);
				}
			});
		},
	},
};
</script>

<style lang="scss" scoped></style>
