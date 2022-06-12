<template>
  <div class="container">
    <a-card :bordered="false">
      <div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
        <div class="table-operator"></div>
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <div class="flex justify-between flex-wrap">
              <a-form-item label="">
                <a-input v-model="queryParam.name" placeholder="会议室名称" />
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
        <span slot="reserveDate" slot-scope="text, record, index">
          {{ text }} {{ record.startTime }} - {{ record.endTime }}
        </span>
        <span slot="state" slot-scope="text, record, index">
          {{ text | statusFilter }}
        </span>
        <span slot="operate" slot-scope="operate, record">
          <template
            v-if="
              record.stateText === '申请中' || record.stateText === '调换申请中'
            "
          >
            <a @click="handleChange(record, 'yes')">同意</a>
            <a-divider type="vertical" />
            <a @click="handleChange(record, 'no')">驳回</a>
          </template>
        </span>
      </s-table>
      <edit-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :meetingList="meetingList"
        :model="mdl"
        @cancel="handleCancel()"
        @ok="handleOk()"
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
    title: "议题",
    dataIndex: "topics",
  },
  {
    title: "会议室名称",
    dataIndex: "conferenceRoomName",
  },
  {
    title: "会议室地点",
    dataIndex: "address",
  },
  {
    title: "参会人数",
    dataIndex: "attendNumberOfPeople",
    width: 100,
  },
  {
    title: "使用时间",
    dataIndex: "reserveDate",
    width: 200,
    ellipsis: true,
    scopedSlots: {
      customRender: "reserveDate",
    },
  },
  {
    title: "状态",
    dataIndex: "stateText",
    width: 80,
    // scopedSlots: {
    // 	customRender: 'status'
    // }
  },
  {
    title: "操作",
    dataIndex: "operate",
    width: 150,
    fixed: "right",
    scopedSlots: {
      customRender: "operate",
    },
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
      queryParamSub: {},
      url: {
        getPageSet: "/office/oaConferenceRoomReserve/getPageSet",
        save: "/office/oaConferenceRoomReserve/save",
        update: "/office/oaConferenceRoomReserve/update",
        deleteBatch: "/office/oaConferenceRoomReserve/deleteBatch",
        getListByPid: "/mdata/organization/getListByPid?pid=2",
        getMeetingRoom: "/office/officeConferenceRoom/getMettingRoomAddress",
        getUpdataData: "/office/oaConferenceRoomReserve/reserverOperation",
      },
      loadData: (parameter) => {
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
      meetingList: [],
    };
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: "空闲",
        1: "使用中",
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
    this.getCodeData();
  },
  methods: {
    rowClassName(row) {
      return row.uuid === this.masterUuids ? "bg-bray" : "";
    },
    masterRowClick(record, index) {
      this.rows = record;
      this.masterUuids = record.uuid;
    },
    handleChange(record, type) {
      var that = this;
      var tips = type === "yes" ? "同意" : "驳回";
      var state = "";
      if (record.state === "调换申请中") {
        state = "switchApply";
      } else {
        state = type === "yes" ? "agree" : "reject";
      }
      that.$confirm({
        title: "警告",
        content: "是否" + tips + "此条数据申请？",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          that
            .$post(that.url.getUpdataData, {
              uuid: record.uuid,
              isRelease: state,
            })
            .then((res) => {
              if (res === 1 || res.statusCode === 200) {
                that.$refs.table.refresh();
                that.$message.success(res.message ? res.message : "操作成功");
              } else {
                that.$message.error(res.message);
              }
            });
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
    resetForm() {
      this.$refs.table.refresh();
    },
    resetSearchForm() {
      this.queryParam = {};
      this.$refs.table.refresh();
    },
    getCodeData() {
      // 获取会议室
      this.$post(this.url.getMeetingRoom).then((res) => {
        if (res.statusCode !== 300) {
          this.meetingList = res;
        }
      });
    },
  },
};
</script>

<style lang="less"></style>
