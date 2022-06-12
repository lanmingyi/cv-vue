<template>
  <div class="container">
    <a-card :bordered="false">
      <div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
        <div class="table-operator">
          <a-button class="cu-btn-primary" icon="plus" @click="handleAdd()"
            >新建</a-button
          >
          <a-button
            class="cu-btn-danger"
            icon="delete"
            @click="handleSub('all')"
            >删除</a-button
          >
        </div>
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <div class="flex justify-between flex-wrap">
              <a-form-item label="">
                <a-input v-model="queryParam.title" placeholder="标题" />
              </a-form-item>
              <a-form-item label="">
                <t-date
                  v-model="queryParam.date"
                  placeholder="发布时间"
                  dateFormat="YYYY-MM-DD"
                  allowClear
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
        <span slot="operate" slot-scope="operate, record">
          <template>
            <span v-if="record.state === '待发布'">
              <a @click="handleEdit(record, 'master')">编辑</a>
            </span>
            <span v-if="record.state === '已发布'">
              <a @click="handleDetail(record)">详情</a>
              <a-divider type="vertical" />
              <a @click="handleCheck(record)">查阅记录</a>
            </span>
          </template>
        </span>
      </s-table>
      <a-card :bordered="false">
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" tab="附件信息">
            <accessory-info
              ref="accessoryModal"
              :url="urlFile"
              tag="fdsFile"
              label="fds"
              :params="queryParamSub"
              :model="mdl"
            />
          </a-tab-pane>
        </a-tabs>
      </a-card>
      <edit-form
        ref="createModal"
        :visible="visible"
        :loading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel()"
        @ok="handleOk('yes')"
        @save="handleOk('no')"
      />
      <detail-form
        ref="detailModal"
        @cancel="handleCancelDetail()"
        :visible="visibleDetail"
      />
      <post-form
        ref="postModal"
        :visible="postVisible"
        :loading="postConfirmLoading"
        :model="mdl"
        :title="actTitle"
        @cancel="handlePostCancel"
        @ok="handlePostOk"
      />
    </a-card>
  </div>
</template>

<script>
import { STable } from "@/components";
import { simpleListMixin } from "@/mixins/simpleListMixin";
import editForm from "../noticeOn/edit.vue";
import detailForm from "../noticeOn/detail.vue";
import postForm from "../noticeOn/broRecord.vue";
import accessoryInfo from "@/components/TopVUI/accessory/index";

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
    title: "标题",
    dataIndex: "title",
    ellipsis: true,
  },
  {
    title: "发布部门",
    dataIndex: "publishingDepartmentName",
    ellipsis: true,
  },
  {
    title: "发布时间",
    dataIndex: "createTime",
    ellipsis: true,
  },
  {
    title: "发布状态",
    dataIndex: "state",
    ellipsis: true,
  },
  {
    title: "操作",
    dataIndex: "operate",
    width: 150,
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
    accessoryInfo,
    detailForm,
    postForm,
  },
  data() {
    this.columns = columns;
    return {
      queryParam: {},
      queryParamSub: {},
      queryParamTrainee: {},
      url: {
        getPageSet: "/office/officePublicAnnouncement/getPageSetPublic",
        save: "/office/officePublicAnnouncement/savePublic",
        update: "/office/officePublicAnnouncement/update",
        deleteBatch: "/office/officePublicAnnouncement/deleteBatch",
      },
      urlFile: {
        webUpload: "/document/fdfs/upload",
        getPageSet: "/document/fastdfs/getPageSet",
        deleteBatch: "/document/fdfs/delete",
        update: "/document/fastdfs/update",
        getPageSet: "/document/fastdfs/getPageSet",
      },
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        return this.$post(this.url.getPageSet, requestParameters).then(
          (res) => {
            return res;
          }
        );
      },
      key: 1,
      mdlUserPost: null,
      visible: false,
      mdl: null,
      confirmLoading: false,
      selectedRowKeys: [],
      rows: "",
      masterUuids: "",
      visibleDetail: false,
      actTitle: "",
      postVisible: false,
      postConfirmLoading: false,
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
        0: "待发布",
        1: "已发布",
      };
      return statusMap[status];
    },
  },
  mounted() {},
  methods: {
    rowClassName(row) {
      return row.uuid === this.masterUuids ? "bg-bray" : "";
    },
    masterRowClick(record, index) {
      this.rows = record;
      this.masterUuids = record.uuid;
      this.queryParamSub.puuid = record.uuid;
      if (this.key === 1 && this.$refs.accessoryModal) {
        this.$refs.accessoryModal.refreshList(this.queryParamSub);
      }
    },
    handleCheck(record) {
      this.actTitle = record.title;
      this.mdl = record;
      this.postVisible = true;
      this.$refs.postModal.edit(record);
    },
    handlePostCancel() {
      this.postVisible = false;
    },
    handlePostOk() {
      this.postVisible = false;
    },
    handleDetail(record) {
      this.visibleDetail = true;
      this.$refs.detailModal.onLoadData(record);
    },
    handleCancelDetail() {
      this.visibleDetail = false;
    },
    refreshOnload() {
      this.$refs.accessoryModal.refreshList({});
    },
    resetForm() {
      this.$refs.table.refresh();
      this.queryParamSub = {};
      this.$refs.accessoryModal.refreshList(this.queryParamSub);
    },
    resetSearchForm() {
      this.queryParam = {};
      this.$refs.table.refresh();
      this.queryParamSub = {};
      this.$refs.accessoryModal.refreshList(this.queryParamSub);
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
