<template>
	<t-modal centered :title="name + '选择'" :width="width" :height="800" :visible="visible" switchFullscreen
		@ok="handleOk" @cancel="close" cancelText="关闭">
		<template>
			<!-- 查询区域 -->
			<div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
				<div class="table-page-search-wrapper">
					<a-form layout="inline">
						<div class="table-operator flex justify-between flex-wrap">
							<a-form-item>
								<!-- <a-tree-select style="width: 200px;" :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" :tree-data="treeData"
								 placeholder="组织机构" :showSearch="true" :load-data="onLoadData" v-model="queryParam.orgName" @select="select" /> -->
								<tree-select style="width: 200px;" v-model="queryParam.orgName"
									:treeValueText="queryParam.orgName" placeholder="组织机构" :parameter="parameter"
									:url="url" :data="treeData" idfield="id" textfield="text" @change="selectOrg" />
							</a-form-item>
							<a-form-item label="">
								<a-input v-model="queryParam.userName" placeholder="姓名" />
							</a-form-item>
							<div class="table-page-search-submitButtons flex">
								<a-button class="cu-btn-primary" @click="$refs.table.refresh(true)">查询</a-button>
								<a-button class="cu-btn-filter" @click="refreshParam()">重置</a-button>
							</div>
						</div>
					</a-form>
				</div>
			</div>
			<a-row :gutter="18">
				<a-col :span="16">
					<div class="page-common-sub-box">
						<s-table bordered ref="table" :columns="innerColumns" :data="loadData" rowKey="userNameId"
							:scroll="scrollXY" :pageSize="10" :rowSelection="{
						    selectedRowKeys,
						    onChange: onSelectChange,
						    onSelectAll: onSelectAll,
						    getCheckboxProps: getCheckboxProps,
						  }" @rowClick="customRowFn">
						</s-table>
					</div>
				</a-col>
				<a-col :span="8">
					<div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
						<div class="table-page-search-wrapper">
							<a-form layout="inline">
								<div class="flex justify-between flex-wrap"></div>
							</a-form>
						</div>
					</div>
					<div class="page-common-sub-box">
						<a-table rowKey="uuid" size="small" bordered v-bind="selectedTable" :scroll="scrollXY">
							<span slot="action" slot-scope="text, record, index">
								<a @click="handleDeleteSelected(record, index)">删除</a>
							</span>
						</a-table>
					</div>
				</a-col>
			</a-row>
		</template>
	</t-modal>
</template>

<script>
	import {
		STable
	} from "@/components";
	import {
		cloneObject
	} from "@/utils/util";
	import TreeSelect from "@/components/TopVUI/custom/TreeSelect";

	export default {
		name: "TSelectBizComponentModal",
		components: {
			STable,
			TreeSelect,
		},
		props: {
			visible: {
				type: Boolean,
				default: false,
			},
			valueKey: {
				type: String,
				required: true,
			},
			multiple: {
				type: Boolean,
				default: true,
			},
			width: {
				type: Number,
				default: 900,
			},

			name: {
				type: String,
				default: "",
			},
			listUrl: {
				type: String,
				required: true,
				default: "",
			},
			// 根据 value 获取显示文本的地址，例如存的是 username，可以通过该地址获取到 realname
			valueUrl: {
				type: String,
				default: "",
			},
			displayKey: {
				type: String,
				default: null,
			},
			columns: {
				type: Array,
				required: true,
				default: () => [],
			},
			paramList: {
				type: Array,
				default: () => [],
			},
			// 查询条件Code
			queryParamCode: {
				type: String,
				default: null,
			},
			// 查询条件文字
			queryParamText: {
				type: String,
				default: null,
			},
			// 过长裁剪长度，设置为 -1 代表不裁剪
			ellipsisLength: {
				type: Number,
				default: 12,
			},
			showBtn: {
				type: Boolean,
				default: true,
			},
		},
		data() {
			return {
				innerValue: [],
				selectedRowKeys: [],
				// 已选择列表
				selectedTable: {
					pagination: false,
					scroll: {
						y: 400,
					},
					columns: [{
							...this.columns[0],
							width: this.columns[0].widthRight || this.columns[0].width,
						},
						{
							title: "操作",
							dataIndex: "action",
							align: "center",
							width: 60,
							scopedSlots: {
								customRender: "action",
							},
						},
					],
					dataSource: [],
				},
				// 加载数据方法 必须为 Promise 对象
				loadData: (parameter) => {
					const requestParameters = Object.assign({}, parameter, this.queryParam);
					return this.$post(this.url.masterList, requestParameters).then(
						(res) => {
							return res;
						}
					);
				},
				url: {
					masterList: "/mdata/user/getPageSet",
					fathersUrl: "/mdata/organization/getListByLevelId?levelId=1",
					expandUrl: "/mdata/organization/getListByPid",
				},
				parameter: {
					father: {
						levelId: 1,
					},
					children: {},
				},
				options: [],
				dataSourceMap: {},
				queryParam: {
					pageNo: 1,
					pageSize: 20,
					puuid: "",
					orgId: "",
					orgName: "",
				},
				treeData:[],
				subHeight: 0,
			};
		},
		computed: {
			// 表头
			innerColumns() {
				const columns = cloneObject(this.columns);
				columns.forEach((column) => {
					// 给所有的列加上过长裁剪
					if (this.ellipsisLength !== -1) {
						// column.customRender = (text) => this.renderEllipsis(text)
					}
				});
				return columns;
			},
			scrollXY() {
				let subHeight = this.subHeight ? this.subHeight : 500
				let height = subHeight - 40 - 40
				return {
					y: height
				};
			},
		},
		created() {
			this.$post(this.url.fathersUrl).then((res) => {
				this.treeData = res;
				this.treeData.forEach((e, index) => {
					this.treeData[index].title = e.text;
					this.treeData[index].label = e.text;
					this.treeData[index].index = index;
					this.treeData[index].value = e.id;
					this.treeData[index].key = e.id;
					this.treeData[index].levelId = e.levelId;
				});
			});
			this.$nextTick(() => {
				this.subHeight = document.getElementsByClassName("page-common-sub-box")[0]?.clientHeight;
			})
		},
		mounted() {},
		methods: {
			refreshParam() {
				this.queryParam = {};
				this.$refs.table.refresh()
			},
			selectOrg(value, node) {
				this.queryParam.orgId = "";
				this.queryParam.orgName = "";
				this.$nextTick(() => {
					this.queryParam.orgId = value;
					this.queryParam.orgName = node ? node.toString() : "";
				});
			},
			/** 关闭弹窗 */
			close() {
				this.$emit("update:visible", false);
				this.selectedRowKeys = [];
				this.selectedTable.dataSource = [];
			},
			refreshList(e) {
				this.queryParam = e || {};
				if (this.$refs.table) this.$refs.table.refresh();
			},

			/** 完成选择 */
			handleOk() {
				// console.log('this.selectedRowKeys', this.selectedRowKeys)
				this.$emit("input", this.selectedRowKeys);
				if (this.showBtn) {
					this.$emit("changeData", this.selectedTable.dataSource);
				} else {
					let selectedRows = [];
					this.selectedTable.dataSource.forEach((e, index) => {
						if (index === 0) {
							selectedRows.userNameId = e.userNameId;
							selectedRows.userName = e.userName;
						} else {
							selectedRows.userNameId += "," + e.userNameId;
							selectedRows.userName += "," + e.userName;
						}
					});
					this.$emit("changeData", selectedRows);
				}
				this.close();
			},

			/** 删除已选择的 */
			handleDeleteSelected(record, index) {
				this.selectedRowKeys.splice(
					this.selectedRowKeys.indexOf(record.userNameId),
					1
				);
				this.selectedTable.dataSource.splice(index, 1);
			},
			customRowFn(record) {
				console.log("paramList", this.paramList);
				const type = this.paramList.some(
					(item) => item.userNameId === record.userNameId
				);
				if (!type) {
					const key = record.userNameId;
					if (!this.multiple) {
						this.selectedRowKeys = [key];
						this.selectedTable.dataSource = [record];
					} else {
						const index = this.selectedRowKeys.indexOf(key);
						if (index === -1) {
							this.selectedRowKeys.push(key);
							this.selectedTable.dataSource.push(record);
						} else {
							this.handleDeleteSelected(record, index);
						}
					}
				} else {
					this.$message.info("已存在该数据");
				}
			},
			onSelectChange(selectedRowKeys, selectedRow) {
				let dataSource = this.selectedTable.dataSource.concat(selectedRow);
				this.selectedTable.dataSource = dataSource.reduce(
					(all, next) =>
					all.some((item) => item["uuid"] === next["uuid"]) ?
					all :
					[...all, next],
					[]
				);
				this.selectedRowKeys = selectedRowKeys.reduce(
					(all, next) =>
					all.some((item) => item == next) ? all : [...all, next],
					[]
				);
			},
			onSelectAll(selected, selectedRows, changeRows) {
				if (!selected) {
					const selectionsRows = [];
					const dataSource = [];
					this.selectedRowKeys.forEach((e, index) => {
						if (JSON.stringify(changeRows).indexOf(JSON.stringify(e)) === -1) {
							selectionsRows.push(e);
						}
					});
					this.selectedTable.dataSource.forEach((e, index) => {
						if (
							JSON.stringify(changeRows).indexOf(JSON.stringify(e.uuid)) === -1
						) {
							dataSource.push(e);
						}
					});
					console.log(dataSource);
					this.selectedRowKeys = selectionsRows;
					this.selectedTable.dataSource = dataSource;
				}
			},
			getCheckboxProps(record) {
				return {
					props: {
						disabled: this.paramList.some(
							(item) => item.userNameId === record.userNameId
						),
						// defaultChecked: this.paramList.some(item => item.userNameId === record.userNameId)
					},
				};
			},
		},
	};
</script>
<style lang="less" scoped>
	.ant-modal-content {
		height: 100% !important;
	}
</style>
