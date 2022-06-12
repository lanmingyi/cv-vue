<template>
  <div class="page-common-layout">
    <div class="page-common-content">
      <tool-bar
          @search="$refs.table.refresh(true)"
          @reset="
          () => {
            (this.queryParam = {}), $refs.table.refresh(true);
          }
        "
      >
        <template slot="toolBtn" slot-scope="scope">
          <a-button
              class="cu-btn-danger"
              icon="delete"
              @click="handleSub($refs.table.selectedRowKeys)"
              v-action:actMyProcessCopyAddDialog
          >删除
          </a-button
          >
        </template>
        <template slot="toolForm">
          <a-form-item label="">
            <a-input v-model="queryParam.formName" placeholder="请输入标题"/>
          </a-form-item>
        </template>
      </tool-bar>
      <DataGrid
          ref="table"
          :columns="columns"
          :url="url"
          bordered
          rowKey="uuid"
          showPagination="auto"
          :queryParam="queryParam"
      >
        <span slot="action" slot-scope="{ text, record }">
          <template>
            <a @click="handleFlow(record)">流程图</a>
              <a-divider type="vertical"/>
            <a @click="handleGetListComments(record)">审批意见</a>

          </template>
        </span>
      </DataGrid>
      <task-view
          ref="taskModal"
          :visible="taskVisible"
          :loading="confirmLoading"
          @cancel="taskHandleCancel()"
          @ok="taskHandleOk"
      />

      <flowChat ref="flowChatForm"></flowChat>
      <comment-modal ref="commentModal"></comment-modal>

    </div>
  </div>
</template>

<script>
import {dataGridMixin} from "@/mixins/dataGridMixin";
import {DataGrid} from "@/components";
import taskView from "../apiFlowableTask/myMission/taskView.vue";


import commentModal from "../oaLeave/comment";
import flowChat from "../apiFlowableTask/myMission/flowChat.vue";

export default {
  name: "TableList",
  mixins: [dataGridMixin],
  components: {DataGrid, taskView,flowChat, commentModal},
  data() {
    return {
      columns: [
        {title: "标题", dataIndex: "formName"},
        {title: "抄送日期", dataIndex: "createTime"},
        {title: "当前环节", dataIndex: "taskName"},
        {title: "流程发起人", dataIndex: "startUserId"},
        {
          title: "操作",
          dataIndex: "action",
          align: "center",
          scopedSlots: {customRender: "action"},
        },
      ],
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 查询参数
      queryParam: {},
      url: {
        getPageSet: "/workflow/actMyProcessCopy/getPageSet",
        deleteBatch: "/workflow/actMyProcessCopy/deleteBatch",
      },
      isView: false,
      taskVisible: false,
    };
  },
  methods: {
    // 详情
    handleTransaction(e) {
      this.confirmLoading = true;
      const jsonData = "";
      this.$post("/workflow/apiFlowableProcessInstance/clickStartProcess", {
        modelKey: e.modelKey,
        taskId: e.taskId,
        processInstanceId: e.processInstanceId,
        nodeId: e.nodeId,
        processDefinitionId: e.processDefinitionId,
      }).then((res) => {
        if (res.statusCode != 300) {
          const jsonData = res;
          this.$refs.taskModal.loadData(e, jsonData);
          this.confirmLoading = false;
          this.taskVisible = true;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    taskHandleOk() {
      this.taskVisible = false;
    },
    taskHandleCancel() {
      this.taskVisible = false;
    },
    // 流程图
    handleFlow(record) {
      this.$post("/workflow/oaLeave/clickFlowChart", {
        uuid: record.businessKey,
      }).then((res) => {
        if (res.statusCode != 300) {
          const jsonData = res;
          this.$refs.flowChatForm.loadData(
              jsonData,
              jsonData.lists.actDeModelId,
              jsonData.lists.actDeModelKey,
              jsonData.lists.actDeModelName,
              jsonData.lists.flowDesign,
              record
          );
        } else {
          this.$message.error(res.message);
        }
      });
    },

    handleGetListComments(record) {
      this.$refs.commentModal.getCommentList(record.businessKey);
    },
  },
};
</script>

<style lang="less"></style>
