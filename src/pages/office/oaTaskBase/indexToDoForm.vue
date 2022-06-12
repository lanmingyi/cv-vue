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
					<div style="height: calc(100% - 40px - 44px);">
						<tree-grid ref="masterList" :scroll="scrollXY" :columns="columns" rowKey="uuid" :url="url" :parameter="parameter"
							:pagination="pagination" @onSelectChange="onSelectChangeMaster" @rowClick="masterRowClick">
							<span slot="priority" slot-scope="{ text }">
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
							<span slot="status" slot-scope="{ text }">
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
							<span slot="action" slot-scope="{ record }">
								<template>
									<a @click.stop="masterRowClick(record)">详情</a>
								</template>
							</span>
						</tree-grid>
					</div>
				</div>
			</a-layout-sider>
			<transition name="bounce">
				<a-layout-content style="padding-left: 40px;" class="layout-box" v-show="rightShow">
					<div class="page-common-content">
						<detail-form actType="view" ref="createModal" :model="masterRows ? masterRows : {}"
							:paramList="queryParamTaskProblem" :fileUrl="urlFile" @closeRight="closeRight"
							@update="handleUpadte" />
					</div>
				</a-layout-content>
			</transition>
		</a-layout>
		<!-- <edit-form ref="masterModal" :type="key" :visible="masterVisible" :loading="masterConfirmLoading" :model="masterMdl" @cancel="handleCancel" @ok="handleOk" /> -->
	</div>
</template>

<script>
	import TreeGrid from "@/components/TopVUI/custom/TreeGrid";
	import {
		dataTreeMixin
	} from "@/mixins/dataTreeMixin";
	import detailForm from "./oaTaskBaseDetail.vue";
	import editForm from "./edit.vue";

	export default {
		name: "TableList",
		mixins: [dataTreeMixin],
		components: {
			editForm,
			detailForm,
			TreeGrid,
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
				pagination: {
					pageSize: 10,
					showSizeChanger: true,
					showQuickJumper: true,
					showTotal: (total, range) => {
						return " 共 " + total + " 条";
					},
					onShowSizeChange: (current, pageSize) =>
						this.onShowSizeChange(current, pageSize),
				},
				url: {
					fathersUrl: "/office/oaTaskBase/getToDoTaskBaseByLevelId",
					expandUrl: "/office/oaTaskBase/getListByPid",
					masterDelete: "/office/oaTaskBase/deleteBatch",
					masterUpdate: "/office/oaTaskBase/update",
				},
				parameter: {
					father: {
						levelId: 1,
					},
					children: {},
				},
				urlFile: {
					webUpload: "/document/oss/multiUpload",
					getPageSet: "/document/fastdfs/getPageSet",
					deleteBatch: "/document/fdfs/delete",
					update: "/document/fastdfs/update",
				},
				leftWidth: "100%",
				rightShow: false,
				pageClientHeight: 0,
				toolbarHeight: 0,
			};
		},
		created() {
			this.columns = [...this.columns, ...this.columnsList];
		},
		computed:{
			scrollXY() {
				let height = this.pageClientHeight - this.toolbarHeight - 85 - 20;
				console.log("height",height)
				return height ?
					{
						y: height,
					} :
					{};
			},
		},
		beforeDestroy() {
			this.destroyResizeEvent();
		},
		mounted() {
			this.resizeHandler();
			this.initResizeEvent();
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
		methods: {
			// 表格高度自适应	
			resizeHandler() {
				// 获取页面内容的高度
				this.pageClientHeight = document.getElementsByClassName(
					"page-common-layout"
				)[0]?.clientHeight;
				this.toolbarHeight = document.getElementsByClassName(
					"toolbar"
				)[0]?.clientHeight;
				console.log("this.pageClientHeight",this.pageClientHeight,this.toolbarHeight)
			},
			//监听resize
			initResizeEvent() {
				window.addEventListener("resize", this.resizeHandler, false);
			},
			//移除resize
			destroyResizeEvent() {
				window.removeEventListener("resize", this.resizeHandler);
			},
			masterRowClick(record, index) {
				const that = this;
				that.masterRows = record;
				that.uuids = record.uuid;
				that.queryParamList = {
					puuid: record.uuid,
					id: record.id,
				};
				that.resizeHandler()
				if (that.$refs.createModal)
					that.$refs.createModal.refreshList(
						that.queryParamList,
						that.masterRows
					); // 设置刷新子表
				that.columns.splice(2);
				that.leftWidth = 400;
				that.rightShow = true;
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
				const form = this.$refs.createModal.form;
				form.validateFields((errors, values) => {
					if (!errors) {
						if (type) {
							values.type = type;
						}
						this.$post("/office/oaTaskBase/update", values)
							.then((res) => {
								if (res.statusCode === 200 || res === 1) {
									this.$refs.masterList.refresh();
									this.$message.success(
										res.message ? res.message : "操作成功",
										1.5
									);
									if (this.$refs.createModal)
										this.$refs.createModal.refreshList(
											this.queryParamList,
											this.masterRows
										); // 设置刷新子表
								} else {
									this.$message.error(res.message, 1.5);
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
