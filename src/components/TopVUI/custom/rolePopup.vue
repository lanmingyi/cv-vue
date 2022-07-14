<!--
 * @Description: 角色权限
 * @Author: lmy
 * @Date: 2021-06-02 13:38:08
 * @LastEditTime: 2021-09-15 10:42:57
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
	<t-modal title="角色权限" :width="800" :visible="visible" switchFullscreen wrapClassName="t-popup-modal"
		@ok="handleSubmit" @cancel="handleCancel" cancelText="关闭">
		<div class="table-page-search-wrapper">
			<a-form layout="inline">
				<a-row :gutter="12" type="flex" justify="end">
					<a-col :md="6" :sm="24">
						<a-form-item label="">
							<a-input v-model="queryParam.roleName" placeholder="请输入角色名称" />
						</a-form-item>
					</a-col>
					<a-col :md="(!advanced && 6) || 4" :sm="24">
						<span class="table-page-search-submitButtons" :style="
                (advanced && { float: 'right', overflow: 'hidden' }) || {}
              ">
							<a-button class="cu-btn-primary" type="primary" @click="$refs.table.refresh(true)">查询
							</a-button>
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
				<span slot="status" slot-scope="text">
					{{ text | statusFilter }}
				</span>
			</s-table>
		</div>
	</t-modal>
</template>

<script>
	import {
		STable
	} from "@/components";

	export default {
		name: "rolePopup",
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
						title: "角色",
						align: "center",
						width: 300,
						dataIndex: "text",
					},
					{
						title: "状态",
						align: "center",
						dataIndex: "status",
						scopedSlots: {
							customRender: "status",
						},
					},
				],
				orgTree: [],
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
				advanced: false,
				uuids: "",
				dicUuids: "",
				info: "",
				infoUserPost: "",
				orgName: "",
				orgId: "",
				subHeight: 0,
				url: {
					getUserList: "/system/authGroup/getPageSetData",
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
			statusFilter(status) {
				const statusMap = {
					0: "禁用",
					1: "启用",
				};
				return statusMap[status];
			},
		},
		watch: {
			// visible(){
			//   console.log(this.userList)
			//   // this.selectedRowKeys = this.userList.split(',')
			//   // this.selectedRows = this.selectedRowKeys
			//   console.log(this.selectedRowKeys)
			// }
		},
		created() {
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
			onSelectChange(selectedRowKeys, selectedRows) {
				this.selectedRowKeys = selectedRowKeys;
				this.selectedRows = selectedRows;
			},
			handleSubmit() {
				console.log(this.selectedRows);
				if (!this.selectedRows || this.selectedRows.length == 0) {
					this.$message.warning("请选择一条数据");
					return false;
				}
				if (this.typeNum === 1) {
					this.$emit("change", this.selectedRows[0]);
				} else {
					let selectedRows = {
						userNameId: "",
						userName: "",
						id: "",
						uuid: "",
					};
					this.selectedRows.forEach((e, index) => {
						if (index === 0) {
							selectedRows.userNameId += e.userNameId;
							selectedRows.uuid += e.uuid;
							selectedRows.userName += e.text;
							selectedRows.id += e.id;
						} else {
							selectedRows.userNameId += "," + e.userNameId;
							selectedRows.uuid += "," + e.uuid;
							selectedRows.userName += "," + e.text;
							selectedRows.id += "," + e.id;
						}
					});
					console.log(selectedRows);
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
                this.queryParam = {};
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
