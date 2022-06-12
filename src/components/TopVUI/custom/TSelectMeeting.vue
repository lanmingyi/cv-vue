<template>
	<t-modal centered title="会议室选择" :width="1000" :height="800" :visible="visible" switchFullscreen @ok="handleOk"
		@cancel="close" cancelText="关闭">
		<template>
			<!-- 查询区域 -->
			<div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
				<div class="table-page-search-wrapper"></div>
			</div>
			<a-row :gutter="24">
				<a-col :span="24">
					<div class="page-common-sub-box">
						<s-table bordered ref="table" :columns="innerColumns" :data="loadData" rowKey="uuid"
							:scroll="scrollXY" :pageSize="10" :rowSelection="{
						    selectedRowKeys,
						    onChange: onSelectChange,
						    onSelectAll: onSelectAll,
						    getCheckboxProps: getCheckboxProps,
						    type: 'radio',
						  }" @rowClick="customRowFn">
							<span slot="stateText" slot-scope="text, record, index">
								<!-- {{ text | statusFilter }} -->
								<div v-if="record.state == 'meetingRoom.foundation.roomStatus04'" style="color: red;">
									{{ text }}
								</div>
								<div v-else>{{ text }}</div>
							</span>
						</s-table>
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

	const columns = [{
			title: "会议室名称",
			dataIndex: "name",
		},
		{
			title: "地点",
			dataIndex: "address",
		},
		{
			title: "容纳人数",
			dataIndex: "numberOfPeople",
		},
		{
			title: "设备",
			dataIndex: "equipment",
		},
		{
			title: "会议室状态",
			dataIndex: "stateText",
			scopedSlots: {
				customRender: "stateText",
			},
		},
	];
	export default {
		name: "TSelectAsset",
		components: {
			STable,
		},
		props: {
			visible: {
				type: Boolean,
				default: false,
			},
			multiple: {
				type: Boolean,
				default: true,
			},
			name: {
				type: String,
				default: "",
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
			paramList: {
				type: Array,
				default: () => [],
			},
		},
		data() {
			this.columns = columns;
			return {
				innerValue: [],
				selectedRowKeys: [],
				// 已选择列表
				selectedTable: {
					pagination: false,
					scroll: {
						y: 500,
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
					masterList: "/office/officeConferenceRoom/getPageSet",
					getOrgTree: "/mdata/organization/getListByLevelId?levelId=1",
					getTreeListByPid: "/mdata/organization/getListByPid",
				},
				options: [],
				dataSourceMap: {},
				queryParam: {
					pageNo: 1,
					pageSize: 10,
				},
				treeData: [],
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
			scrollXY(){
				let subHeight = this.subHeight ? this.subHeight : 500
				let height = subHeight - 40 - 40
				return { y : height};
			},
		},
		created() {
			this.$post(this.url.getOrgTree).then((res) => {
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
			this.$nextTick(()=>{
				this.subHeight = document.getElementsByClassName("page-common-sub-box")[0]?.clientHeight;
			})
		},
		filters: {
			statusFilter(status) {
				const statusMap = {
					"meetingRoom.foundation.roomStatus01": "可使用",
					"meetingRoom.foundation.roomStatus02": "正在使用",
					"meetingRoom.foundation.roomStatus03": "移除",
					"meetingRoom.foundation.roomStatus04": "停用",
				};
				return statusMap[status];
			},
		},
		mounted() {},

		methods: {
			refreshParam() {
				this.queryParam = {};
			},
			select(value, node, extra) {
				this.$nextTick(() => {
					this.queryParam.orgId = node.dataRef.id;
					this.queryParam.orgName = node.dataRef.text;
				});
			},
			onLoadData(treeNode) {
				return new Promise((resolve) => {
					if (treeNode.dataRef.children) {
						resolve();
						return;
					}
					this.$post(this.url.getTreeListByPid, {
							pid: treeNode.dataRef.id,
						})
						.then((res) => {
							const treeData = res;
							treeData.forEach((e, index) => {
								treeData[index].title = e.text;
								treeData[index].label = e.text;
								treeData[index].index = index;
								treeData[index].value = e.id;
								treeData[index].levelId = e.levelId;
								treeData[index].key = e.id;
							});
							treeNode.dataRef.children = treeData;
							this.treeData = [...this.treeData];
							resolve();
						})
						.catch((err) => {
							console.log(err);
						});
				});
			},
			/** 关闭弹窗 */
			close() {
				this.$emit("close");
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
				this.$emit("changeData", this.selectedTable.dataSource);
				this.close();
			},

			/** 删除已选择的 */
			handleDeleteSelected(record, index) {
				this.selectedRowKeys.splice(this.selectedRowKeys.indexOf(record.uuid), 1);
				this.selectedTable.dataSource.splice(index, 1);
			},
			customRowFn(record) {
				if (record.state != "meetingRoom.foundation.roomStatus01") {
					this.$message.warning("请选择可使用状态下的会议室!");
				} else {
					if (this.selectedRowKeys) {
						this.selectedRowKeys = [];
						this.selectedTable.dataSource = [];
						this.selectedRowKeys.push(record.uuid);
						this.selectedTable.dataSource.push(record);
					} else {
						this.selectedRowKeys.push(record.uuid);
						this.selectedTable.dataSource.push(record);
					}
				}
			},
			onSelectChange(selectedRowKeys, selectedRow) {
				// console.log("selectedRowKeys", selectedRowKeys)
				// console.log("selectedRow", selectedRow)
				let record = selectedRow[0];
				// console.log("record = " , record);
				if (record.state != "meetingRoom.foundation.roomStatus01") {
					this.$message.warning("请选择可使用状态下的会议室!");
					return;
				}
				this.selectedTable.dataSource = selectedRow.reduce(
					(all, next) =>
					all.some((item) => item["uuid"] == next["uuid"]) ?
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
					this.selectedRowKeys = selectionsRows;
					this.selectedTable.dataSource = dataSource;
				}
			},
			getCheckboxProps(record) {
				return {
					props: {
						disabled: record.state == "meetingRoom.foundation.roomStatus04",
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
