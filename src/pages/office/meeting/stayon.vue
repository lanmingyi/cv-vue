<template>
  <div class="container">
    <a-card :bordered="false">
      <div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
        <div class="table-operator"></div>
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <div class="flex justify-between flex-wrap">
              <a-form-item label="">
                <a-input
                  v-model="queryParam.mettingName"
                  placeholder="议会名称"
                />
              </a-form-item>
              <a-form-item label="">
                <a-select
                  v-model="queryParam.mettingType"
                  placeholder="议会类型"
                  style="width: 200px;"
                >
                  <a-select-option
                    v-for="(item, index) in typeList"
                    :key="index"
                    :value="item.value"
                  >
                    {{ item.text }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="">
                <a-input
                  v-model="queryParam.applicationDepartmentName"
                  placeholder="议会单位"
                />
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
      >
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="startTime" slot-scope="text, record">
          {{ moment(record.startTime).format("yyyy-MM-DD HH:mm") }}
          -
          {{ moment(record.endTime).format("yyyy-MM-DD HH:mm") }}
        </span>
        <span slot="status" slot-scope="text">
          {{ text | statusFilter }}
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="handleSub(record)">移除</a>
          </template>
        </span>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { STable } from "@/components";
import { simpleListMixin } from "@/mixins/simpleListMixin";
import moment from "moment";
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
    dataIndex: "nameOfProposedMeeting",
    ellipsis: true,
  },
  {
    title: "会议地点",
    dataIndex: "conferenceRoomName",
    ellipsis: true,
  },
  {
    title: "会议负责单位",
    dataIndex: "applicationDepartmentName",
    ellipsis: true,
  },
  {
    title: "会议类型",
    dataIndex: "typees",
    width: 100,
  },
  {
    title: "开会时间",
    dataIndex: "startTime",
    width: 300,
    ellipsis: true,
    scopedSlots: {
      customRender: "startTime",
    },
  },
  {
    title: "主持人",
    dataIndex: "hostess",
  },
  // {
  // 	title: '暂停原因',
  // 	dataIndex: 'reasonsSuspension',
  // 	ellipsis: true,
  // },
  // {
  // 	title: '操作',
  // 	dataIndex: 'action',
  // 	width: 100,
  // 	scopedSlots: {
  // 		customRender: 'action'
  // 	}
  // }
];
export default {
  name: "TableList",
  mixins: [simpleListMixin],
  components: {
    STable,
  },
  data() {
    this.columns = columns;
    return {
      queryParam: {},
      url: {
        // getPageSet: '/office/oaMeetingMeeting/getPageSet',
        getPageSet: "/office/oaMeetingApplication/getPageSet",
        getDicItemByCode: "/system/dicSet/getDicItemByCode",
      },
      loadData: (parameter) => {
        this.queryParam.type = "toBeMet";
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        return this.$post(this.url.getPageSet, requestParameters).then(
          (res) => {
            return res;
          }
        );
      },
      mdl: null,
      selectedRowKeys: [],
      rows: "",
      masterUuids: "",
      meetingList: [],
      typeList: [],
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
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: "待登记",
        2: "已登记",
      };
      return statusMap[status];
    },
  },
  mounted() {
    this.getCodeList();
  },
  methods: {
    moment,
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
    getCodeList() {
      // 获取会议类型
      this.$post(this.url.getDicItemByCode, {
        code: "meetingsType",
      }).then((res) => {
        if (res.statusCode !== 300) {
          this.typeList = res;
        }
      });
    },
  },
};
</script>

<style lang="less"></style>
