<!--
 * @Description: 门户设计器内容展示操作组件
 * @Author: lmy
 * @Date: 2021-05-20 18:13:04
 * @LastEditTime: 2021-08-06 16:26:54
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <div class="form-panel">
    <p class="hint-text" v-show="data.list.length === 0">
      从左侧选择控件添加
    </p>
    <draggable
      tag="div"
      class="draggable-box"
      style="width: 100%;"
      v-bind="{
        group: 'index-draggable',
        ghostClass: 'moving',
        animation: 180,
        handle: '.drag-move',
      }"
      v-model="data.list"
      @add="deepClone"
      @start="dragStart($event, data.list)"
    >
      <transition-group tag="div" name="list" class="list-main">
        <layoutItem
          class="drag-move"
          v-for="record in data.list"
          :key="record.key"
          :record="record"
          :selectItem.sync="selectItem"
          :startType="startType"
          :insertAllowedType="insertAllowedType"
          :hideModel="hideModel"
          @dragStart="dragStart"
          @handleSelectItem="handleSelectItem"
          @handleCopy="handleCopy"
          @handleDelete="handleDelete"
          @handleColAdd="handleColAdd"
          @handleShowRightMenu="handleShowRightMenu"
        />
      </transition-group>
    </draggable>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import layoutItem from "./layoutItem";
import "codemirror/mode/javascript/javascript";
export default {
  name: "KCenter",
  data() {
    return {
      insertAllowedType: [
        "list",
        "card",
        "bar",
        "pie",
        "line",
        "calendar",
        "timeLine",
        "weather",
        "flowCard",
      ],
      rightMenuSelectValue: {},
      showRightMenu: false,
      menuTop: 0,
      menuLeft: 0,
      trIndex: 0,
      tdIndex: 0,
    };
  },
  props: {
    noModel: {
      type: Array,
      required: true,
    },
    startType: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    selectItem: {
      type: Object,
      default: () => {},
    },
    hideModel: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    draggable,
    layoutItem,
  },
  methods: {
    deepClone(evt) {
      const newIndex = evt.newIndex;
      // json深拷贝一次
      const listString = JSON.stringify(this.data.list);
      this.data.list = JSON.parse(listString);
      // 删除icon及compoent属性
      // delete this.data.list[newIndex].icon;
      delete this.data.list[newIndex].component;
      this.$emit("handleSetSelectItem", this.data.list[newIndex], 1);
    },
    handleColAdd(evt, columns, isCopy = false) {
      console.log(columns, "handleColAdd");
      // 重置或者生成key值
      const newIndex = evt.newIndex;
      const key = columns[newIndex].type + "_" + new Date().getTime();
      if (columns[newIndex].key === "" || isCopy) {
        this.$set(columns, newIndex, {
          ...columns[newIndex],
          key,
          model: key,
        });
        if (this.noModel.includes(columns[newIndex].type)) {
          // 删除不需要的model属性
          delete columns[newIndex].model;
        }
        if (typeof columns[newIndex].options !== "undefined") {
          // 深拷贝options
          const optionsStr = JSON.stringify(columns[newIndex].options);
          columns[newIndex].options = JSON.parse(optionsStr);
        }
        if (typeof columns[newIndex].rules !== "undefined") {
          // 深拷贝rules
          const rulesStr = JSON.stringify(columns[newIndex].rules);
          columns[newIndex].rules = JSON.parse(rulesStr);
        }
        if (typeof columns[newIndex].list !== "undefined") {
          // 深拷贝list
          columns[newIndex].list = [];
        }
        if (typeof columns[newIndex].columns !== "undefined") {
          // 深拷贝columns
          const columnsStr = JSON.stringify(columns[newIndex].columns);
          columns[newIndex].columns = JSON.parse(columnsStr);
          // 复制时，清空数据
          columns[newIndex].columns.forEach((item) => {
            item.list = [];
          });
        }
        if (columns[newIndex].type === "table") {
          // 深拷贝trs
          const trsStr = JSON.stringify(columns[newIndex].trs);
          columns[newIndex].trs = JSON.parse(trsStr);
          // 复制时，清空数据
          columns[newIndex].trs.forEach((item) => {
            item.tds.forEach((val) => {
              val.list = [];
            });
          });
        }
      }
      // 深拷贝数据
      const listString = JSON.stringify(columns[newIndex]);
      columns[newIndex] = JSON.parse(listString);
      this.$emit("handleSetSelectItem", columns[newIndex], 1);
    },
    dragStart(evt, list) {
      // 拖拽结束,自动选择拖拽的控件项
      this.$emit("handleSetSelectItem", list[evt.oldIndex]);
    },
    handleSelectItem(record, type) {
      console.log("shanchu=========0");
      // 修改选择Item
      this.$emit("handleSetSelectItem", record, type);
    },
    handleCopy(isCopy = true, data) {
      const traverse = (array) => {
        array.forEach((element, index) => {
          if (element.key === this.selectItem.key) {
            if (isCopy) {
              // 复制添加到选择节点后面
              array.splice(index + 1, 0, element);
            } else {
              // 双击添加到选择节点后面
              array.splice(index + 1, 0, data);
            }
            // 复制完成，重置key值
            const evt = {
              newIndex: index + 1,
            };
            this.handleColAdd(evt, array, true);
            return;
          }
          if (element.type === "grid" || element.type === "tabs") {
            // 栅格布局
            element.columns.forEach((item) => {
              traverse(item.list);
            });
          }
        });
      };
      traverse(this.data.list);
    },
    handleDelete() {
      // 删除已选择
      console.log(234);
      const traverse = (array) => {
        array = array.filter((element, index) => {
          if (element.type === "grid" || element.type === "tabs") {
            // 栅格布局
            element.columns.forEach((item) => {
              item.list = traverse(item.list);
            });
          }
          // if (element.type === 'card' || element.type === 'batch') {
          // 	// 卡片布局
          // 	element.list = traverse(element.list);
          // }
          // if (element.type === 'table') {
          // 	// 表格布局
          // 	element.trs.forEach((item) => {
          // 		item.tds.forEach((val) => {
          // 			val.list = traverse(val.list);
          // 		});
          // 	});
          // }
          if (element.key !== this.selectItem.key) {
            return true;
          } else {
            this.handleSelectItem(array[index], 0);

            return false;
          }
        });
        return array;
      };

      this.data.list = traverse(this.data.list);
    },
    handleDownMerge() {
      // 向下合并
      if (
        this.rightMenuSelectValue.trs.length -
          this.rightMenuSelectValue.trs[this.trIndex].tds[this.tdIndex]
            .rowspan <=
        this.trIndex
      ) {
        this.$message.error("当前是最后一行，无法向下合并");
        return false;
      }

      // 计算rowspan超过自身的td
      let rows = 0;
      this.rightMenuSelectValue.trs[this.trIndex].tds.forEach(
        (element, index) => {
          if (index >= this.tdIndex) {
            return false;
          }
          if (
            element.rowspan >
            this.rightMenuSelectValue.trs[this.trIndex].tds[this.tdIndex]
              .rowspan
          ) {
            rows += 1;
          }
        }
      );
      if (
        this.rightMenuSelectValue.trs[this.trIndex].tds[this.tdIndex]
          .colspan !==
        this.rightMenuSelectValue.trs[this.trIndex + 1].tds[this.tdIndex - rows]
          .colspan
      ) {
        this.$message.error("当前表格无法向下合并");
        return false;
      }

      this.rightMenuSelectValue.trs[this.trIndex].tds[
        this.tdIndex
      ].rowspan += 1;
      this.rightMenuSelectValue.trs[
        this.trIndex + 1
      ].tds = this.rightMenuSelectValue.trs[this.trIndex + 1].tds.filter(
        (item, index) => index !== this.tdIndex - rows
      );

      // }
    },
    handleRightMerge() {
      // 向右合并
      const sumCols = this.rightMenuSelectValue.trs[this.trIndex].tds
        .map((item) => item.colspan)
        .reduce(function(partial, value) {
          return partial + value;
        });
      if (
        sumCols -
          this.rightMenuSelectValue.trs[this.trIndex].tds[this.tdIndex]
            .colspan <=
        this.tdIndex
      ) {
        this.$message.error("当前是最后一列，无法向右合并");
        return false;
      }
      if (
        this.rightMenuSelectValue.trs[this.trIndex].tds[this.tdIndex]
          .rowspan !==
        this.rightMenuSelectValue.trs[this.trIndex].tds[this.tdIndex + 1]
          .rowspan
      ) {
        this.$message.error("当前表格无法向右合并");
        return false;
      }

      this.rightMenuSelectValue.trs[this.trIndex].tds[
        this.tdIndex
      ].colspan += this.rightMenuSelectValue.trs[this.trIndex].tds[
        this.tdIndex + 1
      ].colspan;

      this.rightMenuSelectValue.trs[
        this.trIndex
      ].tds = this.rightMenuSelectValue.trs[this.trIndex].tds.filter(
        (item, index) => {
          return index !== this.tdIndex + 1;
        }
      );
      // }
    },
    handleAddCol() {
      // 增加列
      this.rightMenuSelectValue.trs.forEach((item) => {
        item.tds.splice(this.tdIndex + 1, 0, {
          colspan: 1,
          rowspan: 1,
          list: [],
        });
      });
    },
    handleAddRow() {
      // 增加行
      // 获取总col值
      const sumCols = this.rightMenuSelectValue.trs[0].tds
        .map((item) => item.colspan)
        .reduce(function(partial, value) {
          return partial + value;
        });
      const rowJson = { tds: [] };
      for (let i = 0; i < sumCols; i++) {
        rowJson.tds.push({
          colspan: 1,
          rowspan: 1,
          list: [],
        });
      }
      this.rightMenuSelectValue.trs.splice(this.trIndex + 1, 0, rowJson);
    },
    handleShowRightMenu(e, val, trIndex, tdIndex) {
      // 显示右键菜单
      e.stopPropagation();
      // this.fileItem = item
      // 显示
      this.showRightMenu = true;

      // 定位
      this.menuTop = e.clientY;
      this.menuLeft = e.clientX;
      // this.rightMenuType = type
      // this.rightId = id
      this.activeArr = [val];
      this.rightMenuSelectValue = val;
      this.trIndex = trIndex;
      this.tdIndex = tdIndex;
      return false;
    },
    handleRemoveRightMenu() {
      // 取消右键菜单
      this.showRightMenu = false;
    },
  },
  mounted() {
    // 添加监听取消右键菜单
    document.addEventListener("click", this.handleRemoveRightMenu, true);
    document.addEventListener("contextmenu", this.handleRemoveRightMenu, true);
  },
  destroyed() {
    // 移除监听
    document.removeEventListener("click", this.handleRemoveRightMenu, true);
    document.removeEventListener(
      "contextmenu",
      this.handleRemoveRightMenu,
      true
    );
  },
};
</script>
