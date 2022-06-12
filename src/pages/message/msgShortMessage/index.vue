<template>
  <div class="page-common-layout">
    <div class="page-common-content">
      <tool-bar
        @search="$refs.masterList.refresh(true)"
        @reset="
          () => {
            (masterQueryParam = {}), $refs.masterList.refresh(true);
          }
        "
      >
        <template slot="toolBtn" slot-scope="scope">
          <a-button
            class="cu-btn-primary"
            icon="plus"
            @click="handleAdd('master')"
            v-action:msgShortMessageSendTemplate
            >发送模板</a-button
          >
          <a-button
            class="cu-btn-default"
            icon="edit"
            @click="handleAddCode()"
            v-action:msgShortMessageSendCode
            >发送验证码</a-button
          >
        </template>
        <template slot="toolForm">
          <a-form-item label="">
            <a-input
              v-model="masterQueryParam.phoneNumber"
              placeholder="手机号码"
            />
          </a-form-item>
        </template>
      </tool-bar>

      <data-grid
        ref="masterList"
        type="master"
        :columns="masterColumns"
        :url="url"
        bordered
        :queryParam="masterQueryParam"
        rowKey="uuid"
        showPagination="auto"
      >
        <span slot="aliSendStatus" slot-scope="{ text }">
          {{ text | aliSendStatusFilter }}
        </span>
        <span slot="aliContent" slot-scope="{ text }">
          <!-- <a-tooltip>
						<template slot="title">
							{{ text }}
						</template>
						<ellipsis :length="42" style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{
							text
						}}</ellipsis>
					</a-tooltip> -->
          <t-ellipsis :value="text" :length="40"> </t-ellipsis>
        </span>
      </data-grid>
      <master-form
        ref="masterModal"
        :visible="masterVisible"
        :loading="masterConfirmLoading"
        :model="masterMdl"
        @cancel="handleCancel('master')"
        @ok="handleOk('master')"
      />
      <sub-form
        ref="subModal"
        :visible.sync="subVisible"
        :loading="subConfirmLoading"
        :model="subMdl"
        @ok="handleSendCode()"
      />
    </div>
  </div>
</template>

<script>
import { masterTableMixin } from "@/mixins/masterTableMixin";
import { DataGrid, Ellipsis } from "@/components";
import masterForm from "./masterEdit.vue";
import subForm from "./subEdit.vue";
export default {
  name: "TableList",
  mixins: [masterTableMixin],
  components: {
    DataGrid,
    Ellipsis,
    masterForm,
    subForm,
  },
  data() {
    return {
      masterColumns: [
        {
          title: "接受手机号码",
          dataIndex: "phoneNumber",
          width: 120,
          sorter: false,
        },
        {
          title: "发送状态",
          dataIndex: "aliSendStatus",
          scopedSlots: { customRender: "aliSendStatus" },
          width: 80,
          sorter: false,
        },
        {
          title: "短信内容",
          dataIndex: "aliContent",
          scopedSlots: { customRender: "aliContent" },
          width: 300,
          sorter: false,
        },
        {
          title: "请求状态码",
          dataIndex: "aliCode",
          width: 100,
          sorter: false,
        },
        {
          title: "反馈的消息",
          dataIndex: "aliMessage",
          width: 100,
          sorter: false,
        },
        {
          title: "发送日期",
          dataIndex: "aliSendDate",
          width: 150,
          sorter: false,
        },
        {
          title: "接收日期",
          dataIndex: "aliReceiveDate",
          width: 150,
          sorter: false,
        },
      ],
      // create model
      masterVisible: false,
      masterConfirmLoading: false,
      masterMdl: null,
      subVisible: false,
      subConfirmLoading: false,
      subMdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      masterQueryParam: {},
      masterSelectedRowKeys: [],
      masterSelectedRows: [],
      masterUuids: "",
      masterRows: "",
      uuids: "",
      url: {
        masterList: "/message/msgShortMessage/getPageSet",
        masterAdd: "/message/msgShortMessage/sendSms",
        subAdd: "/message/msgShortMessage/sendSmsCode",
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
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
  filters: {
    aliSendStatusFilter(val) {
      const aliSendStatusMap = {
        1: "等待回执",
        2: "发送失败",
        3: "发送成功",
      };
      return aliSendStatusMap[val];
    },
  },
  methods: {
    rowClassName(row) {
      return row.uuid === this.uuids ? "bg-bray" : ""; // 每条数据的唯一识别值
    },
    handleSendCode() {
      let form = {};
      form = this.$refs.subModal.form;
      this.subConfirmLoading = true;
      form.validateFields((errors, values) => {
        if (!errors) {
          // 新增
          this.$post(this.url.subAdd, values).then((res) => {
            if (res === 1 || res.statusCode === 200) {
              this.subVisible = false;
              // 刷新表格
              this.$refs.masterList.refresh();
              this.$message.success(res.message, 1.5);
            } else {
              this.$message.error(res.message, 1.5);
            }
          });
          this.subConfirmLoading = false;
        } else {
          this.subConfirmLoading = false;
        }
      });
    },
    resetForm() {
      this.masterQueryParam = {};
      this.$refs.masterList.refresh();
    },
    handleAddCode() {
      const form = this.$refs.subModal.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.subVisible = true;
    },
  },
};
</script>

<style lang="less" scoped="scoped">
// /deep/ .table-operator{
// 	display: flex;
// 	width: 100%;
// 	justify-content: space-between;
// }
</style>
