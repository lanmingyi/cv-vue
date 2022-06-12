<!--
 * @Description: 表单设计表格列表页
 * @Author: 张夕雅s
-->
<template>
  <a-card :bordered="false">
    <tool-bar
      @search="$refs.table.refresh(true)"
      @reset="
        () => {
          ((this.queryParam = {}),
          (this.queryParam.tableName = this.tableName)),
            $refs.table.refresh(true);
        }
      "
    >
      <template slot="toolBtn" v-if="topButton.length > 0">
        <a-button
          v-if="topButton.includes('新增')"
          class="cu-btn-primary"
          icon="plus"
          @click="handleAdd()"
          >新增</a-button
        >
        <a-button
          v-if="topButton.includes('编辑')"
          class="cu-btn-default"
          icon="edit"
          @click="handleEdit('all')"
          >编辑</a-button
        >
        <a-button
          v-if="topButton.includes('详情')"
          class="cu-btn-info margin-right-xs"
          icon="delete"
          @click="handleView()"
          >查看详情</a-button
        >
        <a-button
          v-if="topButton.includes('删除')"
          class="cu-btn-danger"
          icon="delete"
          @click="handleSub('all')"
          >删除</a-button
        >
      </template>
      <template slot="toolForm" v-if="searchData.length > 0">
        <!-- 搜索字段 -->
        <a-form-item
          :label="item.filedName"
          v-for="(item, index) in searchData"
          :key="index"
        >
          <a-input
            v-model="queryParam[item.filed]"
            :placeholder="item.filedName"
          />
        </a-form-item>
      </template>
    </tool-bar>
    <DataGrid
      v-if="columns.length > 1"
      ref="table"
      :columns="columns"
      :url="url"
      :queryParam="queryParam"
      rowKey="uuid"
      :pageSize="pageSize"
      @rowClick="handleClick"
      @onSelectChange="onSelectChange"
      :format-conditions="true"
    >
      <template
        slot="action"
        slot-scope="{ text, record }"
        v-if="lineButton.length > 0"
      >
        <a
          style="margin-right: 5px"
          v-if="lineButton.includes('编辑')"
          @click="handleEdit(record)"
          >编辑</a
        >
        <a-divider v-if="lineButton.length > 1" type="vertical" />
        <a
          style="margin-right: 5px"
          v-if="lineButton.includes('删除')"
          @click="handleSub(record)"
          >删除</a
        >
      </template>
    </DataGrid>
    <edit-form
      ref="createModal"
      :visible="visible"
      :loading="confirmLoading"
      :model="mdl"
      @cancel="handleCancel()"
      @ok="handleOk()"
    />
  </a-card>
</template>

<script>
import DataGrid from "@/components/table/advance/dataGrid.vue";
import { simpleListMixin } from "@/mixins/simpleListMixin";
import { STable, Ellipsis } from "@/components";

import editForm from "./editView.vue";
import util from "@/utils/util";
import { getColumns } from "@/utils/formatter";
export default {
  name: "TableList",
  mixins: [simpleListMixin],
  components: { DataGrid, STable, Ellipsis, editForm },
  data() {
    return {
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
      columns: [
        {
          type: "serial",
          title: "#",
          align: "center",
          width: 50,
          scopedSlots: {
            customRender: "serial",
          },
          fixed: "left",
        },
      ],
      tableName: "",
      jsonData: {},
      pageSize: 10,
      basicData: {},
      listProData: {},
      topButton: [], //顶部按钮展示
      lineButton: [], //行内按钮展示
      listData: [],
      searchData: [],
      searchList: [],
      drawingList: [],
      url: {
        getPageSet: "/form/formField/commonGetPageSet",
        save: "/form/formField/commonSave",
        update: "/form/formField/commonUpdate",
        deleteBatch: "/form/formField/commonDeleteBatch",
      },
      // url: {
      //   getPageSet: "/system/config/getPageSetData",
      //   save: "/system/config/save",
      //   update: "/system/config/update",
      //   deleteBatch: "/system/config/deleteBatch",
      // }
    };
  },
  mounted() {
    // this.loadDataJson(this.$route.query.tableName);
    // this.queryParam.tableName  = this.tableName
    // this.loadDataJson(this.tableName);

    // this.columns = []
    this.searchData = JSON.parse(localStorage.getItem("searchData"));
    this.drawingList = JSON.parse(localStorage.getItem("formData"));
    // this.drawingList.forEach((e, index) => {
    //   getColumns(e, this.columns);
    // });
    this.basicData = JSON.parse(localStorage.getItem("basicData"));
    this.listData = JSON.parse(localStorage.getItem("listData"));
    this.listProData = JSON.parse(localStorage.getItem("listProData"));
    this.getTableColumns(this.columns, this.listData, this.listProData);
    this.getLoadData(this.tableName);

    console.log("basicData", this.basicData);
    console.log("searchData", this.searchData);
    console.log("drawingList", this.drawingList);
    console.log("listData", this.listData);
    console.log("listProData", this.listProData);
    console.log("columns", this.columns);
  },
  methods: {
    //获取表头
    getTableColumns(columns, listData, listProData) {
      if (
        this.basicData.basicLayout == "default" ||
        this.basicData.basicLayout == "data"
      ) {
        console.log("单表数据");
      }
      // 分页
      this.tableName = this.basicData.tableName;
      if (listProData.showPage) {
        this.pageSize = listProData.showPageSize
          ? listProData.showPageSize
          : 10;
        this.queryParam = {
          ...this.queryParam,
          // pageSize:this.pageSize,
          tableName: this.tableName,
        };
      }
      //顶部按钮
      if (listProData.showtopButton) {
        listProData.topButtonList.forEach((val) => {
          if (val.checked == true) {
            this.topButton.push(val.name);
          }
        });
      }
      //表头columns
      listData.forEach((val) => {
        let col = {
          dataIndex: val.filed,
          title: val.filedName,
          align: val.align,
          width: val.width ? val.width : null,
          fixed: val.fixed ? val.fixed : null,
          visible: true,
          ellipsis: true,
          scopedSlots: {
            customRender: val.filed,
          },
        };
        this.columns.push(col);
      });
      // 行内按钮
      if (listProData.showlineButton) {
        listProData.lineButtonList.forEach((val) => {
          if (val.checked == true) {
            this.lineButton.push(val.name);
          }
        });
      }
    },
    // 获取数据
    getLoadData() {
      this.$post("/form/formFieldJson/getDetailByTableName", {
        tableName: this.basicData.tableName,
      }).then((res) => {
        console.log("res", res);
      });
    },
    // 获取数据
    loadDataJson(e) {
      this.columns = [];
      this.tableName = e;
      this.$post("/form/formFieldJson/getDetailByTableName", {
        tableName: this.tableName,
      }).then((res) => {
        this.jsonData = res;
        if (res.searchData) this.searchData = JSON.parse(res.searchData);
        this.drawingList = JSON.parse(res.fieldJson);
        this.drawingList.list.forEach((e, index) => {
          getColumns(e, this.columns);
        });
        this.getSearchList(this.searchData);
        if (this.columns.length > 10) {
          this.columns.splice(11);
        }
      });
    },
    getSearchList(data) {
      this.searchList = data;
    },
    // 行点击事件
    handleClick(record, index, keys) {
      this.rows = record;
    },
    // 新增
    handleAdd() {
      this.visible = true;
      if (this.$refs.createModal.add) this.$refs.createModal.add(this.mdl);
    },
    // 编辑
    handleEdit() {
      if (this.rows) {
        this.visible = true;
        if (this.$refs.createModal.edit)
          this.$refs.createModal.edit(this.mdl, "edit");
      } else {
        this.$message.info("请先选中需要修改的数据");
        return true;
      }
    },
    rowClassName(row) {
      return row.uuid === this.rows.uuid ? "bg-bray" : ""; // 每条数据的唯一识别值
    },
    // 预览详情
    handleView() {
      if (!this.rows) {
        this.$message.warn("请选中需要查看的数据");
        return;
      } else {
        this.visible = true;
        if (this.$refs.createModal.edit)
          this.$refs.createModal.edit(this.mdl, "view");
      }
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
              tableName: that.$route.query.tableName,
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
  },
};
</script>

<style lang="less"></style>
