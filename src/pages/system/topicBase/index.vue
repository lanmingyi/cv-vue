<template>
	<div class="page-common-layout">
		<div class="page-common-left" style="width:25%">
			<ZTree ref="masterList" :columns="columns" rowKey="uuid" :url="url" :parameter="parameter"
				:formatConditions="false" :showSearch="false" @rowClick="
          (e) => {
            masterRowClick(e, { uuid: 'uuid', id: 'id' });
          }
        ">
			</ZTree>
		</div>
		<div class="page-common-content">
			<tool-bar @search="$refs.subList.refresh(true)" @reset="
          () => {
            (subQueryParam = {}), $refs.subList.refresh(true);
          }
        ">
				<template slot="toolBtn" slot-scope="scope">
					<a-button class="cu-btn-primary" icon="plus" @click="handleAdd('1', $refs.masterList.data, 'sub')"
						v-action:systopicBaseAddDialog>新增</a-button>
					<!-- <a-button
                class="cu-btn-default"
                icon="edit"
                @click="
                  handleEdit($refs.subList.rows, $refs.masterList.data, 'sub')
                "
                v-action:systopicBaseEditDialog
                >编辑</a-button
              > -->
					<a-button class="cu-btn-danger" icon="delete"
						@click="handleSub($refs.subList.selectedRowKeys, 'sub')" v-action:systopicBaseDelDialog>删除
					</a-button>
				</template>
			</tool-bar>
			<dataGrid ref="subList" type="sub" :url="url" :columns="subColumns" bordered :queryParam="subQueryParam"
				rowKey="uuid" showPagination="auto">
				<span slot="action" slot-scope="{ text, record }">
					<template>
						<a @click="handleEdit(record, $refs.masterList.data, 'sub')">编辑</a>
						<a-divider type="vertical" />
						<a-dropdown>
							<a class="ant-dropdown-link">
								更多
								<a-icon type="down" />
							</a>
							<a-menu slot="overlay">
								<a-menu-item>
									<a @click="handleViewDetail(record)">详情</a>
								</a-menu-item>
								<a-menu-item>
									<a @click="handleSub(record, 'sub')">删除</a>
								</a-menu-item>
							</a-menu>
						</a-dropdown>
					</template>
				</span>
			</dataGrid>
			<editDic-form ref="subModal" :visible="subVisible" :loading="subConfirmLoading" :model="subMdl"
				@cancel="handleCancel('sub')" @ok="handleOk('sub')" />
			<detail-form ref="detailModal" @cancel="handleCancelDetail()" :visible="visibleDetail" :uuid="detailUuid" />
		</div>
	</div>
</template>
<script>
	import {
		TreeGrid,
		DataGrid
	} from "@/components";
	import editDicForm from "./editDicItem.vue";
	import detailForm from "./detail.vue";
	import {
		treeGridMixin
	} from "@/mixins/treeGridMixin";
	const columns = [{
		title: "名称",
		align: "left",
		dataIndex: "text",
	}, ];
	const subColumns = [{
			title: "标题",
			dataIndex: "title",
			align: "left",
			width: 350,
		},
		{
			title: "发布时间",
			dataIndex: "createTime",
			ellipsis: true,
			sorter: true,
		},
		{
			title: "操作",
			dataIndex: "action",
			align: "center",
			width: 120,
			scopedSlots: {
				customRender: "action",
			},
		},
	];
	export default {
		mixins: [treeGridMixin],
		components: {
			DataGrid,
			editDicForm,
			TreeGrid,
			detailForm,
		},
		data() {
			return {
				key: "1",
				columns,
				subColumns,
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
					fathersUrl: "/system/category/getCategorysByTypeAndLevelId",
					expandUrl: "/system/category/getListByPid",
					masterUpdate: "/system/category/update",
					masterDelete: "/system/category/deleteBatch",
					masterSaveRoot: "/system/category/saveRoot",
					masterSave: "/system/category/save",
					subList: "/system/topicBase/getPageSet",
					subSave: "/system/topicBase/save",
					subUpdate: "/system/topicBase/update",
					subDelete: "/system/topicBase/deleteBatch",
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
						type: "topic",
					},
					children: {
						levelId: 1,
						type: "topic",
					},
				},
				visibleDetail: false,
				detailUuid: "",
			};
		},
		activated() {},
		mounted() {},
		computed: {
			subRowSelection() {
				return {
					selectedRowKeys: this.subSelectedRowKeys,
					onChange: this.onSelectChangeSub,
				};
			},
		},
		methods: {
			rowClassName(row) {
				return row.uuid === this.masterRows?.uuid ? "bg-bray" : ""; // 每条数据的唯一识别值
			},
			rowClassNameDic(row) {
				return row.uuid === this.subRows?.uuid ? "bg-bray" : ""; // 每条数据的唯一识别值
			},
			// 查看详情
			handleViewDetail(e) {
				this.visibleDetail = true;
				// this.$refs.detailModal.onLoadData(e);
				this.detailUuid = e.uuid;
			},
			handleCancelDetail() {
				this.visibleDetail = false;
			},
		},
	};
</script>

<style scope>
	.table-operator {
		margin-left: 18px;
	}

	.ant-table-tbody>tr>td:last-child {
		padding: 16px 16px;
	}
</style>
