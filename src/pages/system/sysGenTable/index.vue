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
            class="cu-btn-primary"
            icon="plus"
            @click="handleAdd()"
            v-action:sysGenTableAddDialog
            >新增</a-button
          >
          <!-- <a-button
          class="cu-btn-default"
          icon="edit"
          @click="handleEdit($refs.table.rows)"
          v-action:sysGenTableEditDialog
          >编辑</a-button
        >
        <a-button
          class="cu-btn-danger"
          icon="delete"
          v-action:sysGenTableDelDialog
          @click="handleSub($refs.table.selectedRowKeys)"
          >移除</a-button
        > -->
          <a-button
            class="cu-btn-orange"
            icon="vertical-align-bottom"
            @click="databaseImportTable()"
            v-action:sysGenTableImportTableDialog
            >数据库导入表</a-button
          >
          <a-button
            class="cu-btn-brown"
            icon="border-inner"
            @click="singleTableGenerationCode()"
            v-action:singleTableGenerationCode
            >单表生成代码</a-button
          >
          <a-button
            class="cu-btn-olive"
            icon="deployment-unit"
            @click="mainsubTableGenerationCode()"
            v-action:masterChildTableGenerationCode
            >主子表生成代码</a-button
          >
          <a-button
            class="cu-btn-maroon"
            icon="pull-request"
            @click="synchronization()"
            v-action:synchronousDatabase
            >同步数据库</a-button
          >
        </template>
        <template slot="toolForm">
          <a-form-item label="">
            <a-input v-model="queryParam.tableName" placeholder="表名" />
          </a-form-item>
        </template>
      </tool-bar>
      <DataGrid
        ref="table"
        size="small"
        :url="url"
        :columns="columns"
        bordered
        rowKey="uuid"
        showPagination="auto"
        :queryParam="queryParam"
      >
        <span slot="action" slot-scope="{ text, record }">
          <template>
            <a @click="handleEdit(record)" v-action:sysGenTableEditDialog
              >编辑</a
            >
            <a-divider type="vertical" />
            <a @click="handleSub(record)" v-action:sysGenTableDelDialog>删除</a>
          </template>
        </span>
      </DataGrid>
      <!--单表代码-->
      <datagrid-modal
        ref="datagridModal"
        :loading="confirmLoading"
        :puuid="puuid"
        :visible="datagridVisible"
        @handleCancel="handleCancel"
        @ok="handleSubmit"
      />
      <!--同步数据库-->
      <syn-model
        :model="mdl"
        :visible="synchronizationVisible"
        :loading="confirmLoading"
        @cancel="synchronizationCancel()"
        @ok="handleSynchronizationOk"
      />
      <!-- 编辑 -->
      <edit-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel()"
        @ok="handleSubmit()"
      />
      <!--数据库导入表-->
      <generated-modal
        ref="generatedModal"
        :visible="generatedVisible"
        :loading="confirmLoading"
        @cancel="createCancel()"
        @ok="generatedOk"
      />
      <!--主子表代码-->
      <masterson-form
        ref="mastersonModal"
        :visible="mastersonVisible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel()"
        @ok="handleMastersonOk"
      />
    </div>
  </div>
</template>

<script>
import { dataGridMixin } from "@/mixins/dataGridMixin";
import { DataGrid } from "@/components";
import editForm from "./modal/edit.vue";
import { filterDictTextByCache } from "@/components/TopVUI/dict/JDictSelectUtil";
import synModel from "./synchronization";
import datagridModal from "./datagridModal";
import generatedModal from "./databaseImportTable.vue";
import mastersonForm from "./masterson.vue";

export default {
  name: "TableList",
  mixins: [dataGridMixin],
  components: {
    DataGrid,
    editForm,
    synModel,
    datagridModal,
    generatedModal,
    mastersonForm,
  },
  data() {
    return {
      columns: [
        {
          title: "表类型",
          dataIndex: "tableType",
          align: "center",
        },
        {
          title: "表名",
          dataIndex: "tableName",
        },
        {
          title: "来自数据库",
          dataIndex: "database",
        },
        {
          title: "类名",
          dataIndex: "className",
        },
        {
          title: "是否同步数据库",
          dataIndex: "synchronizeDatabase",
        },
        {
          title: "说明",
          dataIndex: "notes",
          ellipsis: true,
        },
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          width: 100,
          scopedSlots: { customRender: "action" },
        },
      ],
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 查询参数
      queryParam: {},
      url: {
        getPageSet: "/system/sysGenTable/getPageSet",
        save: "/system/sysGenTable/save",
        update: "/system/sysGenTable/update",
        deleteBatch: "/system/sysGenTable/deleteBatch",
      },
      synchronizationVisible: false, //同步数据库
      datagridVisible: false, //单表
      puuid: "",
      generatedVisible: false,
      mastersonVisible: false,
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
    synchronization() {
      if (!this.$refs.table.rows) {
        this.$message.error("请选中需要操作的数据！");
        return;
      }
      this.mdl = this.$refs.table.rows;
      this.synchronizationVisible = true;
    },
    createCancel(type) {
      this.generatedVisible = false;
    },
    synchronizationCancel(type) {
      this.synchronizationVisible = false;
      this.$refs.table.refresh();
      this.mdl = null;
    },
    handleSynchronizationOk() {
      this.$refs.table.refresh();
    },
    // 单表
    handleSubmit() {
      this.visible = false;
      this.datagridVisible = false;
      this.$refs.table.refresh();
    },
    // 单表生成
    singleTableGenerationCode() {
      console.log("this.mdl", this.mdl);
      const form = this.$refs.datagridModal.form;
      form.resetFields();
      if (this.$refs.table.rows) {
        this.mdl = this.$refs.table.rows;
        if (!this.mdl.tableType) {
          this.$message.warn("请先修改表类型");
        } else if (this.mdl.synchronizeDatabase == "否") {
          this.$message.warn("请先同步数据库");
        } else {
          this.$post("/system/sysGenTable/isGenerateCode", {
            tableName: this.mdl.tableName,
            tableSchema: this.mdl.database,
          }).then((res) => {
            if (res.statusCode === 200) {
              this.datagridVisible = true;
              this.$refs.datagridModal.add(this.mdl);
            } else {
              this.$message.warn(res.message);
            }
          });
        }
      } else {
        this.$message.warn("请先选择一条数据");
      }
    },
    // 取消
    handleCancel() {
      this.datagridVisible = false;
      this.visible = false;
      this.mastersonVisible = false;
    },
    // 数据库导入表
    generatedOk() {
      this.$refs.table.refresh();
      this.generatedVisible = false;
    },
    databaseImportTable() {
      this.generatedVisible = true;
      this.$refs.generatedModal.onLoad();
    },
    // 主子表代码生成
    mainsubTableGenerationCode() {
      const form = this.$refs.mastersonModal.form;
      form.resetFields();
      // this.mdl = null
      this.mastersonVisible = true;
      this.$refs.mastersonModal.openEdit();
    },
    // 主子表
    handleMastersonOk() {
      const form = this.$refs.mastersonModal.form;
      this.confirmLoading = true;
      form.validateFields((errors, values) => {
        if (!errors) {
        }
      });
      this.$refs.table.refresh();
    },
  },
};
</script>

<style lang="less"></style>
