<template>
	<div class="page-common-layout">
		<div class="page-common-content">
			<div class="page-common-box-content">
				<tool-bar @search="$refs.table.refresh(true)" @reset="
			     () => {
			       (this.queryParam = {}), $refs.table.refresh(true);
			     }
			   ">
					<template slot="toolBtn" slot-scope="scope">
						<a-button class="cu-btn-primary" icon="plus" @click="handleAdd('master')"
							v-action:msgWebNoticeAddDialog>新增</a-button>
						<!-- <a-button
			       class="cu-btn-default"
			       icon="edit"
			       @click="handleEdit($refs.masterList.rows, 'master')"
			       v-action:msgWebNoticeEditDialog
			       >编辑</a-button
			     > -->
						<a-button class="cu-btn-danger" icon="delete"
							@click="handleSub($refs.masterList.selectedRowKeys, 'master')"
							v-action:msgWebNoticeDelDialog>删除</a-button>
					</template>
				</tool-bar>
				<data-grid ref="masterList" type="master" :columns="masterColumns" :url="url" bordered rowKey="uuid"
					:pageSize="10" showPagination="auto" @rowClick="
			     (e) => {
			       masterRowClick(e, { webNoticeUuid: 'uuid' });
			     }
			   ">
					<span slot="action" slot-scope="{ text, record }">
						<template>
							<a @click="handleEdit(record, 'master')">编辑</a>
							<a-divider type="vertical" />
							<a @click="handleSub(record, 'master')">删除</a>
						</template>
					</span>
				</data-grid>
				<edit-form ref="masterModal" :visible="masterVisible" :loading="masterConfirmLoading" :model="masterMdl"
					@cancel="handleCancel('master')" @ok="handleOk('master')" />
			</div>

			<div class="page-common-box-content">
				<a-tabs type="card">
					<a-tab-pane key="1" tab="消息接收人员">
						<data-grid ref="subList" type="sub" :url="url" :columns="subColumns" bordered
							:queryParam="subQueryParam" rowKey="uuid" showPagination="auto">
							<span slot="sendStatus" slot-scope="{ text }">
								{{ text | statusFilter }}
							</span>
						</data-grid>
					</a-tab-pane>
				</a-tabs>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		masterTableMixin
	} from "@/mixins/masterTableMixin";
	import {
		DataGrid,
		Ellipsis
	} from "@/components";

	import editForm from "./nEdit.vue";

	const masterColumns = [{
			title: "消息标题",
			align: "center",
			dataIndex: "title",
			width: 300,
			sorter: false,
		},
		{
			title: "消息描述",
			align: "center",
			dataIndex: "description",
			sorter: false,
		},
		{
			title: "站内消息类型",
			align: "center",
			dataIndex: "type",
			sorter: false,
		},
		{
			title: "发送人",
			dataIndex: "creator",
			align: "center",
			sorter: false,
		},
		{
			title: "操作",
			dataIndex: "action",
			align: "center",
			width: 100,
			scopedSlots: {
				customRender: "action"
			},
		},
	];
	const subColumns = [{
			title: "接收人姓名",
			dataIndex: "receiverName",
			align: "center",
			sorter: false,
		},
		{
			title: "工号",
			width: 100,
			dataIndex: "receiverId",
			align: "center",
			sorter: false,
		},
		{
			title: "部门",
			width: 150,
			dataIndex: "receiverOrgName",
			align: "center",
			sorter: false,
		},
		{
			title: "发送状态",
			width: 100,
			dataIndex: "sendStatus",
			align: "center",
			scopedSlots: {
				customRender: "sendStatus"
			},
			sorter: false,
		},
		{
			title: "是否已读",
			width: 100,
			dataIndex: "receiverStatus",
			align: "center",
			sorter: false,
		},
	];
	export default {
		name: "TableList",
		mixins: [masterTableMixin],
		components: {
			DataGrid,
			Ellipsis,
			editForm,
		},
		data() {
			this.masterColumns = masterColumns;
			this.subColumns = subColumns;
			return {
				masterColumns,
				subColumns,
				// create model
				masterVisible: false,
				visible: false,
				visibleDic: false,
				confirmLoading: false,
				confirmLoadingDic: false,
				masterConfirmLoading: false,
				masterMdl: null,
				mdlDic: null,
				subQueryParam: {},
				// 高级搜索 展开/关闭
				advanced: false,
				// 查询参数
				queryParam: {},
				queryParamDicItem: {},
				masterSelectedRows: [],
				masterRows: "",
				uuids: "",
				url: {
					masterList: "/message/msgWebNotice/getPageSet",
					subList: "/message/msgWebNotice/getRelationPageSet",
					masterAdd: "/message/msgWebNotice/save",
					masterUpdate: "/message/msgWebNotice/update",
					masterDelete: "/message/msgWebNotice/deleteBatch",
				},
			};
		},
		filters: {
			statusFilter(sendStatus) {
				const statusMap = {
					0: "失败",
					1: "成功",
				};
				return statusMap[sendStatus];
			},
		},
		methods: {
			handleSend() {
				let form = {};
				form = this.$refs.subModal.form;
				this.subConfirmLoading = true;
				form.validateFields((errors, values) => {
					if (!errors) {
						// 新增
						this.$post(this.url.subAdd, values).then((res) => {
							if (res === 1 || res.statusCode === 200) {
								this.subVisible = false;
								// 重置表单数据
								form.resetFields();
								// 刷新表格
								this.$refs.masterList.refresh();
								this.$message.info("新增成功");
							} else {
								this.$message.error(res.message);
							}
						});
						this.subConfirmLoading = false;
					} else {
						this.subConfirmLoading = false;
					}
				});
			},
			resetForm() {
				this.queryParam = {};
				this.$refs.masterList.refresh();
			},
		},
	};
</script>

<style lang="less"></style>
