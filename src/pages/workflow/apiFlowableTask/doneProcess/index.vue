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
            <a-input v-model="queryParam.modelName" placeholder="流程名称" />
          </a-form-item>
        </template>
      </tool-bar>
      <DataGrid
        ref="table"
        :columns="columns"
        :url="url"
        bordered
        rowKey="taskId"
        showPagination="auto"
        :queryParam="queryParam"
      >
        <span slot="action" slot-scope="{ text, record }">
          <template>
            <a @click="handleTransaction(record)">详情</a>
          </template>
        </span>
      </DataGrid>
      <!-- 流程详情 -->
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
import taskForm from "../myMission/taskView.vue";

const columns = [
  {
    title: "流程标题",
    dataIndex: "formName",
    width: 300,
  },
  {
    title: "流程名称",
    dataIndex: "modelName",
    align: "center",
  },
  {
    title: "当前环节",
    dataIndex: "taskName",
    align: "center",
  },
  {
    title: "开始时间",
    dataIndex: "startTime",
    sorter: false,
    align: "center",
  },
  {
    title: "结束时间",
    dataIndex: "endTime",
    sorter: false,
    align: "center",
  },
  {
    title: "操作",
    dataIndex: "action",
    width: 80,
    align: "center",
    scopedSlots: {
      customRender: "action",
    },
  },
];
export default {
  name: "TableList",
  mixins: [dataGridMixin],
  components: {
    DataGrid,
    taskForm,
  },
  data() {
    return {
      columns,
      visible: false,
      confirmLoading: false,
      mdl: null,
      queryParam: {},
      url: {
        getPageSet: "/workflow/apiFlowableTask/getApplyedTasks",
      },
      taskVisible: false,
    };
  },
  methods: {
    handleCancel() {
      this.visible = false;
    },
    // 获取流程详情
    handleTransaction(e) {
      this.confirmLoading = true;
      const jsonData = "";
      this.$post("/workflow/apiFlowableTask/historyClickDetails", {
        processInstanceId: e.processInstanceId,
        modelKey: e.modelKey,
        businessKey: e.businessKey,
        processDefinitionId: e.processDefinitionId,
        nodeId: e.nodeId,
      }).then((res) => {
        if (res.statusCode == 300) {
          this.$message.error(res.message, 1.5);
          return false;
        }
        this.taskVisible = true;
        const jsonData = res;
        this.$refs.taskModal.loadData(e, jsonData);
        this.confirmLoading = false;
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
