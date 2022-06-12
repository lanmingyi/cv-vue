<template>
	<div class="page-common-layout">
		<div class="page-common-content">
			<div class="page-common-box-content">
				<tool-bar @search="resetSearchForm" @reset="resetForm
			  ">
					<template slot="toolBtn" slot-scope="scope">
						<a-button class="cu-btn-primary" icon="plus" @click="handleAdd()">新增</a-button>
						<a-button class="cu-btn-danger" icon="delete" @click="handleSub($refs.table.selectedRowKeys)">删除
						</a-button>
					</template>
					<template slot="toolForm">
						<a-form-item label="">
							<a-input v-model="queryParam.newsTitle" placeholder="新闻标题" />
						</a-form-item>
					</template>
				</tool-bar>
				<DataGrid ref="table" size="small" :columns="columns" :url="url" bordered :pageSize="10" rowKey="uuid"
					showPagination="auto" @rowClick="masterRowClick" :queryParam="queryParam">
					<span slot="state" slot-scope="{text}">
						{{ text | statusFilter }}
					</span>
					<span slot="operate" slot-scope="{operate, record}">
						<template>
							<span v-if="record.state == 2">
								<a @click="handleDetail(record)">详情</a>
								<a-divider type="vertical" />
								<a @click="handleSub(record)">删除</a>
							</span>
							<span v-else>
								<a @click="handleEdit(record)">编辑</a>
								<a-divider type="vertical" />
								<a @click="handleSub(record)">删除</a>
							</span>
						</template>
					</span>
				</DataGrid>
			</div>
			<div class="page-common-box-content">
				<a-tabs default-active-key="1">
					<a-tab-pane key="1" tab="附件信息">
						<accessory-info ref="accessoryModal" :url="urlFile" tag="fds" label="fds"
							:params="queryParamSub" :type="2" />
					</a-tab-pane>
				</a-tabs>
			</div>
			<edit-form ref="createModal" :visible="visible" :loading="confirmLoading" :model="mdl"
				@cancel="handleCancel()" @ok="handleOk({ isRelease: 'yes' })" @save="handleOk({ isRelease: 'no' })" />
			<detail-form ref="detailModal" @cancel="handleCancelDetail()" :visible="visibleDetail" />

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
	import accessoryInfo from "@/components/TopVUI/accessory/index";
	const columns = [
		{
			title: "新闻标题",
			dataIndex: "newsTitle",
			ellipsis: true,
		},
		{
			title: "发布人",
			dataIndex: "publisher",
		},
		{
			title: "发布部门",
			dataIndex: "releaseDeparmentName",
			ellipsis: true,
		},
		{
			title: "发布时间",
			dataIndex: "releaseTime",
			ellipsis: true,
		},
		{
			title: "发布状态",
			dataIndex: "state",
			scopedSlots: {
				customRender: "state",
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
			detailForm,
			accessoryInfo,
		},
		data() {
			return {
				columns,
				queryParam: {},
				queryParamSub: {},
				url: {
					getPageSet: "/office/oaNewsBase/getPageSet",
					save: "/office/oaNewsBase/save",
					update: "/office/oaNewsBase/update",
					deleteBatch: "/office/oaNewsBase/deleteBatch",
				},
				urlFile: {
					webUpload: "/document/fdfs/upload",
					getPageSet: "/document/fastdfs/getPageSet",
					deleteBatch: "/document/fdfs/delete",
					update: "/document/fastdfs/update",
				},
				key: 1,
				visible: false,
				confirmLoading: false,
				mdl: null,
				visibleDetail: false,
				actTitle: "",
				postVisible: false,
				postConfirmLoading: false,
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
					1: "待发布",
					2: "已发布",
				};
				return statusMap[status];
			},
		},
		mounted() {},
		methods: {
			masterRowClick(record, index) {
				this.masterUuids = record.uuid;
				this.queryParamSub.puuid = record.uuid;
				if (this.key === 1 && this.$refs.accessoryModal) {
					this.$refs.accessoryModal.refreshList(this.queryParamSub);
				}
			},
			handleCheck(record) {
				this.actTitle = record.title;
				this.postVisible = true;
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
				this.$refs.accessoryModal.refreshList(this.queryParamSub);
			},
			resetSearchForm() {
				this.$refs.table.refresh();
				this.queryParamSub = {puuid:1};
				this.$refs.accessoryModal.refreshList(this.queryParamSub);
			},
		},
	};
</script>

<style lang="less"></style>
