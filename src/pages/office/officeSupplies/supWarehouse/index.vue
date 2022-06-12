<template>
	<div class="page-common-layout">
		<div class="page-common-content">
			<div class="page-common-box-content">
				<tool-bar @search="$refs.masterList.refresh(true)" @reset="
          () => {
            (masterQueryParam = {}), $refs.masterList.refresh(true);
          }">
					<template slot="toolBtn" slot-scope="scope">
						<a-button class="cu-btn-primary" icon="plus" @click="handleAdd('master')">新增</a-button>
						<a-button class="cu-btn-danger" icon="delete"
							@click="handleSub($refs.masterList.selectedRowKeys, 'master')">删除</a-button>
					</template>
					<template slot="toolForm">
						<a-form-item label="">
							<a-input v-model="masterQueryParam.warehouseName" placeholder="用品库名称" />
						</a-form-item>
						<a-form-item label="">
							<a-input v-model="masterQueryParam.warehouseAdministrator" placeholder="库管理员" />
						</a-form-item>
					</template>
				</tool-bar>
				<DataGrid ref="masterList" type="master" :columns="masterColumns" :url="url" bordered :pageSize="10"
					rowKey="uuid" @rowClick=" (e) => { masterRowClick(e, { uuid: 'uuid' });}" showPagination="auto"
					:queryParam="masterQueryParam">
				</DataGrid>
			</div>
			<div class="page-common-box-content">
				<a-tabs default-active-key="1">
					<a-tab-pane key="1" tab="办公用品">
						<DataGrid ref="subList" type="sub" :columns="subColumns" :url="url" bordered :pageSize="10"
							rowKey="uuid" showPagination="auto" :queryParam="subQueryParam">
						</DataGrid>
					</a-tab-pane>
				</a-tabs>
			</div>
			<master-form ref="masterModal" :visible="masterVisible" :loading="masterConfirmLoading" :model="masterMdl"
				@cancel="handleCancel('master')" @ok="handleOk('master')" />
		</div>
	</div>
</template>

<script>
	import {
		masterTableMixin
	} from "@/mixins/masterTableMixin";
	import {
		DataGrid
	} from "@/components";
	import masterForm from "./edit.vue";
	const masterColumns = [{
			title: "库排序号",
			dataIndex: "sortNumber",
			ellipsis: true,
		},
		{
			title: "库名称",
			dataIndex: "warehouseName",
			ellipsis: true,
		},
		{
			title: "库管理员",
			dataIndex: "warehouseAdministrator",
			ellipsis: true,
		},
		{
			title: "领用权限",
			dataIndex: "promissionSettings",
			ellipsis: true,
		},
		{
			title: "管理权限",
			dataIndex: "adminSettings",
			ellipsis: true,
		},
		{
			title: "创建人",
			dataIndex: "creator",
			ellipsis: true,
		},
		{
			title: "创建时间",
			dataIndex: "createTime",
			width: 200,
			ellipsis: true,
		},
	];
	const subColumns = [
		{
			title: "用品ID",
			dataIndex: "useId",
			ellipsis: true,
		},
		{
			title: "用品类型",
			dataIndex: "useTypeName",
			ellipsis: true,
		},
		{
			title: "用品名称",
			dataIndex: "useName",
			ellipsis: true,
		},
		{
			title: "数量",
			dataIndex: "counts",
			ellipsis: true,
		},
		{
			title: "说明",
			dataIndex: "explain",
			width: 300,
			ellipsis: true,
		},
	];
	export default {
		name: "TableList",
		mixins: [masterTableMixin],
		components: {
			DataGrid,
			masterForm,
		},
		data() {
			return {
				masterColumns,
				subColumns,
				masterVisible: false,
				subVisible: false,
				masterConfirmLoading: false,
				subConfirmLoading: false,
				masterMdl: null,
				subMdl: null,
				// 查询参数
				masterQueryParam: {},
				subQueryParam: {},
				url: {
					masterList: "/office/oaWorkSupplies/getPageSet",
					masterDelete: "/office/oaWorkSupplies/deleteBatch",
					masterAdd: "/office/oaWorkSupplies/save",
					masterUpdate: "/office/oaWorkSupplies/update",
					subList: "/office/oaWorkSuplist/getPageSetList",
				},
				statusList: [],
				titleList: [],
				imgVisible: false,
				imgPreview: "",
			};
		},
		filters: {
			statusFilter(status) {
				const statusMap = {
					0: "申请中",
					1: "已通过",
				};
				return statusMap[status];
			},
		},
		computed: {},
		mounted() {},
		methods: {
			// 预览
			handlePreview(e) {
				this.imgPreview = "";
				this.imgVisible = true;
				this.imgPreview = baseUrl + "/system/attachment/showPic?path=" + e;
				console.log("e----------------预览", this.imgPreview);
			}
		},
	};
</script>

<style lang="less"></style>
