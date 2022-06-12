<!--
 * @Description: 门户分类
 * @Author: 黄婷
 * @Date: 2021-06-02 13:38:09
 * @LastEditTime: 2021-09-09 16:10:26
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\system\sysPortalClassify\index.vue
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
            v-action:sysPortalClassifyAddDialog
            >新增</a-button
          >
          <!-- <a-button
          class="cu-btn-default"
          icon="edit"
          @click="handleEdit($refs.table.rows)"
          v-action:sysPortalClassifyEditDialog
          >编辑</a-button
        > -->
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleSub($refs.table.selectedRowKeys)"
            v-action:sysPortalClassifyDelDialog
            >删除</a-button
          >
        </template>
        <template slot="toolForm"> </template>
      </tool-bar>
      <DataGrid
        ref="table"
        :columns="columns"
        :url="url"
        :pageSize="10"
        :queryParam="queryParam"
        rowKey="uuid"
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
import { DataGrid, Ellipsis } from "@/components";

import editForm from "./edit.vue";
const columns = [
  { title: "分类名", dataIndex: "classifyName" },
  { title: "标识", dataIndex: "classifyCode", sorter: true },
  { title: "分类排序", dataIndex: "classifySort", sorter: true },
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
  name: "TableList",
  mixins: [dataGridMixin],
  components: { DataGrid, Ellipsis, editForm },
  data() {
    return {
      columns: columns,
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      selectedRows: [],
      rows: "", //选中行数据
      url: {
        getPageSet: "/system/sysPortalClassify/getPageSet",
        save: "/system/sysPortalClassify/save",
        update: "/system/sysPortalClassify/update",
        deleteBatch: "/system/sysPortalClassify/deleteBatch",
      },
    };
  },
  filters: {},
  methods: {},
};
</script>

<style lang="less"></style>
