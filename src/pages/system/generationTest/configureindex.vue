<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="主键">
              <a-input v-model="queryParam.uuid" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="(!advanced && 8) || 24" :sm="24">
            <span
              class="table-page-search-submitButtons"
              :style="
                (advanced && { float: 'right', overflow: 'hidden' }) || {}
              "
            >
              <a-button type="primary" @click="$refs.table.refresh(true)"
                >查询</a-button
              >
              <a-button class="cu-btn-filter" @click="reset">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAdd">新增</a-button>
      <a-button type="primary" icon="edit" @click="handleEdit('1')"
        >编辑</a-button
      >
      <a-button type="primary" icon="delete" @click="handleSub('all')"
        >删除</a-button
      >
    </div>
    <s-table
      bordered
      ref="table"
      size="small"
      :columns="columns"
      :data="loadData"
      :rowSelection="rowSelection"
      rowKey="uuid"
      showPagination="auto"
      @rowClick="rowClick"
      :rowClassName="rowClassName"
    >
      <span slot="action" slot-scope="record">
        <template>
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="handleSub(record)">删除</a>
        </template>
      </span>
    </s-table>
    <add-form
      ref="createModal"
      :visible="visible"
      :loading="confirmLoading"
      :model="mdl"
      @cancel="handleCancel"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
import moment from "moment";
import { STable, Ellipsis } from "@/components";

import addForm from "./edit.vue";
const columns = [
  {
    title: "姓名",
    dataIndex: "userName",
    sorter: true,
  },
  {
    title: "时间",
    dataIndex: "userTime",
    sorter: true,
  },
];
export default {
  name: "TableList",
  components: {
    STable,
    Ellipsis,
    addForm,
  },
  data() {
    this.columns = columns;
    return {
      visible: false,
      confirmLoading: false,
      mdl: null,
      advanced: false,
      queryParam: {},
      url: {
        getPageSet: "/system/sysFkdatagrid/getPageSet",
        save: "/system/sysFkdatagrid/save",
        update: "/system/sysFkdatagrid/update",
        deleteBatch: "/system/sysFkdatagrid/deleteBatch",
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        // console.log("requestParameters",requestParameters)
        return this.$post(this.url.getPageSet, requestParameters).then(
          (res) => {
            return res;
          }
        );
      },
      selectedRowKeys: [],
      selectedRows: [],
      uuid: "",
      uuids: "",
    };
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
      };
    },
  },
  methods: {
    getRowKeys(row) {
      return row.uuid; // 每条数据的唯一识别值
    },
    rowClassName(row) {
      return row.uuid === this.uuid ? "bg-bray" : ""; // 每条数据的唯一识别值
    },
    rowClick(record, index) {
      const that = this;
      that.info = record;
      that.uuid = record.uuid;
    },
    handleAdd() {
      this.mdl = null;
      this.visible = true;
      let form = {};
      form = this.$refs.createModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.$refs.createModal.add(this.mdl);
    },
    handleEdit(record) {
      if (record === "1") {
        if (this.info) {
          this.visible = true;
          this.mdl = this.info;
        } else {
          this.$message.error("请先选中需要修改的数据");
        }
      } else {
        this.visible = true;
        this.mdl = { ...record };
      }
      this.$refs.createModal.add(this.mdl);
    },
    handleOk() {
      const form = this.$refs.createModal.form;
      this.confirmLoading = true;
      form.validateFields((errors, values) => {
        if (!errors) {
          if (values.uuid) {
            // 修改 e.g.
            this.$post(this.url.update, values).then((res) => {
              if (res.statusCode === 200) {
                this.visible = false;
                this.confirmLoading = false;
                // 重置表单数据
                form.resetFields();
                // 刷新表格
                this.info = "";
                this.uuid = "";
                this.selectedRowKeys = [];
                this.$refs.table.refresh();
                this.$message.info("更新成功");
              } else {
                this.confirmLoading = false;
                this.$message.error(res.message);
              }
            });
          } else {
            // 新增
            this.$post(this.url.save, values).then((res) => {
              if (res.statusCode === 200) {
                this.visible = false;
                this.confirmLoading = false;
                // 重置表单数据
                this.info = "";
                this.uuid = "";
                this.selectedRowKeys = [];
                form.resetFields();
                // 刷新表格
                this.$refs.table.refresh();
                this.$message.info("新增成功");
              } else {
                this.confirmLoading = false;
                this.$message.error(res.message);
              }
            });
          }
        } else {
          this.confirmLoading = false;
        }
      });
    },
    handleCancel() {
      this.visible = false;
    },
    handleSub(record) {
      const that = this;
      if (record === "all") {
        if (that.selectedRowKeys.length === 0) {
          this.$message.error("请先勾选需要的删除的数据");
        }
      } else {
        that.uuids = record.uuid;
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
              uuid: that.uuids,
            })
            .then((res) => {
              if (res.statusCode === 200) {
                that.$message.success("删除成功");
                that.$refs.table.refresh();
              } else {
                that.$message.error(res.message);
              }
            });
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
          }).catch(() => console.log("Oops errors!"));
        },
        onCancel() {},
      });
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      selectedRows.forEach((e, index) => {
        if (index === 0) {
          this.uuids = e.uuid;
        } else {
          this.uuids = this.uuids + "," + e.uuid;
        }
      });
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    resetSearchForm() {
      this.queryParam = {
        date: moment(new Date()),
      };
    },
    reset() {
      this.queryParam = {};
      this.$refs.table.refresh();
    },
  },
};
</script>

<style lang="less"></style>
