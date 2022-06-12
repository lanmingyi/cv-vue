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
            v-action:managementAddDialog
            >新增</a-button
          >
          <!-- <a-button
          class="cu-btn-default"
          icon="edit"
          @click="handleEdit($refs.table.rows)"
          v-action:managementEditDialog
          >编辑</a-button
        > -->
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleSub($refs.table.selectedRowKeys)"
            v-action:managementDelDialog
            >删除</a-button
          >
        </template>
        <template slot="toolForm">
          <a-form-item label="">
            <a-input v-model="queryParam.buttonName" placeholder="名称" />
          </a-form-item>
        </template>
      </tool-bar>
      <DataGrid
        ref="table"
        :columns="columns"
        :url="url"
        bordered
        rowKey="uuid"
        showPagination="auto"
        :queryParam="queryParam"
      >
        <span slot="action" slot-scope="{ text, record }">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleSub(record)">删除</a>
          </template>
        </span>
      </DataGrid>
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
import { dataGridMixin } from "@/mixins/dataGridMixin";
import { DataGrid } from "@/components";

import editForm from "./add.vue";

export default {
  name: "TableList",
  mixins: [dataGridMixin],
  components: { DataGrid, editForm },
  data() {
    return {
      columns: [
        {
          title: "名称",
          dataIndex: "buttonName",
          align: "center",
        },
        {
          title: "标识",
          dataIndex: "buttonCode",
          align: "center",
        },
        {
          title: "排序",
          dataIndex: "buttonSort",
          align: "center",
        },
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          width: 120,
          scopedSlots: {
            customRender: "action",
          },
          align: "center",
        },
      ],
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 查询参数
      queryParam: {},
      url: {
        getPageSet: "/workflow/flowButton/getPageSet",
        deleteBatch: "/workflow/flowButton/deleteBatch",
        update: "/workflow/flowButton/update",
        save: "/workflow/flowButton/save",
      },
    };
  },
};
</script>

<style lang="less"></style>
