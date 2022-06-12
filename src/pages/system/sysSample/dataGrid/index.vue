<template>
  <a-card :bordered="false">
    <div class="toolbar flex justify-between flex-wrap">
      <div class="table-operator">
        <a-button class="cu-btn-primary" icon="plus" @click="handleAdd()"
          >新增</a-button
        >
        <a-button class="cu-btn-default" icon="edit" @click="handleEdit('all')"
          >编辑</a-button
        >
        <a-button class="cu-btn-danger" icon="delete" @click="handleSub('all')"
          >删除</a-button
        >
      </div>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <div class="flex justify-between flex-wrap">
            <a-form-item label="">
              <a-input v-model="queryParam.uuid" placeholder="uuid" />
            </a-form-item>
            <div class="table-page-search-submitButtons flex">
              <a-button
                class="cu-btn-primary"
                @click="$refs.table.refresh(true)"
                >查询</a-button
              >
              <a-button
                class="cu-btn-filter"
                @click="
                  () => {
                    (queryParam = {}), $refs.table.refresh();
                  }
                "
                >重置</a-button
              >
            </div>
          </div>
        </a-form>
      </div>
    </div>
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
          <a @click="handleEdit(record)">编辑</a>
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
  </a-card>
</template>

<script>
import { simpleListMixin } from "@/mixins/simpleListMixin";
import { STable, Ellipsis } from "@/components";

import editForm from "../modal/edit.vue";
const columns = [
  {
    title: "#",
    width: 50,
    align: "center",
    scopedSlots: {
      customRender: "serial",
    },
  }, 
  {
    title: "listClearly",
    dataIndex: "listClearly",
    align: "center",
  },
  {
    title: "datagrid",
    dataIndex: "datagrid",
    align: "center",
  },
  {
    title: "edatagrid",
    dataIndex: "edatagrid",
    align: "center",
  },
  {
    title: "explain",
    dataIndex: "explain",
    align: "center",
  },
  {
    title: "fieldType",
    dataIndex: "fieldType",
    align: "center",
  },
  {
    title: "formDisplay",
    dataIndex: "formDisplay",
    align: "center",
  },
  {
    title: "formType",
    dataIndex: "formType",
    align: "center",
  },
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
  mixins: [simpleListMixin],
  components: { STable, Ellipsis, editForm },
  data() {
    this.columns = columns;
    return {
      visible: false,
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
        getPageSet: "/system/testDemo/getPageSet",
        add: "/system/testDemo/save",
        update: "/system/testDemo/update",
        deleteBatch: "/system/testDemo/deleteBatch",
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
    rowClassName(row) {
      return row.uuid === this.rows?.uuid ? "bg-bray" : ""; // 每条数据的唯一识别值
    },
  },
};
</script>

<style lang="less"></style>
