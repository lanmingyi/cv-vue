<template>
  <div class="page-common-layout">
    <div class="page-common-left" style="width:500px">
      <data-grid
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
            masterRowClick(e, { classifyUuid: 'uuid' });
          }
        "
      >
      </data-grid>
    </div>
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
            class="cu-btn-primary"
            icon="plus"
            @click="handleAdd('sub')"
            v-action:sysPortalTemplateAddDialog
            >新增</a-button
          >
          <!-- <a-button
                class="cu-btn-default"
                icon="edit"
                @click="handleEdit($refs.subList.rows, 'sub')"
                v-action:sysPortalTemplateEditDialog
                >编辑</a-button
              > -->
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleSub($refs.subList.selectedRowKeys, 'sub')"
            v-action:sysPortalTemplateDelDialog
            >删除</a-button
          >
        </template>
      </tool-bar>
      <data-grid
        ref="subList"
        type="sub"
        :url="url"
        :columns="subColumns"
        bordered
        :queryParam="subQueryParam"
        rowKey="uuid"
        showPagination="auto"
      >
        <span slot="portalStatus" slot-scope="{ text, record, index }">
          <a-tag v-if="text == '启用'" :color="'blue'">
            {{ text }}
          </a-tag>
          <a-tag v-else-if="text == '禁用'" :color="'orange'">
            {{ text }}
          </a-tag>
        </span>
        <span slot="action" slot-scope="{ text, record }">
          <a @click="handleEdit(record, 'sub')">编辑</a>
          <a-divider v-if="record.templateType == '自建'" type="vertical" />
          <template>
            <a
              v-if="record.templateType == '自建'"
              @click="handleDesign(record)"
              >设计</a
            >
            <a-divider v-if="record.templateType == '自建'" type="vertical" />
            <a
              v-if="record.templateType == '自建'"
              @click="handlePreview(record)"
              >预览</a
            >
            <a-divider v-if="record.templateType == '自建'" type="vertical" />
            <a
              v-if="record.templateType == '自建'"
              @click="handleSub(record, 'sub')"
              >删除</a
            >
          </template>
        </span>
      </data-grid>
      <sub-form
        ref="subModal"
        :visible="subVisible"
        :loading="subConfirmLoading"
        :model="subMdl"
        @cancel="handleCancel('sub')"
        @ok="handleOk('sub')"
      />
      <design-modal
        ref="designModal"
        :visible="visibleDesign"
        :templateUuid="templateUuid"
        @ok="handleSave()"
        @cancel="
          () => {
            visibleDesign = false;
          }
        "
      ></design-modal>
      <preview-modal ref="previewModal" :data="jsonData"></preview-modal>
    </div>
  </div>
</template>

<script>
import { masterTableMixin } from "@/mixins/masterTableMixin";

import { DataGrid } from "@/components";
import subForm from "./edit.vue";
import designModal from "./designModal.vue";
import previewModal from "@/components/TopVUI/k-portal-design/preview/index";

const masterColumns = [
  {
    title: "分类名",
    align: "center",
    width: 100,
    dataIndex: "classifyName",
  },
  {
    title: "标识",
    align: "center",
    width: 100,
    dataIndex: "classifyCode",
    sorter: true,
  },
];
const subColumns = [
  { title: "模板名称", dataIndex: "templateName" },
  { title: "模板类型", dataIndex: "templateType", sorter: true },
  { title: "创建者", width: 120, dataIndex: "creator", align: "center" },
  {
    title: "创建时间",
    width: 150,
    dataIndex: "createTime",
    sorter: true,
    align: "center",
  },
  {
    title: "操作",
    width: 200,
    dataIndex: "action",
    align: "center",
    scopedSlots: {
      customRender: "action",
    },
  },
];
export default {
  name: "TableList",
  mixins: [masterTableMixin],
  components: {
    DataGrid,
    subForm,
    designModal,
    previewModal,
  },
  data() {
    return {
      masterColumns: masterColumns,
      subColumns: subColumns,
      // create model
      masterVisible: false,
      subVisible: false,
      masterConfirmLoading: false,
      subConfirmLoading: false,
      masterMdl: null,
      subMdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      masterQueryParam: {},
      subQueryParam: {},
      masterSelectedRows: [],
      subSelectedRows: [],
      masterRows: "",
      subRows: "",
      jsonData: {},
      url: {
        masterList: "/system/sysPortalClassify/getPageSet",
        subList: "/system/sysPortalTemplate/getPageSet",
        subDelete: "/system/sysPortalTemplate/deleteBatch",
        subAdd: "/system/sysPortalTemplate/save",
        subUpdate: "/system/sysPortalTemplate/update",
      },
      visibleDesign: false,
      visiblePreview: false,
      templateUuid: "",
    };
  },
  methods: {
    masterRowClick(record, index, param) {
      this.masterRows = record;
      this.masterMdl = record;
      this.subQueryParam = { templateClassiftCode: record.classifyCode };
      this.subMdl = { templateClassiftCode: record.classifyCode };
      this.$refs.subList.refresh();
    },
    handleDesign(val) {
      this.visibleDesign = true;
      this.templateUuid = val.uuid;
      this.$refs.designModal.getDesignData(val);
    },
    handlePreview(val) {
      this.$refs.previewModal.jsonData = val.templateJsonData
        ? JSON.parse(val.templateJsonData)
        : {};
      this.$refs.previewModal.visible = true;
    },
    handleSave() {
      this.visibleDesign = false;
      this.$refs.subList.refresh();
    },
  },
};
</script>

<style lang="less"></style>
