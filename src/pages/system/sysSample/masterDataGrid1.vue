<template>
  <div class="container">
    <a-row :gutter="10">
      <a-col :md="12" :sm="24">
        <a-card :bordered="false">
          <tool-bar
            @search="$refs.masterList.refresh(true)"
            @reset="
              () => {
                (this.masterQueryParam = {}), $refs.masterList.refresh(true);
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
              <a-button
                class="cu-btn-default"
                icon="edit"
                @click="handleEdit('all', 'master')"
                >编辑</a-button
              >
              <a-button
                class="cu-btn-danger"
                icon="delete"
                @click="handleSub('all', 'master')"
                >删除</a-button
              >
            </template>
            <template slot="toolForm">
              <a-form-item label="">
                <a-input v-model="masterQueryParam.name" placeholder="name" />
              </a-form-item>
            </template>
          </tool-bar>
          <s-table
            ref="masterList"
            size="small"
            :columns="masterColumns"
            :data="masterLoadData"
            bordered
            :rowSelection="masterRowSelection"
            rowKey="uuid"
            showPagination="auto"
            @rowClick="
              (e, key) => {
                masterRowClick(e, key, { puuid: 'uuid' });
              }
            "
            :rowClassName="masterRowClassName"
          >
            <span slot="serial" slot-scope="text, record, index">
              {{ index + 1 }}
            </span>
            <span slot="sex" slot-scope="text">
              {{ text | sexFilter }}
            </span>
            <span slot="action" slot-scope="text, record">
              <template>
                <a @click="handleEdit(record, 'master')">编辑</a>
                <a-divider type="vertical" />
                <a @click="handleSub(record, 'master')">删除</a>
              </template>
            </span>
          </s-table>
          <master-form
            ref="masterModal"
            :visible="masterVisible"
            :loading="masterConfirmLoading"
            :model="masterMdl"
            @cancel="handleCancel('master')"
            @ok="handleOk('master')"
          />
        </a-card>
      </a-col>
      <a-col :md="12" :sm="24">
        <a-card :bordered="false">
          <tool-bar>
            <template slot="toolBtn" slot-scope="scope">
              <a-button
                class="cu-btn-primary"
                icon="plus"
                @click="handleAdd('sub')"
                >新增</a-button
              >
              <a-button
                class="cu-btn-default"
                icon="edit"
                @click="handleEdit('all', 'sub')"
                >编辑</a-button
              >
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
            :columns="subColumns"
            :data="subLoadData"
            bordered
            :rowSelection="subRowSelection"
            rowKey="uuid"
            showPagination="auto"
            :customRow="subRowClick"
            :rowClassName="subRowClassName"
          >
            <span slot="serial" slot-scope="text, record, index">
              {{ index + 1 }}
            </span>
            <span slot="testCombobox" slot-scope="text">
              {{ text | testComboboxFilter }}
            </span>
            <span slot="action" slot-scope="text, record">
              <template>
                <a @click="handleEdit(record, 'sub')">编辑</a>
                <a-divider type="vertical" />
                <a @click="handleSub(record, 'sub')">删除</a>
              </template>
            </span>
          </s-table>
          <sub-form
            ref="subModal"
            :visible="subVisible"
            :loading="subConfirmLoading"
            :model="subMdl"
            @cancel="handleCancel('sub')"
            @ok="handleOk('sub')"
          />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { dataListMixin } from "@/mixins/dataListMixin";

import { STable, Ellipsis } from "@/components";
import masterForm from "./modal/masterEdit.vue";
import subForm from "./modal/subEdit.vue";
const masterColumns = [
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
    title: "操作",
    width: 150,
    dataIndex: "action",
    align: "center",
    scopedSlots: {
      customRender: "action",
    },
  },
];
const subColumns = [
  {
    title: "#",
    align: "center",
    width: 50,
    scopedSlots: {
      customRender: "serial",
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
    width: "150px",
    scopedSlots: {
      customRender: "action",
    },
  },
];
export default {
  name: "TableList",
  mixins: [dataListMixin],
  components: {
    STable,
    Ellipsis,
    masterForm,
    subForm,
  },
  data() {
    this.masterColumns = masterColumns;
    this.subColumns = subColumns;
    return {
      // create model
      masterVisible: false,
      subVisible: false,
      masterConfirmLoading: false,
      subConfirmLoading: false,
      masterMdl: null,
      subMdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      masterQueryParam: {},
      subQueryParam: {},
      masterSelectedRowKeys: [],
      masterSelectedRows: [],
      subSelectedRowKeys: [],
      subSelectedRows: [],
      masterRows: "",
      subRows: "",
      url: {
        masterList: "/system/testDemo/getPageSet",
        masterDelete: "/system/testDemo/deleteBatch",
        masterAdd: "/system/testDemo/save",
        masterUpdate: "/system/testDemo/update",
        subList: "/workflow/testDatagrid/getPageSet",
        subDelete: "/workflow/testDatagrid/deleteBatch",
        subAdd: "/workflow/testDatagrid/save",
        subUpdate: "/workflow/testDatagrid/update",
      },
      // 加载数据方法 必须为 Promise 对象
      masterLoadData: (parameter) => {
        const requestParameters = Object.assign(
          {},
          parameter,
          this.masterQueryParam
        );
        return this.$post(this.url.masterList, requestParameters).then(
          (res) => {
            return res;
          }
        );
      },
      subLoadData: (parameter) => {
        const requestParameters = Object.assign(
          {},
          parameter,
          this.subQueryParam
        );
        return this.$post(this.url.subList, requestParameters).then((res) => {
          return res;
        });
      },
    };
  },
  filters: {
    sexFilter(sex) {
      const sexMap = {
        0: "女",
        1: "男",
      };
      return sexMap[sex];
    },
    testComboboxFilter(val) {
      if (val === "true") {
        return "可排序";
      } else if (val === "false") {
        return "不可排序";
      }
    },
  },
  computed: {
    masterRowSelection() {
      return {
        selectedRowKeys: this.masterSelectedRowKeys,
        onChange: this.onSelectChangeMaster,
      };
    },
    subRowSelection() {
      return {
        selectedRowKeys: this.subSelectedRowKeys,
        onChange: this.onSelectChangeSub,
      };
    },
  },
  methods: {},
};
</script>

<style lang="less"></style>
