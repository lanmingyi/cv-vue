<template>
  <t-modal
    :visible="visible"
    :width="1000"
    :title="title"
    :fullscreen="false"
    :switchFullscreen="false"
    :confirmLoading="loading"
    :footer="null"
    @cancel="
      () => {
        $emit('cancel');
      }
    "
  >
    <a-card :bordered="false">
      <div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <div class="flex justify-between flex-wrap">
              <a-form-item label="">
                <a-input v-model="queryParam.userName" placeholder="用户名" />
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
        :pageSize="10"
        :scroll="{ y: 400 }"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="viewTimr" slot-scope="text">
          {{ moment(text).format("YYYY-MM-DD HH:mm:ss") }}
        </span>
      </s-table>
    </a-card>
  </t-modal>
</template>

<script>
import moment from "moment";
import { STable } from "@/components";
import { simpleListMixin } from "@/mixins/simpleListMixin";
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
    title: "用户名称",
    dataIndex: "creator",
  },
  {
    title: "用户编码",
    dataIndex: "userNameId",
  },
  {
    title: "部门",
    dataIndex: "viewDepartmentName",
  },
  {
    title: "访问时间",
    dataIndex: "viewTimr",
    scopedSlots: {
      customRender: "viewTimr",
    },
  },
  {
    title: "访问IP",
    dataIndex: "accessIp",
  },
];
export default {
  name: "TableList",
  mixins: [simpleListMixin],
  components: {
    STable,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    loading: {
      type: Boolean,
      default: () => false,
    },
    model: {
      type: Object,
      default: () => null,
    },
    title: {
      type: String,
      default: () => null,
    },
  },
  data() {
    this.columns = columns;
    return {
      queryParam: {},
      queryParamSub: {},
      url: {
        getPageSet: "/office/officePublicBrowsingHistory/getPageSet",
      },
      fullscreen: true,
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        console.log("model", this.model);
        return this.$post(this.url.getPageSet, requestParameters).then(
          (res) => {
            return res;
          }
        );
      },
      mdlUserPost: null,
      mdl: null,
      selectedRowKeys: [],
      rows: "",
      masterUuids: "",
      uuid: "",
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
  mounted() {},
  methods: {
    moment,
    edit(record) {
      this.uuid = record.uuid;
      this.queryParam.publicUuid = record.uuid;
      this.$nextTick(() => {
        this.$refs.table.refresh();
      });
    },
    rowClassName(row) {
      return row.uuid === this.masterUuids ? "bg-bray" : "";
    },
    masterRowClick(record, index) {
      this.rows = record;
      this.masterUuids = record.uuid;
      this.queryParamSub.puuid = record.uuid;
      this.queryParamSub.page = this.queryParamSub.page
        ? this.queryParamSub.page
        : "1";
      this.queryParamSub.rows = this.queryParamSub.pageSize
        ? this.queryParamSub.pageSize
        : "10";
    },
    resetForm() {
      this.queryParam.publicUuid = this.uuid;
      this.$refs.table.refresh();
    },
    resetSearchForm() {
      this.queryParam = {};
      this.queryParam.publicUuid = this.uuid;
      this.$refs.table.refresh();
    },
  },
};
</script>

<style lang="less"></style>
