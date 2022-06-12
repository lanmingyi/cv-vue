<template>
  <div class="container">
    <a-row :gutter="10">
      <a-col :md="12" :sm="24">
        <a-card :bordered="false">
          <div
            class="toolbar flex justify-between flex-wrap"
            style="width: 100%;"
          >
            <div class="table-operator">
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
            </div>
            <div class="table-page-search-wrapper">
              <a-form layout="inline">
                <div class="flex justify-between flex-wrap">
                  <a-form-item label="">
                    <a-input
                      v-model="masterQueryParam.text"
                      placeholder="字典集"
                    />
                  </a-form-item>
                  <a-form-item label="">
                    <a-input
                      v-model="masterQueryParam.code"
                      placeholder="字典集代码"
                      style="width: 100%"
                    />
                  </a-form-item>
                  <div class="table-page-search-submitButtons flex">
                    <a-button
                      class="cu-btn-primary"
                      @click="$refs.masterList.refresh(true)"
                      >查询</a-button
                    >
                    <a-button
                      class="cu-btn-filter"
                      @click="
                        () => {
                          (this.masterQueryParam = {}),
                            $refs.masterList.refresh(true);
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
            ref="masterList"
            size="small"
            :columns="masterColumns"
            :data="masterLoadData"
            bordered
            :rowSelection="masterRowSelection"
            rowKey="uuid"
            showPagination="auto"
            :customRow="masterRowClick"
            :rowClassName="masterRowClassName"
          >
            <span slot="serial" slot-scope="text, record, index">
              {{ index + 1 }}
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
          <div
            class="toolbar flex justify-between flex-wrap"
            style="width: 100%;"
          >
            <div class="table-operator">
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
            </div>
            <div class="table-page-search-wrapper">
              <a-form layout="inline">
                <div class="flex justify-between flex-wrap">
                  <a-form-item label="">
                    <a-input
                      v-model="subQueryParam.text"
                      placeholder="字典集"
                    />
                  </a-form-item>
                  <a-form-item label="">
                    <a-input
                      v-model="subQueryParam.value"
                      placeholder="字典集代码"
                      style="width: 100%"
                    />
                  </a-form-item>
                  <div class="table-page-search-submitButtons flex">
                    <a-button
                      class="cu-btn-primary"
                      @click="$refs.subList.refresh(true)"
                      >查询</a-button
                    >
                    <a-button
                      class="cu-btn-filter"
                      @click="
                        () => {
                          (this.subQueryParam = {}),
                            $refs.subList.refresh(true);
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
    title: "字典集名称",
    align: "center",
    dataIndex: "text",
  },
  {
    title: "字典集代码",
    align: "center",
    dataIndex: "code",
  },
  {
    title: "备注",
    align: "center",
    dataIndex: "remark",
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
    scopedSlots: {
      customRender: "serial",
    },
  },
  {
    title: "字典项名称",
    dataIndex: "text",
    align: "center",
  },
  {
    title: "字典项值",
    dataIndex: "value",
    align: "center",
  },
  {
    title: "默认选中",
    dataIndex: "selected",
    align: "center",
  },
  {
    title: "备注",
    dataIndex: "remark",
    align: "center",
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
        masterList: "/system/dicSet/getPageSet",
        masterDelete: "/system/dicSet/delete",
        masterAdd: "/system/dicSet/save",
        masterUpdate: "/system/dicSet/update",
        subList: "/system/dicItem/getPageSet",
        subDelete: "/system/dicItem/delete",
        subAdd: "/system/dicItem/save",
        subUpdate: "/system/dicItem/update",
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
  methods: {
    masterRowClassName(row) {
      return row.uuid === this.masterRows?.uuid ? "bg-bray" : ""; // 每条数据的唯一识别值
    },
    subRowClassName(row) {
      return row.uuid === this.subRows?.uuid ? "bg-bray" : ""; // 每条数据的唯一识别值
    },
  },
};
</script>

<style lang="less"></style>
