<template>
  <div class="container">
    <a-card :bordered="false">
      <div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
        <div class="table-operator">
          <a-button class="cu-btn-primary" icon="plus" @click="handleAdd"
            >新增</a-button
          >
        </div>
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <div class="flex justify-between flex-wrap">
              <a-form-item label="">
                <a-input
                  v-model="queryParam.name"
                  placeholder="请输入报表名称"
                />
              </a-form-item>
              <div class="table-page-search-submitButtons flex">
                <a-button
                  class="cu-btn-primary"
                  @click="$refs.masterList.refresh(true)"
                  >查询</a-button
                >
                <a-button
                  class="cu-btn-filter margin-left-xs"
                  @click="
                    () => {
                      (this.queryParam = {}), $refs.masterList.refresh(true);
                    }
                  "
                  >重置</a-button
                >
              </div>
            </div>
          </a-form>
        </div>
      </div>
      <s-table
        ref="masterList"
        size="small"
        :columns="columns"
        :data="loadData"
        bordered
        :pageSize="10"
        :rowSelection="rowSelection"
        rowKey="uuid"
        showPagination="auto"
        @rowClick="masterRowClick"
      >
        <!-- :rowClassName="rowClassName" -->
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="designReport(record, 'master')">设计报表</a>
            <a-divider type="vertical" />
            <a @click="showReport(record, 'master')">查看报表</a>
            <a-divider type="vertical" />
            <a @click="exportPDF(record, 'master')">导出PDF</a>
            <a-divider type="vertical" />
            <a @click="exportExcel(record, 'master')">导出Excel</a>
            <a-divider type="vertical" />
            <a @click="exportExcelPage(record, 'master')">导出分页Excel</a>
            <a-divider type="vertical" />
            <a @click="exportExcelPageSheet(record, 'master')"
              >导出分页分Sheet的Excel</a
            >
          </template>
        </span>
      </s-table>
      <design-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        @cancel="handleCancel"
        @ok="handleOk"
      ></design-form>
    </a-card>
  </div>
</template>

<script>
import designForm from "../ureport/designer.vue";
import { ACCESS_TOKEN } from "@/store/mutation-types";
import Vue from "vue";
import { baseUrl } from "@/services/baseUrl.js";
import { STable, Ellipsis } from "@/components";
const columns = [
  {
    title: "#",
    width: 50,
    align: "center",
    scopedSlots: {
      customRender: "serial",
    },
  },
  {
    title: "报表名称",
    align: "center",
    dataIndex: "name",
  },
  {
    title: "操作",
    dataIndex: "action",
    align: "center",
    scopedSlots: {
      customRender: "action",
    },
  },
];
export default {
  name: "TableList",
  components: {
    STable,
    Ellipsis,
    designForm,
  },
  data() {
    this.columns = columns;
    return {
      subMdl: null,
      advanced: false,
      queryParam: {},
      queryParamDicItem: {},
      masterSelectedRowKeys: [],
      subSelectedRows: [],
      masterRows: "",
      subRows: "",
      uuids: "",
      visible: false,
      confirmLoading: false,
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        console.log("loadData request parameters:", requestParameters);
        return this.$post("/report/templet/getPageSet", requestParameters).then(
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
        selectedRowKeys: this.masterSelectedRowKeys,
        onChange: this.onSelectChangeMaster,
      };
    },
  },
  methods: {
    handleAdd() {
      console.log("打开设计界面成功");
      // this.visible = true
      window.open(
        baseUrl + "/report/ureport/designer?token=" + Vue.ls.get(ACCESS_TOKEN),
        "_blank"
      );
    },
    rowClassName(row) {
      return row.uuid === this.uuids ? "bg-bray" : ""; // 每条数据的唯一识别值
    },
    masterRowClick(record, index) {
      // 数据表格行点击事件
      const that = this;
      that.info = record;
      that.uuids = record.uuid;
    },
    onSelectChangeMaster(selectedRowKeys, selectedRows) {
      selectedRows.forEach((e, index) => {
        if (index === 0) {
          this.uuids = e.uuid;
        } else {
          this.uuids = this.uuids + "," + e.uuid;
        }
      });
      this.masterSelectedRowKeys = selectedRowKeys;
      this.subSelectedRows = selectedRows;
    },
    reset() {
      this.queryParam = {};
      this.$refs.masterList.refresh(true);
    },
    designReport(record, index) {
      // this.visible = true
      // const routeUrl = this.$router.resolve({
      //   path: '/report/ureport/designer?_u=mysql-' + record.name
      //   // query: { id: 96 }
      // })

      window.open(
        baseUrl +
          "/report/ureport/designer?_u=mysql-" +
          record.name +
          "&token=" +
          Vue.ls.get(ACCESS_TOKEN),
        "_blank"
      );
    },
    showReport(record, index) {
      // this.visible = true
      // const routeUrl = this.$router.resolve({
      //   path: '/report/ureport/pdf/show?_u=mysql-' + record.name
      //   // query: { id: 96 }
      // })
      this.$router.replace({
        path:
          "/report/ureport/pdf/show?_u=mysql-" +
          record.name +
          "&token=" +
          Vue.ls.get(ACCESS_TOKEN),
      });
      // window.open(baseUrl+'/report/ureport/pdf/show?_u=mysql-' + record.name + '&token='+Vue.ls.get(ACCESS_TOKEN), '_blank')
    },
    exportPDF(record, index) {
      window.location.href =
        baseUrl +
        "/report/ureport/pdf?_u=mysql-" +
        record.name +
        "&_n=" +
        record.name +
        "&token=" +
        Vue.ls.get(ACCESS_TOKEN);
    },
    exportExcel(record, index) {
      window.location.href =
        baseUrl +
        "/report/ureport/excel?_u=mysql-" +
        record.name +
        "&token=" +
        Vue.ls.get(ACCESS_TOKEN);
    },
    exportExcelPage(record, index) {
      window.location.href =
        baseUrl +
        "/report/ureport/excel/paging?_u=mysql-" +
        record.name +
        "&token=" +
        Vue.ls.get(ACCESS_TOKEN);
    },
    exportExcelPageSheet(record, index) {
      window.location.href =
        baseUrl +
        "/report/ureport/excel/sheet?_u=mysql-" +
        record.name +
        "&token=" +
        Vue.ls.get(ACCESS_TOKEN);
    },
    handleOk() {
      this.visible = false;
    },
    handleCancel() {
      this.visible = false;
    },
  },
};
</script>

<style lang="less"></style>
