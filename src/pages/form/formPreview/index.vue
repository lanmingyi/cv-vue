<template>
	<div class="page-common-layout">
		<div class="page-common-content">
			<div class="toolbar flex justify-between flex-wrap">
				<div class="table-operator">
					<a-button class="cu-btn-primary" icon="plus" @click="handleAdd()">新增
					</a-button>
					<!-- <a-button
          class="cu-btn-default"
          icon="edit"
          @click="handleEdit('all')"
          >编辑</a-button
        > -->

					<a-button class="cu-btn-danger" icon="delete" @click="handleSub('all')">删除</a-button>
					<a-button type="link" icon="file" @click="handleView()">查看详情
					</a-button>
				</div>
			</div>
			<div :id="id" :style="{height:tableHeight}">
				<s-table ref="table" :columns="columns" :data="loadData" bordered :rowSelection="rowSelection"
					rowKey="uuid" showPagination="auto" :rowClassName="rowClassName" :customRow="rowClick"
					:scroll="scrollXY">
					<span slot="serial" slot-scope="text, record, index">
						{{ index + 1 }}
					</span>
					<span slot="action" slot-scope="text, record, index">
						<template>
							<a @click="handleEdit(record)">编辑</a>
							<a-divider type="vertical" />
							<a @click="handleSub(record)">删除</a>
						</template>
					</span>
				</s-table>
				<edit-form ref="createModal" :visible="visible" :loading="confirmLoading" :model="mdl"
					@cancel="handleCancel()" @ok="handleOk()" />
			</div>
		</div>
	</div>
</template>

<script>
	import {
		simpleListMixin
	} from "@/mixins/simpleListMixin";
	import {
		STable,
		Ellipsis
	} from "@/components";
	import editForm from "./edit.vue";
	import util from "@/utils/util";
	import {
		getColumns
	} from "@/utils/formatter";
	import {
		getQueryString
	} from "@/services/common.js";
	export default {
		name: "TableList",
		mixins: [simpleListMixin],
		components: {
			STable,
			Ellipsis,
			editForm
		},
		data() {
			return {
				id: `${new Date().getTime()}-${Math.floor(Math.random() * 10)}`,
				visible: false,
				confirmLoading: false,
				mdl: null,
				// 高级搜索 展开/关闭
				advanced: false,
				// 查询参数
				queryParam: {},
				selectedRowKeys: [],
				selectedRows: [],
				rows: "", //选中行数据
				columns: [{
					title: "#",
					align: "center",
					width: 50,
					scopedSlots: {
						customRender: "serial",
					},
					fixed: "left",
				}, ],
				url: {
					getPageSet: "/form/formField/commonGetPageSet",
					save: "/form/formField/commonSave",
					update: "/form/formField/commonUpdate",
					deleteBatch: "/form/formField/commonDeleteBatch",
				},
				toolbarTableHeight: 0,
				antbar: 0,
				antcontent: 0,
				pageClientHeight: 0, //使用固定的页面布局时的页面高度
				toolbarHeight: 0, //有表格操作按钮时的按钮高度
				paginationtHeight: 34, //分页组件的高度
				// 加载数据方法 必须为 Promise 对象
				loadData: (parameter) => {
					this.queryParam.tableName = getQueryString("tableName");
					const requestParameters = Object.assign({}, parameter, this.queryParam);
					return this.$post(this.url.getPageSet, requestParameters).then(
						(res) => {
							return res;
						}
					);
				},
			};
		},
		computed: {
			rowSelection() {
				return {
					selectedRowKeys: this.selectedRowKeys,
					onChange: this.onSelectChange,
				};
			},
			// 表格竖向滚动条设置  这里是根据每页数据条数大于等于20的时候出现滚动条
			scrollXY() {
				let height = ''
				if (this.antcontent && this.antcontent > 0) {
					height =
						this.antcontent -
						this.toolbarHeight -
						this.antbar -
						40 -
						this.paginationtHeight;
				} else {
					height =
						this.pageClientHeight -
						this.toolbarHeight -
						this.antbar -
						40 -
						22 -
						this.paginationtHeight;
				}
				const tdHeight = this.dataSource?.length * 40 ?? 0;
				let scroll = "";
				if (this.scroll) scroll = {
					x: this.scroll.x,
					y: height
				};
				return this.scroll ?
					scroll :
					this.dataSource?.length >= 20 || height < tdHeight ? {
						y: height,
					} : {};
			},
			tableHeight() {
				let height = ''
				if (!this.toolbarHeight) {
					height = `calc(100% - 40px)`
				} else {
					height = `calc(100% - ${ this.toolbarHeight}px - 40px)`
				}
				return height;
			}
		},
		// 组件销毁时移除监听事件
		beforeDestroy() {
			this.destroyResizeEvent();
		},
		mounted() {
			console.log(getQueryString("tableName"));
			// this.queryParam = this.queryParams
			this.loadDataJson(getQueryString("tableName"));
			util.$on("loadDataJson", (test) => {
				this.queryParam.tableName = test;
				if (this.$refs.table) this.$refs.table.refresh();
				this.loadDataJson(test);
			});
			this.resizeHandler();
			this.initResizeEvent();
		},
		methods: {
			resizeHandler() {
				this.toolbarHeight = document.getElementsByClassName(
					'toolbar'
				)[0]?.clientHeight;
				// 获取页面内容的高度
				this.pageClientHeight = document.getElementsByClassName(
					"page-common-layout"
				)[0]?.clientHeight;
				// 获取页面内容的高度
				const paginationt = this.$refs.AdvanceTable?.$children[0].$children[0]
					.$children[0].$children[1];
				if (paginationt) {
					this.paginationtHeight = document.getElementsByClassName(
						paginationt.$el.className
					)[0]?.clientHeight;
				}

				let antIdBom = document.getElementById(this.id)?.parentNode.className; //当前数据表格的id
				this.antbar = antIdBom == 'ant-card-body' ? document.getElementsByClassName('ant-tabs-bar')[0]
					?.clientHeight : 0;
				this.antcontent = document.getElementsByClassName('page-common-box-content')[0]?.clientHeight

			},
			// 获取数据
			loadDataJson(e) {
				this.columns = [];
				this.tableName = e;
				this.$post("/form/formFieldJson/getDetailByTableName", {
					tableName: this.tableName,
				}).then((res) => {
					this.jsonData = res;
					this.drawingList = JSON.parse(res.fieldJson);
					this.drawingList?.list.forEach((e, index) => {
						getColumns(e, this.columns);
					});
					if (this.columns.length > 10) {
						this.columns.splice(11);
					}
					this.columns.push({
						title: "操作",
						align: "center",
						dataIndex: "action",
						width: 100,
						scopedSlots: {
							customRender: "action",
						},
					});
				});
			},
			// 新增
			handleAdd() {
				this.visible = true;
				this.$refs.createModal.loadData(
					getQueryString("tableName"),
					"add",
					this.jsonData
				);
			},
			// 编辑
			handleEdit(record) {
				if (record) {
					this.visible = true;
					this.$refs.createModal.loadData(
						getQueryString("tableName"),
						"edit",
						this.jsonData,
						record
					);
				} else {
					this.$message.info("请先选中需要修改的数据");
					return true;
				}
			},
			rowClassName(row) {
				return row.uuid === this.rows?.uuid ? "bg-bray" : ""; // 每条数据的唯一识别值
			},
			// 预览详情
			handleView() {
				if (!this.rows) {
					this.$message.warn("请选中需要查看的数据");
					return;
				} else {
					this.visible = true;
					this.$refs.createModal.loadData(
						getQueryString("tableName"),
						"view",
						this.jsonData,
						this.rows
					);
				}
			},
			handleOk: function() {
				this.visible = false;
				this.$refs.table.refresh();
			},
			// 删除
			handleSub() {
				const that = this;
				let uuids = "";
				if (that.selectedRowKeys.length === 0) {
					that.$message.warn("请勾选需要删除的数据");
					return;
				} else {
					uuids = that.selectedRowKeys.toString();
				}
				that.$confirm({
					title: "警告",
					content: `确定要执行该操作吗?`,
					okText: "删除",
					okType: "danger",
					cancelText: "取消",
					onOk() {
						// 在这里调用删除接口
						that
							.$post(that.url.deleteBatch, {
								uuid: uuids,
								tableName: getQueryString("tableName"),
							})
							.then((res) => {
								if (res.statusCode === 200 || res === 1) {
									that.$message.success("删除成功");
									that.rows = "";
									that.selectedRowKeys = [];
									that.$refs.table.refresh();
								} else {
									that.$message.info("删除失败");
								}
							});
					},
					onCancel() {},
				});
			},
			//监听resize
			initResizeEvent() {
				window.addEventListener("resize", this.resizeHandler, false);
			},
			//移除resize
			destroyResizeEvent() {
				window.removeEventListener("resize", this.resizeHandler);
			},
		},
	};
</script>

<style lang="less"></style>
