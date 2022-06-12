<template>
  <div>
    <a-card :bordered="false">
      <div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
        <div class="table-operator">
          <a-button
            class="cu-btn-primary"
            icon="plus"
            @click="handleAdd(queryParam)"
          >
            新增
          </a-button>
          <a-button
            class="cu-btn-default"
            icon="edit"
            @click="handleEdit('all')"
            >编辑</a-button
          >
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleSub('all')"
            >删除</a-button
          >
        </div>
      </div>
      <a-table
        bordered
        ref="table"
        size="small"
        :columns="columns"
        :data-source="data"
        :pagination="pagination"
        :rowSelection="rowSelection"
        rowKey="uuid"
        showPagination="auto"
        :customRow="rowClick"
        :rowClassName="rowClassName"
        @change="handleTableChange"
      />
      <edit-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        :tabKey="tabKey"
        @cancel="handleCancel"
        @ok="handleOk"
      />
    </a-card>
  </div>
</template>

<script>
import { simpleListMixin } from "@/mixins/simpleListMixin";
import editForm from "./tabsEdit.vue";
const columns = [
  {
    title: "开始时间",
    dataIndex: "startTime",
    sorter: true,
    ellipsis: true,
  },
  {
    title: "结束时间",
    dataIndex: "endTime",
    sorter: true,
    ellipsis: true,
  },
  {
    title: "任务问题",
    dataIndex: "content",
    sorter: true,
    ellipsis: true,
  },
];
export default {
  name: "TableList",
  mixins: [simpleListMixin],
  components: {
    editForm,
  },
  props: {
    paramList: {
      type: Object,
    },
    tabKey: {
      type: String,
    },
    model: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    this.columns = columns;
    return {
      visible: false,
      visibleSelect: false,
      confirmLoading: false,
      mdl: {},
      rows: null,
      queryParam: {},
      queryParamlist: {},
      data: [],
      pagination: {
        total: 0,
        current: 1,
        showTotal: (total, range) => {
          return " 共 " + total + " 条";
        },
        pageSize: 10,
        pageSizeOptions: ["10", "20", "30", "40"],
        showSizeChanger: true,
        showQuickJumper: true,
        onShowSizeChange: (current, pageSize) =>
          this.onShowSizeChange(current, pageSize),
      },
      url: {
        getPageSet: "/office/oaTaskProgress/getPageSet",
        save: "/office/oaTaskProgress/save",
        deleteBatch: "/office/oaTaskProgress/deleteBatch",
        update: "/office/oaTaskProgress/update",
      },
      selectedRowKeys: [],
      selectedRows: [],
      uuid: "",
      uuids: "",
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
  mounted() {
    // this.fetch(this.queryParam)
  },
  methods: {
    refreshList(e, url) {
      this.url.getPageSet = url.getPageSet;
      this.url.save = url.save;
      this.url.deleteBatch = url.deleteBatch;
      this.url.update = url.update;
      this.uuid = "";
      this.uuids = "";
      this.rows = null;
      this.selectedRowKeys = [];
      this.queryParam = e;
      this.queryParamlist = Object.assign({}, e);
      if (this.queryParam && this.queryParam.puuid) {
        this.fetch(this.queryParam);
      }
    },
    fetch(params) {
      const that = this;
      params.page =
        params && params.page ? params.page : that.pagination.current;
      params.rows =
        params && params.rows ? params.rows : that.pagination.pageSize;
      that.$post(that.url.getPageSet, params).then((res) => {
        const arr = [];
        const pager = { ...that.pagination };
        pager.total = res.total;
        that.pagination = pager;
        res.rows.forEach(function(item, index) {
          arr.push({
            ...item,
            // children: item.state === 'closed' ? [] : ''
          });
        });
        that.data = arr;
      });
    },
    rowClassName(row) {
      return row.uuid === this.uuids ? "bg-bray" : ""; // 每条数据的唯一识别值
    },
    rowClick(record, index) {
      const that = this;
      return {
        on: {
          click: () => {
            that.rows = record;
            that.uuids = record.uuid;
          },
        },
      };
    },
  },
};
</script>

<style></style>
