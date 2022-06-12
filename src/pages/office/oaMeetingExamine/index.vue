<template>
  <div class="container">
    <a-card :bordered="false">
      <div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
        <div class="table-operator">
          <a-button
            class="cu-btn-default"
            icon="edit"
            @click="handleApproEdit()"
            >审批会议</a-button
          >
          <!-- <a-button class="cu-btn-danger" icon="delete" @click="handleSub('all','master')">删除</a-button> -->
        </div>
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <div class="flex justify-between flex-wrap">
              <a-form-item label="">
                <a-select
                  v-model="queryParam.state"
                  placeholder="申请状态"
                  style="width:200px;"
                >
                  <a-select-option
                    v-for="(item, index) in meetingState"
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
        :pageSize="10"
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
      </s-table>
      <edit-form
        ref="masterModal"
        :visible="masterVisible"
        :loading="masterConfirmLoading"
        :model="masterMdl"
        :typeList="typeList"
        :meetingList="meetingList"
        @cancel="handleCancel('master')"
        @ok="handleExamineOk"
      />
    </a-card>
  </div>
</template>

<script>
import { getJsonData } from "@/services/common";
import { STable } from "@/components";
import { dataListMixin } from "@/mixins/dataListMixin";
import editForm from "./edit.vue";
const columns = [
  {
    title: "#",
    width: 50,
    align: "center",
    scopedSlots: { customRender: "serial" },
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
  },
  {
    title: "会议名称",
    dataIndex: "exaName",
  },
  {
    title: "申请人",
    dataIndex: "creator",
  },
  {
    title: "申请时间",
    dataIndex: "applicationTime",
  },
  {
    title: "审批人",
    dataIndex: "approvingOfficerUserId",
  },
  {
    title: "审批时间",
    dataIndex: "approvalTime",
  },
  {
    title: "申请状态",
    dataIndex: "aexaState",
    scopedSlots: { customRender: "aexaState" },
  },
  {
    title: "备注",
    dataIndex: "remarks",
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
        getPageSet: "/office/oaMeetingExamine/getPageSet",
        masterAdd: "/office/oaMeetingroomBase/save",
        masterUpdate: "/office/oaMeetingroomBase/update",
        masterDelete: "/office/oaMeetingroomBase/task",
        getDetailBystae: "/office/oaMeetingroomBase/getDetailBystae",
        updateStarteReject: "/office/oaMeetingExamine/updateStarteReject", // 驳回
        update: "/office/oaMeetingExamine/update", // 同意
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
      masterConfirmLoading: false,
      masterVisible: false,
      masterMdl: null,
      meetingList: [],
      typeList: [],
      masterSelectedRowKeys: [],
      masterRows: "",
      masterUuids: "",
      meetingState: [],
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
    handleApproEdit() {
      console.log("this.masterRows", this.masterRows);
      if (this.masterRows) {
        if (this.masterRows.exaState === "meeting.examineAndApprove01") {
          this.$message.info("请选择未处理的会议数据");
        } else {
          this.handleEdit("all", "master");
        }
      } else {
        this.$message.info("请选择需处理的会议数据");
      }
    },
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
    handleExamineOk(type) {
      let form = {};
      form = this.$refs.masterModal.form;
      this.masterConfirmLoading = true;
      form.validateFields((errors, values) => {
        let fileData = {};
        if (type === "agree") {
          fileData = {
            frompostoaMeeting: JSON.stringify(values),
          };
        } else {
          fileData = {
            a: JSON.stringify(values),
          };
        }
        console.log("values", type, values, fileData);
        if (!errors) {
          if (type === "agree") {
            // 同意
            this.$post(this.url.update, fileData).then((res) => {
              if (res === 1 || res.statusCode === 200) {
                this.masterVisible = false;
                this.$message.info("已同意");
              } else {
                this.$message.error(res.message);
              }
              this.$refs.masterList.refresh();
            });
          } else {
            // 驳回
            this.$post(this.url.updateStarteReject, fileData).then((res) => {
              if (res === 1 || res.statusCode === 200) {
                this.masterVisible = false;
                this.$message.info("已驳回");
              } else {
                this.$message.error(res.message);
              }
              // 刷新表格
              this.$refs.masterList.refresh();
            });
          }
          this.masterConfirmLoading = false;
        } else {
          this.masterConfirmLoading = false;
        }
      });
    },
    getCodeList() {
      // 获取会议类型
      this.$post(this.url.getDicItemByCode, {
        code: "meetingsType",
      }).then((res) => {
        if (res.statusCode !== 300) {
          this.typeList = res;
        }
      });
      // 申请状态
      this.$post(this.url.getDicItemByCode, {
        code: "meetingApplication",
      }).then((res) => {
        if (res.statusCode !== 300) {
          this.meetingState = res;
        }
      });
      // 获取会议室
      this.$post(this.url.getDetailBystae).then((res) => {
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
