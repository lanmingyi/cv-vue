<template>
	<div class="page-common-layout">
		<a-layout>
			<a-layout-sider :width="leftWidth" style="" class="layout-box">
				<div class="page-common-content">
					<div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
						<div class="table-operator">
							<a-button class="cu-btn-danger" icon="delete" @click="handleSub('all')">删除</a-button>
						</div>
					</div>
					<DataGrid ref="table" :columns="columns" :url="url" :queryParam="queryParam" rowKey="uuid"
						:format-conditions="true">
						<span slot="priority" slot-scope="{text}">
							<a-tag color="pink" v-if="text == 1">
								{{ text | priorityFilter }}
							</a-tag>
							<a-tag color="orange" v-if="text == 2">
								{{ text | priorityFilter }}
							</a-tag>
							<a-tag color="green" v-if="text == 3">
								{{ text | priorityFilter }}
							</a-tag>
						</span>
						<span slot="status" slot-scope="{text}">
							<a-tag color="pink" v-if="text == 0">
								{{ text | statusFilter }}
							</a-tag>
							<a-tag color="green" v-if="text == 1">
								{{ text | statusFilter }}
							</a-tag>
							<a-tag color="blue" v-if="text == 2">
								{{ text | statusFilter }}
							</a-tag>
						</span>
						<span slot="action" slot-scope="{text, record}">
							<template>
								<a @click.stop="masterRowClick(record)">详情</a>
							</template>
						</span>
					</DataGrid>
				</div>
			</a-layout-sider>
			<transition name="bounce">
				<a-layout-content style="padding-left: 40px;" class="layout-box" v-show="rightShow">
					<div class="page-common-content">
						<detail-form actType="view" ref="masterModal" :model="masterRows ? masterRows : {}"
							:paramList="queryParamTaskProblem" :fileUrl="urlFile" @closeRight="closeRight"
							@update="handleUpadte" />
					</div>
				</a-layout-content>
			</transition>
		</a-layout>
		<edit-form ref="createModal" :type="key" :visible="masterVisible" :loading="masterConfirmLoading"
			:model="masterMdl" @cancel="handleCancel" @ok="handleOk" />
	</div>
</template>

<script>
	import {
		DataGrid
	} from "@/components";
	import {
		dataGridMixin
	} from "@/mixins/dataGridMixin";
	import detailForm from "./oaTaskBaseDetail.vue";
	import editForm from "./edit.vue";

	export default {
		name: "TableList",
		mixins: [dataGridMixin],
		components: {
			DataGrid,
			editForm,
			detailForm
		},
		data() {
			return {
				columnsList: [{
						title: "优先级",
						dataIndex: "priority",
						sorter: true,
						ellipsis: true,
						scopedSlots: {
							customRender: "priority",
						},
					},
					{
						title: "任务类型",
						dataIndex: "taskTypeText",
						sorter: true,
						ellipsis: true,
					},
					{
						title: "任务状态",
						dataIndex: "status",
						sorter: true,
						ellipsis: true,
						scopedSlots: {
							customRender: "status",
						},
					},
					{
						title: "计划开始时间",
						dataIndex: "planStartTime",
						sorter: true,
						ellipsis: true,
					},
					{
						title: "计划结束时间",
						dataIndex: "planEndTime",
						sorter: true,
						ellipsis: true,
					},
					{
						title: "创建人",
						dataIndex: "creator",
						sorter: true,
						ellipsis: true,
					},
					{
						title: "操作",
						dataIndex: "action",
						width: 100,
						align: "center",
						scopedSlots: {
							customRender: "action",
						},
					},
				],
				columns: [{
						title: "任务标题",
						dataIndex: "title",
						width: 200,
						ellipsis: true,
						sorter: true,
					},
					{
						title: "指派人",
						dataIndex: "assigner",
						sorter: true,
						ellipsis: true,
					},
				],
				visibleDetail: false,
				tabKey: 1,
				key: "0",
				masterConfirmLoading: false,
				masterVisible: false,
				masterMdl: null,
				masterRows: null,
				masterSelectedRowKeys: [],
				masterSelectedRows: [],
				data: [],
				queryParam: {},
				queryParamList: {},
				queryParamTaskEvolve: {},
				queryParamTaskPlan: {},
				queryParamTaskProblem: {},
				queryParamAccessory: {},
				selectedRowKeys: [],
				selectedRows: [],
				defaultExpandedRowKeys: [],
				url: {
					getPageSet: "/office/oaTaskBase/getPageSetNotCompleted",
					save: "/office/oaTaskBase/save",
					update: "/office/oaTaskBase/update",
					deleteBatch: "/office/oaTaskBase/deleteBatch",
				},
				urlFile: {
					webUpload: "/document/oss/multiUpload",
					getPageSet: "/document/fastdfs/getPageSet",
					deleteBatch: "/document/fdfs/delete",
					update: "/document/fastdfs/update",
				},
				leftWidth: "100%",
				rightShow: false,
			};
		},
		created() {
			this.columns = [...this.columns, ...this.columnsList];
		},
		mounted() {
			// console.log(this.$refs.masterList.getListData(),'11111')
		},
		filters: {
			statusFilter(status) {
				const statusMap = {
					0: "未开始",
					1: "已接收",
					2: "已完成",
				};
				return statusMap[status];
			},
			priorityFilter(status) {
				const statusMap = {
					1: "一级",
					2: "二级",
					3: "三级",
				};
				return statusMap[status];
			},
		},
		computed: {
		},
		methods: {
			rowClassName(row) {
				return row.uuid === this.uuids ? "bg-bray" : "";
			},
			masterRowClick(record, index) {
				console.log("record-----", record);
				const that = this;
				that.masterRows = record;
				that.uuids = record.uuid;
				that.queryParamList = {
					puuid: record.uuid,
					id: record.id,
				};
				that.columns.splice(2);
				that.leftWidth = 400;
				that.rightShow = true;
				if (that.$refs.masterModal)
					that.$refs.masterModal.refreshList(
						that.queryParamList,
						that.masterRows
					); // 设置刷新子表
			},
			closeRight() {
				let that = this;
				that.columns = [...that.columns, ...that.columnsList];
				that.leftWidth = "100%";
				that.rightShow = false;
			},
			refresh() {
				const form = this.$refs.masterModal.form;
				form.resetFields();
				this.masterRows = null;
				this.uuids = "";
				this.search();
				this.masterConfirmLoading = false;
			},
			refreshParams() {
				this.queryParam = {};
				this.search();
			},
			search() {
				this.$refs.masterList.getListData();
			},
			handleCancelDetail() {
				this.visibleDetail = false;
			},
			handleUpadte(type) {
				const form = this.$refs.masterModal.form;
				form.validateFields((errors, values) => {
					if (!errors) {
						if (type) {
							values.type = type;
						}
						
						this.$post("/office/oaTaskBase/update", values)
							.then((res) => {
								if (res.statusCode === 200 || res === 1) {
									this.$refs.table.refresh();
									this.$message.success(
										res.message ? res.message : "操作成功",
										1.5
									);
									if (this.$refs.masterModal)
										this.$refs.masterModal.refreshList(
											this.queryParamList,
											this.masterRows
										); // 设置刷新子表
								} else {
									this.$message.error(res.message, 1.5);
								}
								if(type == "yes" || values.status == "2"){
									this.closeRight();
								}
							})
							.finally(() => {});
					}
				});
			},
		},
	};
</script>

<style></style>
