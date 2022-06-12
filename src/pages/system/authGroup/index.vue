<template>
	<div class="page-common-layout">
		<div class="page-common-left" style="width:60%">
			<div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
				<div class="table-operator">
					<a-dropdown v-action:groupAddDialog>
						<a-menu slot="overlay" @click="
                (e) => {
                  handleAdd(e.key, marsterData);
                }
              ">
							<a-menu-item key="1">
								<a-icon type="plus" /> 新增根节点
							</a-menu-item>
							<a-menu-item key="2">
								<a-icon type="plus" /> 新增子节点
							</a-menu-item>
						</a-menu>
						<a-button class="cu-btn-primary" icon="plus">
							新增
							<a-icon type="down" />
						</a-button>
					</a-dropdown>
					<!-- <a-button
              class="cu-btn-default"
              icon="edit"
              @click="handleEdit('all', marsterData)"
              v-action:groupEditDialog
              >编辑</a-button
            > -->
					<a-button class="cu-btn-danger" icon="delete" @click="handleChangeSub('all')"
						v-action:groupDelDialog>删除</a-button>
					<a-button type="link" icon="bars" @click="handleReset()" v-action:authGroupResetMenuDialog>重置菜单
					</a-button>
				</div>
			</div>
			<a-table ref="masterList" size="small" v-if="tLoading" defaultExpandAllRows :columns="columns" bordered
				:data-source="marsterData" rowKey="uuid" :row-selection="rowSelection" :customRow="masterRowClick"
				:rowClassName="masterRowClassName" :pagination="false">
				<span slot="status" slot-scope="text">
					{{ text | statusFilter }}
				</span>
				<span slot="action" slot-scope="text, record, index">
					<template>
						<a @click="handleEdit(record, $refs.masterList.data)">编辑</a>
						<a-divider type="vertical" />
						<a @click="handleChangeSub(record)">删除</a>
					</template>
				</span>
			</a-table>
			<!-- <api /> -->
			<edit-form ref="masterModal" :type="key" :visible="masterVisible" :loading="masterConfirmLoading"
				:model="masterMdl" @cancel="handleCancel()" @ok="handleMasterRowOk()" />
		</div>
		<div class="page-common-content">
			<a-tabs default-active-key="1" @change="changTabs">
				<a-tab-pane key="1" tab="功能权限">
					<jurisdiction ref="jurisdiction" :pramas="pramas"></jurisdiction>
				</a-tab-pane>
				<a-tab-pane key="2" tab="数据权限">
					<dataPermission ref="dataPermission" :pramas="pramas"></dataPermission>
				</a-tab-pane>
			</a-tabs>
		</div>
	</div>
</template>

<script>
	import TreeGrid from "@/components/TopVUI/custom/TreeGrid";
	import {
		dataTreeMixin
	} from "@/mixins/dataTreeMixin";
	import editForm from "./edit.vue";

	import {
		getFilter
	} from "@/utils/TopVUI";
	import jurisdiction from "./jurisdiction.vue";
	import dataPermission from "./dataPermission.vue";
	export default {
		name: "Table",
		mixins: [dataTreeMixin],
		components: {
			TreeGrid,
			editForm,
			jurisdiction,
			dataPermission,
		},
		data() {
			return {
				key: "0",
				masterConfirmLoading: false,
				masterVisible: false,
				buttonVisible: false,
				buttonConfirmLoading: false,
				buttonMdl: null,
				masterMdl: null,
				masterRows: null,
				masterSelectedRowKeys: [],
				masterSelectedRows: [],
				marsterData: [],
				columns: [{
						title: "名称",
						align: "left",
						dataIndex: "text",
						ellipsis: true,
					},
					{
						title: "状态",
						dataIndex: "status",
						scopedSlots: {
							customRender: "status"
						},
						customCell: (record, rowIndex) => {
							if (record.status === "0" || record.status === 0) {
								return {
									style: "color: red"
								};
							} else {
								return {
									style: "color: green"
								};
							}
						},
						ellipsis: true,
						width: 80,
					},
					{
						title: "操作",
						width: 100,
						align: "center",
						dataIndex: "action",
						scopedSlots: {
							customRender: "action"
						},
					},
				],
				url: {
					fathersUrl: "/system/authGroup/getListByUserUuid",
					masterUpdate: "/system/authGroup/update",
					masterDelete: "/system/authGroup/delete",
					masterSaveRoot: "/system/authGroup/save",
					masterSave: "/system/authGroup/save",
					menuMenuSave: "/system/authGroup/functionMenuSave",
					getListByLevelId: "/system/authGroup/getListByLevelId",
					resetListByRoleId: "/system/authAccess/resetListByRoleId",
				},
				spinningData: false,
				tLoading: false,
				pramas: {},
				tabIndex: 1,
			};
		},
		filters: {
			statusFilter(value) {
				if (value === 1 || value === "1") {
					return "启用";
				} else {
					return "禁用";
				}
			},
		},
		computed: {
			rowSelection() {
				return {
					selectedRowKeys: this.masterSelectedRowKeys,
					onChange: (selectedRowKeys, selectedRows) => {
						this.masterSelectedRowKeys = selectedRowKeys;
					},
				};
			},
		},
		mounted() {
			// console.log(this.$refs.masterList.getListData())
			this.getMarsterData();
		},
		methods: {
			// 获取最外层数据
			getMarsterData() {
				let that = this;
				that.$post(this.url.fathersUrl).then((res) => {
					let marsterData = [];
					let children = [];
					res.forEach((e) => {
						if (e.pid == 1) {
							e.key = e.id;
							e.children = e.state === "closed" ? [] : "";
							marsterData.push(e);
						} else {
							children.push(e);
						}
					});
					that.marsterData = getFilter(marsterData, children);
					that.tLoading = true;
				});
			},
			// 行点击
			masterRowClick(record, index) {
				const that = this;
				return {
					on: {
						click: () => {
							that.masterRows = record;
							that.masterMdl = record;
							that.pramas = {
								roleId: record.id,
								roleType: record.roleType
							};
							// this.$refs.subList.refresh();
							that.getListFilter(this.tabIndex);
						},
					},
				};
			},
			changTabs(key) {
				this.tabIndex = Number(key);
				this.$nextTick(() => {
					this.getListFilter(this.tabIndex);
				});
			},
			getListFilter(key) {
				if (key === 1) {
					// this.$refs.jurisdiction.queryParam = this.pramas;
					this.$refs.jurisdiction.refreshList(this.pramas); // 设置刷新子表
				} else if (key === 2 && this.$refs.dataPermission) {
					// this.$refs.dataPermission.queryParam = this.pramas;
					this.$refs.dataPermission.refreshList(this.pramas); // 设置刷新子表
				}
			},
			// 提交表单
			handleMasterRowOk: function() {
				let url = "";
				let form = {};
				form = this.$refs.masterModal.form;
				form.validateFields((errors, values) => {
					if (!errors) {
						this.masterConfirmLoading = true;
						if (!values.uuid) {
							url = this.url.masterSaveRoot;
						} else {
							url = this.url.masterUpdate;
						}
						this.$post(url, values)
							.then((res) => {
								if (res.statusCode === 200 || res === 1) {
									this.getMarsterData();
									this.$message.success("操作成功");
								} else {
									this.$message.error(res.message);
								}
							})
							.finally(() => {
								this.masterConfirmLoading = false;
								this.masterVisible = false;
							});
					}
				});
			},
			// 删除
			handleChangeSub: function(record, type) {
				const that = this;
				let uuids = "";
				let url = "";
				if (record === "all") {
					if (that.masterSelectedRowKeys.length === 0) {
						that.$message.warn("请先勾选需要的删除的数据", 1.5);
						return true;
					} else {
						uuids = that.masterSelectedRowKeys.toString();
						url = that.url.masterDelete;
					}
				} else {
					uuids = record.uuid;
					url = that.url.masterDelete;
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
							.$post(url, {
								uuid: uuids,
							})
							.then((res) => {
								if (res.statusCode === 200 || res === 1) {
									that.$message.success("删除成功", 1.5);
									that.getMarsterData();
									that.masterRows = null;
									that.masterSelectedRowKeys = [];
								} else {
									that.$message.error(res.message);
								}
							});
					},
					onCancel() {
						console.log("Cancel");
					},
				});
			},
			handleReset() {
				let that = this;
				if (that.masterSelectedRowKeys.length === 0) {
					that.$warning({
						title: "操作提示",
						content: "请先勾选中要操作的数据!",
					});
					return;
				}
				that.$confirm({
					title: "提示",
					content: "确认执行此操作吗？",
					okText: "确认",
					cancelText: "取消",
					onOk() {
						that
							.$post(that.url.resetListByRoleId, {
								uuid: that.masterSelectedRowKeys.toString(),
							})
							.then((res) => {
								if (res.statusCode === 200) {
									that.marsterData = [];
									that.masterSelectedRowKeys = [];
									that.getMarsterData();
									that.$message.info(res.message);
								} else {
									that.$message.error(res.message);
								}
							});
					},
				});
			},
		},
	};
</script>

<style scoped lang="less">
	.table {
		background-color: @base-bg-color;
		padding: 24px;
	}
</style>
