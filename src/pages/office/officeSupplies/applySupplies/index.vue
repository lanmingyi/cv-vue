<template>
  <div class="container">
    <a-card :bordered="false">
      <div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
        <div class="table-operator">
          <a-button class="cu-btn-primary" icon="plus" @click="handleAdd()"
            >申请</a-button
          >
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleSub('all')"
            >删除</a-button
          >
        </div>
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <div class="flex justify-between flex-wrap">
              <a-form-item label="">
                <a-input
                  v-model="queryParam.warehouseName"
                  placeholder="库名"
                />
              </a-form-item>
              <a-form-item label="">
                <a-input v-model="queryParam.useName" placeholder="用品名称" />
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
        ref="table"
        size="small"
        :columns="columns"
        :data="loadData"
        bordered
        :rowSelection="rowSelection"
        rowKey="uuid"
        showPagination="auto"
        :rowClassName="rowClassName"
        @rowClick="masterRowClick"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
      </s-table>
      <edit-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel()"
        @ok="handleOk()"
        :typeList="typeList"
      />
    </a-card>
  </div>
</template>

<script>
import { STable } from "@/components";
import { simpleListMixin } from "@/mixins/simpleListMixin";
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
    title: "申请单号",
    dataIndex: "warehouseTicketNumbers",
    ellipsis: true,
  },
  {
    title: "库名",
    dataIndex: "warehouseName",
    ellipsis: true,
  },
  {
    title: "用品类型",
    dataIndex: "useTypeName",
    ellipsis: true,
  },
  {
    title: "用品名称",
    dataIndex: "useName",
    ellipsis: true,
  },
  {
    title: "数量",
    dataIndex: "counts",
    ellipsis: true,
  },
  {
    title: "申请人",
    dataIndex: "applyName",
    ellipsis: true,
  },
  {
    title: "申请时间",
    dataIndex: "createTime",
    ellipsis: true,
  },
  {
    title: "审核人",
    dataIndex: "approverName",
    ellipsis: true,
  },
  {
    title: "审核状态",
    dataIndex: "applyStateText",
    ellipsis: true,
  },
  {
    title: "备注",
    dataIndex: "remark",
    width: 200,
    ellipsis: true,
  },
];
export default {
  name: "TableList",
  mixins: [simpleListMixin],
  components: {
    STable,
    editForm,
  },
  data() {
    this.columns = columns;
    return {
      queryParam: {},
      url: {
        getPageSet: "/office/oaWorkApply/getPageSet",
        save: "/office/oaWorkApply/save",
        update: "/office/oaWorkApply/update",
        deleteBatch: "/office/oaWorkApply/deleteBatch",
        getDicItemByCode: "/system/dicSet/getDicItemByCode",
      },
      loadData: (parameter) => {
        this.queryParam.type = "quitWarehouse";
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        return this.$post(this.url.getPageSet, requestParameters).then(
          (res) => {
            return res;
          }
        );
      },
      mdlUserPost: null,
      visible: false,
      mdl: null,
      confirmLoading: false,
      selectedRowKeys: [],
      rows: "",
      masterUuids: "",
      typeList: [],
    };
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: "申请中",
        1: "已通过",
      };
      return statusMap[status];
    },
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
    this.getCodeList();
  },
  methods: {
    getCodeList() {
      this.$post(this.url.getDicItemByCode, {
        code: "officeSuppliesType",
      }).then((res) => {
        if (res.statusCode !== 300) {
          this.typeList = res;
        }
      });
    },
    rowClassName(row) {
      return row.uuid === this.masterUuids ? "bg-bray" : "";
    },
    masterRowClick(record, index) {
      this.rows = record;
      this.masterUuids = record.uuid;
    },
    resetForm() {
      this.$refs.table.refresh();
    },
    resetSearchForm() {
      this.queryParam = {};
      this.$refs.table.refresh();
    },
  },
};
</script>

<style lang="less"></style>
