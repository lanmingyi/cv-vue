<template>
	<div class="page-common-layout">
		<div class="page-common-content">
			<tool-bar @search="$refs.table.refresh(true)" @reset="
          () => {
            (this.queryParam = {}), $refs.table.refresh(true);
          }
        ">
				<template slot="toolBtn" slot-scope="scope">
					<a-button class="cu-btn-primary" icon="plus" @click="handleAdd()"
						v-action:sysSampleDataGridAddDialog>新增</a-button>

					<a-button class="cu-btn-danger" icon="delete" @click="handleSub($refs.table.selectedRowKeys)"
						v-action:sysSampleDataGridDelDialog>删除</a-button>
				</template>
				<template slot="toolForm">
					<a-form-item label="">
						<a-input v-model="queryParam.name" placeholder="名称" />
					</a-form-item>
				</template>
			</tool-bar>
			<DataGrid ref="table" :columns="columns" :url="url" :queryParam="queryParam" rowKey="uuid"
				:format-conditions="true">
				<template slot="testCombobox" slot-scope="{ text }">
					<filterDictTextByCode code="sortFields" :value="text"></filterDictTextByCode>
				</template>
				<template slot="sex" slot-scope="{ text }">
					{{ text | sexStr }}
				</template>
				<template slot="action" slot-scope="{ text, record }">
					<a style="margin-right: 5px" @click="() => handleEdit(record)">编辑</a>
					<a style="margin-right: 5px" @click="() => handleSub(record)">删除</a>
				</template>
			</DataGrid>
			<!--	新增编辑	 -->
			<edit-form ref="createModal" :visible="visible" :loading="confirmLoading" :model="mdl"
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
	import editForm from "./modal/myEdit.vue";
	// 表格列字典数据处理
	import filterDictTextByCode from "@/components/TopVUI/dict/filterDictTextByCode";
	export default {
		name: "Table",
		components: {
			DataGrid,
			editForm,
			filterDictTextByCode
		},
		mixins: [dataGridMixin],
		filters: {
			sexStr(val) {
				switch (val) {
					case "male":
						return "男";
					case "female":
						return "女";
					case "unknown":
						return "未知";
				}
			},
		},
		data() {
			return {
				columns: [{
						title: "名称",
						dataIndex: "name",
					},
					{
						title: "年龄",
						dataIndex: "age",
					},
					{
						title: "性别",
						dataIndex: "sex",
						scopedSlots: {
							customRender: "sex"
						},
					},
					{
						title: "生日",
						dataIndex: "testDate",
						dataType: "date",
					},
					{
						title: "时间",
						dataIndex: "testDatetime",
					},
					{
						title: "排序",
						dataIndex: "testCombobox",
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
				],
				visible: false,
				confirmLoading: false,
				mdl: null,
				// 查询参数
				queryParam: {},
				url: {
					getPageSet: "/system/exampleSingleDatagrid/getPageSet",
					save: "/system/exampleSingleDatagrid/save",
					update: "/system/exampleSingleDatagrid/update",
					deleteBatch: "/system/exampleSingleDatagrid/deleteBatch",
				},
			};
		},
		methods: {},
	};
</script>

<style scoped lang="less">
	.table {
		background-color: @base-bg-color;
		padding: 24px;
	}
</style>
