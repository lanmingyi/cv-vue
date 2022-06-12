<template>
	<div class="page-common-layout">
		<div class="page-common-content">
			<div class="toolbar flex justify-between flex-wrap">
				<div class="table-operator">
					<a-button class="cu-btn-primary" icon="plus" @click="handleAdd()">新增</a-button>
					<a-button class="cu-btn-default" icon="edit" @click="handleEdit($refs.table.rows)">编辑</a-button>
					<a-button class="cu-btn-info margin-right-xs" icon="delete" @click="handleView($refs.table.rows)">查看详情</a-button>
					<a-button class="cu-btn-danger" icon="delete" @click="handleSub($refs.table.selectedRowKeys)">删除</a-button>
				</div>
			</div>
			<DataGrid v-if="columns.length > 0" ref="table" :columns="columns" :url="url" :queryParam="queryParam" rowKey="uuid" :scroll="scroll">
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

	import editForm from "./edit.vue";
	import util from "@/utils/util";
	import {
		getColumns
	} from "@/utils/formatter";
	export default {
		name: "TableList",
		mixins: [dataGridMixin],
		components: {
			DataGrid,
			editForm
		},
		data() {
			return {
				visible: false,
				confirmLoading: false,
				mdl: null,
				// 高级搜索 展开/关闭
				advanced: false,
				// 查询参数
				queryParam: {},
				selectedRows: [],
				rows: "", //选中行数据
				columns: [],
				url: {
					getPageSet: "/form/formField/commonGetPageSet",
					save: "/form/formField/commonSave",
					update: "/form/formField/commonUpdate",
					deleteBatch: "/form/formField/commonDeleteBatch",
				},
				scroll: {}
			};
		},
		mounted() {
			this.queryParam.tableName = this.$route.query.tableName;
			this.loadDataJson(this.$route.query.tableName);
		},
		methods: {
			// 获取数据
			loadDataJson(e) {
				this.columns = [];
				this.tableName = e;
				this.$post("/form/formFieldJson/getDetailByTableName", {
					tableName: this.tableName,
				}).then((res) => {
					this.jsonData = res;
					this.drawingList = JSON.parse(res.fieldJson);
					this.drawingList?.list.forEach((e, index) => {
						getColumns(e, this.columns);
					});
					this.scroll.x = this.columns.length * 100
					// if (this.columns.length > 10) {
					// 	this.columns.splice(11);
					// }
				});
			},
			// 新增
			handleAdd() {
				this.visible = true;
				this.$refs.createModal.loadData(
					this.$route.query.tableName,
					"add",
					this.jsonData
				);
			},
			// 编辑
			handleEdit(record) {
				this.rows = record
				if (this.rows) {
					this.visible = true;
					this.$refs.createModal.loading = true
					this.$post("/form/formField/commonGetDetailByUuidAndTableName", {
						uuid: record.uuid,
						tableName: this.$route.query.tableName
					}).then((res) => {
						
						this.$refs.createModal.loadData(
							this.$route.query.tableName,
							"edit",
							this.jsonData,
							res
						);
					});
				} else {
					this.$message.info("请先选中需要修改的数据");
					return true;
				}
			},
			rowClassName(row) {
				return row.uuid === this.rows?.uuid ? "bg-bray" : ""; // 每条数据的唯一识别值
			},
			// 预览详情
			handleView(record) {
				// this.rows = record
				// if (!this.rows) {
				// 	this.$message.warn("请选中需要查看的数据");
				// 	return;
				// } else {
				// 	this.visible = true;
				// 	this.$refs.createModal.loadData(
				// 		this.$route.query.tableName,
				// 		"view",
				// 		this.jsonData,
				// 		this.rows
				// 	);
				// }
				this.rows = record
				if (this.rows) {
					this.visible = true;
					this.$refs.createModal.loading = true
					this.$post("/form/formField/commonGetDetailByUuidAndTableName", {
						uuid: record.uuid,
						tableName: this.$route.query.tableName
					}).then((res) => {
						this.$refs.createModal.loadData(
							this.$route.query.tableName,
							"view",
							this.jsonData,
							res
						);
					});
				} else {
					this.$message.warn("请选中需要查看的数据");
					return true;
				}
			},
			handleOk: function() {
				this.visible = false;
				this.$refs.table.refresh();
			},
			// 删除
			handleSub(e) {
				console.log(this.$refs.table.selectedRowKeys)
				const that = this;
				let uuids = "";
				if (that.$refs.table.selectedRowKeys.length === 0) {
					that.$message.warn("请勾选需要删除的数据");
					return;
				} else {
					uuids = that.$refs.table.selectedRowKeys.toString();
				}
				that.$confirm({
					title: "警告",
					content: `确定要执行该操作吗?`,
					okText: "删除",
					okType: "danger",
					cancelText: "取消",
					onOk() {
						// 在这里调用删除接口
						that
							.$post(that.url.deleteBatch, {
								uuid: uuids,
								tableName: that.$route.query.tableName,
							})
							.then((res) => {
								if (res.statusCode === 200 || res === 1) {
									that.$message.success("删除成功");
									that.rows = "";
									that.$refs.table.selectedRowKeys = [];
									that.$refs.table.refresh();
								} else {
									that.$message.info("删除失败");
								}
							});
					},
					onCancel() {},
				});
			},
		},
	};
</script>

<style lang="less"></style>
