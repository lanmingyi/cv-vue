<template>
  <div class="container">
    <a-card :bordered="false">
      <div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
        <div class="table-operator">
          <!-- <a-button class="cu-btn-primary" icon="plus" @click="handleAdd('master')">新拟公文</a-button> -->
          <!-- <a-button class="cu-btn-default"
            icon="edit" @click="handleEdit('all','master')">编辑</a-button>
					<a-button class="cu-btn-danger" icon="delete" @click="handleSub('all','master')">删除</a-button>
					<a-button class="cu-btn-default"
            icon="edit" >导出</a-button> -->
        </div>
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <div class="flex justify-between flex-wrap">
              <a-form-item label="">
                <a-input
                  v-model="queryParam.trainName"
                  placeholder="用户名称"
                />
              </a-form-item>
              <a-form-item label="">
                <a-input v-model="queryParam.trainName" placeholder="标题" />
              </a-form-item>
              <a-form-item label="">
                <a-input
                  v-model="queryParam.trainName"
                  placeholder="事项名称"
                />
              </a-form-item>
              <a-form-item label="">
                <a-input v-model="queryParam.trainName" placeholder="状态" />
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
      <a-tabs default-active-key="1" @change="changTabs">
        <a-tab-pane key="1" tab="我的待办">
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
            :scroll="{ x: 1200, y: 700 }"
          >
            <span slot="serial" slot-scope="text, record, index">
              {{ index + 1 }}
            </span>
            <span slot="itemName" slot-scope="text">
              {{ text | itemNameFilter }}
            </span>
            <span slot="status" slot-scope="text">
              {{ text | statusFilter }}
            </span>
            <span slot="operate" slot-scope="text, record">
              <template>
                <a>详情</a>
              </template>
            </span>
          </s-table>
        </a-tab-pane>
        <a-tab-pane key="2" tab="我的已办">
          <s-table
            ref="subList"
            rowKey="uuid"
            :columns="subColumns"
            bordered
            :pageSize="10"
            :rowSelection="subRowSelection"
            @rowClick="subRowClick"
            :rowClassName="subRowClassName"
            :scroll="{ x: 1200, y: 700 }"
            :data="loadDataSub"
          >
            <span slot="serial" slot-scope="text, record, index">
              {{ index + 1 }}
            </span>
            <span slot="itemName" slot-scope="text">
              {{ text | itemNameFilter }}
            </span>
            <span slot="status" slot-scope="text">
              {{ text | statusFilter }}
            </span>
            <span slot="action" slot-scope="text, record">
              <template>
                <a>详情</a>
                <a-divider
                  type="vertical"
                  v-if="record.status === 0 || record.status === 1"
                />
                <a v-if="record.status === 0 || record.status === 1">取回</a>
                <!-- @click="handleBack(record)" -->
              </template>
            </span>
          </s-table>
        </a-tab-pane>
      </a-tabs>
      <edit-form
        ref="masterModal"
        :visible="masterVisible"
        :loading="masterConfirmLoading"
        :model="masterMdl"
        @cancel="handleCancel('master')"
        @return="handleReturn()"
        @sign="handleSign()"
      />
      <borrow-form
        ref="borrowModal"
        :visible="borrowVisible"
        :loading="borrowConfirmLoading"
        :model="masterMdl"
        @cancel="handleBorrowCancel('master')"
      />
      <payment-form
        ref="paymentModal"
        :visible="paymentVisible"
        :loading="paymentConfirmLoading"
        :model="masterMdl"
        @cancel="handlePaymentCancel('master')"
      />
      <reimburse-form
        ref="reimburseModal"
        :visible="reimburseVisible"
        :loading="reimburseConfirmLoading"
        :model="masterMdl"
        @cancel="handleReimburseCancel('master')"
      />
    </a-card>
  </div>
</template>

<script>
import { baseUrl } from "@/services/baseUrl.js";
import { pdfStreamHandeler } from "@/services/common";
import { STable } from "@/components";
import { dataListMixin } from "@/mixins/dataListMixin";
import editForm from "./edit.vue";
import borrowForm from "./editBorrow.vue";
import paymentForm from "./editPayment.vue";
import reimburseForm from "./editReimburse.vue";
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
    title: "业务编号",
    dataIndex: "codeId",
    width: 200,
  },
  {
    title: "标题",
    dataIndex: "title",
    width: 400,
  },
  {
    title: "事项名称",
    dataIndex: "itemName",
    width: 100,
    scopedSlots: {
      customRender: "itemName",
    },
  },
  {
    title: "申请时间",
    dataIndex: "applicantTime",
    width: 200,
  },
  {
    title: "申请人",
    dataIndex: "applicant",
    width: 150,
  },
  {
    title: "状态",
    dataIndex: "status",
    width: 150,
    scopedSlots: {
      customRender: "status",
    },
  },
  {
    title: "操作",
    width: 100,
    dataIndex: "operate",
    scopedSlots: {
      customRender: "operate",
    },
  },
];
const subColumns = [
  {
    title: "#",
    width: 50,
    align: "center",
    scopedSlots: {
      customRender: "serial",
    },
  },
  {
    title: "业务编号",
    dataIndex: "codeId",
    width: 200,
  },
  {
    title: "标题",
    dataIndex: "title",
    width: 400,
  },
  {
    title: "事项名称",
    dataIndex: "itemName",
    width: 100,
    scopedSlots: {
      customRender: "itemName",
    },
  },
  {
    title: "申请时间",
    dataIndex: "applicantTime",
    width: 200,
  },
  {
    title: "申请人",
    dataIndex: "applicant",
    width: 150,
  },
  {
    title: "状态",
    dataIndex: "status",
    scopedSlots: {
      customRender: "status",
    },
    width: 150,
  },
  {
    title: "操作",
    dataIndex: "action",
    width: 100,
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
    editForm,
    borrowForm,
    paymentForm,
    reimburseForm,
  },
  data() {
    this.columns = columns;
    this.subColumns = subColumns;
    return {
      queryParam: {},
      queryParamSub: {},
      queryParamTrainee: {},
      url: {
        getPageSet: "/system/topicBase/getPageSet",
      },
      urlpdf: {
        pdfStreamHandeler: "/system/attachment/pdfStreamHandeler",
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
                  codeId: "J20201230",
                  applicant: "管理员",
                  applicantTime: "2018-06-12 08:49:01",
                  trainEndTime: "2018-06-12 10:49:01",
                  title: "示例执行器",
                  uuid: "F9BF6730AC374624AAB327B49EBA7807",
                  trainContent: "示例执行器123",
                  itemName: 1,
                  status: 1,
                },
                {
                  codeId: "J20201230",
                  applicant: "管理员",
                  applicantTime: "2018-06-12 08:49:01",
                  trainEndTime: "2018-06-12 10:49:01",
                  title: "赵丽颖黑超遮面气场全开，高铁商务舱中狂凹造型",
                  uuid: "97c3c7800c254e38955603206ba1285d",
                  trainContent:
                    "赵丽颖黑超遮面气场全开，高铁商务舱中狂凹造型123",
                  itemName: 0,
                  status: 2,
                },
                {
                  codeId: "J20201230",
                  applicant: "管理员",
                  applicantTime: "2018-06-12 08:49:01",
                  trainEndTime: "2018-06-12 10:49:01",
                  title: "杨幂女儿太厉害，才4岁就看纯英文动画片",
                  uuid: "bd85830e4a2c4ffaaa229ad76791adae",
                  trainContent: "杨幂女儿太厉害，才4岁就看纯英文动画片123",
                  itemName: 2,
                  status: 2,
                },
                {
                  codeId: "J20201230",
                  applicant: "管理员",
                  applicantTime: "2018-06-12 08:49:01",
                  trainEndTime: "2018-06-12 10:49:01",
                  title: "7步搞定4㎡卫生间装修，又省钱又上档次",
                  uuid: "93c3e68af6654bd5a3290a5b24751bbe",
                  trainContent: "7步搞定4㎡卫生间装修，又省钱又上档次123",
                  itemName: 0,
                  status: 1,
                },
              ],
              totalCount: 1,
              totalPage: 1,
            };
            return list;
          }
        );
      },
      loadDataSub: (parameter) => {
        const requestParameters = Object.assign(
          {},
          parameter,
          this.queryParamSub
        );
        return this.$post(this.url.getPageSet, requestParameters).then(
          (res) => {
            var list = {
              pageNo: 0,
              pageSize: 0,
              rows: [
                {
                  codeId: "J20201230",
                  applicant: "管理员",
                  applicantTime: "2018-06-12 08:49:01",
                  trainEndTime: "2018-06-12 10:49:01",
                  title: "杨幂女儿太厉害，才4岁就看纯英文动画片",
                  uuid: "bd85830e4a2c4ffaaa229ad76791adae",
                  trainContent: "杨幂女儿太厉害，才4岁就看纯英文动画片123",
                  itemName: 2,
                  status: 2,
                },
                {
                  codeId: "J20201230",
                  applicant: "管理员",
                  applicantTime: "2018-06-12 08:49:01",
                  trainEndTime: "2018-06-12 10:49:01",
                  title: "7步搞定4㎡卫生间装修，又省钱又上档次",
                  uuid: "93c3e68af6654bd5a3290a5b24751bbe",
                  trainContent: "7步搞定4㎡卫生间装修，又省钱又上档次123",
                  itemName: 0,
                  status: 1,
                },
              ],
              totalCount: 0,
              totalPage: 0,
            };
            return list;
          }
        );
      },
      key: 1,
      subVisible: false,
      SubLoadingUserPost: false,
      SubConfirmLoading: false,
      mdlUserPost: null,
      masterVisible: false,
      masterMdl: null,
      masterConfirmLoading: false,
      detailConfirmLoading: false,
      trainList: [
        {
          text: "礼仪",
          value: "礼仪",
        },
      ],
      masterSelectedRowKeys: [],
      masterRows: "",
      masterUuids: "",
      subSelectedRowKeys: [],
      subRows: "",
      subUUids: "",
      imgVisible: false,
      imgPreview: "",
      meetingState: [],
      visibleDetail: false,
      borrowVisible: false,
      borrowConfirmLoading: false,
      paymentVisible: false,
      paymentConfirmLoading: false,
      reimburseVisible: false,
      reimburseConfirmLoading: false,
    };
  },
  filters: {
    itemNameFilter(name) {
      const nameMap = {
        0: "借款",
        1: "报销",
        2: "付款",
      };
      return nameMap[name];
    },
    statusFilter(status) {
      const statusMap = {
        0: "未提交",
        1: "审批中",
        2: "已还款",
        3: "已批准",
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
    subRowSelection() {
      return {
        selectedRowKeys: this.subSelectedRowKeys,
        onChange: this.onSelectChangeSub,
      };
    },
  },
  mounted() {},
  methods: {
    handleBorrow() {
      this.borrowVisible = true;
      let form = {};
      form = this.$refs.borrowModal.form;
      form.resetFields(); // 清理表单数据（可不做）
    },
    handleBorrowCancel() {
      this.borrowVisible = false;
    },
    handlePayment() {
      this.paymentVisible = true;
      let form = {};
      form = this.$refs.paymentModal.form;
      form.resetFields(); // 清理表单数据（可不做）
    },
    handlePaymentCancel() {
      this.paymentVisible = false;
    },
    handleReimburse() {
      this.reimburseVisible = true;
      let form = {};
      form = this.$refs.reimburseModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.$refs.reimburseModal.add();
    },
    handleReimburseCancel() {
      this.reimburseVisible = false;
    },
    handleDetail(record) {
      this.masterMdl = record;
      if (record.itemName === 0) {
        this.borrowVisible = true;
        this.$refs.borrowModal.add(this.masterMdl);
      } else if (record.itemName === 1) {
        this.reimburseVisible = true;
        this.$refs.reimburseModal.add(this.masterMdl);
      } else if (record.itemName === 2) {
        this.paymentVisible = true;
        this.$refs.paymentModal.add(this.masterMdl);
      }
    },
    handleBack(record) {
      var that = this;
      that.$confirm({
        title: "警告",
        content: `是否取回此条数据`,
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          that.$message.error("取回数据失败");
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
    handleReturn(record) {
      var that = this;
      var tips = "";
      if (record) {
        tips = record.docTitle;
      } else {
        tips = "这条公文";
      }
      that.$confirm({
        title: "警告",
        content: `是否退回《` + tips + "》？",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          that.$message.error("退回数据失败");
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
    handleSign(record) {
      var that = this;
      var tips = "";
      if (record) {
        tips = record.docTitle;
      } else {
        tips = "这条公文";
      }
      that.$confirm({
        title: "警告",
        content: `是否签收《` + tips + "》？",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          that.$message.error("签收数据失败");
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
    handlePreview(record) {
      this.masterVisible = true;
    },
    changTabs(key) {
      var that = this;
      that.key = Number(key);
      that.$nextTick(() => {
        setTimeout(() => {
          if (that.key === 1 && that.$refs.masterList) {
            that.$refs.masterList.refresh(); // 设置刷新子表
          } else if (that.key === 2 && that.$refs.subList) {
            that.$refs.subList.refresh(); // 设置刷新子表
          }
        }, 10);
      });
    },
    rowClassName(row) {
      return row.uuid === this.masterUuids ? "bg-bray" : "";
    },
    subRowClassName(row) {
      return row.uuid === this.subUuids ? "bg-bray" : ""; // 每条数据的唯一识别值
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
        this.$refs.traineeList.refreshList(this.queryParamSub);
      }
    },
    subRowClick(record, index) {
      this.subRows = record;
      this.subUuids = record.uuid;
    },
    handleDetailCancel() {
      this.visibleDetail = false;
    },
    handleDetailOk() {
      this.visibleDetail = false;
    },
    handleBrowse(record) {
      this.visibleDetail = true;
      let form = {};
      form = this.$refs.detailModal.form;
      form.resetFields();
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
