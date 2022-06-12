<!--
 * @Description: 门户模板
 * @Author: 黄婷
 * @Date: 2021-06-02 13:38:09
 * @LastEditTime: 2021-09-09 16:18:04
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\system\sysPortal\index.vue
-->
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
            subQueryParam.templateClassiftCode = e.classifyCode;
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
            v-action:sysPortalAddDialog
            >新增</a-button
          >
          <!-- <a-button
                class="cu-btn-default"
                icon="edit"
                @click="handleEdit($refs.subList.rows, 'sub')"
                v-action:sysPortalEditDialog
                >编辑</a-button
              > -->
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleSub($refs.subList.selectedRowKeys, 'sub')"
            v-action:sysPortalDelDialog
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
          <a-divider type="vertical" />
          <template v-if="record.templateType === '自建'">
            <a @click="handleDesign(record)">设计</a>
            <a-divider type="vertical" /><a @click="handlePreview(record)"
              >预览</a
            >
            <a-divider type="vertical" />
            <a-dropdown>
              <a-menu slot="overlay">
                <a-menu-item v-if="record.portalStatus == '禁用'"
                  ><a @click="handleUpdateStatus(record)">启用</a></a-menu-item
                >
                <a-menu-item
                  ><a @click="handleSub(record, 'sub')">删除</a></a-menu-item
                >
              </a-menu>
              <a>更多<a-icon type="down"/></a>
            </a-dropdown>
          </template>
          <template v-else>
            <a
              v-if="record.portalStatus == '禁用'"
              @click="handleUpdateStatus(record)"
              >启用</a
            >
            <a-divider type="vertical" v-if="record.portalStatus == '禁用'" /><a
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
      <preview-modal ref="previewModal" :data="jsonData"></preview-modal>
      <design-modal
        ref="designModal"
        :visible="visibleDesign"
        @ok="handleSave()"
        @cancel="
          () => {
            visibleDesign = false;
          }
        "
      ></design-modal>
    </div>
  </div>
</template>

<script>
import { masterTableMixin } from "@/mixins/masterTableMixin";
import { DataGrid } from "@/components";
import subForm from "./subEdit.vue";
import previewModal from "@/components/TopVUI/k-portal-design/preview/index";
import designModal from "./designModal.vue";

const masterColumns = [
  {
    title: "分类名",
    align: "center",
    dataIndex: "classifyName",
    sorter: true,
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
  {
    title: "门户名称",
    dataIndex: "portalName",
    align: "center",
    sorter: true,
  },
  {
    title: "模板",
    dataIndex: "templateName",
    align: "center",
    sorter: true,
  },
  {
    title: "类型",
    dataIndex: "templateType",
    align: "center",
    width: 100,
    sorter: true,
  },

  {
    title: "状态",
    dataIndex: "portalStatus",
    align: "center",
    width: 100,
    scopedSlots: { customRender: "portalStatus" },
    sorter: true,
  },
  {
    title: "操作",
    dataIndex: "action",
    align: "center",
    width: 200,
    scopedSlots: { customRender: "action" },
  },
];
export default {
  name: "TableList",
  mixins: [masterTableMixin],
  components: {
    DataGrid,
    subForm,
    previewModal,
    designModal,
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
      visibleDesign: false,
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
        subList: "/system/sysPortal/getPageSet",
        subDelete: "/system/sysPortal/deleteBatch",
        subAdd: "/system/sysPortal/save",
        subUpdate: "/system/sysPortal/update",
      },
    };
  },
  methods: {
    handlePreview(val) {
      console.log(val.templateJsonData ? JSON.parse(val.templateJsonData) : {});
      if (!val.portalJsonData) {
        this.$message.success("请先设计！");
        return;
      }
      this.$refs.previewModal.jsonData = val.portalJsonData
        ? JSON.parse(val.portalJsonData)
        : val.templateJsonData
        ? JSON.parse(val.templateJsonData)
        : {};
      this.$refs.previewModal.visible = true;
    },
    handleUpdateStatus(record) {
      this.$post("/system/sysPortal/updateStatus", {
        uuid: record.uuid,
        templateClassiftCode: record.templateClassiftCode,
      }).then((res) => {
        if (200 === res.statusCode) {
          this.subMdl = { templateClassiftCode: record.templateClassiftCode };
          this.$refs.subList.refresh();
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
      });
    },
    handleDesign(val) {
      this.visibleDesign = true;
      this.$refs.designModal.getDesignData(val);
    },
    handleSave() {
      this.visibleDesign = false;
      this.$refs.subList.refresh();
    },
  },
};
</script>

<style lang="less"></style>
