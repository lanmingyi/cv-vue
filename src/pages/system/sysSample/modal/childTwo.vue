<template>
  <a-card :bordered="false" :bodyStyle="{ padding: 0 }">
    <tool-bar
      @search="$refs.table.refresh(true)"
      @reset="
        () => {
          ((queryParam.name = ''), delete queryParam.name),
            $refs.table.refresh();
        }
      "
    >
      <template slot="toolBtn" slot-scope="scope">
        <a-button
          class="cu-btn-primary"
          icon="plus"
          @click="handleAdd(queryParam)"
          >新增</a-button
        >
        <!-- <a-button
          class="cu-btn-default"
          icon="edit"
          @click="handleEdit($refs.table.rows)"
          >编辑</a-button
        > -->
        <a-button
          class="cu-btn-danger"
          icon="delete"
          @click="handleSub($refs.table.selectedRowKeys)"
          >删除
        </a-button>
      </template>
      <template slot="toolForm">
        <a-form-item label="">
          <a-input v-model="queryParam.name" placeholder="姓名" />
        </a-form-item>
      </template>
    </tool-bar>
    <DataGrid
      ref="table"
      :columns="columns"
      :url="url"
      bordered
      :pageSize="10"
      rowKey="uuid"
      showPagination="auto"
      :queryParam="queryParam"
    >
      <span slot="sex" slot-scope="{ text }">
        {{ text | sexFilter }}
      </span>
      <span slot="testCombobox" slot-scope="{ text }">
        {{ text | testComboboxFilter }}
      </span>
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
  </a-card>
</template>

<script>
import { dataGridMixin } from "@/mixins/dataGridMixin";
import { DataGrid } from "@/components";
import editForm from "./editOne.vue";
export default {
  name: "TableList",
  mixins: [dataGridMixin],
  components: {
    DataGrid,
    editForm,
  },
  data() {
    return {
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
          width: 150,
          dataIndex: "action",
          align: "center",
          scopedSlots: {
            customRender: "action",
          },
        },
      ],
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 查询参数
      queryParam: {},
      url: {
        getPageSet: "/system/exampleRightDatagrid/getPageSet",
        save: "/system/exampleRightDatagrid/save",
        update: "/system/exampleRightDatagrid/update",
        deleteBatch: "/system/exampleRightDatagrid/deleteBatch",
      },
    };
  },
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
    refresh() {
      this.$refs.table.refresh();
    },
  },
};
</script>

<style lang="less"></style>
