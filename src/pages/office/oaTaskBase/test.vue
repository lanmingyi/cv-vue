<template>
  <a-card :bordered="false">
    <a-layout>
      <a-layout-sider width="300" style="background: #fff;">
        <div
          class="toolbar flex justify-between flex-wrap"
          style="width: 100%;"
        >
          <div class="table-operator">
            <!-- <a-button class="cu-btn-default"
            icon="edit" @click="handleEdit('all',$refs.masterList.getListData())">编辑</a-button> -->
            <a-button
              class="cu-btn-danger"
              icon="delete"
              @click="handleSub('all')"
              >删除</a-button
            >
          </div>
        </div>
        <tree-grid
          ref="masterList"
          :columns="columns"
          rowKey="uuid"
          :url="url"
          :parameter="parameter"
          :pagination="pagination"
          @onSelectChange="onSelectChangeMaster"
          @rowClick="masterRowClick"
          @getData="getTreeData"
        >
          <span slot="priority" slot-scope="{ text }">
            <a-tag color="pink" v-if="text == 1">
              {{ text | priorityFilter }}
            </a-tag>
            <a-tag color="orange" v-if="text == 2">
              {{ text | priorityFilter }}
            </a-tag>
            <a-tag color="green" v-if="text == 3">
              {{ text | priorityFilter }}
            </a-tag>
          </span>
          <span slot="status" slot-scope="{ text }">
            <a-tag color="pink" v-if="text == 0">
              {{ text | statusFilter }}
            </a-tag>
            <a-tag color="green" v-if="text == 1">
              {{ text | statusFilter }}
            </a-tag>
            <a-tag color="blue" v-if="text == 2">
              {{ text | statusFilter }}
            </a-tag>
          </span>
        </tree-grid>
      </a-layout-sider>
      <a-layout-content style="background: #fff;padding-left: 40px;">
        <a-card title="任务详情">
          <a slot="extra" href="#">
            <a-button class="cu-btn-default" icon="edit" @click="handleOk"
              >完成任务</a-button
            >
            <a-button class="cu-btn-default" icon="edit" @click="handleOk"
              >更新</a-button
            >
          </a>
          <detail-form
            actType="view"
            ref="masterModal"
            :model="masterRows ? masterRows : {}"
            :paramList="queryParamTaskProblem"
            :fileUrl="urlFile"
          />
        </a-card>
      </a-layout-content>
    </a-layout>
    <!-- <edit-form ref="masterModal" :type="key" :visible="masterVisible" :loading="masterConfirmLoading" :model="masterMdl" @cancel="handleCancel" @ok="handleOk" /> -->
  </a-card>
</template>

<script>
import TreeGrid from "@/components/TopVUI/custom/TreeGrid";
import { dataTreeMixin } from "@/mixins/dataTreeMixin";
import detailForm from "./oaTaskBaseDetail.vue";
import editForm from "./edit.vue";

const columns = [
  {
    title: "任务标题",
    dataIndex: "title",
    width: 200,
    ellipsis: true,
    sorter: true,
  },
  // {
  // 	title: '指派人',
  // 	dataIndex: 'assigner',
  // 	sorter: true,
  // 	ellipsis: true,
  // },
  // {
  // 	title: '优先级',
  // 	dataIndex: 'priority',
  // 	sorter: true,
  // 	ellipsis: true,
  // 	scopedSlots: {
  // 		customRender: 'priority'
  // 	},
  // }
];
export default {
  name: "TableList",
  mixins: [dataTreeMixin],
  components: {
    editForm,
    detailForm,
    TreeGrid,
  },
  data() {
    this.columns = columns;
    return {
      visibleDetail: false,
      tabKey: 1,
      key: "0",
      masterConfirmLoading: false,
      masterVisible: false,
      masterMdl: null,
      masterRows: null,
      masterSelectedRowKeys: [],
      masterSelectedRows: [],
      data: [],
      queryParam: {},
      queryParamList: {},
      queryParamTaskEvolve: {},
      queryParamTaskPlan: {},
      queryParamTaskProblem: {},
      queryParamAccessory: {},
      selectedRowKeys: [],
      selectedRows: [],
      defaultExpandedRowKeys: [],
      pagination: {
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => {
          return "共 " + total + " 条";
        },
        onShowSizeChange: (current, pageSize) =>
          this.onShowSizeChange(current, pageSize),
      },
      url: {
        fathersUrl: "/office/oaTaskBase/getOaTaskBaseByLevelId",
        expandUrl: "/office/oaTaskBase/getListByPid",
        masterDelete: "/office/oaTaskBase/deleteBatch",
        masterUpdate: "/office/oaTaskBase/update",
      },
      parameter: {
        father: {
          levelId: 1,
        },
        children: {},
      },
      urlFile: {
        webUpload: "/document/fdfs/upload",
        getPageSet: "/document/fastdfs/getPageSet",
        deleteBatch: "/document/fdfs/delete",
        update: "/document/fastdfs/update",
      },
      oaTaskTabUrl: {
        getPageSet: "/office/oaTaskProgress/getPageSet",
        save: "/office/oaTaskProgress/save",
        deleteBatch: "/office/oaTaskProgress/deleteBatch",
        update: "/office/oaTaskProgress/update",
      },
    };
  },
  mounted() {
    console.log(this.$refs.masterList.getListData(), "11111");
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: "未开始",
        1: "已接收",
        2: "已完成",
      };
      return statusMap[status];
    },
    priorityFilter(status) {
      const statusMap = {
        1: "一级",
        2: "二级",
        3: "三级",
      };
      return statusMap[status];
    },
  },
  methods: {
    getTreeData(data) {
      console.log(data);
      that.masterRows = data[0];
      that.queryParamList = {
        puuid: data[0].uuid,
        id: data[0].id,
      };
    },
    masterRowClick(record, index) {
      const that = this;
      that.masterRows = record;
      that.uuids = record.uuid;
      that.queryParamList = {
        puuid: record.uuid,
        id: record.id,
      };
      that.$refs.masterModal.refreshList(that.queryParamList); // 设置刷新子表
    },
    refresh() {
      const form = this.$refs.masterModal.form;
      form.resetFields();
      this.masterRows = null;
      this.uuids = "";
      this.search();
      this.masterConfirmLoading = false;
    },
    refreshParams() {
      this.queryParam = {};
      this.search();
    },
    search() {
      this.$refs.masterList.getListData();
    },
    handleCancelDetail() {
      this.visibleDetail = false;
    },
  },
};
</script>

<style></style>
