<template>
	<div ref="table" :id="id" class="advanced-table" :style="{ height: tableHeight }">
		<!-- 数据表格 -->
		<s-table ref="AdvanceTable" v-bind="{
        ...$options.propsData,
        columns: visibleColumns,
        title: undefined,
        loading: false,
      }" bordered :data="loadData" :size="size" @expandedRowsChange="onExpandedRowsChange" @change="onChange"
			@expand="onExpand" :rowClassName="rowClassName" :rowSelection="rowSelection" :customRow="rowClick" :showTotal="showTotal"
			:customHeaderRow="customHeaderRow" :pageSize="pageSize" :scroll="scrollXY" :pagination="pagination" :showPagination="showPagination">
			<span v-if="rownumbers" slot="serial" slot-scope="text, record, index">
				{{ index + 1 }}
			</span>
			<template slot-scope="text, record, index" :slot="slot" v-for="slot in scopedSlots">
				<slot :name="slot" v-bind="{ text, record, index }"></slot>
			</template>
			<template :slot="slot" v-for="slot in slots">
				<slot :name="slot"></slot>
			</template>
			<template slot-scope="record, index, indent, expanded"
				:slot="$scopedSlots.expandedRowRender ? 'expandedRowRender' : ''">
				<slot v-bind="{ record, index, indent, expanded }"
					:name="$scopedSlots.expandedRowRender ? 'expandedRowRender' : ''"></slot>
			</template>
		</s-table>
		<!-- 右键菜单 start -->
		<div v-show="showRightMenu" :style="{ top: menuTop + 'px', left: menuLeft + 'px' }" class="right-menu"
			@mouseleave="mouseLeave">
			<action-columns :columns="columns" @reset="onColumnsReset" class="action">
				<template :slot="slot" v-for="slot in slots">
					<slot :name="slot"></slot>
				</template>
			</action-columns>
		</div>
	</div>
</template>

<script>
	import {
		STable
	} from "@/components";
	import ActionColumns from "@/components/table/advance/ActionColumns"; //右键显示表格列
	import {
		debounce
	} from "@/utils/index.js";
	export default {
		name: "AdvanceTable",
		components: {
			ActionColumns,
			STable,
		},
		props: {
			url: Object,
			tableLayout: String,
			bordered: Boolean,
			childrenColumnName: Array[String],
			columns: Array,
			components: Object,
			defaultExpandAllRows: Array[String],
			expandedRowKeys: Array[String],
			expandedRowRender: Function,
			expandIcon: Function,
			expandRowByClick: Boolean,
			expandIconColumnIndex: Number,
			footer: Function,
			indentSize: Number,
			loading: Boolean,
			locale: Object,
			pagination: Object,
			showPagination: {
				default: true,
				type: String | Boolean,
			},
			customRow: Function,
			rowKey: [String, Function],
			scroll: Object,
			showHeader: Boolean,
			size: {
				default: "small",
				type: String,
			},
			title: String,
			getPopupContainer: Function,
			transformCellText: Function,
			formatConditions: Boolean,
			queryParam: Object,
			customCell: Function,
			rownumbers: {
				default: true,
				type: Boolean,
			},
			type: String,
			showSearch: {
				type: Boolean,
				default: true,
			},
			pageSize: {
				type: Number,
			},
			rowSelectionType: {
				type: String,
				default: "checkbox",
			},
			showTotal: {
				type: Boolean,
				default: true,
			}
		},
		provide() {
			return {
				table: this,
			};
		},
		data() {
			return {
				id: `${new Date().getTime()}-${Math.floor(Math.random() * 10)}`,
				fullScreen: false,
				conditions: {},
				// 加载数据方法 必须为 Promise 对象
				loadData: (parameter) => {
					const url = this.type ?
						this.type === "master" ?
						this.url.masterList :
						this.url.subList :
						this.url.getPageSet;
					const requestParameters = Object.assign({},
						parameter,
						this.queryParamObj
					);
					return this.$post(url, requestParameters).then((res) => {
						console.log('data:',res);
						this.dataSource = res.rows;
						return res;
					});
				},
				rowKeys: "", //表格行的唯一key值
				selectedRowKeys: [],
				selectedRows: [],
				rows: null,
				queryParamObj: {},
				showRightMenu: false,
				menuTop: "",
				menuLeft: "",
				dataSource: [],
				pageTableBoxHeight: 0, //单个表格高度
				toolbarTableHeight: 0,
				antbar: 0,
				antcontent: 0,
				pageClientHeight: 0, //使用固定的页面布局时的页面高度
				toolbarHeight: 0, //有表格操作按钮时的按钮高度
				paginationtHeight: 34, //分页组件的高度
			};
		},
		computed: {
			// 插槽
			slots() {
				return Object.keys(this.$slots).filter((slot) => slot !== "title");
			},
			scopedSlots() {
				return Object.keys(this.$scopedSlots).filter(
					(slot) => slot !== "expandedRowRender" && slot !== "title"
				);
			},
			// 显示隐藏表格列
			visibleColumns() {
				let columns = this.columns;
				let serial = {
					title: "#",
					width: 50,
					align: "center",
					type: "serial",
					key: "serial",
					scopedSlots: {
						customRender: "serial",
					},
				};
				if (
					this.rownumbers &&
					columns.filter((col) => col.type === "serial").length === 0
				) {
					columns.splice(0, 0, serial);
				}
				return columns.filter((col) => col.visible);
			},
			// 表格勾选的配置
			rowSelection() {
				return {
					columnWidth: 50,
					selectedRowKeys: this.selectedRowKeys,
					onChange: this.onSelectChange,
					onSelectAll: this.onSelectAll,
					onSelectInvert: this.onSelectInvert,
					type: this.rowSelectionType,
				};
			},
			// 表格竖向滚动条设置  这里是根据每页数据条数大于等于20的时候出现滚动条
			scrollXY() {
				let height = "";
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
				// console.log(height,"antbar",this.antcontent,this.antbar,this.pageClientHeight,this.toolbarHeight,this.paginationtHeight)
				const tdHeight = this.dataSource?.length * 40 ?? 0;
				let scroll = "";
				if (this.scroll)
					scroll = {
						x: this.scroll.x,
						y: height,
					};
				let width = 0;
				this.columns.forEach(item => {
					if(item.width){
						width += item.width
					}
				})
				return this.scroll ?
					scroll :
					this.dataSource?.length >= 20 || height < tdHeight ?
					{
						y: height,
						x: width
					} :
					{x: width};
			},
			tableHeight() {
				let height = "";
				if (!this.toolbarHeight) {
					height = `calc(100% - 40px)`;
				} else {
					height = `calc(100% - ${this.toolbarHeight}px - 40px)`;
				}
				return height;
			},
		},
		created() {
			this.addListener();
		},
		// 组件销毁时移除监听事件
		beforeDestroy() {
			this.removeListener();
			this.destroyResizeEvent();
		},
		// 监听获取表格数据参数的变化
		watch: {
			queryParam: {
				deep: true,
				immediate: true,
				handler(newVal, oldVal) {
					this.queryParamObj = newVal;
				},
			},
		},
		mounted() {
			this.resizeHandler();
			this.initResizeEvent();
		},
		methods: {
			// 重新调整表格高度
			resizeHandler() {
				let tableId = this.$refs.AdvanceTable?.$parent.$el.id; //当前数据表格的id
				// 获取菜单按钮的高度
				let toolbar = document.getElementById(tableId)?.previousElementSibling;
				// 判断表格工具栏是否存在
				if (toolbar && toolbar.className.indexOf("toolbar") >= 0) {
					this.toolbarHeight = document.getElementById(
						tableId
					)?.previousElementSibling?.clientHeight;
				}
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

				this.pageTableBoxHeight = document.getElementById(tableId)?.clientHeight;
				// 获取tabs的高度

				let antIdBom = document.getElementById(tableId)?.parentNode.className; //当前数据表格的id
				this.antbar =
					antIdBom == "ant-card-body" ?
					document.getElementsByClassName("ant-tabs-bar")[0]?.clientHeight :
					0;
				this.antcontent = document.getElementsByClassName(
					"page-common-box-content"
				)[0]?.clientHeight;
			},
			// 全部勾选
			onSelectAll(selected, selectedRows, changeRows) {
				this.$emit("onSelectAll", selected, selectedRows, changeRows);
			},
			onSelectInvert(selectedRows) {
				this.$emit("onSelectInvert", selectedRows);
			},
			// 勾选事件
			onSelectChange(selectedRowKeys, selectedRows) {
				console.log(selectedRowKeys, selectedRows);
				this.selectedRowKeys = selectedRowKeys;
				this.selectedRows = selectedRows;
				this.$emit("onSelectChange", selectedRowKeys, selectedRows);
			},
			// 刷新
			refresh(parmar) {
				this.selectedRowKeys = [];
				this.selectedRows = [];
				this.rows = null;
				this.rowKeys = null;
				setTimeout(() => {
					if (this.$refs.AdvanceTable) this.$refs.AdvanceTable.refresh(parmar);
				}, 100);
			},
			// 全屏切换
			toggleScreen() {
				if (this.fullScreen) {
					this.outFullScreen();
				} else {
					this.inFullScreen();
				}
			},
			// 行点击事件
			rowClick(record, index) {
				const that = this;
				return {
					on: {
						click: () => {
							that.rowKeys = record[this.rowKey];
							that.rows = record;
							that.$emit("rowClick", record, index, that.rowKeys);
						},
					},
				};
			},
			// 格式化表头  主要用于右键显示操作列
			customHeaderRow() {
				return {
					on: {
						contextmenu: (e) => {
							e.preventDefault();
							// 显示
							this.showRightMenu = true;
							// 定位
							this.menuTop = e.clientY;
							this.menuLeft = e.clientX;
						},
					},
				};
			},
			mouseLeave(event) {
				this.showRightMenu = false;
				document.removeEventListener(
					"contextmenu",
					this.handleRemoveRightMenu,
					true
				);
			},
			// 悬浮行的样式
			rowClassName(row) {
				return row[this.rowKey] === this.rowKeys ? "bg-bray" : ""; // 每条数据的唯一识别值
			},
			// 全屏
			inFullScreen() {
				const el = this.$refs.table;
				el.classList.add("beauty-scroll");
				if (el.requestFullscreen) {
					el.requestFullscreen();
					return true;
				} else if (el.webkitRequestFullScreen) {
					el.webkitRequestFullScreen();
					return true;
				} else if (el.mozRequestFullScreen) {
					el.mozRequestFullScreen();
					return true;
				} else if (el.msRequestFullscreen) {
					el.msRequestFullscreen();
					return true;
				}
				this.$message.warn("对不起，您的浏览器不支持全屏模式");
				el.classList.remove("beauty-scroll");
				return false;
			},
			outFullScreen() {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.webkitCancelFullScreen) {
					document.webkitCancelFullScreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				}
				this.$refs.table.classList.remove("beauty-scroll");
			},
			onColumnsReset(conditions) {
				this.$emit("reset", conditions);
			},
			onExpandedRowsChange(expandedRows) {
				this.$emit("expandedRowsChange", expandedRows);
			},
			onChange(pagination, filters, sorter, options) {
				this.$emit("change", pagination, filters, sorter, options);
			},
			onExpand(expanded, record) {
				this.$emit("expand", expanded, record);
			},
			addListener() {
				document.addEventListener("fullscreenchange", this.fullScreenListener);
				document.addEventListener(
					"webkitfullscreenchange",
					this.fullScreenListener
				);
				document.addEventListener("mozfullscreenchange", this.fullScreenListener);
				document.addEventListener("msfullscreenchange", this.fullScreenListener);
				document.addEventListener(
					"contextmenu",
					this.handleRemoveRightMenu,
					true
				);
			},
			removeListener() {
				document.removeEventListener("fullscreenchange", this.fullScreenListener);
				document.removeEventListener(
					"webkitfullscreenchange",
					this.fullScreenListener
				);
				document.removeEventListener(
					"mozfullscreenchange",
					this.fullScreenListener
				);
				document.removeEventListener(
					"msfullscreenchange",
					this.fullScreenListener
				);
				document.removeEventListener(
					"contextmenu",
					this.handleRemoveRightMenu,
					true
				);
			},
			//监听resize
			initResizeEvent() {
				window.addEventListener("resize", this.resizeHandler, false);
			},
			//移除resize
			destroyResizeEvent() {
				window.removeEventListener("resize", this.resizeHandler);
			},
			fullScreenListener(e) {
				if (e.target.id === this.id) {
					this.fullScreen = !this.fullScreen;
				}
			},
			handleRemoveRightMenu() {
				this.showRightMenu = false;
			},
		},
	};
</script>

<style lang="less">
	.td-content {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	@import "./index.less";
</style>
