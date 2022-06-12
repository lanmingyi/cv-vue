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
						<a-select v-model="queryParam.useType" placeholder="办公用品分类" style="width: 200px;">
							<a-select-option v-for="(item, index) in typeList" :key="index" :value="item.value">
								{{ item.text }}
							</a-select-option>
						</a-select>
					</a-form-item>
				</template>
			</tool-bar>
			<DataGrid ref="table" :columns="columns" :url="url" :queryParam="queryParam" rowKey="uuid">
				<template slot="action" slot-scope="{ text, record }">
					<a style="margin-right: 5px" @click="() => handleEdit(record)">编辑</a>
				</template>
			</DataGrid>
			<edit-form ref="createModal" :visible="visible" :loading="confirmLoading" :model="mdl" :typeList="typeList"
				@cancel="handleCancel()" @ok="handleOk()" />
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
	const columns = [{
			title: "用品ID",
			dataIndex: "useId",
		},
		{
			title: "库名",
			dataIndex: "suppliesName",
		},
		{
			title: "用品类型",
			dataIndex: "useTypeName",
		},
		{
			title: "用品名称",
			dataIndex: "useName",
		},
		{
			title: "数量",
			dataIndex: "counts",
		},
		{
			title: "说明",
			dataIndex: "explain",
			width: 300,
			scopedSlots: {
				customRender: "testCombobox"
			},
		},
		{
			title: "操作",
			dataIndex: "action",
			scopedSlots: {
				customRender: "action"
			},
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
				// 查询参数
				queryParam: {},
				url: {
					getPageSet: "/office/oaWorkSuplist/getPageSet",
					save: "/office/oaWorkSuplist/save",
					update: "/office/oaWorkSuplist/update",
					deleteBatch: "/office/oaWorkSuplist/deleteBatch",
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
		computed: {},
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

<style lang="less">
</style>
