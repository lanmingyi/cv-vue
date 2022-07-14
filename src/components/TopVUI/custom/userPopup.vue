<!--
 * @Description: 用户
 * @Author: lmy
 * @Date: 2021-01-18 15:17:27
 * @LastEditTime: 2021-08-31 11:23:37
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
	<t-modal title="用户信息" :width="1000" :visible="visible" switchFullscreen wrapClassName="t-popup-modal"
		@ok="handleSubmit" @cancel="handleCancel" cancelText="关闭">
		<a-row :gutter="10">
			<a-col :md="6" :sm="24">
				<a-card :bordered="false">
					<div class="page-common-sub-box" style="overflow: auto;">
						<a-tree v-if="orgTree.length" showLine :load-data="onLoadData" :tree-data="orgTree"
							@select="selectTree" default-expand-all />
					</div>
				</a-card>
			</a-col>
			<a-col :md="18" :sm="24">
				<a-card :bordered="false" >
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
								<a-col :md="(!advanced && 6) || 4" :sm="24">
									<span class="table-page-search-submitButtons" :style="
                      (advanced && { float: 'right', overflow: 'hidden' }) || {}
                    ">
										<a-button class="cu-btn-primary" type="primary"
											@click="$refs.table.refresh(true)">查询</a-button>
										<a-button class="cu-btn-filter" @click="resetSearchForm">重置</a-button>
									</span>
								</a-col>
							</a-row>
						</a-form>
					</div>
					<div class="page-common-sub-box">
						<s-table ref="table" :columns="columns" bordered rowKey="uuid" :data="loadData" :pageSize="10"
							:rowSelection="rowSelection" @rowClick="rowClick" :scroll="scrollXY">
							<span slot="serial" slot-scope="text, record, index">
								{{ index + 1 }}
							</span>
							<span slot="sex" slot-scope="text">
								{{ text | sexFilter }}
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

	export default {
		name: "TreeList",
		components: {
			STable,
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
						dataIndex: this.userNameId,
						sorter: true,
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
				orgTree: [],
				// 加载数据方法 必须为 Promise 对象
				loadData: (parameter) => {
					const requestParameters = Object.assign({}, parameter, this.queryParam);
					return this.$post(this.url.getUserList, requestParameters).then(
						(res) => {
							delete this.queryParam.pageNo
							return res;
						}
					);
				},
				selectedRowKeys: [],
				selectedRows: [],
				advanced: false,
				uuids: "",
				dicUuids: "",
				info: "",
				infoUserPost: "",
				orgName: "",
				orgId: "",
				subHeight : 0,
				url: {
					getUserList: this.hrUrl,
					getOrgTree: "/mdata/organization/getListByLevelId?levelId=1",
					getTreeListByPid: "/mdata/organization/getListByPid",
				},
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
		watch: {
			visible() {
				console.log(this.userList);
				if (this.userList) {
					this.selectedRowKeys = this.userList.split(",");
					this.selectedRows = this.selectedRowKeys;
				} else {
					this.selectedRowKeys = [];
					this.selectedRows = [];
				}
				console.log(this.selectedRowKeys);
			},
		},
		created() {
			this.$post(this.url.getOrgTree).then((res) => {
				// 获取树形第一层级
				this.orgTree = res;
				this.orgTree.forEach((e, index) => {
					this.orgTree[index].title = e.text;
					this.orgTree[index].label = e.text;
					this.orgTree[index].index = index;
					this.orgTree[index].key = e.id;
					this.orgTree[index].levelId = e.levelId;
					this.orgTree[index].key = e.id;
					if(this.orgTree[index].state === "open"){
						this.orgTree[index].isLeaf = true
					}
				});
			});
			this.$nextTick(()=>{
				this.subHeight = document.getElementsByClassName("page-common-sub-box")[0]?.clientHeight;
			})
		},
		methods: {
			rowClick(record, index) {
				// 数据表格行点击事件
				this.selectedRows = [];
				this.selectedRows.push(record);
				this.selectedRowKeys = index;
			},
			// 加载树形子级数据
			onLoadData(treeNode) {
				return new Promise((resolve) => {
					// 判断是否有子级
					if (treeNode.dataRef.children) {
						resolve();
						return;
					}
					console.log(treeNode.dataRef.id, "treeNode.dataRef.id=======");
					this.$post(this.url.getTreeListByPid, {
							pid: treeNode.dataRef.id,
						})
						.then((res) => {
							const orgTree = res;
							orgTree.forEach((e, index) => {
								orgTree[index].title = e.text;
								orgTree[index].index = index;
								orgTree[index].key = e.id;
								orgTree[index].levelId = e.levelId;
								if(e.state === "open"){
									orgTree[index].isLeaf = true
								}
							});
							treeNode.dataRef.children = orgTree;
							this.orgTree = [...this.orgTree];
							resolve();
						})
						.catch((err) => {
							console.log(err);
						});
				});
			},
			// 树形选择事件
			selectTree(value, node, extra) {
				const tree = node.node.dataRef;
				this.queryParam = {};
				this.$nextTick(()=>{
					this.queryParam.pageNo = 1;
					if (this.userName && this.userName != "userName") {
						this.queryParam.deptId = tree.id;
					} else {
						if (this.typeForm) this.queryParam.orgId = tree.id;
						else this.queryParam.id = tree.id;
					}
					this.orgName = tree.text;
					console.log("queryParam",this.queryParam)
					this.$refs.table.refresh();
				})
			},
			onSelectChange(selectedRowKeys, selectedRows) {
				this.selectedRowKeys = selectedRowKeys;
				this.selectedRows = selectedRows;
			},
			toggleAdvanced() {
				this.advanced = !this.advanced;
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
								selectedRows.userNameId = e.userNameId;
								selectedRows.userName = e.userName;
								selectedRows.orgName = e.orgName;
								selectedRows.orgId = e.orgId;
							} else {
								selectedRows.userNameId += "," + e.userNameId;
								selectedRows.userName += "," + e.userName;
								selectedRows.orgName += "," + e.orgName;
								selectedRows.orgId += "," + e.orgId;
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
			resetSearchForm() {
				this.orgId = this.typeForm ? this.queryParam.orgId : this.queryParam.id;
				this.queryParam = {};
				if (this.typeForm) {
					this.queryParam.orgId = this.orgId;
				} else {
					this.queryParam.id = this.orgId;
				}
				this.$refs.table.refresh();
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
