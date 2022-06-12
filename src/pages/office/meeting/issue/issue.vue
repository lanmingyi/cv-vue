<template>
	<div class="page-common-layout">
		<div class="page-common-content">
			<div class="page-common-box-content">
				<tool-bar @search="resetSearchForm" @reset="resetForm
				">
					<template slot="toolForm">
						<a-form-item label="">
							<a-input v-model="queryParam.topicsName" placeholder="会议名称" />
						</a-form-item>
					</template>
				</tool-bar>
				<DataGrid ref="table" size="small" :columns="columns" :url="url" bordered :pageSize="10" rowKey="uuid"
					showPagination="auto" @rowClick="masterRowClick" :queryParam="queryParam">
					<span slot="topicsState" slot-scope="{text, record, index}">
						{{ text | statusFilter }}
					</span>
					<span slot="operate" slot-scope="{operate, record}">
						<template v-if="record.topicsState === 'oa.issueStatus01'">
							<a @click="handleAgree(record, 'yes')">同意</a>
							<a-divider type="vertical" />
							<a @click="handleAgree(record, 'no')">驳回</a>
						</template>
					</span>
				</DataGrid>
			</div>
			<div class="page-common-box-content">
				<a-tabs default-active-key="1">
					<a-tab-pane key="1" tab="附件信息">
						<accessory-info ref="accessoryModal" :url="urlFile" tag="fds" label="fds" :model="rows"
							:type="1" :params="queryParamSub"></accessory-info>
					</a-tab-pane>
				</a-tabs>
			</div>
			<edit-form ref="createModal" :visible="visible" :loading="confirmLoading" :model="mdl"
				@cancel="handleCancel()" @ok="handleOk()" />
		</div>
	</div>
</template>

<script>
	import {
		dataGridMixin
	} from "@/mixins/dataGridMixin";
	import {
		DataGrid
	} from "@/components";
	import editForm from "./edit.vue";
	import accessoryInfo from "@/components/TopVUI/accessory/index";
	const columns = [
		{
			title: "议题名称",
			dataIndex: "topicsName",
			width: 200,
			ellipsis: true,
		},
		{
			title: "会议名称",
			dataIndex: "mettingName",
			width: 200,
			ellipsis: true,
		},
		{
			title: "会议时间",
			dataIndex: "startTime",
			width: 150,
			ellipsis: true,
		},
		// {
		// 	title: '申请时间',
		// 	dataIndex: 'createTime',
		// 	width: 200,
		// 	ellipsis: true,
		// },
		{
			title: "申请理由",
			dataIndex: "applyReason",
			width: 200,
			ellipsis: true,
		},
		{
			title: "状态",
			dataIndex: "topicsState",
			width: 100,
			scopedSlots: {
				customRender: "topicsState",
			},
		},
		{
			title: "操作",
			dataIndex: "operate",
			width: 100,
			scopedSlots: {
				customRender: "operate",
			},
		},
	];
	export default {
		name: "TableList",
		mixins: [dataGridMixin],
		components: {
			DataGrid,
			editForm,
			accessoryInfo,
		},
		data() {
			return {
				columns,
				queryParam: {},
				queryParamSub: {},
				url: {
					getPageSet: "/office/oaMeetingTopics/getPageSet",
					save: "/office/oaMeetingTopics/save",
					update: "/office/oaMeetingTopics/update",
					deleteBatch: "/office/oaMeetingTopics/deleteBatch",
					meetingAgreeAndReject: "/office/oaMeetingTopics/meetingAgreeAndReject ",
				},
				urlFile: {
					webUpload: "/document/fdfs/upload",
					getPageSet: "/document/fastdfs/getPageSet",
					deleteBatch: "/document/fdfs/delete",
					update: "/document/fastdfs/update",
					getPageSet: "/document/fastdfs/getPageSet",
				},
				loadData: (parameter) => {
					const requestParameters = Object.assign({}, parameter, this.queryParam);
					return this.$post(this.url.getPageSet, requestParameters).then(
						(res) => {
							return res;
						}
					);
				},
				mdlUserPost: null,
				visible: false,
				mdl: null,
				confirmLoading: false,
				selectedRowKeys: [],
				rows: "",
				masterUuids: "",
				statusList: [],
				titleList: [],
			};
		},
		filters: {
			statusFilter(status) {
				const statusMap = {
					"oa.issueStatus01": "申请中",
					"oa.issueStatus02": "已通过",
					"oa.issueStatus03": "被驳回",
				};
				return statusMap[status];
			},
		},
		computed: {
			rowSelection() {
				return {
					selectedRowKeys: this.selectedRowKeys,
					onChange: this.onSelectChange,
				};
			},
		},
		mounted() {},
		methods: {
			rowClassName(row) {
				return row.uuid === this.masterUuids ? "bg-bray" : "";
			},
			masterRowClick(record, index) {
				this.rows = record;
				this.masterUuids = record.uuid;
				this.queryParamSub.puuid = record.uuid;
				this.$refs.accessoryModal.refreshList(this.queryParamSub);
			},
			handleAgree(record, type) {
				var that = this;
				let isRelease = type;
				let state = type === "no" ? "驳回" : "同意";
				that.$confirm({
					title: "警告",
					content: `是否` + state + `此条数据`,
					okText: "确定",
					okType: "danger",
					cancelText: "取消",
					onOk() {
						that
							.$post(that.url.meetingAgreeAndReject, {
								isRelease: isRelease,
								uuid: record.uuid,
							})
							.then((res) => {
								if (res === 1 || res.statusCode === 200) {
									// 重置表单数据
									// 刷新表格
									that.$refs.table.refresh();
									that.$message.success(res.message ? res.message : "操作成功");
								} else {
									that.$message.error(res.message);
								}
							})
							.finally(() => {
								that.confirmLoading = true;
							});
					},
					onCancel() {
						console.log("Cancel");
					},
				});
			},
			resetSearchForm() {
				this.$refs.table.refresh();
				this.queryParamSub = {};
				this.$refs.accessoryModal.refreshList(queryParamSub);
			},
			resetForm() {
				this.queryParam = {};
				this.resetSearchForm();
			},
		},
	};
</script>

<style lang="less"></style>
