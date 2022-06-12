<template>
  <a-card :bordered="false">
    <tool-bar>
      <template slot="toolBtn" slot-scope="scope">
        <a-button
          class="cu-btn-primary"
          icon="plus"
          @click="handleAdd('1', treeData, 'sub')"
          >新增</a-button
        >
        <!-- <a-button
          class="cu-btn-default"
          icon="edit"
          @click="handleEdit('all', treeData, 'sub')"
          >编辑</a-button
        > -->
        <a-button
          class="cu-btn-danger"
          icon="delete"
          @click="handleSub('all', 'sub')"
          >删除</a-button
        >
      </template>
    </tool-bar>
    <s-table
      ref="subList"
      size="small"
      :columns="columnsDicItem"
      :data="loadDataDicItem"
      bordered
      :rowSelection="subRowSelection"
      rowKey="uuid"
      showPagination="auto"
      :customRow="subRowClick"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="sex" slot-scope="text">
        {{ text | sexFilter }}
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a
            @click="
              handleEdit(record, treeData, 'sub', {
                puuid: childTwoQueryParam.puuid,
              })
            "
            >编辑</a
          >
          <a-divider type="vertical" />
          <a href="javascript:;" @click="handleSub(record, 'sub')">删除</a>
        </template>
      </span>
    </s-table>
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
import { STable } from "@/components";

import editDicForm from "./masterTreeEdit";
import { dataTreeMixin } from "@/mixins/dataTreeMixin";
const columnsDicItem = [
  {
    title: "#",
    width: 50,
    align: "center",
    scopedSlots: {
      customRender: "serial",
    },
  },
  {
    title: "姓名",
    dataIndex: "name",
    align: "center",
  },
  {
    title: "年龄",
    width: 80,
    dataIndex: "age",
    align: "center",
  },
  {
    title: "性别",
    width: 80,
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
    width: 80,
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
    width: "150px",
    scopedSlots: {
      customRender: "action",
    },
  },
];
export default {
  mixins: [dataTreeMixin],
  components: {
    STable,
    editDicForm,
  },
  props: ["childTwoQueryParam"],
  data() {
    return {
      key: "1",
      columnsDicItem,
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
      masterRows: "",
      masterMdl: null,
      url: {
        subList: "/workflow/testDatagrid/getPageSet",
        subSave: "/workflow/testDatagrid/save",
        subUpdate: "/workflow/testDatagrid/update",
        subDelete: "/workflow/testDatagrid/deleteBatch",
      },
      loadDataDicItem: (parameter) => {
        this.subQueryParam = {
          ...this.subQueryParam,
          ...this.childTwoQueryParam,
        };
        const requestParameters = Object.assign(
          {},
          parameter,
          this.subQueryParam
        );
        return this.$post(this.url.subList, requestParameters).then((res) => {
          return res;
        });
      },
      treeData: [],
    };
  },
  activated() {},
  mounted() {},
  computed: {
    subRowSelection() {
      return {
        selectedRowKeys: this.subSelectedRowKeys,
        onChange: this.onSelectChangeSub,
      };
    },
  },
  filters: {
    sexFilter(sex) {
      const sexMap = {
        0: "女",
        1: "男",
      };
      return sexMap[sex];
    },
  },
  methods: {
    refresh(parameter, record) {
      this.masterRows = { puuid: record.id };
      this.subMdl = { puuid: record.id };
      this.subQueryParam = parameter;
      this.$refs.subList.refresh();
    },
  },
};
</script>

<style scope></style>
