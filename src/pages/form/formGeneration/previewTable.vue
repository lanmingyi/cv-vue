<template>
	<t-modal title="设计预览" :visible="visible" @ok="addAnalogData" @cancel="handleCancel" okText="添加模拟数据" cancelText="关闭"
		style="top:20px;" :destroyOnClose="true" :width="`850px`">
		<div style="color: #f40;font-size: 13px;" class="padding-bottom-sm">
			*注意：此设计预览仅为模板演示，页面效果均为静态展示！
		</div>
		<tool-bar @search="() => {}" @reset="() => {}">
			<template slot="toolBtn" v-if="topButton.length > 0">
				<a-button v-if="topButton.includes('新增')" class="cu-btn-primary" icon="plus">新增</a-button>
				<a-button v-if="topButton.includes('编辑')" class="cu-btn-default" icon="edit">编辑</a-button>
				<a-button v-if="topButton.includes('详情')" class="cu-btn-info margin-right-xs" icon="delete">查看详情
				</a-button>
				<a-button v-if="topButton.includes('删除')" class="cu-btn-danger" icon="delete">删除</a-button>
			</template>
			<template slot="toolForm" v-if="searchData.length > 0">
				<!-- 搜索字段 -->
				<a-form-item :label="item.filedName" v-for="(item, index) in searchData" :key="index">
					<a-input v-model="queryParam[item.filed]" :placeholder="item.filedName" disabled />
				</a-form-item>
			</template>
		</tool-bar>
		<div class="page-common-sub-box margin-bottom-xl">
			<a-table bordered size="small" :data-source="tableSource" :columns="columns" :pagination="pagination"
				@change="handleTableChange" :scroll="scrollXY">
				<template slot="serial" slot-scope="text, record, index">
					{{ index + 1 }}
				</template>
				<template slot="action" slot-scope="{ text, record }" v-if="lineButton.length > 0">
					<a style="margin-right: 5px" v-if="lineButton.includes('编辑')">编辑</a>
					<a-divider v-if="lineButton.length > 1" type="vertical" />
					<a style="margin-right: 5px" v-if="lineButton.includes('删除')">删除</a>
				</template>
			</a-table>
		</div>
	</t-modal>
</template>
<script>
	import DataGrid from "@/components/table/advance/dataGrid.vue";
	import tableView from "../formTemplate/tableView.vue";
	export default {
		props: {
			listData: Array,
			searchData: Array,
			listProData: Object,
			basicData: Object,
		},
		data() {
			return {
				visible: false,
				previewWidth: 850,
				topButton: [], //顶部按钮展示
				lineButton: [], //行内按钮展示
				tableName: "",
				queryParam: {},
				url: {
					getPageSet: "/form/formField/commonGetPageSet",
					save: "/form/formField/commonSave",
					update: "/form/formField/commonUpdate",
					deleteBatch: "/form/formField/commonDeleteBatch",
				},
				columns: [],
				columnList: [],
				tableSource: [],
				pagination: {
					current: 1,
					pageSize: 10,
					total: 0,
				},
				subHeight: 0,
			};
		},
		components: {
			tableView,
			DataGrid,
		},
		computed: {
			scrollXY() {
				let subHeight = this.subHeight ? this.subHeight : 500
				let height = subHeight - 40 - 40
				return {
					x: 'auto',
					y: height
				};
			},
		},
		watch: {
			basicData: {
				deep: true,
				immediate: true,
				handler(newVal, oldVal) {
					this.tableName = newVal ? newVal.tableName : null;
					this.queryParam = {
						...this.queryParam,
						tableName: this.tableName,
					};
				},
			},
			listData: {
				deep: true,
				immediate: true,
				handler(newVal, oldVal) {
					//表头
					this.columnList = newVal;
					this.columns = [];
					this.getColumns(this.columnList);
				},
			},
			listProData: {
				deep: true,
				immediate: true,
				handler(newVal, oldVal) {
					//分页
					if (newVal.showPage) {
						this.pagination = {
							current: 1,
							pageSize: newVal.showPageSize,
							total: this.tableSource.length,
						};
					} else {
						this.pagination = false;
					}
					//顶部按钮
					this.topButton = [];
					if (newVal.showtopButton) {
						newVal.topButtonList.forEach((val) => {
							if (val.checked == true) {
								this.topButton.push(val.name);
							}
						});
					}
					// 行内按钮
					this.lineButton = [];
					if (newVal.showlineButton) {
						newVal.lineButtonList.forEach((val) => {
							if (val.checked == true) {
								this.lineButton.push(val.name);
							}
						});
					}
				},
			},
		},
		mounted() {
			// this.getTableColumns(this.columns,this.listData,this.listProData)
		},
		methods: {
			//获取表头
			getColumns(list) {
				let data = {
					type: "serial",
					title: "#",
					align: "center",
					width: 50,
					scopedSlots: {
						customRender: "serial",
					},
					fixed: "left",
				};
				this.columns.push(data);
				list.forEach((val) => {
					let col = {
						dataIndex: val.filed,
						title: val.filedName,
						align: val.align,
						width: val.width ? val.width : 200,
						fixed: val.fixed ? val.fixed : null,
						visible: true,
						ellipsis: true,
						scopedSlots: {
							customRender: val.filed,
						},
					};
					this.columns.push(col);
				});
				if (this.tableSource.length > 0) {
					let length = this.tableSource.length;
					this.tableSource = [];
					for (let i = 0; i < length; i++) {
						let data = {};
						this.columns.forEach((val) => {
							if (val.dataIndex)
								data[val.dataIndex] =
								"模拟" + Number(this.tableSource.length + 1);
						});
						this.tableSource.push(data);
					}
				}
			},
			//添加模拟数据
			addAnalogData() {
				let data = {};
				this.columns.forEach((val) => {
					if (val.dataIndex)
						data[val.dataIndex] = "模拟" + Number(this.tableSource.length + 1);
				});
				this.tableSource.push(data);
			},
			// 分页切换
			handleTableChange(pagination, filters, sorter) {
				const pager = {
					...this.pagination
				};
				pager.current = pagination.current;
				this.pagination = pager;
			},
			//退出预览
			handleCancel() {
				this.visible = false;
			},
		},
	};
</script>
