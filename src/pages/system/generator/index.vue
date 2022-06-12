<template>
  <div class="container">
    <a-card :bordered="false">
      <div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
        <div class="table-operator">
          <a-button
            class="cu-btn-primary"
            icon="download"
            @click="singleTableCode"
            >单表代码生成</a-button
          >
          <!-- <a-button class="cu-btn-primary" icon="download" @click="uniappCode">uniapp代码生成</a-button> -->
        </div>
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <div class="flex justify-between flex-wrap">
              <a-form-item class="margin-left-xs" style="width: 150px;">
                <a-input v-model="queryParam.tableName" placeholder="表名" />
              </a-form-item>
              <div class="table-page-search-submitButtons flex align-center">
                <a-button
                  class="cu-btn-primary"
                  type="primary"
                  @click="$refs.masterList.refresh()"
                  >查询</a-button
                >
                <a-button class="cu-btn-filter" @click="refreshQueryParam()"
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
        :rowKey="(record) => record.tableName"
        showPagination="auto"
        :rowClassName="rowClassName"
        @rowClick="rowClick"
        :rowSelection="rowSelection"
      >
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { STable, Ellipsis } from "@/components";

import { baseUrl } from "@/services/baseUrl.js";
import { ACCESS_TOKEN } from "@/store/mutation-types";
import Vue from "vue";
const columns = [
  {
    title: "表名",
    align: "center",
    dataIndex: "tableName",
    width: 400,
  },
  {
    title: "创建时间",
    align: "center",
    dataIndex: "createTime",
    width: 180,
    customRender(text, record, index) {
      var date = new Date(text);
      var yy = date.getFullYear();
      var mm = date.getMonth();
      var dd = date.getDate();
      var hh = date.getHours();
      var mi = date.getMinutes();
      var ss = date.getSeconds();
      if (hh < 10) {
        hh = "0" + mi;
      }
      if (mi < 10) {
        mi = "0" + mi;
      }
      if (ss < 10) {
        ss = "0" + ss;
      }
      return `${yy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
    },
  },
  {
    title: "描述",
    align: "center",
    dataIndex: "tableComment",
    ellipsis: true,
  },
];
export default {
  components: {
    STable,
    Ellipsis,
  },
  data() {
    this.columns = columns;
    return {
      queryParam: {},
      selectedRowKeys: [],
      tableName: "",
      url: {
        masterList: "/system/generator/getPageSet",
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        return this.$post(this.url.masterList, requestParameters).then(
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
  methods: {
    refreshQueryParam() {
      this.queryParam = {};
      this.$refs.masterList.refresh();
    },
    rowClassName(row) {
      return row.tableName === this.tableName ? "bg-bray" : ""; // 每条数据的唯一识别值
    },
    rowClick(record, index) {
      this.tableName = record.tableName;
    },
    singleTableCode() {
      if (!this.tableName) {
        this.$message.info("请先选中要操作的数据");
      } else {
        let uil = "/system/generator/code?tables=" + this.tableName;
        this.$post(uil).then((res) => {
          if (!res) {
            return;
          }
          // const url = window.URL.createObjectURL(new Blob([res], {
          // 	type: 'application/zip'
          // }))
          // const link = document.createElement('a')
          // link.style.display = 'none'
          // link.href = url
          // document.body.appendChild(link)
          // link.click()
          window.location.href =
            baseUrl +
            "/system/generator/code?tables=" +
            this.tableName +
            "&token=" +
            Vue.ls.get(ACCESS_TOKEN);
        });
      }
    },
    uniappCode() {
      if (!this.tableName) {
        this.$message.info("请先选中要操作的数据");
      } else {
        // window.location.href = "/system/uniappGenerator/code?tables=" + this.tableName;
        let uil = "/system/uniappGenerator/code?tables=" + this.tableName;
        this.$post(uil).then((res) => {
          if (!res) {
            return;
          }
          const url = window.URL.createObjectURL(
            new Blob([res], {
              type: "application/zip",
            })
          );
          const link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          document.body.appendChild(link);
          link.click();
        });
      }
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
    },
  },
};
</script>

<style lang="less"></style>
