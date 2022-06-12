<template>
  <a-card :bordered="false" :bodyStyle="{ padding: 0 }">
    <tool-bar>
      <template slot="toolBtn" slot-scope="scope">
        <a-button
          class="cu-btn-primary"
          icon="plus"
          @click="handleAdd('1', treeData, 'sub', masterRows)"
          >新增
        </a-button>
        <!-- <a-button
          class="cu-btn-default"
          icon="edit"
          @click="handleEdit($refs.table.rows, treeData, 'sub')"
          >编辑
        </a-button> -->
        <a-button
          class="cu-btn-danger"
          icon="delete"
          @click="handleSub($refs.table.selectedRowKeys, 'sub')"
          >删除
        </a-button>
      </template>
    </tool-bar>
    <DataGrid
      type="sub"
      ref="subList"
      :columns="columns"
      :url="url"
      bordered
      rowKey="uuid"
      showPagination="auto"
      :queryParam="subQueryParam"
      :pageSize="10"
    >
      <span slot="sex" slot-scope="{ text }">
        {{ text | sexFilter }}
      </span>
      <span slot="testCombobox" slot-scope="{ text }">
        {{ text | testComboboxFilter }}
      </span>
      <span slot="action" slot-scope="{ text, record }">
        <template>
          <a @click="handleEdit(record, treeData, 'sub')">编辑</a>
          <a-divider type="vertical" />
          <a href="javascript:;" @click="handleSub(record, 'sub')">删除</a>
        </template>
      </span>
    </DataGrid>
    <editDic-form
      ref="subModal"
      :visible="subVisible"
      :loading="subConfirmLoading"
      :model="subMdl"
      @cancel="handleCancel('sub')"
      @ok="handleOk('sub')"
    />
  </a-card>
</template>
<script>
import { DataGrid } from "@/components";

import editDicForm from "./masterTreeEdit";
import { treeGridMixin } from "@/mixins/treeGridMixin";

export default {
  mixins: [treeGridMixin],
  components: {
    DataGrid,
    editDicForm,
  },
  data() {
    return {
      key: "1",
      columns: [
        {
          title: "姓名",
          dataIndex: "name",
          align: "center",
        },
        {
          title: "年龄",
          dataIndex: "age",
          align: "center",
        },
        {
          title: "性别",
          dataIndex: "sex",
          align: "center",
          scopedSlots: {
            customRender: "sex",
          },
        },
        {
          title: "生日",
          dataIndex: "testDate",
          align: "center",
        },
        {
          title: "注册时间",
          dataIndex: "testDatetime",
          align: "center",
        },
        {
          title: "排序",
          dataIndex: "testCombobox",
          align: "center",
          scopedSlots: {
            customRender: "testCombobox",
          },
        },
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          width: 150,
          scopedSlots: {
            customRender: "action",
          },
        },
      ],
      subVisible: false,
      subConfirmLoading: false,
      subMdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      subQueryParam: {},
      subSelectedRowKeys: [],
      subSelectedRows: [],
      subRows: "",
      masterRows: {},
      masterMdl: null,
      url: {
        subList: "/system/exampleRightDatagrid/getPageSet",
        subSave: "/system/exampleRightDatagrid/save",
        subUpdate: "/system/exampleRightDatagrid/update",
        subDelete: "/system/exampleRightDatagrid/deleteBatch",
      },
      treeData: [],
    };
  },
  activated() {},
  mounted() {},
  filters: {
    sexFilter(sex) {
      switch (sex) {
        case "male":
          return "男";
        case "female":
          return "女";
        case "unknown":
          return "未知";
      }
    },
    testComboboxFilter(val) {
      if (val === "true") {
        return "可排序";
      } else {
        return "不可排序";
      }
    },
  },
  methods: {
    refresh(record) {
      this.masterRows = {
        puuid: record ? record.id : '',
      };
      this.$refs.subList.refresh();
    },
  },
};
</script>

<style scope></style>
