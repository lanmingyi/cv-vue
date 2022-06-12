<template>
  <div class="page-common-layout">
    <div class="page-common-left" style="width:50%">
      <tool-bar
        @search="$refs.masterList.refresh(true)"
        @reset="
          () => {
            (masterQueryParam = {},subQueryParam={}), $refs.masterList.refresh(true),$refs.subList.refresh(true);
          }
        "
      >
        <template slot="toolBtn" slot-scope="scope">
          <a-button
            class="cu-btn-primary"
            icon="plus"
            @click="handleAdd('master')"
            >新增</a-button
          >
          <!-- <a-button
            class="cu-btn-default"
            icon="edit"
            @click="handleEdit($refs.masterList.rows, 'master')"
            >编辑</a-button
          > -->
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleSub($refs.masterList.selectedRowKeys, 'master')"
            >删除</a-button
          >
        </template>
        <template slot="toolForm">
          <a-form-item label="">
            <a-input v-model="masterQueryParam.text" placeholder="字典集名称" />
          </a-form-item>
          <a-form-item label="">
            <a-input
              v-model="masterQueryParam.code"
              placeholder="字典集代码"
              style="width: 100%"
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
            masterRowClick(e, { puuid: 'uuid', code: 'code' });
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
      <master-form
        ref="masterModal"
        :visible="masterVisible"
        :loading="masterConfirmLoading"
        :model="masterMdl"
        @cancel="handleCancel('master')"
        @ok="handleOk('master')"
      />
    </div>
    <div class="page-common-content" style="width:50%">
      <tool-bar
        @search="$refs.subList.refresh(true)"
        @reset="
          () => {
            (subQueryParam = {
              puuid: $refs.masterList.rows.uuid,
              code: $refs.masterList.rows.code,
            }),
              $refs.subList.refresh(true);
          }
        "
      >
        <template slot="toolBtn" slot-scope="scope">
          <a-button class="cu-btn-primary" icon="plus" @click="handleAdd('sub')"
            >新增</a-button
          >
          <!-- <a-button
            class="cu-btn-default"
            icon="edit"
            @click="handleEdit($refs.subList.rows, 'sub')"
            >编辑</a-button
          > -->
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleSub($refs.subList.selectedRowKeys, 'sub')"
            >删除</a-button
          >
        </template>
        <template slot="toolForm">
          <a-form-item label="">
            <a-input v-model="subQueryParam.text" placeholder="字典项名称" />
          </a-form-item>
          <a-form-item label="">
            <a-input
              v-model="subQueryParam.value"
              placeholder="字典项值"
              style="width: 100%"
            />
          </a-form-item>
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
import { DataGrid } from "@/components";
import masterForm from "./masterEdit.vue";
import subForm from "./subEdit.vue";

export default {
  name: "TableList",
  mixins: [masterTableMixin],
  components: {
    masterForm,
    subForm,
    DataGrid,
  },
  data() {
    return {
      masterColumns: [
        {
          title: "字典集名称",
          align: "center",
          dataIndex: "text",
          width: 200,
        },
        {
          title: "字典集代码",
          align: "center",
          dataIndex: "code",
        },
        {
          title: "操作",
          width: 150,
          dataIndex: "action",
          align: "center",
          scopedSlots: { customRender: "action" },
        },
      ],
      subColumns: [
        {
          title: "字典项名称",
          dataIndex: "text",
          align: "center",
          width: 200,
        },
        {
          title: "字典项值",
          dataIndex: "value",
          align: "center",
        },
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          width: 150,
          scopedSlots: { customRender: "action" },
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
      subQueryParam: {},
      url: {
        masterList: "/system/dicSet/getPageSet",
        masterDelete: "/system/dicSet/delete",
        masterAdd: "/system/dicSet/save",
        masterUpdate: "/system/dicSet/update",
        subList: "/system/dicItem/getPageSet",
        subDelete: "/system/dicItem/delete",
        subAdd: "/system/dicItem/save",
        subUpdate: "/system/dicItem/update",
      },
    };
  },
  methods: {},
};
</script>

<style lang="less"></style>
