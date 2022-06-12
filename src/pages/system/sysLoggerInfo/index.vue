<template>
  <div class="page-common-layout">
    <div class="page-common-content">
      <tool-bar
        @search="$refs.table.refresh(true)"
        @reset="
          () => {
            (this.queryParam = {}), $refs.table.refresh(true);
          }
        "
      >
        <template slot="toolBtn" slot-scope="scope">
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleSub($refs.table.selectedRowKeys)"
            v-action:logDelDialog
            >删除</a-button
          >
        </template>
        <template slot="toolForm">
          <a-form-item label="">
            <a-input v-model="queryParam.aliClientIp" placeholder="客户端IP" />
          </a-form-item>
          <a-form-item label="">
            <a-input
              v-model="queryParam.aliLocalHistory"
              placeholder="服务端IP"
            />
          </a-form-item>
          <a-form-item label="">
            <a-input
              v-model="queryParam.aliHttpStatusCode"
              placeholder="HTTP状态码"
            />
          </a-form-item>
          <a-form-item label="">
            <a-input v-model="queryParam.aliMethod" placeholder="请求方式" />
          </a-form-item>
        </template>
      </tool-bar>
      <DataGrid
        ref="table"
        size="small"
        :columns="columns"
        bordered
        :url="url"
        rowKey="uuid"
        showPagination="auto"
        :scroll="{ x: 2000 }"
        :queryParam="queryParam"
      >
        <span slot="serial" slot-scope="{ text, record, index }">
          {{ index + 1 }}
        </span>
        <span slot="aliType" slot-scope="{ text }">
          {{ text | aliTypeFilter }}
        </span>
        <span slot="aliParamData" slot-scope="{ text, record }">
          <a-tooltip>
            <ellipsis :length="50" tooltip>{{ text }}</ellipsis>
          </a-tooltip>
        </span>
      </DataGrid>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { DataGrid, Ellipsis } from "@/components";
import { dataGridMixin } from "@/mixins/dataGridMixin";

export default {
  name: "TableList",
  mixins: [dataGridMixin],
  components: {
    DataGrid,
    Ellipsis,
  },
  data() {
    return {
      columns: [
        {
          title: "客户端IP",
          width: 120,
          dataIndex: "aliClientIp",
        },
        {
          title: "服务端IP",
          width: 250,
          dataIndex: "aliLocalHistory",
        },
        {
          title: "URL",
          width: 320,
          dataIndex: "aliUri",
        },
        {
          title: "请求类型",
          dataIndex: "aliType",
          scopedSlots: { customRender: "aliType" },
        },
        {
          title: "请求方式",
          width: 100,
          dataIndex: "aliMethod",
        },
        {
          title: "请求耗时",
          dataIndex: "aliTimeConsuming",
        },
        {
          title: "HTTP状态码",
          dataIndex: "aliHttpStatusCode",
        },
        {
          title: "请求时间",
          width: 200,
          dataIndex: "createTime",
        },
        {
          title: "请求创建人",
          dataIndex: "creator",
        },
        {
          title: "数据参数",
          width: 350,
          dataIndex: "aliParamData",
          scopedSlots: { customRender: "aliParamData" },
        },
      ],
      visible: false,
      // 查询参数
      queryParam: {},
      url: {
        getPageSet: "/system/sysLoggerInfo/getPageSet",
        save: "/system/sysLoggerInfo/save",
        update: "/system/sysLoggerInfo/update",
        deleteBatch: "/system/sysLoggerInfo/deleteBatch",
      },
    };
  },
  filters: {
    aliTypeFilter(aliType) {
      const aliTypeMap = {
        XMLHttpRequest: "AJAX请求",
      };
      return aliTypeMap[aliType];
    },
  },
};
</script>

<style lang="less"></style>
