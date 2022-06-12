<template>
  <div class="page-common-layout">
    <div class="page-common-content">
      <tool-bar
        @search="$refs.table.refresh(true)"
        @reset="
          () => {
            (this.queryParam = { isError: true }), $refs.table.refresh(true);
          }
        "
      >
        <template slot="toolBtn" slot-scope="scope">
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleSub($refs.table.selectedRowKeys)"
            v-action:logErrorDelDialog
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
        :url="url"
        bordered
        rowKey="uuid"
        :scroll="{ x: 2500 }"
        :queryParam="queryParam"
      >
        <span slot="serial" slot-scope="{ text, record, index }">
          {{ index + 1 }}
        </span>
        <span slot="aliType" slot-scope="{ text }">
          {{ text | aliTypeFilter }}
        </span>
        <span slot="aliMessage" slot-scope="{ text, record }">
          <a-tooltip>
            <ellipsis :length="50" tooltip>{{
              text | aliMessageFilter(record)
            }}</ellipsis>
          </a-tooltip>
        </span>
        <span slot="aliParamData" slot-scope="{ text }">
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
          title: "异常信息",
          dataIndex: "aliMessage",
          width: 380,
          scopedSlots: { customRender: "aliMessage" },
          customCell: (record, rowIndex) => {
            if (
              record.aliHttpStatusCode === "400" ||
              record.aliHttpStatusCode === 401 ||
              record.aliHttpStatusCode === 403 ||
              record.aliHttpStatusCode === 404 ||
              record.aliHttpStatusCode === 500 ||
              record.aliHttpStatusCode === 502 ||
              record.aliHttpStatusCode === 501
            ) {
              return { style: "color: black" };
            } else {
              return { style: "color: red" };
            }
          },
        },
        {
          title: "请求类型",
          dataIndex: "aliType",
          scopedSlots: { customRender: "aliType" },
        },
        {
          title: "请求方式",
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
          dataIndex: "createTime",
        },
        {
          title: "请求创建人",
          dataIndex: "creator",
        },
        {
          title: "数据参数",
          width: 380,
          dataIndex: "aliParamData",
          ellipsis: true,
          scopedSlots: { customRender: "aliParamData" },
        },
      ],
      // 查询参数
      queryParam: {
        isError: true,
      },
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
    aliMessageFilter(aliMessage, record, index) {
      var text = "";
      if (record.aliHttpStatusCode === "400") {
        text += "由于语法格式有误，服务器无法理解此请求";
      } else if (record.aliHttpStatusCode === 401) {
        text += "未授权";
      } else if (record.aliHttpStatusCode === 403) {
        text += "拒绝用户证书试图访问此 Web 站点";
      } else if (record.aliHttpStatusCode === 404) {
        text += "服务器找不到您所请求的文件或脚本";
      } else if (record.aliHttpStatusCode === 500) {
        text += "服务器的内部错误";
      } else if (record.aliHttpStatusCode === 501) {
        text += "服务器不支持实现此请求所需的功能";
      } else if (record.aliHttpStatusCode === 502) {
        text += "网关出错";
      } else {
        text = aliMessage;
      }
      return text;
    },
  },
  methods: {},
};
</script>

<style lang="less"></style>
