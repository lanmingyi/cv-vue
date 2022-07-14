<!--
 * @Description: 树形表格
 * @Author: lmy
 * @Date: 2021-01-18 15:17:26
 * @LastEditTime: 2021-07-27 11:08:12
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <a-spin :spinning="spinning">
    <div class="advanced-table">
      <s-table
        ref="treeGrid"
        v-if="treeLoading"
        :columns="columns"
        bordered
        :data="loadData"
        :size="sSize"
        :rowKey="rowKey"
        @expand="onExpand"
        :defaultExpandedRowKeys="defaultExpandedRowKeys"
        :pagination="{ hideOnSinglePage: true }"
        :rowSelection="rowSelection"
        :customRow="rowClick"
        :rowClassName="rowClassName"
        :scroll="scroll"
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
      </s-table>
    </div>
  </a-spin>
</template>

<script>
import { STable } from "@/components";

export default {
  name: "TreeGrid",
  props: {
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
    rowKey: [String, Function],
    scroll: Object,
    showHeader: Boolean,
    size: String,
    title: String,
    customHeaderRow: Function,
    getPopupContainer: Function,
    transformCellText: Function,
    formatConditions: Boolean,
    url: Object,
    parameter: Object,
  },
  components: {
    STable,
  },
  provide() {
    return {
      table: this,
    };
  },
  data() {
    return {
      id: `${new Date().getTime()}-${Math.floor(Math.random() * 10)}`,
      sSize: this.size || "small",
      fullScreen: false,
      conditions: {},
      data: [],
      defaultExpandedRowKeys: [],
      rowKeys: "",
      treeLoading: false,
      spinning: true,
      data: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        const requestParameters = Object.assign(
          {},
          parameter,
          this.parameter.father
        );
        return this.$post(this.url.fathersUrl, requestParameters).then(
          (res) => {
            let list = [];
            if (res.rows) {
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
            if (this.data.length != 0) {
              this.onExpand("1", this.data[0]);
              this.defaultExpandedRowKeys = [];
              this.defaultExpandedRowKeys.push(this.data[0].uuid);
            } else {
              this.data = [];
            }
            this.treeLoading = true;
            this.spinning = false;
            this.$emit("getData", this.data);

            return this.data;
          }
        );
      },
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
    visibleColumns() {
      // console.log(this.columns.filter(col => col.visible))
      return this.columns.filter((col) => col.visible);
    },
    rowSelection() {
      return {
        onChange: this.onSelectChange,
      };
    },
  },
  created() {
    this.getListByLevelId();
  },
  // mounted() {
  // 	this.columnsList = this.columns.forEach(e=>e.ellipsis = true)
  // 	console.log(this.columnsList,this.columns);
  // },
  beforeDestroy() {
    // this.removeListener()
  },
  methods: {
    getListData() {
      return this.data;
    },
    refresh() {
      this.$refs.treeGrid.refresh();
    },
    // 获取最外层级数据
    getListByLevelId() {
      const that = this;
      that.rowKeys = null;
      this.$post(this.url.fathersUrl, this.parameter.father).then((res) => {
        let list = [];
        if (res.rows) {
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
        that.data = arr;
        if (that.data.length != 0) {
          that.onExpand("1", that.data[0]);
          that.defaultExpandedRowKeys = [];
          that.defaultExpandedRowKeys.push(that.data[0].uuid);
        } else {
          that.data = [];
        }
        that.treeLoading = true;
        that.spinning = false;
        that.$emit("getData", that.data);
      });
    },
    // 展开获取子级数据
    onExpand: function(expanded, record) {
      this.$emit("expand", expanded, record);
      return new Promise((resolve) => {
        // 判断是否有子级
        if (record.children.length > 0) {
          resolve();
          return;
        }
        let parameter = this.parameter.children;
        parameter.pid = record.id;
        this.$post(this.url.expandUrl, parameter)
          .then((res) => {
            const data = this.data;
            const children = res;
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
          resolve();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.$emit("onSelectChange", selectedRowKeys, selectedRows);
    },
    rowClick(record, index) {
      const that = this;
      return {
        on: {
          click: () => {
            that.rowKeys = record.uuid;
            that.$emit("rowClick", record, index);
          },
        },
      };
    },
    rowClassName(row) {
      return row.uuid === this.rowKeys ? "bg-bray" : ""; // 每条数据的唯一识别值
    },
  },
};
</script>

<style scoped lang="less">
.advanced-table {
  // overflow-y: auto;

  .header-bar {
    padding: 16px 24px;
    display: flex;
    align-items: center;
    border-radius: 4px;
    transition: all 0.3s;

    &.middle {
      padding: 12px 16px;
    }

    &.small {
      padding: 8px 12px;
      border: 1px solid @border-color;
      border-bottom: 0;

      .title {
        font-size: 16px;
      }
    }

    .title {
      transition: all 0.3s;
      font-size: 18px;
      color: @title-color;
      font-weight: 700;
    }

    .search {
      flex: 1;
      text-align: right;
      margin: 0 24px;
    }

    .actions {
      text-align: right;
      font-size: 17px;
      color: @text-color;

      .action {
        margin: 0 8px;
        cursor: pointer;

        &:hover {
          color: @primary-color;
        }
      }
    }
  }
}
</style>
