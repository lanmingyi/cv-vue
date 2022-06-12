<template>
  <div class="container">
    <a-card :bordered="false">
      <!-- <div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
				<div class="table-operator">
					<a-button class="cu-btn-primary" icon="plus" @click="handleAddDoc()">新拟公文</a-button>
				</div>
			</div> -->
      <a-card :bordered="false">
        <a-tabs default-active-key="1" @change="changTabs">
          <a-tab-pane key="1" tab="公文发文"> </a-tab-pane>
          <a-tab-pane key="2" tab="待办公文"> </a-tab-pane>
          <a-tab-pane key="3" tab="待阅公文"> </a-tab-pane>
          <a-tab-pane key="4" tab="已阅办公文"> </a-tab-pane>
        </a-tabs>
      </a-card>
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
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="status" slot-scope="text">
          {{ text | statusFilter }}
        </span>
        <span slot="operate" slot-scope="text, record">
          <template>
            <a v-if="record.status === 0" @click="handlePreview(record, 2)"
              >编辑</a
            >
            <a v-if="record.status != 0" @click="handlePreview(record, 1)"
              >查看</a
            >
          </template>
        </span>
      </s-table>
      <edit-form
        ref="masterModal"
        :actType="actType"
        :visible="masterVisible"
        :loading="masterConfirmLoading"
        :model="masterMdl"
        @cancel="handleCancel('master')"
        @save="handleSave()"
        @sign="handleSign()"
      />
      <submit-form
        ref="submitModal"
        :visible="submitVisible"
        :loading="submitConfirmLoading"
        :model="masterMdl"
        @cancel="handleSubmitCancel()"
        @ok="handleSubmitOk()"
      />
    </a-card>
  </div>
</template>

<script>
import { baseUrl } from "@/services/baseUrl.js";
import { pdfStreamHandeler } from "@/services/common";
import { STable } from "@/components";
import { dataListMixin } from "@/mixins/dataListMixin";
import editForm from "./editDoc.vue";
import submitForm from "./editSubmit.vue";
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
    title: "公文标题",
    dataIndex: "docTitle",
    ellipsis: true,
  },
  {
    title: "主送",
    dataIndex: "lordSentName",
  },
  {
    title: "抄送",
    dataIndex: "copySentName",
  },
  {
    title: "协办部门",
    dataIndex: "transUnitName",
  },
  {
    title: "节点",
    dataIndex: "nowNode",
  },
  {
    title: "状态",
    dataIndex: "status",
    scopedSlots: {
      customRender: "status",
    },
  },
  {
    title: "操作",
    width: 100,
    dataIndex: "operate",
    align: "center",
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
    submitForm,
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
                  nameId: "code",
                  name: "管理员",
                  lordSentName: "管理员",
                  copySentName: "张三",
                  transUnitTime: "2018-06-12 10:49:01",
                  transUnitName: "国务院",
                  status: 1,
                  docTitle: "示例执行器",
                  uuid: "F9BF6730AC374624AAB327B49EBA7801",
                  trainContent: "示例执行器123",
                  postCode: "黔自然资规〔2020〕5号",
                  nowNode: "副处审核",
                },
                {
                  nameId: "code",
                  name: "管理员",
                  lordSentName: "管理员",
                  copySentName: "张三",
                  transUnitTime: "2018-06-12 10:49:01",
                  transUnitName: "国务院",
                  status: 0,
                  docTitle: "示例执行器",
                  uuid: "F9BF6730AC374624AAB327B49EBA7802",
                  trainContent: "示例执行器123",
                  postCode: "黔自然资规〔2020〕5号",
                  nowNode: "初始拟稿",
                },
                {
                  nameId: "code",
                  name: "管理员",
                  lordSentName: "管理员",
                  copySentName: "张三",
                  transUnitTime: "2018-06-12 10:49:01",
                  transUnitName: "国务院",
                  status: 1,
                  docTitle: "示例执行器",
                  uuid: "F9BF6730AC374624AAB327B49EBA7800",
                  trainContent: "示例执行器123",
                  postCode: "黔自然资规〔2020〕5号",
                  nowNode: "处长审核",
                },
                {
                  nameId: "code",
                  name: "管理员",
                  lordSentName: "管理员",
                  copySentName: "张三",
                  transUnitTime: "2018-06-12 10:49:01",
                  transUnitName: "国务院",
                  status: 2,
                  docTitle: "示例执行器",
                  uuid: "F9BF6730AC374624AAB327B49EBA7805",
                  trainContent: "示例执行器123",
                  postCode: "黔自然资规〔2020〕5号",
                  nowNode: "局长批示",
                },
              ],
              totalCount: 1,
              totalPage: 1,
            };
            return list;
          }
        );
      },
      key: 1,
      mdlUserPost: null,
      masterVisible: false,
      masterMdl: {
        paymentReason: "测试标题",
        paymentUnit: "12",
        paymentName: "管理员",
        agentName: "同意",
        finaAudit: "同意",
      },
      masterConfirmLoading: false,
      masterSelectedRowKeys: [],
      masterRows: "",
      masterUuids: "",
      submitVisible: false,
      submitConfirmLoading: false,
      actType: 2,
    };
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: "拟稿中",
        1: "待审核",
        2: "待批示",
        3: "已批示",
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
    handleAddDoc() {
      this.masterVisible = true;
    },
    handleSave(record) {
      var that = this;
      var tips = "";
      if (record) {
        tips = record.docTitle;
      } else {
        tips = "这条公文";
      }
      that.$confirm({
        title: "警告",
        content: `是否保存` + tips + "？",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          that.$message.error("保存数据失败");
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
    handleSubmitCancel() {
      this.submitVisible = false;
    },
    handleSubmitOk() {
      this.submitVisible = false;
    },
    handleSign(record) {
      this.submitVisible = true;
      // var that = this
      // var tips = ''
      // if(record){
      // 	tips = record.docTitle
      // }else{
      // 	tips = '这条公文'
      // }
      // that.$confirm({
      // 	title: '警告',
      // 	content: `是否提交` + tips + '？',
      // 	okText: '确定',
      // 	okType: 'danger',
      // 	cancelText: '取消',
      // 	onOk() {
      // 		that.$message.error('提交数据失败')
      // 	},
      // 	onCancel() {
      // 		console.log('Cancel')
      // 	}
      // })
    },
    handlePreview(record, type) {
      this.masterVisible = true;
      this.actType = type;
      this.$refs.masterModal.accessoryList();
    },
    changTabs(key) {
      var that = this;
      that.key = Number(key);
      // that.$nextTick(() => {
      // 	setTimeout(() => {
      // 		if (that.key === 1 && that.$refs.masterList) {
      // 			that.$refs.masterList.refresh() // 设置刷新子表
      // 		} else if (that.key === 2 && that.$refs.subList) {
      // 			that.$refs.subList.refresh() // 设置刷新子表
      // 		}
      // 	}, 10)
      // })
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
        this.$refs.traineeList.refreshList(this.queryParamSub);
      }
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
