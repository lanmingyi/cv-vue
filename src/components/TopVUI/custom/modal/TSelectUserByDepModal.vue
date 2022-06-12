<template>
	<t-modal :width="950" :visible="visible" :title="title" switchFullscreen @ok="handleSubmit" @cancel="close"
		style="top:50px" cancelText="关闭">
		<a-row class="t-row" :gutter="24" style="background-color: #ececec; padding: 10px; margin: -10px">
			<a-col :md="8" :sm="24">
				<a-card :bordered="false">
					<a-tree v-if="orgTree.length" showLine :load-data="onLoadData" :tree-data="orgTree"
						@select="selectTree" default-expand-all />
				</a-card>
			</a-col>
			<a-col :md="16" :sm="24">
				<a-card :bordered="false">
					<div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
						<div class="table-page-search-wrapper">
							<a-form layout="inline">
								<div class="flex justify-between flex-wrap">
									<a-form-item label="">
										<a-input v-model="queryParam.userNameId" placeholder="员工号" />
									</a-form-item>
									<a-form-item label="">
										<a-input v-model="queryParam.userName" placeholder="姓名" />
									</a-form-item>
									<div class="table-page-search-submitButtons flex">
										<a-button class="cu-btn-primary" @click="$refs.table.refresh(true)">查询
										</a-button>
										<a-button class="cu-btn-filter" @click="
                        () => {
                          (queryParam = {}), $refs.table.refresh();
                        }
                      ">重置</a-button>
									</div>
								</div>
							</a-form>
						</div>
					</div>
					<div class="page-common-sub-box">
						<s-table ref="table" :columns="columns" rowKey="uuid" :data="loadData" bordered :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
              type: multi ? 'checkbox' : 'radio',
            }" @rowClick="rowClick" :pageSize="10" :scroll="scrollXY">
							<span slot="serial" slot-scope="text, record, index">
								{{ index + 1 }}
							</span>
							<span slot="sex" slot-scope="text">
								{{ text | sexFilter }}
							</span>
							<span slot="status" slot-scope="text">
								<a-tag :color="text === 1 || text === '1' ? 'green' : 'red'">
									{{ text === 1 || text === "1" ? "启用" : "禁用" }}
								</a-tag>
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
		props: ["modalWidth", "multi", "userIds"],
		components: {
			STable,
		},
		data() {
			return {
				title: "用户",
				visible: false,
				confirmLoading: false,
				mdl: null,
				// 查询参数
				queryParam: {},
				queryParamList: {},
				userPost: [],
				data: [],
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
						dataIndex: "userNameId",
						sorter: true,
					},
					{
						title: "姓名",
						align: "center",
						dataIndex: "userName",
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
					console.log("loadData request parameters:", requestParameters);
					return this.$post(this.url.getUserList, requestParameters).then(
						(res) => {
							this.data = res.rows;
							return res;
						}
					);
				},
				selectedRowKeys: [],
				selectedRows: [],
				advanced: false,
				userNameId: "",
				dicUuids: "",
				info: "",
				infoUserPost: "",
				orgName: "",
				orgId: "",
				showFlag: true,
				subHeight : 0,
				url: {
					getOrgTree: "/mdata/organization/getListByLevelId?levelId=1",
					getUserList: "/mdata/user/getPageSet",
					getTreeListByPid: "/mdata/organization/getListByPid",
					getUserListByUuids: "/mdata/user/getListByUuids",
				},
			};
		},
		computed: {
			hasSelected() {
				return this.selectedRowKeys.length > 0;
			},
			scrollXY(){
				let subHeight = this.subHeight ? this.subHeight : 500
				let height = subHeight - 40 - 40
				return { y : height};
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
		created() {
			// 该方法触发屏幕自适应
			this.resetScreenSize();
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
					this.selectedRowKeys = [];
					// JSelectUserByDep组件bug issues/I16634
					this.$emit("initComp", "");
				}
			},
			refreshQueryParam() {
				this.queryParam = {};
				this.queryParam = Object.assign({}, this.queryParamList);
				this.$refs.table.refresh();
			},
			showModal() {
				this.visible = true;
				this.showFlag = true;
				this.orgTree = [];
				this.queryParam = {};
				this.queryParamList = {};
				this.getData();
				if (this.$refs.table) this.$refs.table.refresh();
			},
			close() {
				this.visible = false;
			},
			handleSubmit() {
				const that = this;
				that.$emit("ok", that.selectedRows, that.selectedRowKeys.toString());
				that.close();
			},
			rowClick(record, index) {
				// 数据表格行点击事件
				this.selectedRows = [];
				this.selectedRows.push(record);
				this.selectedRowKeys = index;
			},
			// 触发屏幕自适应
			resetScreenSize() {
				const screenWidth = document.body.clientWidth;
				if (screenWidth < 500) {
					this.scrollTrigger = {
						x: 800
					};
				} else {
					this.scrollTrigger = {};
				}
			},
			getData() {
				this.$nextTick(() => {
					if (this.showFlag) {
						this.showFlag = false;
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
							});
						});
					}
				});
			},
			// 加载树形子级数据
			onLoadData(treeNode) {
				return new Promise((resolve) => {
					// 判断是否有子级
					if (treeNode.dataRef.children) {
						resolve();
						return;
					}
					this.$post(this.url.getTreeListByPid, {
							pid: treeNode.dataRef.id
						})
						.then((res) => {
							const orgTree = res;
							orgTree.forEach((e, index) => {
								orgTree[index].title = e.text;
								orgTree[index].index = index;
								orgTree[index].key = e.id;
								orgTree[index].levelId = e.levelId;
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
				this.queryParam.id = tree.id;
				this.queryParamList = Object.assign({}, this.queryParam);
				this.orgName = tree.text;
				this.$refs.table.refresh();
			},
			onSelectChangeResh(changeableRowKeys) {
				console.log(changeableRowKeys);
			},
			onSelectChange(selectedRowKeys, selectedRows) {
				this.selectedRowKeys = selectedRowKeys;
				this.selectedRows = selectedRows;
			},
			toggleAdvanced() {
				this.advanced = !this.advanced;
			},
		},
	};
</script>

<style lang="less" scoped="scoped">
	.t-row.ant-row {
		background: #fff !important;
	}

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
