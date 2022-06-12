<template>
	<div class="page-common-layout">
		<div class="page-common-content">
			<div class="page-common-box-content">
				<tool-bar @search="$refs.table.refresh(true)" @reset="
				    () => {
				      (this.queryParam = {}), $refs.table.refresh(true);
				    }
				  ">
					<template slot="toolBtn" slot-scope="scope">
						<a-button class="cu-btn-primary" icon="plus" @click="handleAdd()"
							v-action:sysSampleTabEditGridAddDialog>新增</a-button>
						<!--<a-button class="cu-btn-default" icon="edit" @click="handleEdit($refs.table.rows)"-->
							<!--v-action:sysSampleTabEditGridEditDialog>编辑</a-button>-->
						<a-button class="cu-btn-danger" icon="delete" @click="handleSub($refs.table.selectedRowKeys)"
							v-action:sysSampleTabEditGridDelDialog>删除</a-button>
					</template>
					<template slot="toolForm">
						<a-form-item label="">
							<a-input v-model="queryParam.name" placeholder="姓名" />
						</a-form-item>
					</template>
				</tool-bar>
				<DataGrid ref="table" size="small" :columns="columns" :url="url" bordered :pageSize="10" rowKey="uuid"
					showPagination="auto" @rowClick="customClick" :queryParam="queryParam">
					<span slot="sex" slot-scope="{ text }">
						{{ text | sexFilter }}
					</span>
					<span slot="testCombobox" slot-scope="{ text }">
						{{ text | testComboboxFilter }}
					</span>
					<span slot="action" slot-scope="{ text, record }">
						<template>
							<a @click="handleEdit(record)">编辑</a>
							<a-divider type="vertical" />
							<a @click="handleSub(record)">删除</a>
						</template>
					</span>
				</DataGrid>
			</div>
			<edit-form ref="createModal" :visible="visible" :loading="confirmLoading" :model="mdl"
				@cancel="handleCancel()" @ok="handleOk()" />
			<div class="page-common-box-content">
				<a-tabs default-active-key="1" @change="changTabs">
					<a-tab-pane key="1" tab="子表一">
						<child-one ref="childOne"></child-one>
					</a-tab-pane>
					<a-tab-pane key="2" tab="子表二">
						<child-two ref="childTwo"></child-two>
					</a-tab-pane>
				</a-tabs>
			</div>
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

	import editForm from "./modal/edit.vue";
	import childOne from "./modal/childThree";
	import childTwo from "./modal/childFour";

	export default {
		name: "TableList",
		mixins: [dataGridMixin],
		components: {
			DataGrid,
			editForm,
			childOne,
			childTwo
		},
		data() {
			return {
				columns: [{
						title: "姓名",
						dataIndex: "name",
						align: "center",
					},
					{
						title: "年龄",
						dataIndex: "age",
						align: "center",
					},
					{
						title: "性别",
						dataIndex: "sex",
						align: "center",
						scopedSlots: {
							customRender: "sex",
						},
					},
					{
						title: "生日",
						dataIndex: "testDate",
						align: "center",
					},
					{
						title: "注册时间",
						dataIndex: "testDatetime",
						align: "center",
					},
					{
						title: "排序",
						dataIndex: "testCombobox",
						align: "center",
						scopedSlots: {
							customRender: "testCombobox",
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
				childOneQueryParam: {},
				childTwoQueryParam: {},
				tabIndex: 1,
			};
		},
		filters: {
			sexFilter(sex) {
				switch (sex) {
					case "male":
						return "男";
					case "female":
						return "女";
					case "unknown":
						return "未知";
				}
			},
			testComboboxFilter(val) {
				if (val === "true") {
					return "可排序";
				} else if (val === "false") {
					return "不可排序";
				}
			},
		},
		methods: {
			customClick(record) {
				console.log(record);
				this.rows = record;
				this.$refs.table.rows = record;
				this.childOneQueryParam.puuid = record.uuid;
				this.childTwoQueryParam.puuid = record.uuid;
				this.getListFilter(this.tabIndex);
			},
			changTabs(key) {
				this.tabIndex = Number(key);
				this.$nextTick(() => {
					this.getListFilter(this.tabIndex);
				});
			},
			getListFilter(key) {
				if (key === 1) {
					this.$refs.childOne.queryParam = this.childOneQueryParam;
					this.$refs.childOne.refresh(); // 设置刷新子表
				} else if (key === 2 && this.$refs.childTwo) {
					this.$refs.childTwo.queryParam = this.childTwoQueryParam;
					this.$refs.childTwo.refresh(); // 设置刷新子表
				}
			},
		},
	};
</script>

<style lang="less"></style>
