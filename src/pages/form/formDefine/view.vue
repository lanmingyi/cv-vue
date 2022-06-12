<template>
  <div class="page-common-layout">
    <div class="page-common-content">
      <div class="toolbar flex justify-between flex-wrap">
        <div class="table-operator">
          <a-button class="cu-btn-primary" icon="plus" @click="handleAdd()"
            >新增</a-button
          >
          <a-button
            class="cu-btn-default"
            icon="edit"
            @click="handleEdit('all')"
            >编辑</a-button
          >
          <a-button
            class="cu-btn-info margin-right-xs"
            icon="delete"
            @click="handleView()"
            >查看详情</a-button
          >
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleSub('all')"
            >删除</a-button
          >
        </div>
      </div>
      <s-table
        ref="table"
        :columns="columns"
        :data="loadData"
        bordered
        :rowSelection="rowSelection"
        rowKey="uuid"
        showPagination="auto"
        :rowClassName="rowClassName"
        :customRow="rowClick"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
      </s-table>
      <edit-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel()"
        @ok="handleOk()"
      />
    </div>
  </div>
</template>

<script>
import { simpleListMixin } from "@/mixins/simpleListMixin";
import { STable, Ellipsis } from "@/components";

import editForm from "./edit.vue";
import util from "@/utils/util";
import { getColumns } from "@/utils/formatter";
export default {
  name: "TableList",
  mixins: [simpleListMixin],
  components: { STable, Ellipsis, editForm },
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
          title: "#",
          align: "center",
          width: 50,
          scopedSlots: {
            customRender: "serial",
          },
          fixed: "left",
        },
      ],
      url: {
        getPageSet: "/form/formField/commonGetPageSet",
        save: "/form/formField/commonSave",
        update: "/form/formField/commonUpdate",
        deleteBatch: "/form/formField/commonDeleteBatch",
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        this.queryParam.tableName = this.$route.query.tableName;
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
  },
  mounted() {
    // this.queryParam = this.queryParams
    this.loadDataJson(this.$route.query.tableName);
    // util.$on('loadDataJson', (test) => {
    // 	this.queryParam.tableName = test;
    // 	if (this.$refs.table) this.$refs.table.refresh();
    // 	this.loadDataJson(test);
    // });
  },
  methods: {
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
      });
    },
    // 新增
    handleAdd() {
      this.visible = true;
      this.$refs.createModal.loadData(
        this.$route.query.tableName,
        "add",
        this.jsonData
      );
    },
    // 编辑
    handleEdit() {
      if (this.rows) {
        this.visible = true;
        this.$refs.createModal.loadData(
          this.$route.query.tableName,
          "edit",
          this.jsonData,
          this.rows
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
          this.$route.query.tableName,
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
