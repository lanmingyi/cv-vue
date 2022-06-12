<template>
  <div class="container">
    <a-card :bordered="false">
      <div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
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
        </div>
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <div class="flex justify-between flex-wrap">
              <a-form-item label="">
                <a-input v-model="queryParam.name" placeholder="会议室名称" />
              </a-form-item>
              <a-form-item>
                <a-select
                  v-model="queryParam.stateName"
                  placeholder="会议室状态"
                  style="width:200px;"
                >
                  <a-select-option
                    v-for="(item, index) in meetingList"
                    :key="index"
                    :value="item.value"
                  >
                    {{ item.text }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <div class="table-page-search-submitButtons flex align-center">
                <a-button class="cu-btn-primary" @click="resetForm()"
                  >查询</a-button
                >
                <a-button class="cu-btn-filter" @click="resetSearchForm()"
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
        :columns="columns"
        :data="loadData"
        bordered
        :rowSelection="rowSelection"
        rowKey="uuid"
        showPagination="auto"
        :rowClassName="rowClassName"
        @rowClick="subRowClick"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="operate" slot-scope="operate, record">
          <template>
            <a @click="handleSub(record, 'master')">移除</a>
          </template>
        </span>
      </s-table>
      <edit-form
        ref="masterModal"
        :visible="masterVisible"
        :loading="masterConfirmLoading"
        :model="masterMdl"
        :meetingList="meetingList"
        @cancel="handleCancel('master')"
        @ok="handleOk('master')"
      />
    </a-card>
  </div>
</template>

<script>
import { STable } from "@/components";
import { dataListMixin } from "@/mixins/dataListMixin";
import editForm from "./edit.vue";
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
    title: "序号",
    dataIndex: "number",
  },
  {
    title: "会议室名称",
    dataIndex: "name",
  },
  {
    title: "地址",
    dataIndex: "address",
  },
  {
    title: "备注",
    dataIndex: "remarks",
  },
  {
    title: "门禁系统识别编号",
    dataIndex: "doorControl",
  },
  {
    title: "会议室状态",
    dataIndex: "stateName",
  },
  {
    title: "创建人",
    dataIndex: "creator",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
  },
  {
    title: "操作",
    dataIndex: "operate",
    scopedSlots: {
      customRender: "operate",
    },
  },
];

export default {
  name: "TableList",
  mixins: [dataListMixin],
  components: {
    STable,
    editForm,
  },
  data() {
    this.columns = columns;
    return {
      queryParam: {},
      masterSelectedRowKeys: [],
      masterConfirmLoading: false,
      masterUuids: "",
      url: {
        getPageSet: "/office/oaMeetingroomBase/getPageSet",
        masterAdd: "/office/oaMeetingroomBase/save",
        masterUpdate: "/office/oaMeetingroomBase/update",
        masterDelete: "/office/oaMeetingroomBase/task",
        getDicItemByCode: "/system/dicSet/getDicItemByCode",
      },
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        return this.$post(this.url.getPageSet, requestParameters).then(
          (res) => {
            return res;
          }
        );
      },
      masterVisible: false,
      masterRows: "",
      masterMdl: null,
      meetingList: [],
    };
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.masterSelectedRowKeys,
        onChange: this.onSelectChangeMaster,
      };
    },
  },
  mounted() {
    this.getCodeList();
  },
  methods: {
    rowClassName(row) {
      return row.uuid === this.masterUuids ? "bg-bray" : ""; // 每条数据的唯一识别值
    },
    subRowClick(record, index) {
      this.masterRows = record;
      this.masterUuids = record.uuid;
    },
    resetForm() {
      this.$refs.masterList.refresh();
    },
    resetSearchForm() {
      this.queryParam = {};
      this.$refs.masterList.refresh();
    },
    getCodeList() {
      // 获取银行类型
      this.$post(this.url.getDicItemByCode, {
        code: "meetingRoomstate",
      }).then((res) => {
        if (res.statusCode !== 300) {
          this.meetingList = res;
        }
      });
    },
  },
};
</script>

<style lang="less">
.ant-tag-blue {
  color: white;
  background: #009688;
  border-color: #009688;
}

.ant-tag-red {
  color: white;
  background: #ff5722;
  border-color: #ff5722;
}
</style>
