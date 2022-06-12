<template>
  <div class="container">
    <a-card :bordered="false">
      <div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
        <div class="table-operator">
          <!-- <a-button class="cu-btn-primary" icon="plus" @click="handleAdd('master')">新建</a-button> -->
          <!-- <a-button class="cu-btn-default"
            icon="edit" @click="handleEdit('all','master')">编辑</a-button> -->
          <a-button class="cu-btn-primary" icon="import">导出</a-button>
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleSub('all', 'master')"
            >批量取消</a-button
          >
        </div>
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <div class="flex justify-between flex-wrap">
              <a-form-item label="">
                <a-input v-model="queryParam.title" placeholder="公文标题" />
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
        @rowClick="masterRowClick"
        :pageSize="10"
        :scroll="{ y: 400 }"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="status" slot-scope="text, record, index">
          {{ text | statusFilter }}
        </span>
        <span slot="operate" slot-scope="operate, record">
          <template>
            <a>查看</a>
            <a-divider type="vertical" />
            <a @click="handleSub(record, 'master')">取消收藏</a>
          </template>
        </span>
      </s-table>
      <edit-form
        ref="masterModal"
        :visible="masterVisible"
        :loading="masterConfirmLoading"
        :model="masterMdl"
        @cancel="handleCancel('master')"
        @ok="handleJsonOk('master')"
      />
    </a-card>
  </div>
</template>

<script>
import { baseUrl } from "@/services/baseUrl.js";
import { pdfStreamHandeler } from "@/services/common";
import { STable } from "@/components";
import { dataListMixin } from "@/mixins/dataListMixin";
import webUpload from "@/components/TopVUI/custom/webupload.vue";
import previewImage from "@/components/TopVUI/custom/previewImage.vue";
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
    title: "公文流水号",
    dataIndex: "officialDocNo",
  },
  {
    title: "公文标题",
    dataIndex: "title",
    width: 400,
  },
  {
    title: "来文/发文单位",
    dataIndex: "unit",
  },
  {
    title: "收藏时间",
    dataIndex: "collectTime",
  },
  {
    title: "公文类型",
    dataIndex: "status",
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
      queryParamSub: {},
      url: {
        getPageSet: "/system/topicBase/getPageSet",
      },
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        return this.$post(this.url.getPageSet, requestParameters).then(
          (res) => {
            var list = {
              pageNo: 1,
              pageSize: 10,
              rows: [
                {
                  officialDocNo: "8",
                  applicant: "张三三",
                  unit: "财务部",
                  assetName: "电脑",
                  collectTime: "2018-06-12 08:49:01",
                  buyDepartment: "财务部",
                  assetStatus: "设备",
                  assetsValues: "4999",
                  status: "通知",
                  title: "赵丽颖黑超遮面气场全开，高铁商务舱中狂凹造型",
                  uuid: "97c3c7800c254e38955603206ba1285d",
                },
                {
                  assetId: "8",
                  unit: "研发部",
                  applicant: "张三三",
                  assetName: "电脑",
                  collectTime: "2018-06-12 08:49:01",
                  assetStatus: "设备",
                  officialDocNo: "4999",
                  buyDepartment: "财务部",
                  status: "通知",
                  title: "杨幂女儿太厉害，才4岁就看纯英文动画片",
                  uuid: "bd85830e4a2c4ffaaa229ad76791adae",
                },
                {
                  assetId: "8",
                  unit: "人事部",
                  applicant: "张三三",
                  assetName: "电脑",
                  collectTime: "2018-06-12 08:49:01",
                  assetStatus: "设备",
                  officialDocNo: "4999",
                  buyDepartment: "财务部",
                  status: "通知",
                  title: "7步搞定4㎡卫生间装修，又省钱又上档次",
                  uuid: "93c3e68af6654bd5a3290a5b24751bbe",
                },
              ],
              totalCount: 1,
              totalPage: 1,
            };
            console.log(list, "list");
            return list;
          }
        );
      },
      mdlUserPost: null,
      masterVisible: false,
      masterMdl: null,
      masterConfirmLoading: false,
      masterSelectedRowKeys: [],
      masterRows: "",
      masterUuids: "",
      statusList: [],
      titleList: [],
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
        selectedRowKeys: this.masterSelectedRowKeys,
        onChange: this.onSelectChangeMaster,
      };
    },
  },
  mounted() {},
  methods: {
    rowClassName(row) {
      return row.uuid === this.masterUuids ? "bg-bray" : "";
    },
    masterRowClick(record, index) {
      this.masterRows = record;
      this.masterUuids = record.uuid;
      this.queryParamSub.puuid = record.uuid;
      this.queryParamSub.page = this.queryParamSub.page
        ? this.queryParamSub.page
        : "1";
      this.queryParamSub.rows = this.queryParamSub.pageSize
        ? this.queryParamSub.pageSize
        : "10";
      if (this.key === 1 && this.$refs.subList) {
        this.$refs.subList.refresh();
      } else if (this.key === 2 && this.$refs.traineeList) {
        console.log("this.$refs.traineeList11111", this.$refs.traineeList);
        this.$refs.traineeList.refreshList(this.queryParamSub);
      }
    },
    handleReturn(record) {
      var that = this;
      that.$confirm({
        title: "警告",
        content: `确定撤回此次操作?`,
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          that.$message.error("撤回数据失败");
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
    resetForm() {
      this.$refs.masterList.refresh();
    },
    resetSearchForm() {
      this.queryParam = {};
      this.$refs.masterList.refresh();
    },
  },
};
</script>

<style lang="less">
.rowColorRed {
  background-color: #ffd2d2;
}

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
