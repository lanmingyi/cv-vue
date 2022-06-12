<!--
 * @Description: 常用表单
 * @Author: 黄婷
 * @Date: 2021-08-16 17:43:48
 * @LastEditTime: 2021-09-09 16:51:29
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\workflow\actForm\index.vue
-->
<template>
  <div class="page-common-layout">
    <div class="page-common-left" style="width:50%">
      <tool-bar
        @search="$refs.masterList.refresh(true)"
        @reset="
          () => {
            (masterQueryParam = {}), $refs.masterList.refresh(true);
          }
        "
      >
        <template slot="toolBtn" slot-scope="scope">
          <a-button
            class="cu-btn-primary"
            icon="plus"
            @click="handleAdd('master')"
            v-action:actFormLeftAddDialog
            >新增</a-button
          >
          <!-- <a-button
                class="cu-btn-default"
                icon="edit"
                @click="handleEdit($refs.masterList.rows, 'master')"
                v-action:actFormLeftEditDialog
                >编辑</a-button
              > -->
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleSub($refs.masterList.selectedRowKeys, 'master')"
            v-action:actFormLeftDelDialog
            >删除</a-button
          >
        </template>
      </tool-bar>
      <dataGrid
        ref="masterList"
        type="master"
        :columns="masterColumns"
        :url="url"
        bordered
        :queryParam="masterQueryParam"
        rowKey="uuid"
        showPagination="auto"
				:pagination="{showQuickJumper:false}"
				:showTotal="false"
        @rowClick="
          (e) => {
            masterRowClick(e, { puuid: 'uuid' });
          }
        "
      >
        <span slot="action" slot-scope="{ text, record }">
          <template>
            <a @click="handleEdit(record, 'master')">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleSub(record, 'master')">删除</a>
          </template>
        </span>
      </dataGrid>
      <master-form
        ref="masterModal"
        :visible="masterVisible"
        :loading="masterConfirmLoading"
        :model="masterMdl"
        @cancel="handleCancel('master')"
        @ok="handleOk('master')"
      />
    </div>
    <div class="page-common-content">
      <tool-bar
        @search="$refs.subList.refresh(true)"
        @reset="
          () => {
            (subQueryParam = {}), $refs.subList.refresh(true);
          }
        "
      >
        <template slot="toolBtn" slot-scope="scope">
          <a-button
            class="cu-btn-primary"
            icon="plus"
            @click="handleAdd('sub')"
            v-action:actFormRightAddDialog
            >新增</a-button
          >
          <!-- <a-button
                class="cu-btn-default"
                icon="edit"
                @click="handleEdit($refs.subList.rows, 'sub')"
                v-action:actFormRightEditDialog
                >编辑</a-button
              > -->
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleSub($refs.subList.selectedRowKeys, 'sub')"
            v-action:actFormRightDelDialog
            >删除</a-button
          >
        </template>
      </tool-bar>
      <dataGrid
        ref="subList"
        type="sub"
        :url="url"
        :columns="subColumns"
        bordered
        :queryParam="subQueryParam"
        rowKey="uuid"
        showPagination="auto"
      >
        <span slot="testCombobox" slot-scope="{ text }">
          {{ text | testComboboxFilter }}
        </span>
        <span slot="action" slot-scope="{ text, record }">
          <template>
            <a @click="handleEdit(record, 'sub')">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleSub(record, 'sub')">删除</a>
          </template>
        </span>
      </dataGrid>
      <sub-form
        ref="subModal"
        :visible="subVisible"
        :loading="subConfirmLoading"
        :model="subMdl"
        @cancel="handleCancel('sub')"
        @ok="handleOk('sub')"
      />
    </div>
  </div>
</template>

<script>
import { masterTableMixin } from "@/mixins/masterTableMixin";
import dataGrid from "@/components/table/advance/dataGrid";
import masterForm from "./masterEdit.vue";
import subForm from "./subEdit.vue";
const masterColumns = [
  {
    title: "表单",
    dataIndex: "name",
  },
  {
    title: "操作",
    dataIndex: "action",
    align: "center",
    width: 100,
    scopedSlots: { customRender: "action" },
  },
];
const subColumns = [
  {
    title: "页面路径",
    width: 200,
    dataIndex: "nodeFormPath",
  },
  {
    title: "保存接口地址",
    width: 200,
    dataIndex: "nodeFormSavePath",
  },
  {
    title: "更新接口地址",
    width: 200,
    dataIndex: "nodeFormUpdatePath",
  },
  {
    title: "详情接口地址",
    // width: 200,
    dataIndex: "nodeFormEditPath",
  },
  {
    title: "操作",
    dataIndex: "action",
    align: "center",
    width: 100,
    scopedSlots: { customRender: "action" },
  },
];
export default {
  name: "TableList",
  mixins: [masterTableMixin],
  components: {
    masterForm,
    subForm,
    dataGrid,
  },
  data() {
    return {
      masterColumns,
      subColumns,
      // create model
      masterVisible: false,
      subVisible: false,
      masterConfirmLoading: false,
      subConfirmLoading: false,
      masterMdl: null,
      subMdl: null,
      // 查询参数
      masterQueryParam: {},
      subQueryParam: {},
      url: {
        masterList: "/workflow/actForm/getPageSet",
        masterDelete: "/workflow/actForm/deleteBatch",
        masterAdd: "/workflow/actForm/save",
        masterUpdate: "/workflow/actForm/update",
        subList: "/workflow/actFormConfigure/getPageSet",
        subDelete: "/workflow/actFormConfigure/deleteBatch",
        subAdd: "/workflow/actFormConfigure/save",
        subUpdate: "/workflow/actFormConfigure/update",
      },
    };
  },
  methods: {},
};
</script>

<style lang="less"></style>
