<template>
  <div class="page-common-layout">
    <div class="page-common-left" style="width:40%">
      <tool-bar
        @search="$refs.masterList.refresh(true)"
        @reset="
          () => {
            (this.masterQueryParam = {}), $refs.masterList.refresh(true);
          }
        "
      >
        <template slot="toolForm">
          <a-form-item label="">
            <a-input
              v-model="masterQueryParam.categoryName"
              placeholder="分类名称"
            />
          </a-form-item>
        </template>
      </tool-bar>
      <DataGrid
        ref="masterList"
        type="master"
        :columns="masterColumns"
        :url="url"
        bordered
        :queryParam="masterQueryParam"
        rowKey="uuid"
        showPagination="auto"
        @rowClick="
          (e) => {
            masterRowClick(e, { category: 'categoryCode' });
          }
        "
      >
        <span slot="sex" slot-scope="{ text }">
          {{ text | sexFilter }}
        </span>
        <span slot="action" slot-scope="{ text, record }">
          <template>
            <a @click="handleEdit(record, 'master')">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleSub(record, 'master')">删除</a>
          </template>
        </span>
      </DataGrid>
    </div>
    <div class="page-common-content">
      <tool-bar
        @search="$refs.subList.refresh(true)"
        @reset="
          () => {
            (this.subQueryParam.name = ''),
              $refs.subList.refresh(true),
              (processModelType = 2);
          }
        "
      >
        <template slot="toolForm">
          <a-form-item label="">
            <a-input v-model="subQueryParam.name" placeholder="流程名称" />
          </a-form-item>
        </template>
      </tool-bar>
      <DataGrid
        ref="subList"
        type="sub"
        :url="url"
        :columns="subColumns"
        bordered
        :queryParam="subQueryParam"
        rowKey="id"
        showPagination="auto"
      >
        <span slot="version" slot-scope="{ text, record, index }">
          <a-tag v-if="text" :color="'geekblue'">
            {{ "V:" + text }}
          </a-tag>
        </span>
        <span slot="testCombobox" slot-scope="{ text }">
          {{ text | testComboboxFilter }}
        </span>
        <span slot="action" slot-scope="{ text, record }">
          <template>
            <a @click="handleStart(record)">发起流程</a>
          </template>
        </span>
      </DataGrid>
      <sub-form
        ref="subModal"
        :visible="subVisible"
        :loading="subConfirmLoading"
        :model="subMdl"
        @cancel="handleCancel('sub')"
        @ok="handleOk()"
      />
    </div>
  </div>
</template>

<script>
import { masterTableMixin } from "@/mixins/masterTableMixin";
import { DataGrid } from "@/components";
import subForm from "./edit.vue";
import { randomUUID } from "@/utils";

export default {
  name: "apiFlowableProcessDefinition",
  mixins: [masterTableMixin],
  components: {
    subForm,
    DataGrid,
  },
  data() {
    return {
      masterColumns: [
        {
          title: "分类名称",
          align: "center",
          dataIndex: "categoryName",
        },
      ],
      subColumns: [
        {
          title: "流程名称",
          align: "center",
          dataIndex: "name",
        },
        {
          title: "流程标识",
          align: "center",
          dataIndex: "modelKey",
        },
        {
          title: "版本",
          align: "center",
          dataIndex: "version",
          scopedSlots: { customRender: "version" },
          width: 80,
        },
        {
          title: "操作",
          dataIndex: "action",
          width: 150,
          scopedSlots: { customRender: "action" },
          align: "center",
        },
      ],
      // create model
      masterVisible: false,
      subVisible: false,
      masterConfirmLoading: false,
      subConfirmLoading: false,
      masterMdl: null,
      subMdl: null,
      // 查询参数
      masterQueryParam: {},
      subQueryParam: {
        // processModelType: 2,
      },
      url: {
        masterList: "/workflow/flowCategory/getPageSet",
        subList: "/workflow/apiFlowableProcessDefinition/getPageSet",
        startProcessInstanceByKey:
          "/workflow/apiFlowableProcessInstance/startProcessInstanceByKey",
      },
    };
  },
  methods: {
    // 发起流程
    handleStart(e) {
      this.spinning = true;
      const form = this.$refs.subModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.$post("/workflow/flowModel/getDetailByModelKey", {
        modelKey: e.modelKey,
        procdefId: e.procdefId,
      })
        .then((res) => {
          if (res.statusCode == 300) {
            this.$message.info(res.message);
          } else {
            this.subVisible = true;
            res.title=e.name+'-'+res.title
            this.$refs.subModal.loadDataJson(e.modelKey, e.procdefId, 1, res);
          }
        })
        .finally(() => {
          this.spinning = false;
        });
    },
    handleOk() {
      this.subVisible = false;
    },
  },
};
</script>

<style lang="less"></style>
