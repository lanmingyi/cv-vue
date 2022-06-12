<template>
	<div class="page-common-layout">
		<div class="page-common-content">
			<tool-bar @search="$refs.table.refresh(true)" @reset=" () => { (this.queryParam = {}), $refs.table.refresh(true);}">
				<template slot="toolBtn" slot-scope="scope">
					<a-button class="cu-btn-primary" icon="plus" @click="handleAdd()">新增</a-button>
					<a-button class="cu-btn-danger" icon="delete" @click="handleSub($refs.table.selectedRowKeys)">删除
					</a-button>
				</template>
				<template slot="toolForm">
					<a-form-item label="">
						<a-input v-model="queryParam.warehouseName" placeholder="库名" />
					</a-form-item>
					<a-form-item label="">
						<a-input v-model="queryParam.useName" placeholder="用品名称" />
					</a-form-item>
				</template>
			</tool-bar>
			<DataGrid ref="table" :columns="columns" :url="url" :queryParam="queryParam" rowKey="uuid"></DataGrid>
			<edit-form ref="createModal" :visible="visible" :loading="confirmLoading" :model="mdl"
				@cancel="handleCancel()" @ok="handleOk()" :typeList="typeList" />
		</div>
	</div>
</template>

<script>
	import {
		DataGrid
	} from "@/components";
	import {
		dataGridMixin
	} from "@/mixins/dataGridMixin";
	import editForm from "./edit.vue";
	const columns = [
		{
			title: "出库单号",
			dataIndex: "warehouseTicketNumbers",
			ellipsis: true,
		},
		{
			title: "库名",
			dataIndex: "warehouseName",
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
			title: "出库人",
			dataIndex: "warehouseMan",
			ellipsis: true,
		},
		{
			title: "出库时间",
			dataIndex: "createTime",
			ellipsis: true,
		},
		{
			title: "签收人",
			dataIndex: "signMan",
			ellipsis: true,
		},
		{
			title: "备注",
			dataIndex: "remark",
			width: 200,
			ellipsis: true,
		},
	];
	export default {
		name: "TableList",
		mixins: [dataGridMixin],
		components: {
			DataGrid,
			editForm,
		},
		data() {
			return {
				columns,
				visible: false,
				confirmLoading: false,
				mdl: null,
				queryParam: {},
				url: {
					getPageSet: "/office/oaWorkWarehouse/getPageSet",
					save: "/office/oaWorkWarehouse/save",
					update: "/office/oaWorkWarehouse/update",
					deleteBatch: "/office/oaWorkWarehouse/deleteBatch",
					getDicItemByCode: "/system/dicSet/getDicItemByCode",
				},
				typeList: [],
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
		computed: {
		},
		mounted() {
			this.getCodeList();
		},
		methods: {
			getCodeList() {
				this.$post(this.url.getDicItemByCode, {
					code: "officeSuppliesType",
				}).then((res) => {
					if (res.statusCode !== 300) {
						this.typeList = res;
					}
				});
			},
		},
	};
</script>

<style lang="less"></style>
