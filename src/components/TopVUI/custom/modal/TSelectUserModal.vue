<template>
	<t-modal title="用户信息" :width="1000" :visible="visible" switchFullscreen wrapClassName="t-popup-modal"
		@ok="handleSubmit" @cancel="handleCancel" cancelText="关闭">
		<a-row :gutter="10">
			<a-col :md="6" :sm="24">
				<a-card :bordered="false">
					<!-- <a-tree v-if="orgTree.length" showLine :load-data="onLoadData" :tree-data="orgTree" @select="selectTree"
					 default-expand-all /> -->
					<!-- <z-tree></z-tree> -->
					<ZTree ref="masterList" :url="url" :parameter="parameter" @select="
              (e, key) => {
                selectTree(e, key);
              }
            " />
				</a-card>
			</a-col>
			<a-col :md="18" :sm="24">
				<a-card :bordered="false">
					<div class="toolbar table-page-search-wrapper">
						<a-form layout="inline">
							<a-row :gutter="12" type="flex" justify="start">
								<a-col :md="6" :sm="24">
									<a-form-item label="">
										<a-input v-model="queryParam.userNameId" placeholder="员工号" />
									</a-form-item>
								</a-col>
								<a-col :md="6" :sm="24">
									<a-form-item label="">
										<a-input v-model="queryParam.userName" placeholder="姓名" />
									</a-form-item>
								</a-col>
								<a-col :md="6" :sm="24">
									<span class="table-page-search-submitButtons">
										<a-button class="cu-btn-primary" type="primary"
											@click="$refs.table.refresh(true)">查询</a-button>
										<a-button class="cu-btn-filter" @click="() => (queryParam = {})">重置</a-button>
									</span>
								</a-col>
							</a-row>
						</a-form>
					</div>
					<div class="page-common-sub-box">
						<s-table ref="table" :columns="columns" bordered rowKey="uuid" :data="loadData" :pageSize="10"
							:rowSelection="rowSelection" @rowClick="rowClick">
							<span slot="serial" slot-scope="text, record, index">
								{{ index + 1 }}
							</span>
							<span slot="status" slot-scope="text">
								{{ text | statusFilter }}
							</span>
						</s-table>
					</div>
				</a-card>
			</a-col>
		</a-row>
	</t-modal>
</template>

<script>
	import {
		STable
	} from "@/components";

	import ZTree from "@/components/TopVUI/custom/ZTree";
	export default {
		name: "TreeList",
		components: {
			STable,
			ZTree,
		},
		props: {
			visible: {
				type: Boolean,
			},
			typeNum: {
				type: Number,
			},
			userList: {
				type: String,
			},
			hrUrl: {
				type: String,
				default: "/mdata/user/getPageSet",
			},
			userNameId: {
				type: String,
				default: "userNameId",
			},
			userName: {
				type: String,
				default: "userName",
			},
			typeForm: {
				type: Boolean,
				default: () => false,
			},
			userIds: {
				type: String,
			},
		},
		data() {
			return {
				mdl: null,
				// 查询参数
				queryParam: {},
				// 表头
				columns: [{
						title: "#",
						align: "center",
						width: 50,
						scopedSlots: {
							customRender: "serial",
						},
						fixed: "left",
					},
					{
						title: "员工号",
						align: "center",
						width: 300,
						sorter: true,
						dataIndex: this.userNameId,
					},
					{
						title: "姓名",
						align: "center",
						dataIndex: this.userName,
					},
					{
						title: "状态",
						align: "center",
						dataIndex: "status",
						scopedSlots: {
							customRender: "status",
						},
						sorter: true,
					},
				],
				// 加载数据方法 必须为 Promise 对象
				loadData: (parameter) => {
					const requestParameters = Object.assign({}, parameter, this.queryParam);
					console.log("loadData request parameters:", requestParameters);
					return this.$post(this.url.getUserList, requestParameters).then(
						(res) => {
							return res;
						}
					);
				},
				selectedRowKeys: [],
				selectedRows: [],
				orgName: "",
				orgId: "",
				url: {
					getUserList: this.hrUrl,
					fathersUrl: "/mdata/organization/getListByLevelId?levelId=1",
					expandUrl: "/mdata/organization/getListByPid",
					getUserListByUuids: "/mdata/user/getListByUuids",
				},
				parameter: {
					father: {},
					children: {}
				},
				subHeight: 0,
			};
		},
		computed: {
			rowSelection() {
				return {
					selectedRowKeys: this.selectedRowKeys,
					onChange: this.onSelectChange,
					type: this.typeNum === 1 ? "radio" : "checkbox",
				};
			},
			scrollXY(){
				let subHeight = this.subHeight ? this.subHeight : 500
				let height = subHeight - 40 - 40
				return { y : height};
			},
		},
		filters: {
			statusFilter(status) {
				const statusMap = {
					0: "禁用",
					1: "启用",
				};
				return statusMap[status];
			},
		},
		watch: {
			userIds: {
				immediate: true,
				handler() {
					this.initUserNames();
				},
			},
		},
		created() {
			this.$nextTick(()=>{
				this.subHeight = document.getElementsByClassName("page-common-sub-box")[0]?.clientHeight;
			})
		},
		methods: {
			initUserNames() {
				console.log("initUserNames============");
				if (this.userIds) {
					// 这里最后加一个 , 的原因是因为无论如何都要使用 in 查询，防止后台进行了模糊匹配，导致查询结果不准确
					let values = this.userIds;
					let selectedRowKeys = [];
					let realNames = [];
					this.$post(this.url.getUserListByUuids, {
						uuids: values
					}).then(
						(res) => {
							// 获取树形第一层级
							res.forEach((user) => {
								// if(user.uuid = )
								realNames.push(user.userName);
								selectedRowKeys.push(user.uuid);
							});
							console.log(realNames);
							this.selectedRowKeys = selectedRowKeys;
							this.$emit("initComp", realNames.join(","));
						}
					);
				} else {
					// JSelectUserByDep组件bug issues/I16634
					this.$emit("initComp", "");
				}
			},
			rowClick(record, index) {
				// 数据表格行点击事件
				this.selectedRows = [];
				this.selectedRows.push(record);
				this.selectedRowKeys = index;
			},
			// 树形选择事件
			selectTree(tree, value, extra) {
				// const tree = tree
				if (this.userName && this.userName != "userName") {
					this.queryParam.deptId = tree.id;
				} else {
					if (this.typeForm) this.queryParam.orgId = tree.id;
					else this.queryParam.id = tree.id;
				}
				this.queryParam.pageNo = 1;
				this.orgName = tree.text;
				this.$refs.table.refresh();
			},
			onSelectChange(selectedRowKeys, selectedRows) {
				this.selectedRowKeys = selectedRowKeys;
				this.selectedRows = selectedRows;
			},
			handleSubmit() {
				// debugger
				if (!this.selectedRows || this.selectedRows.length == 0) {
					this.$message.warning("请选择一条数据");
					return false;
				}
				if (this.typeNum === 1) {
					this.$emit("change", this.selectedRows[0]);
				} else {
					let selectedRows = {};
					if (this.selectedRows[0].userNameId) {
						this.selectedRows.forEach((e, index) => {
							if (index === 0) {
								selectedRows.uuid = e.uuid;
								selectedRows.userNameId = e.userNameId;
								selectedRows.userName = e.userName;
								selectedRows.orgName = e.orgName;
								selectedRows.orgId = e.orgId;
							} else {
								selectedRows.userNameId += "," + e.userNameId;
								selectedRows.userName += "," + e.userName;
								selectedRows.orgName += "," + e.orgName;
								selectedRows.orgId += "," + e.orgId;
								selectedRows.uuid += "," + e.uuid;
							}
						});
					} else {
						this.selectedRows.forEach((e, index) => {
							if (index === 0) {
								selectedRows.employeeId = e.employeeId;
								selectedRows.employeeName = e.employeeName;
								selectedRows.sex = e.sex;
								selectedRows.department = e.department;
								selectedRows.departmentId = e.departmentId;
								selectedRows.post = e.post;
								selectedRows.postId = e.postId;
								selectedRows.entryDate = e.entryDate;
							} else {
								selectedRows.employeeId += "," + e.employeeId;
								selectedRows.employeeName += "," + e.employeeName;
								selectedRows.sex += "," + e.sex;
								selectedRows.department += "," + e.department;
								selectedRows.departmentId += "," + e.departmentId;
								selectedRows.post += "," + e.post;
								selectedRows.postId += "," + e.postId;
								selectedRows.entryDate += "," + e.entryDate;
							}
						});
					}
					console.log("selectedRows", selectedRows);
					this.$emit("change", selectedRows);
				}
				this.close();
			},
			close() {
				this.$emit("close");
			},
			handleCancel() {
				this.close();
			},
		},
	};
</script>

<style lang="less">
	.custom-tree {
		/deep/ .ant-menu-item-group-title {
			position: relative;

			&:hover {
				.btn {
					display: block;
				}
			}
		}

		/deep/ .ant-menu-item {
			&:hover {
				.btn {
					display: block;
				}
			}
		}

		/deep/ .btn {
			display: none;
			position: absolute;
			top: 0;
			right: 10px;
			width: 20px;
			height: 40px;
			line-height: 40px;
			z-index: 1050;

			&:hover {
				transform: scale(1.2);
				transition: 0.5s all;
			}
		}
	}
</style>
