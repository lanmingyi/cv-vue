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
        <template slot="toolForm">
          <a-form-item label="">
            <a-input v-model="queryParam.taskId" placeholder="任务Id" />
          </a-form-item>
          <a-form-item label="">
            <a-input
              v-model="queryParam.procDefName"
              placeholder="流程名称"
              style="width: 100%"
            />
          </a-form-item>
        </template>
      </tool-bar>
      <DataGrid
        ref="table"
        :columns="columns"
        :url="url"
        bordered
        rowKey="id"
        showPagination="auto"
        :queryParam="queryParam"
      >
        <span slot="action" slot-scope="{ text, record }">
          <template>
            <!-- <a @click="handleTransaction(record)">流程详情</a> -->
            <!--<a-divider type="vertical" />-->
            <a @click="flowChart(record)">流程图</a>
          </template>
        </span>
      </DataGrid>
      <flow-chat ref="flowChatForm" />
      <task-form
        ref="taskModal"
        :visible="taskVisible"
        @cancel="taskHandleCancel()"
        @ok="taskHandleOk"
      />
    </div>
  </div>
</template>

<script>
import { dataGridMixin } from "@/mixins/dataGridMixin";
import { DataGrid } from "@/components";

import flowChat from "../myMission/flowChat.vue";

import taskForm from "../myMission/taskView.vue";

export default {
  name: "TableList",
  mixins: [dataGridMixin],
  components: {
    DataGrid,
    flowChat,
    taskForm,
  },
  data() {
    return {
      columns: [
        {
          title: "任务ID",
          dataIndex: "taskId",
          align: "center",
        },
        {
          title: "流程名称",
          dataIndex: "procDefName",
          align: "center",
          width: 300,
        },
        {
          title: "当前环节",
          dataIndex: "taskName",
          align: "center",
        },
        {
          title: "任务执行人",
          dataIndex: "assignee",
          align: "center",
        },
        {
          title: "任务创建时间",
          dataIndex: "taskCreateTime",
          align: "center",
        },
        {
          title: "操作",
          dataIndex: "action",
          width: 100,
          scopedSlots: {
            customRender: "action",
          },
          align: "center",
        },
      ],
      taskVisible: false,
      visible: false,
      confirmLoading: false,
      mdl: null,
      queryParam: {},
      url: {
        getPageSet: "/workflow/apiFlowableTask/getTaskPageSet",
      },
    };
  },
  methods: {
    // 打开流程图
    flowChart(record) {
      this.$post("/workflow/flowModel/getDetailByModelKey", {
        modelKey: record.procDefKey,
        procdefId: record.processDefinitionId,
        type: "mode",
      }).then((res) => {
        const jsonData = res.flowModel;
        this.$refs.flowChatForm.loadData(
          jsonData,
          jsonData.actDeModelId,
          jsonData.actDeModelKey,
          jsonData.actDeModelName,
          jsonData.flowDesign,
          record
        );
      });
    },
    // 查看流程详情
    handleTransaction(e) {
      const jsonData = "";
      this.$post("/workflow/apiFlowableTask/getTaskPageSetClickDetails", {
        modelKey: e.procDefKey,
        processInstanceId: e.processInstanceId,
      }).then((res) => {
        if (res.statusCode == 300) {
          this.$message.error(res.message, 1.5);
          return false;
        }
        const jsonData = res;
        this.$refs.taskModal.loadData(e.modelKey, jsonData);
        this.taskVisible = true;
      });
    },
    taskHandleOk() {
      this.taskVisible = false;
    },
    taskHandleCancel() {
      this.taskVisible = false;
    },
  },
};
</script>

<style lang="less"></style>
