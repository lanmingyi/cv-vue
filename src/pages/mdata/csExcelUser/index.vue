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
          <a-upload
            name="file"
            :showUploadList="false"
            :multiple="false"
            :headers="tokenHeader"
            :action="uploadUrl"
            v-action:csExcelUserImportDialog
            @change="(e) => handleImportExcel(e, 'table')"
          >
            <a-button class="cu-btn-primary" icon="import">导入</a-button>
          </a-upload>
          <a-button
            class="cu-btn-primary"
            icon="export"
            @click="handleExportXls(columns, 'cs_excel_user', 1)"
            v-action:csExcelUserExportDialog
            >导出</a-button
          >
          <a-button
            class="cu-btn-info"
            icon="export"
            @click="handleExportXls(columns, 'cs_excel_user', 2)"
            v-action:csExcelUserDownloadDialog
            >下载模板</a-button
          >
        </template>
        <template slot="toolForm">
          <a-form-item label="">
            <a-input v-model="queryParam.userName" placeholder="姓名" />
          </a-form-item>
        </template>
      </tool-bar>
      <DataGrid
        ref="table"
        :columns="columns"
        :url="url"
        :queryParam="queryParam"
        rowKey="uuid"
        :format-conditions="true"
      >
        <template slot="action" slot-scope="{ text, record }">
          <a style="margin-right: 5px" @click="() => handleEdit(record)"
            >编辑</a
          >
          <a style="margin-right: 5px" @click="() => handleSub(record)">删除</a>
        </template>
      </DataGrid>
      <!--	新增编辑	 -->
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
import { baseUrl } from "@/services/baseUrl";
import { DataGrid } from "@/components";
import { dataGridMixin } from "@/mixins/dataGridMixin";
import editForm from "./edit.vue";
import { getToken } from "@/utils/TopVUI";
export default {
  name: "Table",
  components: { DataGrid, editForm },
  mixins: [dataGridMixin],
  data() {
    return {
      columns: [
        {
          title: "用户名称",
          dataIndex: "userName",
          sorter: true,
        },
        {
          title: "密码",
          dataIndex: "password",
          sorter: true,
        },
        {
          title: "生日",
          dataIndex: "birthday",
          sorter: true,
        },
        {
          title: "学历",
          dataIndex: "education",
          sorter: true,
        },
        {
          title: "手机",
          dataIndex: "cellphone",
          sorter: true,
        },
        {
          title: "电子邮箱",
          dataIndex: "email",
          sorter: true,
        },
        {
          title: "年龄",
          dataIndex: "age",
          sorter: true,
        },
        {
          title: "国家",
          dataIndex: "country",
          sorter: true,
        },
        {
          title: "备注",
          dataIndex: "remark",
          sorter: true,
        },
        {
          title: "操作",
          width: 150,
          dataIndex: "action",
          align: "center",
          scopedSlots: {
            customRender: "action",
          },
        },
      ],
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 查询参数
      queryParam: {},
      url: {
        uploadUrl: "/system/attachment/upload",
        importExcelUrl: "/mdata/exportImport/exportleadingIn",
        exportExcelUrl: "/mdata/csExcelUser/exportExcel",
        exportExcelTemplate: "/mdata/csExcelUser/exportExcelTemplate",
        getPageSet: "/mdata/csExcelUser/getPageSet",
        save: "/mdata/csExcelUser/save",
        update: "/mdata/csExcelUser/update",
        deleteBatch: "/mdata/csExcelUser/deleteBatch",
      },
      tokenHeader: {
        token: getToken(),
      },
    };
  },
  methods: {},
  computed: {
    uploadUrl: function() {
      return `${baseUrl}${this.url.uploadUrl}`;
    },
  },
};
</script>

<style scoped lang="less">
.table {
  background-color: @base-bg-color;
  padding: 24px;
}
</style>
