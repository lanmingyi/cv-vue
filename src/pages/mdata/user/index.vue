<template>
	<div class="page-common-layout">
		<div class="page-common-left" style="width:25%">
			<ZTree ref="masterList" :columns="columns" rowKey="uuid" :url="url" :parameter="parameter"
				:formatConditions="false" :showSearch="false" @rowClick="
          (e) => {
            masterRowClick(e);
          }
        ">
			</ZTree>
		</div>
		<div class="page-common-content">
			<div class="page-common-box-content">
				<tool-bar @search="$refs.subList.refresh(true)" @reset="
				    () => {
				      (subQueryParam = {}), $refs.subList.refresh(true);
				    }
				  ">
					<template slot="toolBtn" slot-scope="scope">
						<a-button class="cu-btn-primary" icon="plus"
							@click="handleAdd('1', $refs.masterList.data, 'sub')">新增</a-button>
						<!-- <a-button
				      class="cu-btn-default"
				      icon="edit"
				      @click="
				        handleEdit($refs.subList.rows, $refs.masterList.data, 'sub')
				      "
				      >编辑</a-button
				    > -->
						<a-button class="cu-btn-danger" icon="delete"
							@click="handleSub($refs.subList.selectedRowKeys, 'sub')">删除</a-button>
						<a-button icon="export" @click="resetPassword()" type="link">重置密码</a-button>
					</template>
					<template slot="toolForm">
						<a-form-item label="">
							<a-input v-model="subQueryParam.userNameId" placeholder="员工号" />
						</a-form-item>
					</template>
				</tool-bar>
				<DataGrid ref="subList" type="sub" :url="url" :columns="subColumns" bordered :queryParam="subQueryParam"
					rowKey="uuid" showPagination="auto" :pageSize="10" @rowClick="
				    (e) => {
				      subRowClick(e);
				    }
				  ">
					<span slot="sex" slot-scope="{ text }">
						{{ text | sexFilter }}
					</span>
					<span slot="status" slot-scope="{ text }">
						<a-tag :color="text === 1 || text === '1' ? 'green' : 'red'">
							{{ text === 1 || text === "1" ? "启用" : "禁用" }}
						</a-tag>
					</span>
					<span slot="action" slot-scope="{ text, record }">
						<template>
							<a @click="handleEdit(record, $refs.masterList.data, 'sub')">编辑</a>
							<a-divider type="vertical" />
							<a href="javascript:;" @click="handleViewDetail(record)">详情</a>
							<a-divider type="vertical" />
							<a @click="handleSub(record, 'sub')">删除</a>
						</template>
					</span>
				</DataGrid>
			</div>
			<div class="page-common-box-content">
				<a-tabs default-active-key="1">
					<a-tab-pane key="1" tab="职位信息">
						<post-table :queryParam="postQueryParam" ref="postTable"></post-table>
					</a-tab-pane>
				</a-tabs>
			</div>
			<editForm ref="subModal" :visible="subVisible" :loading="subConfirmLoading" :model="subMdl"
				@cancel="handleCancel('sub')" @ok="handleOk('sub')" />
			<detailModal ref="detailModal" :visible.sync="visibleDetail" />
		</div>
	</div>
</template>
<script>
	import {
		TreeGrid,
		DataGrid,
		ZTree
	} from "@/components";
	import {
		treeGridMixin
	} from "@/mixins/treeGridMixin";
	import editForm from "./edit.vue";
	import postTable from "./post";
	import detailModal from "./detail";
	export default {
		mixins: [treeGridMixin],
		components: {
			editForm,
			TreeGrid,
			DataGrid,
			postTable,
			detailModal,
		},
		data() {
			return {
				key: "1",
				columns: [{
					title: "组织机构",
					align: "left",
					dataIndex: "text",
				}, ],
				subColumns: [{
						title: "员工号",
						align: "center",
						dataIndex: "userNameId",
						width: 150,
						sorter: true,
					},
					{
						title: "姓名",
						align: "center",
						dataIndex: "userName",
						width: 150,
					},
					{
						title: "性别",
						align: "center",
						dataIndex: "sex",
						scopedSlots: {
							customRender: "sex",
						},
						sorter: true,
						width: 80,
					},
					{
						title: "电话",
						align: "center",
						dataIndex: "telephone",
						width: 150,
					},
					{
						title: "手机",
						align: "center",
						dataIndex: "cellphone",
						width: 150,
					},
					{
						title: "电子邮箱",
						align: "center",
						dataIndex: "email",
					},
					{
						title: "状态",
						align: "center",
						dataIndex: "status",
						scopedSlots: {
							customRender: "status",
						},
						width: 80,
					},
					{
						title: "操作",
						align: "center",
						dataIndex: "action",
						width: 150,
						scopedSlots: {
							customRender: "action",
						},
						fixed: "right",
					},
				],
				masterVisible: false,
				subVisible: false,
				masterConfirmLoading: false,
				subConfirmLoading: false,
				masterMdl: null,
				subMdl: null,
				// 高级搜索 展开/关闭
				advanced: false,
				// 查询参数
				queryParam: {},
				subQueryParam: {},
				url: {
					fathersUrl: "/mdata/organization/getListByLevelId",
					expandUrl: "/mdata/organization/getListByPid",
					subList: "/mdata/user/getPageSet",
					subSave: "/mdata/user/save",
					subUpdate: "/mdata/user/update",
					subDelete: "/mdata/user/delete",
					getUserPost: "/mdata/sysUserPost/getPageSet",
					savePosition: "/mdata/user/savePosition",
					updatePosition: "/mdata/sysUserPost/update",
					delUserPost: "/mdata/sysUserPost/deleteBatch",
				},
				parameter: {
					father: {
						levelId: 1,
					},
					children: {},
				},
				postQueryParam: {},
				visibleDetail: false,
			};
		},
		activated() {},
		mounted() {},
		filters: {
			sexFilter(sex) {
				const sexMap = {
					1: "男",
					2: "女",
				};
				return sexMap[sex];
			},
			statusFilter(status) {
				const statusMap = {
					0: "禁用",
					1: "启用",
				};
				return statusMap[status];
			},
		},
		methods: {
			masterRowClick(record) {
				this.$refs.masterList.rows = record
				this.subQueryParam.orgId = record.id;
				this.postQueryParam = {};
				this.$refs.subList.refresh();
			},
			subRowClick(record) {
				this.postQueryParam.orgId = record.orgId;
				this.postQueryParam.userNameId = record.userNameId;
				this.$refs.postTable.treeData = this.$refs.masterList.data;
				this.$refs.postTable.refresh();
			},
			// 查看详情
			handleViewDetail(e) {
				this.visibleDetail = true;
                this.$post("/mdata/user/userDetails", {
                    userNameId: e.userNameId,
                }).then((res) => {
                        this.$refs.detailModal.onLoadData(res);
                });

			},
			// 重置密码
			resetPassword() {
				if (this.$refs.subList.selectedRows.length === 0) {
					this.$message.warn("请先勾选需要操作的用户");
				} else {
					let uuid = [],
						password = [];
					this.$refs.subList.selectedRows.forEach((req, index) => {
						uuid.push(req.uuid);
						password.push(req.userNameId);
					});
					this.$post("/mdata/user/updatePassword", {
						uuid: uuid.toString(),
						password: password.toString(),
					}).then((res) => {
						if (res.statusCode === 200) {
							this.$message.success(res.message);
							this.$refs.subList.refresh();
						} else {
							this.$message.error(res.message);
						}
					});
				}
			},
		},
	};
</script>

<style scope></style>
