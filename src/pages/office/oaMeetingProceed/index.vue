<template>
  <div class="container">
    <a-card :bordered="false">
      <div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
        <div class="table-operator">
          <a-button
            class="cu-btn-default"
            icon="edit"
            @click="handleEdit('all', 'master')"
            >编辑</a-button
          >
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleSub('all', 'master')"
            >删除</a-button
          >
        </div>
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <div class="flex justify-between flex-wrap">
              <a-form-item label="">
                <a-input v-model="queryParam.name" placeholder="会议名称" />
              </a-form-item>
              <a-form-item label="">
                <a-select
                  v-model="queryParam.type"
                  placeholder="会议状态"
                  style="width:200px;"
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
        <span slot="operate" slot-scope="operate, record">
          <template>
            <a @click="handleDetail(record)">详情</a>
          </template>
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
        @ok="handleJsonOk('master')"
      />
      <detail-form
        ref="detailModal"
        @cancel="
          () => {
            visibleDetail = false;
          }
        "
        :visible="visibleDetail"
      />
    </a-card>
  </div>
</template>

<script>
import { STable, Ellipsis } from "@/components";
import { dataListMixin } from "@/mixins/dataListMixin";
import editForm from "./edit.vue";
import detailForm from "./detail.vue";
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
    dataIndex: "name",
  },
  {
    title: "会议类型",
    dataIndex: "type",
  },
  {
    title: "会议室",
    dataIndex: "meetingRoom",
  },
  {
    title: "主办人",
    dataIndex: "creator",
  },
  {
    title: "审批人",
    dataIndex: "participants",
  },
  {
    title: "状态",
    dataIndex: "state",
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
    detailForm,
  },
  data() {
    this.columns = columns;
    return {
      queryParam: {},
      queryParamSub: {},
      url: {
        getPageSet: "/office/oaMeetingsBase/MeetProceed",
        masterAdd: "/office/oaMeetingroomBase/save",
        masterUpdate: "/office/oaMeetingroomBase/update",
        masterDelete: "/office/oaMeetingsBase/deleteBatch",
        getDetailByUuid: "/system/attachment/getListByPuuid",
        getDetailBystae: "/office/oaMeetingroomBase/getDetailBystae",
        jsonUpdate: "/office/oaMeetingsBase/updateSate",
        jsonSave: "/office/oaMeetingsBase/save",
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
      visibleDetail: false,
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
    rowClassName(row) {
      return row.uuid === this.masterUuids ? "bg-bray" : ""; // 每条数据的唯一识别值
    },
    subRowClick(record, index) {
      this.masterRows = record;
      this.masterUuids = record.uuid;
    },
    handleDetail(record) {
      this.visibleDetail = true;
      this.$refs.detailModal.onLoadData(record);
    },
    resetForm() {
      this.$refs.masterList.refresh();
    },
    resetSearchForm() {
      this.queryParam = {};
      this.$refs.masterList.refresh();
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
