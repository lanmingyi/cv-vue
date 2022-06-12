<template>
  <a-card :bordered="false">
    <tool-bar
      @search="$refs.table.refresh(true)"
      @reset="
        () => {
          (this.queryParam = {}), $refs.table.refresh(true);
        }
      "
    >
      <template slot="toolBtn" slot-scope="scope">
        <a-button class="cu-btn-primary" icon="plus" @click="handleAdd()"
          >新增</a-button
        >
        <a-button class="cu-btn-default" icon="edit" @click="handleEdit('all')"
          >编辑</a-button
        >
        <a-button class="cu-btn-danger" icon="delete" @click="handleSub('all')"
          >删除</a-button
        >
      </template>
      <template slot="toolForm"> </template>
    </tool-bar>
    <s-table
      ref="table"
      :columns="columns"
      :data="loadData"
      bordered
      :pageSize="10"
      :rowSelection="rowSelection"
      rowKey="uuid"
      showPagination="auto"
      :rowClassName="rowClassName"
      :customRow="rowClick"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleDesign(record)">设计</a>
          <a-divider type="vertical" />
          <a @click="handlePreview(record)">预览</a>
          <a-divider type="vertical" />
          <a @click="handleSub(record)">删除</a>
        </template>
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
  </a-card>
</template>

<script>
import { simpleListMixin } from "@/mixins/simpleListMixin";
import { STable } from "@/components";

import editForm from "./edit.vue";
import designModal from "./designModal.vue";
import previewModal from "@/components/TopVUI/k-portal-design/preview/index";
const columns = [
  {
    title: "#",
    width: 50,
    align: "center",
    scopedSlots: { customRender: "serial" },
  },
  { title: "模板名称", dataIndex: "templateName" },
  // { title: '模板json数据', dataIndex: 'templateJsonData' },
  { title: "模板路径", dataIndex: "templatePath" },
  { title: "分类", dataIndex: "templateClassiftUuid" },
  { title: "创建人", dataIndex: "creator" },
  { title: "创建时间", dataIndex: "createTime" },
  {
    title: "操作",
    width: 150,
    dataIndex: "action",
    align: "center",
    scopedSlots: {
      customRender: "action",
    },
  },
];

export default {
  name: "sysPortalTemplate",
  mixins: [simpleListMixin],
  components: { STable, editForm, designModal, previewModal },
  data() {
    this.columns = columns;
    return {
      visible: false,
      visibleDesign: false,
      visiblePreview: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      selectedRowKeys: [],
      selectedRows: [],
      rows: "", //选中行数据
      url: {
        getPageSet: "/system/sysPortalTemplate/getPageSet",
        save: "/system/sysPortalTemplate/save",
        update: "/system/sysPortalTemplate/update",
        deleteBatch: "/system/sysPortalTemplate/deleteBatch",
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        return this.$post(this.url.getPageSet, requestParameters).then(
          (res) => {
            return res;
          }
        );
      },
      visibleDesign: false,
      visiblePreview: false,
      templateUuid: "",
      jsonData: {},
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
  filters: {},
  methods: {
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
      this.$refs.table.refresh();
    },
  },
};
</script>

<style lang="less"></style>
