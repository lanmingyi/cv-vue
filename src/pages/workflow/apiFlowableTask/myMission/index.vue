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
          <a-form-item label="" class="margin-right-sm">
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
        :queryParam="queryParam"
        rowKey="taskId"
        showPagination="auto"
      >
        <span slot="serial" slot-scope="{ text, record, index }">
          {{ index + 1 }}
        </span>
        <span slot="formName" slot-scope="{ text, record, index }">
          {{ text }}
        </span>
        <span slot="action" slot-scope="{ text, record }">
          <template>
            <a @click="handleTransaction(record)">办理</a>
            <a-divider type="vertical" />
            <a @click="flowChart(record)">流程图</a>
          </template>
        </span>
      </DataGrid>
      <task-form
        ref="taskModal"
        :visible="taskVisible"
        :loading="confirmLoading"
        :model="taskMdl"
        @cancel="taskHandleCancel(0)"
        @ok="taskHandleOk"
        @update="taskUpdate"
        @close="close"
      />
      <!-- 动态加载异步组件-->
      <!-- <component ref="taskModal" :is="plugItem" v-for="(plugItem, plugIndex) in plugs" :key='plugIndex'  :visible="taskVisible" :loading="taskConfirmLoading" :model="taskMdl" @cancel="taskHandleCancel(0)" @ok="taskHandleOk" @update="taskUpdate" @close="close"></component> -->
      <flow-chat ref="flowChatForm" />
    </div>
  </div>
</template>

<script>
import moment from "moment";
import taskForm from "./modal/taskModel.vue";
import flowChat from "./flowChat.vue";
import { dataGridMixin } from "@/mixins/dataGridMixin";
import { DataGrid } from "@/components";

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
          title: "流程标题",
          dataIndex: "formName",
          scopedSlots: {
            customRender: "formName",
          },
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
          title: "流程发起人",
          dataIndex: "startUserId",
          align: "center",
        },
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
      taskVisible: false,
      mdl: null,
      taskMdl: {},
      queryParam: {},
      url: {
        getPageSet: "/workflow/apiFlowableTask/getToDoTasks",
        deployModelId: "/workflow/apiFlowableModel/deployModelId",
        agree: "/workflow/apiFlowableTask/agree",
        getFlowImgByExecutionId:
          "/workflow/apiFlowableTask/getFlowImgByExecutionId",
      },
      modelType: 0,
    };
  },
  methods: {
    //流程办理事件
    handleTransaction(e) {
      const form = this.$refs.taskModal.formOpinion;
      form.resetFields(); // 清理表单数据（可不做）
      this.$post("/workflow/apiFlowableProcessInstance/clickStartProcess", {
        modelKey: e.modelKey,
        taskId: e.taskId,
        processInstanceId: e.processInstanceId,
        nodeId: e.nodeId,
        processDefinitionId: e.processDefinitionId,
      }).then((res) => {
        if (!res || res.message) {
          this.$message.error("获取信息出现错误，请稍后再试");
          return;
        }
        this.modelType = res.lists.modelType;
        if (res.lists.modelType === "1") {
          // this.$refs.taskModal.plugs.push(() => import(`../../../../components/TopVUI/k-form-design/packages/KFormPreview/preview.vue`))
        }
        this.taskVisible = true;
        this.confirmLoading = true;
        this.taskMdl = e;
        const jsonData = res;
        this.$refs.taskModal.loadData(e, jsonData);
        this.confirmLoading = false;
      });
    },
    // 同意、驳回
    taskHandleOk(type, drawingList, values) {
      console.log(values);
      // console.log(type, drawingList, pramar);
      // const form = this.$refs.taskModal.formOpinion;
      // this.confirmLoading = true;
      // form.validateFields((errors, values) => {
      //   if (!errors) {
      //     if (this.modelType === "2") {
      //       values.formDesign = JSON.stringify(drawingList);
      //       values.formModel = JSON.stringify(drawingList.config);
      //     }
      //     values = Object.assign(values, pramar);
      //     this.$post("/workflow/apiFlowableTask/agree", values).then((res) => {
      //       if (res.statusCode === 200) {
      //         this.$message.info(res.message);
      //         this.taskVisible = false;
      //         this.$refs.table.refresh();
      //       } else {
      //         this.confirmLoading = false;
      //         this.$message.error(res.message);
      //       }
      //     });
      //   } else {
      //     this.confirmLoading = false;
      //   }
      // });
      this.$post("/workflow/apiFlowableTask/agree", values).then((res) => {
        if (res.statusCode === 200) {
          this.$message.info(res.message);
          this.taskVisible = false;
          this.$refs.table.refresh();
        } else {
          this.confirmLoading = false;
          this.$message.error(res.message);
        }
      });
    },
    // 更新
    taskUpdate(pramer, pramar) {
      this.confirmLoading = true;
      this.$post("/workflow/flowModel/updateFormDesign", pramer).then((res) => {
        if (res.statusCode === 200) {
          this.$post("/form/formField/commonUpdate", pramar).then((res) => {
            if (res.statusCode === 200) {
              this.$message.info("更新成功！");
              // this.taskVisible = false;
              this.confirmLoading = false;
            } else {
              this.$message.info(res.message);
              this.confirmLoading = false;
            }
          });
        } else {
          this.$message.info(res.message);
        }
      });
    },
    // 刷新
    close() {
      this.taskVisible = false;
      this.$refs.table.refresh();
    },
    handleCancel() {
      this.visible = false;
    },
    // 流程图
    flowChart(record) {
      this.$post("/workflow/apiFlowableProcessInstance/clickStartProcess", {
        modelKey: record.modelKey,
        taskId: record.taskId,
        processInstanceId: record.processInstanceId,
        nodeId: record.nodeId,
        processDefinitionId: record.processDefinitionId,
      }).then((res) => {
        if (res.statusCode != 300) {
          const jsonData = res;
          // this.$refs.flowChatForm.loadData(jsonData)
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
    // 办理提交
    handleOk(drawingList, formConf) {
      const form = this.$refs.createModal.formOpinion;
      this.confirmLoading = true;
      form.validateFields((errors, values) => {
        if (!errors) {
          console.log(values);
          this.$post(this.url.agree, {
            processInstanceId: values.processInstanceId,
            taskId: values.taskId,
            message: values.message,
            processDefinitionId: values.processDefinitionId,
          }).then((res) => {
            if (res.statusCode === 200) {
              this.$refs.table.refresh();
              this.$message.info(res.message);
            } else {
              this.confirmLoading = false;
              this.$message.error(res.message);
            }
          });
        } else {
          this.confirmLoading = false;
        }
      });
    },
    taskHandleCancel() {
      this.taskVisible = false;
    },
  },
};
</script>

<style lang="less"></style>
