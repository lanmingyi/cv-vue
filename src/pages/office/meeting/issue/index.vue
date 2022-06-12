<template>
	<div class="page-common-layout">
		<div class="page-common-content">
			<div class="page-common-box-content">
				<tool-bar @search="resetSearchForm" @reset="resetForm
				">
					<template slot="toolBtn" slot-scope="scope">
						<a-button class="cu-btn-primary" icon="plus" @click="handleAdd()">新增</a-button>
						<a-button class="cu-btn-default" icon="edit" @click="handleEdit($refs.table.rows)">编辑</a-button>
						<a-button class="cu-btn-danger" icon="delete" @click="handleSub($refs.table.selectedRowKeys)">删除
						</a-button>
					</template>
					<template slot="toolForm">
						<a-form-item label="">
							<a-input v-model="queryParam.topicsName" placeholder="议题名称" />
						</a-form-item>
					</template>
				</tool-bar>
				<DataGrid ref="table" size="small" :columns="columns" :url="url" bordered :pageSize="10" rowKey="uuid"
					showPagination="auto" @rowClick="masterRowClick" :queryParam="queryParam">
					<span slot="topicsState" slot-scope="{text}">
						{{ text | statusFilter }}
					</span>
					<span slot="operate" slot-scope="{operate, record}">
						<template>
							<a v-if="record.topicsState === 'oa.issueStatus01'" @click="handleEdit(record)">更改</a>
							<a-divider v-if="record.topicsState === 'oa.issueStatus01'" type="vertical" />
							<a v-if="record.topicsState === 'oa.issueStatus03'" @click="handleReapply(record)">重新申请</a>
							<a-divider v-if="record.topicsState === 'oa.issueStatus03'" type="vertical" />
							<a @click="handleSub(record)">删除</a>
						</template>
					</span>
				</DataGrid>
			</div>
			<div class="page-common-box-content">
				<a-tabs default-active-key="1">
					<a-tab-pane key="1" tab="附件信息">
						<accessory-info ref="accessoryModal" :url="urlFile" tag="fds" label="fds" :model="rows"
							:params="queryParamSub"></accessory-info>
					</a-tab-pane>
				</a-tabs>
			</div>
			<edit-form ref="createModal" :visible="visible" :loading="confirmLoading" :model="mdl"
				:meetingList="meetingList" @cancel="handleCancel()" @ok="handleOk()" @reply="handleOk('Reapply')" />
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
			ellipsis: true,
		},
		{
			title: "会议名称",
			dataIndex: "mettingName",
			ellipsis: true,
		},
		{
			title: "会议时间",
			dataIndex: "startTime",
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
			ellipsis: true,
		},
		{
			title: "状态",
			dataIndex: "topicsState",
			scopedSlots: {
				customRender: "topicsState",
			},
		},
		{
			title: "操作",
			dataIndex: "operate",
			width: 100,
			align: "center",
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
				queryParamTrainee: {},
				url: {
					getPageSet: "/office/oaMeetingTopics/getPageSet",
					save: "/office/oaMeetingTopics/save",
					update: "/office/oaMeetingTopics/update",
					deleteBatch: "/office/oaMeetingTopics/deleteBatch",
					getMettingName: "/office/oaMeetingTopics/getMettingName",
				},
				urlFile: {
					webUpload: "/document/fdfs/upload",
					getPageSet: "/document/fastdfs/getPageSet",
					deleteBatch: "/document/fdfs/delete",
					update: "/document/fastdfs/update",
				},
				loadData: (parameter) => {
					const requestParameters = Object.assign({}, parameter, this.queryParam);
					return this.$post(this.url.getPageSet, requestParameters).then(
						(res) => {
							return res;
						}
					);
				},
				key: 1,
				mdlUserPost: null,
				visible: false,
				mdl: null,
				confirmLoading: false,
				selectedRowKeys: [],
				rows: "",
				masterUuids: "",
				meetingList: [],
			};
		},
		computed: {
			rowSelection() {
				return {
					selectedRowKeys: this.selectedRowKeys,
					onChange: this.onSelectChange,
				};
			},
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
		mounted() {
			this.getCodeList();
		},
		methods: {
			getCodeList() {
				this.$post(this.url.getMettingName).then((res) => {
					this.meetingList = res;
				});
			},
			rowClassName(row) {
				return row.uuid === this.masterUuids ? "bg-bray" : "";
			},
			masterRowClick(record, index) {
				this.rows = record;
				this.masterUuids = record.uuid;
				this.queryParamSub.puuid = record.uuid;
				this.$refs.accessoryModal.refreshList(this.queryParamSub);
			},
			handleReapply(record) {
				this.visible = true;
				const form = this.$refs.createModal.form;
				form.resetFields();
				this.$refs.createModal.edit(record, "reapply");
			},
			handleDetail(record) {
				this.visibleDetail = true;
			},
			handleCancelDetail() {
				this.visibleDetail = false;
			},
			refreshOnload() {
				this.$refs.accessoryModal.refreshList({});
			},
			resetSearchForm() {
				this.$refs.table.refresh();
				this.queryParamSub = {};
				this.$refs.accessoryModal.refreshList(this.queryParamSub);
			},
			resetForm() {
				this.queryParam = {};
				this.resetSearchForm();
			},
		},
	};
</script>
