<!--
 * @Description: 流程分类
 * @Author: 黄婷
 * @Date: 2021-01-18 15:17:31
 * @LastEditTime: 2021-09-09 16:58:02
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\workflow\workflowCategory\index.vue
-->
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
            v-action:workflowCategoryAddDialog
            >新增</a-button
          >
          <!-- <a-button
          class="cu-btn-default"
          icon="edit"
          @click="handleEdit($refs.table.rows)"
          v-action:workflowCategoryEditDialog
          >编辑</a-button
        > -->
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleSub($refs.table.selectedRowKeys)"
            v-action:workflowCategoryDelDialog
            >删除</a-button
          >
        </template>
        <template slot="toolForm">
          <a-form-item label="">
            <a-input v-model="queryParam.categoryName" placeholder="名称" />
          </a-form-item>
        </template>
      </tool-bar>
      <DataGrid
        ref="table"
        :columns="columns"
        :url="url"
        bordered
        :queryParam="queryParam"
        rowKey="uuid"
        showPagination="auto"
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
          title: "分类名称",
          dataIndex: "categoryName",
        },
        {
          title: "分类标识",
          dataIndex: "categoryCode",
        },
        {
          title: "创建时间",
          dataIndex: "createTime",
          align: "center",
        },
        {
          title: "操作",
          dataIndex: "action",
          width: 120,
          align: "center",
          scopedSlots: { customRender: "action" },
          fixed: "right",
        },
      ],
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 查询参数
      queryParam: {},
      url: {
        getPageSet: "/workflow/flowCategory/getPageSet",
        deleteBatch: "/workflow/flowCategory/deleteBatch",
        update: "/workflow/flowCategory/update",
        save: "/workflow/flowCategory/save",
      },
    };
  },
};
</script>

<style lang="less"></style>
