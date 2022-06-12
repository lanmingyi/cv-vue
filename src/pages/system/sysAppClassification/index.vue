<!--
 * @Description: 移动在线开发分类
 * @Author: 黄婷
 * @Date: 2021-07-08 16:34:28
 * @LastEditTime: 2021-09-09 16:40:49
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\system\sysAppClassification\index.vue
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
            v-action:sysAppClassificationAddDialog
            >新增</a-button
          >
          <!-- <a-button
          class="cu-btn-default"
          icon="edit"
          @click="handleEdit($refs.table.rows)"
          v-action:sysAppClassificationEditDialog
          >编辑</a-button
        > -->
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleSub($refs.table.selectedRowKeys)"
            v-action:sysAppClassificationDelDialog
            >删除</a-button
          >
        </template>
        <template slot="toolForm"> </template>
      </tool-bar>
      <DataGrid
        ref="table"
        :columns="columns"
        :url="url"
        :queryParam="queryParam"
        rowKey="uuid"
        :format-conditions="true"
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

export default {
  name: "Table",
  mixins: [dataGridMixin],
  components: { DataGrid, Ellipsis, editForm },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      rows: "", //选中行数据
      url: {
        getPageSet: "/system/sysAppClassification/getPageSet",
        save: "/system/sysAppClassification/save",
        update: "/system/sysAppClassification/update",
        deleteBatch: "/system/sysAppClassification/deleteBatch",
      },
      columns: [
        { title: "分类名", dataIndex: "classificationName", width: 300 },
        { title: "分类编码", dataIndex: "classificationCode" },
        { title: "分类排序", dataIndex: "classificationSort" },
        {
          title: "操作",
          dataIndex: "action",
          width: 100,
          align: "center",
          scopedSlots: { customRender: "action" },
        },
      ],
    };
  },
  filters: {},
  methods: {},
};
</script>

<style lang="less"></style>
