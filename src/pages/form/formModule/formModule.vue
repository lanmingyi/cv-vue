<template>
	<t-modal title="新建数据表" :width="900" :visible="visible" :confirmLoading="loading" :mask-closable="false" @ok="ok"
		@cancel="
      () => {
        $emit('cancel');
      }
    ">
		<a-row type="flex" justify="space-around">
			<a-col :md="8" :sm="24">
				<a-card :bordered="false">
					<div class="page-common-sub-box" style="overflow: auto;">
						<tree-grid ref="masterList" :columns="columns" pagination="false" rowKey="uuid" :url="url" :parameter="parameter"
							@rowClick="
								(e, key) => {
									masterRowClick(e, key, { id: 'id' });
								}
							"></tree-grid>
					</div>
				</a-card>
			</a-col>
			<a-col :md="16" :sm="24">
				<a-card :bordered="false">
					<div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
						<div class="table-operator">
							<a-button class="cu-btn-primary" icon="plus"
								@click="handleAdd('1', $refs.masterList.getListData(), 'sub')">新增</a-button>
							<a-button class="cu-btn-default" icon="edit" @click="
						        handleEdit('all', $refs.masterList.getListData(), 'sub')
						      ">编辑</a-button>
							<a-button class="cu-btn-danger" icon="delete" @click="handleSub('all', 'sub')">删除</a-button>
						</div>
					</div>
					<div class="page-common-sub-box">
						<s-table ref="subList" size="small" :columns="columnsDicItem" :data="loadDataDicItem" bordered
							:rowSelection="subRowSelection" rowKey="uuid" showPagination="auto" @rowClick="subRowClick"
							:rowClassName="rowClassNameDic" :pageSize="10" :scroll="scrollXY">
							<span slot="serial" slot-scope="text, record, index">
								{{ index + 1 }}
							</span>
						</s-table>
					</div>
					<editDic-form ref="subModal" :visible="subVisible" :loading="subConfirmLoading" :model="subMdl"
						@cancel="handleCancel('sub')" @ok="handleOk('sub')" />
				</a-card>
			</a-col>
		</a-row>
	</t-modal>
</template>

<script>
	import TreeGrid from "@/components/TopVUI/custom/TreeGrid";
	import {
		STable
	} from "@/components";
	import editDicForm from "./edit.vue";
	import {
		dataTreeMixin
	} from "@/mixins/dataTreeMixin";
	import detailForm from "./design.vue";
	import util from "@/utils/util";
	const columns = [{
		title: "分类名称",
		dataIndex: "text",
	}, ];
	const columnsDicItem = [{
			title: "#",
			align: "center",
			width: 50,
			scopedSlots: {
				customRender: "serial",
			},
			fixed: "left",
		},
		{
			title: "表名",
			align: "center",
			dataIndex: "tableName",
		},
		{
			title: "表描述",
			align: "center",
			dataIndex: "tableDesc",
		},
	];
	export default {
		mixins: [dataTreeMixin],
		components: {
			STable,
			editDicForm,
			TreeGrid,
			detailForm,
		},
		props: {
			visible: {
				type: Boolean,
				required: true,
			},
			loading: {
				type: Boolean,
				default: () => false,
			},
			model: {
				type: Object,
				default: () => null,
			},
		},
		data() {
			return {
				columns,
				columnsDicItem,
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
				masterSelectedRowKeys: [],
				masterSelectedRows: [],
				subSelectedRowKeys: [],
				subSelectedRows: [],
				masterRows: "",
				subRows: "",
				url: {
					fathersUrl: "/form/formModule/getListByLevelId",
					expandUrl: "/form/formModule/getListByPid",
					subList: "/form/formTable/getPageSetData",
					subSave: "/form/formTable/save",
					subUpdate: "/form/formTable/update",
					subDelete: "/form/formTable/deleteBatch",
				},
				defaultExpandedRowKeys: [],
				loadDataDicItem: (parameter) => {
					const requestParameters = Object.assign({},
						parameter,
						this.subQueryParam
					);
					return this.$post(this.url.subList, requestParameters).then((res) => {
						return res;
					});
				},
				parameter: {
					father: {
						levelId: 1,
					},
					children: {
						levelId: 1,
					},
				},
				visibleDetail: false,
				subHeight: 0,
			};
		},
		activated() {},
		mounted() {},
		created() {
			this.$nextTick(() => {
				this.subHeight = document.getElementsByClassName("page-common-sub-box")[0]?.clientHeight;
			})
		},
		computed: {
			subRowSelection() {
				return {
					selectedRowKeys: this.subSelectedRowKeys,
					onChange: this.onSelectChangeSub,
					type: "radio",
				};
			},
			scrollXY() {
				let subHeight = this.subHeight ? this.subHeight : 500
				let height = subHeight - 40 - 40
				return {
					y: height
				};
			},
		},
		methods: {
			subRowClick(record, index) {
				// 数据表格行点击事件
				this.subRows = record;
				this.subSelectedRows = [];
				this.subSelectedRows.push(record);
				this.subSelectedRowKeys = index;
			},
			// 刷新
			getRefresh() {
				this.masterRows = "";
				this.subRows = "";
				this.subSelectedRowKeys = [];
				this.subSelectedRows = [];
				this.subQueryParam = {};
				if (this.$refs.subList) this.$refs.subList.refresh();
			},
			rowClassNameDic(row) {
				return row.uuid === this.subRows?.uuid ? "bg-bray" : ""; // 每条数据的唯一识别值
			},
			handleViewDesign(e) {
				this.visibleDetail = true;
				this.$refs.detailModal.getData(e.tableName);
			},
			handleCancelDetail(e) {
				this.visibleDetail = false;
			},
			ok() {
				if (this.subSelectedRows.length === 0) {
					this.$message.info("请先选择所要操作的数据表");
					return true;
				}
				this.$emit("ok", this.subSelectedRows[0]);
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
