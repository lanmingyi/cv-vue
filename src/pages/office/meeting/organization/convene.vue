<template>
  <div class="container">
    <a-card :bordered="false">
      <div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
        <!-- <div class="table-operator">
					<a-button class="cu-btn-primary" icon="plus" @click="handleAdd('master')">新建</a-button>
					<a-button class="cu-btn-default"
            icon="edit" @click="handleEdit('all','master')">编辑</a-button>
					<a-button class="cu-btn-danger" icon="delete" @click="handleSub('all','master')">删除</a-button>
				</div> -->
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <div class="flex justify-between flex-wrap">
              <a-form-item label="">
                <a-input v-model="queryParam.title" placeholder="会议名称" />
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
        :scroll="{ x: 1200, y: 400 }"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="status" slot-scope="text, record, index">
          {{ text | statusFilter }}
        </span>
        <span slot="operate" slot-scope="operate, record">
          <template v-if="record.status === 0">
            <a @click="handleCon(record)">召开</a>
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
// import editForm from './edit.vue'
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
    title: "会议名称",
    dataIndex: "applyName",
    ellipsis: true,
  },
  {
    title: "会议类型",
    dataIndex: "agentName",
  },
  {
    title: "会议地点",
    dataIndex: "applyReason",
    ellipsis: true,
  },
  {
    title: "会议时间",
    dataIndex: "applyUnit",
    ellipsis: true,
  },
  {
    title: "主持人",
    dataIndex: "receiveTime",
  },
  {
    title: "申请时间",
    dataIndex: "time",
    ellipsis: true,
  },
  {
    title: "状态",
    dataIndex: "state",
    scopedSlots: {
      customRender: "state",
    },
  },
  {
    title: "操作",
    dataIndex: "operate",
    fixed: "right",
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
                  codeId: "J20201230",
                  agentName: "管理员",
                  receiveTime: "2018-06-12 08:49:01",
                  trainEndTime: "2018-06-12 10:49:01",
                  applyName: "示例执行器",
                  uuid: "F9BF6730AC374624AAB327B49EBA7807",
                  trainContent: "示例执行器123",
                  itemName: 1,
                  status: 1,
                  applyUnit: "财务部",
                  applyItems: "买电脑",
                },
                {
                  codeId: "J20201230",
                  agentName: "管理员",
                  receiveTime: "2018-06-12 08:49:01",
                  trainEndTime: "2018-06-12 10:49:01",
                  applyName: "赵丽颖黑超遮面气场全开，高铁商务舱中狂凹造型",
                  uuid: "97c3c7800c254e38955603206ba1285d",
                  trainContent:
                    "赵丽颖黑超遮面气场全开，高铁商务舱中狂凹造型123",
                  itemName: 0,
                  status: 0,
                  applyUnit: "财务部",
                  applyItems: "买电脑",
                },
                {
                  codeId: "J20201230",
                  agentName: "管理员",
                  receiveTime: "2018-06-12 08:49:01",
                  trainEndTime: "2018-06-12 10:49:01",
                  applyName: "杨幂女儿太厉害，才4岁就看纯英文动画片",
                  uuid: "bd85830e4a2c4ffaaa229ad76791adae",
                  trainContent: "杨幂女儿太厉害，才4岁就看纯英文动画片123",
                  itemName: 2,
                  status: 0,
                  applyUnit: "财务部",
                  applyItems: "买电脑",
                },
                {
                  codeId: "J20201230",
                  agentName: "管理员",
                  receiveTime: "2018-06-12 08:49:01",
                  trainEndTime: "2018-06-12 10:49:01",
                  applyName: "7步搞定4㎡卫生间装修，又省钱又上档次",
                  uuid: "93c3e68af6654bd5a3290a5b24751bbe",
                  trainContent: "7步搞定4㎡卫生间装修，又省钱又上档次123",
                  itemName: 0,
                  status: 1,
                  applyUnit: "财务部",
                  applyItems: "买电脑",
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
      borrowVisible: false,
      borrowConfirmLoading: false,
      paymentVisible: false,
      paymentConfirmLoading: false,
      reimburseVisible: false,
      reimburseConfirmLoading: false,
    };
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: "未开始",
        1: "开会中",
        1: "已召开",
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
    handleCon(record) {
      var that = this;
      that.$confirm({
        title: "警告",
        content: `会议到点后自动召开，确定要现在召开吗？`,
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          that.$message.error("召开会议失败");
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
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
    handleAgree(record) {
      var that = this;
      that.$confirm({
        title: "警告",
        content: `是否同意此条数据`,
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          that.$message.error("同意数据失败");
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
    handleReject(record) {
      var that = this;
      that.$confirm({
        title: "警告",
        content: `是否驳回此条数据`,
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          that.$message.error("驳回数据失败");
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
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
