<template>
	<div class="page-common-layout">
		<div class="page-common-content">
			<tool-bar @search="$refs.table.refresh(true)" @reset="
          () => {
            (queryParam = {}), $refs.table.refresh(true);
          }
        ">
				<template slot="toolBtn" slot-scope="scope">
					<a-button class="cu-btn-primary" icon="plus" @click="handleAdd()"
						v-action:sysSampleEdataGridAddDialog>新增</a-button>
					<!-- <a-button
            class="cu-btn-default"
            icon="edit"
            @click="handleEdit()"
            v-action:sysSampleEdataGridEditDialog
            >编辑</a-button
          > -->
					<a-button class="cu-btn-danger" icon="delete" @click="handleSub($refs.table.selectedRowKeys)"
						v-action:sysSampleEdataGridDelDialog>删除</a-button>
				</template>
				<template slot="toolForm">
					<a-form-item label="">
						<a-input v-model="queryParam.name" placeholder="名称" />
					</a-form-item>
				</template>
			</tool-bar>
			<EdataGrid ref="table" :columns="columns" :url="url" rowKey="uuid" :queryParam="queryParam">
				<template slot="testCombobox" slot-scope="{ text }">
					{{ text | testComboboxStr }}
				</template>
				<template slot="sex" slot-scope="{ text }">
					{{ text | sexStr }}
				</template>
			</EdataGrid>
		</div>
	</div>
</template>
<script>
	import {
		EdataGrid
	} from "@/components";
	import {
		eDataGridMixin
	} from "@/mixins/eDataGridMixin";
	export default {
		name: "Table",
		mixins: [eDataGridMixin],
		components: {
			EdataGrid
		},
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
			testComboboxStr(val) {
				switch (val) {
					case "false":
						return "不排序";
					case "true":
						return "排序";
				}
			},
		},
		data() {
			return {
				columns: [{
						title: "名称",
						dataIndex: "name",
						type: "text",
						option: {
							rules: [{
								required: true,
								message: "必填"
							}],
						},
						scopedSlots: {
							customRender: "name"
						},
					},
					{
						title: "年龄",
						dataIndex: "age",
						width: 100,
						type: "numberbox",
						option: {
							rules: [{
								required: true,
								message: "必填"
							}],
						},
						scopedSlots: {
							customRender: "age"
						},
					},
					{
						title: "性别",
						dataIndex: "sex",
						slots: {
							title: "性别"
						},
						type: "select",
						width: 100,
						scopedSlots: {
							customRender: "sex"
						},
						option: {
							modeType: "default",
							dictCode: "sex",
							rules: [{
								required: true,
								message: "必填"
							}],
							dataType: "code", //static;dynamic
							list: [{
									label: "女",
									value: "0",
								},
								{
									label: "男",
									value: "1",
								},
							],
						},
					},
					{
						title: "生日",
						width: 200,
						dataIndex: "testDate",
						type: "datebox",
						scopedSlots: {
							customRender: "testDate"
						},
					},
					{
						title: "时间",
						width: 200,
						dataIndex: "testDatetime",
						type: "dateTime",
						scopedSlots: {
							customRender: "testDatetime"
						},
					},
					{
						title: "排序",
						width: 100,
						dataIndex: "testCombobox",
						scopedSlots: {
							customRender: "testCombobox"
						},
						type: "select",
						option: {
							modeType: "default",
							dictCode: "sortFields",
							rules: [{
								required: true,
								message: "必填"
							}],
							dataType: "code", //static;dynamic
						},
					},
					{
						title: "操作",
						width: 150,
						dataIndex: "action",
						align: "center",
						scopedSlots: {
							customRender: "action",
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
