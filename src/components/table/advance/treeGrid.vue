<template>
  <div
    ref="table"
    :id="id"
    class="advanced-table"
    :style="{ height: tableHeight }"
  >
    <!-- 数据表格 -->
    <a-spin :spinning="spinning">
      <a-table
        v-if="treeLoading"
        ref="treeGrid"
        v-bind="{
          ...$options.propsData,
          columns: visibleColumns,
          title: undefined,
          loading: false,
        }"
        bordered
        :data-source="data"
        :size="size"
        :defaultExpandedRowKeys="defaultExpandedRowKeys"
        @expand="onExpand"
        :rowClassName="rowClassName"
        :rowSelection="rowSelection"
        :customRow="rowClick"
        :components="cellcomponents"
				
        :pagination="{ hideOnSinglePage: true }"
        :customHeaderRow="customHeaderRow"
        :customCell="customCell"
        :expanded-row-keys.sync="expandedRowKeys"
        :scroll="scrollXY"
      >
        <template
          slot-scope="text, record, index"
          :slot="slot"
          v-for="slot in scopedSlots"
        >
          <slot :name="slot" v-bind="{ text, record, index }"></slot>
        </template>
        <template :slot="slot" v-for="slot in slots">
          <slot :name="slot"></slot>
        </template>
        <template
          slot-scope="record, index, indent, expanded"
          :slot="$scopedSlots.expandedRowRender ? 'expandedRowRender' : ''"
        >
          <slot
            v-bind="{ record, index, indent, expanded }"
            :name="$scopedSlots.expandedRowRender ? 'expandedRowRender' : ''"
          ></slot>
        </template>
      </a-table>
      <!-- 右键菜单 start -->
      <div
        v-show="showRightMenu"
        :style="{ top: menuTop + 'px', left: menuLeft + 'px' }"
        class="right-menu"
        @mouseleave="mouseLeave"
      >
        <action-columns
          :columns="columns"
          @reset="onColumnsReset"
          class="action"
        >
          <template :slot="slot" v-for="slot in slots">
            <slot :name="slot"></slot>
          </template>
        </action-columns>
      </div>
    </a-spin>
  </div>
</template>

<script>
import { STable } from "@/components";
import ActionColumns from "@/components/table/advance/ActionColumns";
import Vue from "vue";
import VueDraggableResizable from "vue-draggable-resizable";
Vue.component("vue-draggable-resizable", VueDraggableResizable);
import { resizeableTitle } from "@/utils/util";
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
    expandedRowRender: Function,
    expandIcon: Function,
    expandRowByClick: Boolean,
    expandIconColumnIndex: Number,
    footer: Function,
    indentSize: Number,
    loading: Boolean,
    locale: Object,
    pagination: Object,
    rowKey: [String, Function],
    scroll: Object,
    showHeader: Boolean,
    size: {
      default: "small",
      type: String,
    },
    title: String,
    customRow: Function,
    customCell: Function,
    getPopupContainer: Function,
    transformCellText: Function,
    formatConditions: Boolean,
    parameter: Object,
    showSearch: {
      type: Boolean,
      default: true,
    },
    rowSelectionType: {
      type: String,
      default: "checkbox",
    },
  },
  provide() {
    return {
      table: this,
    };
  },
  data() {
    // 表格列拖拽的配置
    this.cellcomponents = {
      header: {
        cell: (h, props, children) =>
          resizeableTitle(h, props, children, this.columns),
      },
    };
    return {
      id: `${new Date().getTime()}-${Math.floor(Math.random() * 10)}`,
      fullScreen: false,
      conditions: {},
      data: [],
      rowKeys: "",
      defaultExpandedRowKeys: [],
      expandedRowKeys: [],
      treeLoading: false,
      rows: null,
      selectedRowKeys: [],
      selectedRows: [],
      showRightMenu: false,
      menuTop: "",
      menuLeft: "",
      dataLength: 0,
      pageClientHeight: 0, //使用固定的页面布局时的页面高度
      toolbarHeight: 0, //有表格操作按钮时的按钮高度
      spinning: true,
    };
  },
  computed: {
    slots() {
      return Object.keys(this.$slots).filter((slot) => slot !== "title");
    },
    scopedSlots() {
      return Object.keys(this.$scopedSlots).filter(
        (slot) => slot !== "expandedRowRender" && slot !== "title"
      );
    },
    // 显示表格列
    visibleColumns() {
      let columns = this.columns;
      return columns.filter((col) => col.visible);
    },
    // 行勾选配置
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
    // 表格滚动条
    scrollXY() {
      const height = this.pageClientHeight - this.toolbarHeight - 85 - 20;
      const tdHeight = this.dataLength * 40;
      let scroll = "";
      if (this.scroll)
        scroll = {
          x: this.scroll.x,
          y: height,
        };
      return this.scroll
        ? scroll
        : this.dataLength >= 20 || height < tdHeight
        ? {
            y: height,
          }
        : {};
    },
		// scrollXY() {
		//   const height = this.pageClientHeight - this.toolbarHeight - 85 - 20;
		//   const tdHeight = this.dataLength * 40;
		//   let scroll = "";
		//   if (this.scroll)
		//     scroll = {
		//       x: this.scroll.x,
		//       y: height,
		//     };
		//   return this.scroll?scroll:{ y: document.getElementById(this.id).clientHeight };
		// },
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
  watch: {
    dataLength(val) {
      this.resizeHandler();
    },
  },
  created() {
    this.addListener();
    this.getListByLevelId();
  },
  beforeDestroy() {
    this.removeListener();
    this.destroyResizeEvent();
  },
  mounted() {
    this.resizeHandler();
    this.initResizeEvent();
  },
  methods: {
    // 表格高度自适应
    resizeHandler() {
      // let tableId = this.$refs.treeGrid?.$parent.$el.id;
      let tableId = this.id;
      // 获取菜单按钮的高度
      let toolbar = document.getElementById(tableId)?.previousElementSibling;
      if (toolbar && toolbar.className.indexOf("toolbar") >= 0) {
        this.toolbarHeight = document.getElementById(
          tableId
        )?.previousElementSibling?.clientHeight;
      }
      // 获取页面内容的高度
      this.pageClientHeight = document.getElementsByClassName(
        "page-common-layout"
      )[0]?.clientHeight;
    },
    //监听resize
    initResizeEvent() {
      window.addEventListener("resize", this.resizeHandler, false);
    },
    //移除resize
    destroyResizeEvent() {
      window.removeEventListener("resize", this.resizeHandler);
    },
    // 父组件获取树形数据的方法
    getDataList() {
      return this.data;
    },
    onSelectAll(selected, selectedRows, changeRows) {
      this.$emit("onSelectAll", selected, selectedRows, changeRows);
    },
    onSelectInvert(selectedRows) {
      this.$emit("onSelectInvert", selectedRows);
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
      this.$emit("onSelectChange", selectedRowKeys, selectedRows);
    },
    // 刷新
    refresh() {
      this.selectedRowKeys = [];
      this.selectedRows = [];
      this.rows = null;
      this.rowKeys = null;
      this.getListByLevelId();
      this.$emit("refresh");
    },
    // 搜索
    onSearchChange(conditions, searchOptions) {
      this.conditions = conditions;
      this.getListByLevelId();
      // this.$emit('search', conditions, searchOptions);
    },
    // 全屏切换
    toggleScreen() {
      if (this.fullScreen) {
        this.outFullScreen();
      } else {
        this.inFullScreen();
      }
    },
    // 获取最外层级数据
    getListByLevelId() {
      // const that = this;
      this.rowKeys = null;
      this.$post(this.url.fathersUrl, this.parameter.father).then((res) => {
        if (res.statusCode === 300) {
          this.$message.warn(res.message);
          return;
        }
        let list = [];
        if (res?.rows) {
          list = res.rows;
        } else {
          list = res;
        }
        const arr = [];
        list.forEach(function(item, index) {
          arr.push({
            ...item,
            children: item.state === "closed" ? [] : "",
          });
        });
        this.data = arr;
        if (this.data.length != 0 && this.data[0].children) {
          this.onExpand("1", this.data[0]);
          this.defaultExpandedRowKeys = [];
          this.defaultExpandedRowKeys.push(this.data[0].uuid);
          this.expandedRowKeys = this.defaultExpandedRowKeys;
          this.dataLength = this.data.length;
        }
        this.treeLoading = true;
        this.spinning = false;
        this.$emit("getData", this.data);
      });
    },
    // 展开获取子级数据
    onExpand(expanded, record) {
      this.spinning = true;
      return new Promise((resolve) => {
        // 判断是否有子级
        if (record.children.length > 0) {
          this.spinning = false;
          resolve();
          return;
        }
        let parameter = this.parameter.children;
        parameter.pid = record.id;
        this.$post(this.url.expandUrl, parameter)
          .then((res) => {
            const data = this.data;
            const children = res;
            this.dataLength += children.length;
            const dataMap = (items) => {
              items.find((value) => {
                if (value.id === record.id) {
                  var array = [];
                  children.forEach(function(values, index) {
                    array.push({
                      ...values,
                      children:
                        values.state === "closed" || !values.state ? [] : "",
                    });
                  });
                  value.children = array;
                  return items;
                }
                if (value.children && value.children.length > 0) {
                  dataMap(value.children);
                }
              });
            };
            dataMap(data || []);
            this.data = data;
            this.spinning = false;
            resolve();
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    // 属性子级数据
    refreshChildList(e) {
      this.rowKeys = null;
      let parameter = this.parameter.children;
      parameter.pid = e;
      this.$post(this.url.expandUrl, parameter)
        .then((res) => {
          const data = this.data;
          const children = res;
          this.dataLength = this.data.length + children.length;
          const dataMap = (items) => {
            items.find((value) => {
              if (value.id === e) {
                var array = [];
                children.forEach(function(values, index) {
                  array.push({
                    ...values,
                    children:
                      values.state === "closed" || !values.state ? [] : "",
                  });
                });
                value.children = array;
                return items;
              }
              if (value.children && value.children.length > 0) {
                dataMap(value.children);
              }
            });
          };
          dataMap(data || []);
          this.data = data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 行点击事件
    rowClick(record, index) {
      const that = this;
      return {
        on: {
          click: () => {
            that.rowKeys = record[this.rowKey];
            that.rows = record;
            that.$emit("rowClick", record, index);
          },
        },
      };
    },
    // 表格行悬浮事件
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
    fullScreenListener(e) {
      if (e.target.id === this.id) {
        this.fullScreen = !this.fullScreen;
      }
    },
    handleRemoveRightMenu() {
      this.showRightMenu = false;
    },
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
