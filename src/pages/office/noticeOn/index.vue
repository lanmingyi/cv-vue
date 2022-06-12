<template>
	<div class="page-common-layout">
		<div class="page-common-content">
			<div class="page-common-box-content">
				<tool-bar @search="resetSearchForm" @reset="resetForm">
					<template slot="toolBtn" slot-scope="scope">
						<a-button class="cu-btn-primary" icon="plus" @click="handleAdd()">新增</a-button>
						<a-button class="cu-btn-danger" icon="delete" @click="handleSub($refs.table.selectedRowKeys)">删除</a-button>
					</template>
					<template slot="toolForm">
						<a-form-item label="">
							<a-input v-model="queryParam.title" placeholder="标题" />
						</a-form-item>
						<a-form-item label="">
							<t-date v-model="queryParam.date" placeholder="发布时间" dateFormat="YYYY-MM-DD"
								allowClear />
						</a-form-item>
					</template>
				</tool-bar>
				<DataGrid ref="table" size="small" :columns="columns" :url="url" bordered :pageSize="10" rowKey="uuid"
					showPagination="auto" @rowClick="masterRowClick" :queryParam="queryParam">
					<span slot="operate" slot-scope="{ text, record }">
						<template>
							<span v-if="record.state === '待发布'">
								<a @click="handleEdit(record, 'master')">编辑</a>
							</span>
							<span v-if="record.state === '已发布'">
								<a @click="handleDetail(record)">详情</a>
								<a-divider type="vertical" />
								<a @click="handleCheck(record)">查阅记录</a>
							</span>
						</template>
					</span>
				</DataGrid>
			</div>
			<div class="page-common-box-content">
				<a-tabs default-active-key="1">
					<a-tab-pane key="1" tab="附件信息">
						<!-- webUpload -->
						<accessory-info ref="accessoryModal" :url="urlFile" tag="fdsFile" label="fds"
							:params="queryParamSub" :model="mdl" />
					</a-tab-pane>
				</a-tabs>
			</div>
			<edit-form ref="createModal" :visible="visible" :loading="confirmLoading" :model="mdl"
				@cancel="handleCancel()" @ok="handleOk({ isRelease: 'yes' })" @save="handleOk({ isRelease: 'no' })" />
			<detail-form ref="detailModal" @cancel="handleCancelDetail()" :visible="visibleDetail" />
			<post-form ref="postModal" :visible="postVisible" :loading="postConfirmLoading" :model="mdl"
				:title="actTitle" @cancel="handlePostCancel" @ok="handlePostOk" />
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
	import detailForm from "./detail.vue";
	import postForm from "./broRecord.vue";
	import accessoryInfo from "@/components/TopVUI/accessory/index";
	const columns = [
		{
			title: "标题",
			dataIndex: "title",
			ellipsis: true,
		},
		{
			title: "发布部门",
			dataIndex: "publishingDepartmentName",
			ellipsis: true,
		},
		{
			title: "发布时间",
			dataIndex: "createTime",
			ellipsis: true,
		},
		{
			title: "发布状态",
			dataIndex: "state",
			ellipsis: true,
		},
		{
			title: "操作",
			dataIndex: "operate",
			width: 150,
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
			detailForm,
			postForm,
			accessoryInfo,
		},
		data() {
			return {
				columns,
				visible: false,
				confirmLoading: false,
				mdl: null,
				queryParam: {},
				queryParamSub: {puuid: 1},
				queryParamList: {puuid: 1},
				url: {
					getPageSet: "/office/officePublicAnnouncement/getPageSetNotice",
					save: "/office/officePublicAnnouncement/saveNotice",
					update: "/office/officePublicAnnouncement/update",
					deleteBatch: "/office/officePublicAnnouncement/deleteBatch",
					getListByPid: "/mdata/organization/getListByPid?pid=2",
				},
				urlFile: {
					webUpload: "/document/fdfs/upload",
					getPageSet: "/document/fastdfs/getPageSet",
					deleteBatch: "/document/fdfs/delete",
					update: "/document/fastdfs/update",
				},
				key: 1,
				actTitle: "",
				visibleDetail: false,
				postVisible: false,
				postConfirmLoading: false,
				organList: [],
			};
		},
		computed: {
		},
		filters: {
			statusFilter(status) {
				const statusMap = {
					0: "待发布",
					1: "已发布",
				};
				return statusMap[status];
			},
		},
		mounted() {
			this.getCodeData();
		},
		methods: {
			rowClassName(row) {
				return row.uuid === this.masterUuids ? "bg-bray" : "";
			},
			masterRowClick(record, index) {
				this.rows = record;
				this.masterUuids = record.uuid;
				this.queryParamList.puuid = record.uuid;
				this.queryParamSub = Object.assign({}, this.queryParamList);
				if (this.$refs.accessoryModal)
					this.$refs.accessoryModal.refreshList(this.queryParamSub);
			},
			handleCheck(record) {
				this.actTitle = record.title;
				this.mdl = record;
				this.postVisible = true;
				this.$refs.postModal.edit(record);
			},
			handlePostCancel() {
				this.postVisible = false;
			},
			handlePostOk() {
				this.postVisible = false;
			},
			handleDetail(record) {
				this.visibleDetail = true;
				this.$refs.detailModal.onLoadData(record);
			},
			handleCancelDetail() {
				this.visibleDetail = false;
			},
			refreshOnload() {
				this.$refs.accessoryModal.refreshList({});
			},
			resetForm() {
				this.queryParam = {};
				this.$refs.table.refresh();
				this.queryParamSub = {puuid:1};
				if (this.$refs.accessoryModal)
					this.$refs.accessoryModal.refreshList(this.queryParamSub);
			},
			resetSearchForm() {
				this.$refs.table.refresh();
				this.queryParamSub = {puuid:1};
				if (this.$refs.accessoryModal)
					this.$refs.accessoryModal.refreshList(this.queryParamSub);
			},
			getCodeData() {
				this.$post(this.url.getListByPid).then((res) => {
					this.organList = res;
				});
			},
		},
	};
</script>

<style lang="less"></style>
