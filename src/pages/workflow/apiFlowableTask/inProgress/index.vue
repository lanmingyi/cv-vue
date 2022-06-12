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
            <a-input v-model="queryParam.formName" placeholder="流程标题" />
          </a-form-item>
          <a-form-item label="">
            <a-input
              v-model="queryParam.modelName"
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
        rowKey="taskId"
        showPagination="auto"
        :queryParam="queryParam"
      >
        <span slot="action" slot-scope="{ text, record }">
          <template>
            <a @click="handleTransaction(record)">详情</a>
            <a-divider type="vertical" />
            <!-- <a @click="flowChart(record)">删除</a> -->
          </template>
          <a-dropdown>
            <a class="ant-dropdown-link"> 更多 <a-icon type="down" /> </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handlePress(record)">催办</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;" @click="handleRevocation(record)"
                  >撤销</a
                >
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </DataGrid>
      <!-- 流程图 -->
      <flow-chat ref="flowChatForm" />
      <!-- 流程详情 -->
      <task-form
        ref="taskModal"
        :visible="taskVisible"
        :loading="confirmLoading"
        @cancel="taskHandleCancel()"
        @ok="taskHandleOk"
      />
      <!-- 流程催办 -->
      <press-modal
        ref="pressModel"
        :model="pressModel"
        :loading="confirmLoadingPress"
        :visible="pressVisible"
        @cancel="handleCancelPress()"
        @ok="handleOkPress"
      />
      <!-- 流程撤销 -->
      <revocation-modal
        ref="revocationModel"
        :model="revocationModel"
        :loading="confirmLoadingRevocation"
        :visible="revocationVisible"
        @cancel="handleCancelRevocation()"
        @ok="handleOkRevocation"
      />
    </div>
  </div>
</template>
<script>
import { dataGridMixin } from "@/mixins/dataGridMixin";
import { DataGrid } from "@/components";
import taskForm from "../myMission/taskView.vue";
import flowChat from "../myMission/flowChat.vue";
import pressModal from "./press.vue";
import revocationModal from "./revocation.vue";

export default {
  name: "TableList",
  mixins: [dataGridMixin],
  components: {
    DataGrid,
    taskForm,
    flowChat,
    pressModal,
    revocationModal,
  },
  data() {
    return {
      columns: [
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
        // {
        //   title: "流程执行人",
        //   dataIndex: "assignee",
        //   align: "center",
        // },
        {
          title: "创建时间",
          dataIndex: "startTime",
          sorter: false,
          align: "center",
        },
        {
          title: "操作",
          dataIndex: "action",
          width: 120,
          align: "center",
          scopedSlots: {
            customRender: "action",
          },
        },
      ],
      visible: false,
      confirmLoading: false,
      mdl: null,
      queryParam: {},
      taskVisible: false,
      // 催办
      pressVisible: false,
      pressModel: null,
      confirmLoadingPress: false,
      // 撤销
      revocationModel: null,
      confirmLoadingRevocation: false,
      revocationVisible: false,
      url: {
        getPageSet: "/workflow/apiFlowableTask/getMyNoEndProcessPageSetData",
      },
    };
  },
  methods: {
    // 流程图
    flowChart(record) {
      this.$post("/workflow/apiFlowableProcessInstance/clickStartProcess", {
        modelKey: record.modelKey,
        taskId: record.taskId,
        processInstanceId: record.processInstanceId,
        nodeId: record.nodeId,
      }).then((res) => {
        const jsonData = res;
        this.$refs.flowChatForm.loadData(jsonData);
      });
    },
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
          this.confirmLoading = false;
        }
      });
    },
    taskHandleOk() {
      this.taskVisible = false;
    },
    taskHandleCancel() {
      this.taskVisible = false;
    },
    // 催办
    handlePress(e) {
      const form = this.$refs.pressModel.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.pressVisible = true;
      this.pressModel = e;
    },
    // 确认催办
    handleOkPress() {
      const form = this.$refs.pressModel.form;
      form.validateFields((errors, values) => {
        if (!errors) {
          this.confirmLoadingPress = true;
          this.$post("/workflow/apiFlowableTask/processUrging", values)
            .then((res) => {
              if (res.statusCode === 200) {
                this.pressVisible = false;
                this.$message.info(res.message);
              } else {
                this.$message.info(res.message);
              }
            })
            .finally(() => {
              this.confirmLoadingPress = false;
            });
        }
      });
    },
    handleCancelPress() {
      this.pressVisible = false;
    },
    // 撤销
    handleRevocation(e) {
      const form = this.$refs.revocationModel.form;
      form.resetFields(); // 清理表单数据（可不做）
      this.revocationVisible = true;
      this.revocationModel = e;
    },
    handleCancelRevocation() {
      this.revocationVisible = false;
    },
    handleOkRevocation() {
      const form = this.$refs.revocationModel.form;
      form.validateFields((errors, values) => {
        if (!errors) {
          this.confirmLoadingRevocation = true;
          this.$post("/workflow/apiFlowableTask/processRevocation", values)
            .then((res) => {
              if (res.statusCode === 200) {
                this.revocationVisible = false;
                this.$message.info(res.message);
                this.$refs.table.refresh();
              } else {
                this.$message.error(res.message);
              }
            })
            .finally(() => {
              this.confirmLoadingRevocation = false;
            });
        }
      });
    },
  },
};
</script>

<style lang="less"></style>
