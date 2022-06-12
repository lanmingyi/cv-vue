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
            <a-input v-model="queryParam.name" placeholder="流程标题" />
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
        :queryParam="queryParam"
        rowKey="id"
        showPagination="auto"
      >
        <span slot="action" slot-scope="{ text, record }">
          <template>
            <a @click="handleTransaction(record)">详情</a>
            <a-divider type="vertical" />
            <a @click="deleteData(record)">删除</a>
          </template>
        </span>
      </DataGrid>
      <!-- 详情 -->
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
import taskForm from "./taskView.vue";

export default {
  name: "historyProcess",
  mixins: [dataGridMixin],
  components: {
    DataGrid,
    taskForm,
  },
  data() {
    return {
      columns: [
        {
          title: "流程标题",
          dataIndex: "name",
          width: 300,
        },
        {
          title: "流程名称",
          dataIndex: "procDefName",
          align: "center",
        },
        {
          title: "流程发起人",
          dataIndex: "startUserId",
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
      url: {
        getPageSet: "/workflow/apiFlowableTask/getMyHistoryPageSet",
      },
    };
  },
  methods: {
    // 删除
    deleteData(record) {
      const that = this;
      that.$confirm({
        title: "警告",
        content: `确定要执行该操作吗?`,
        okText: "删除",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          console.log("OK");
          // 在这里调用删除接口
          that
            .$post("/workflow/apiFlowableTask/deleteHistoricProcessInstance", {
              instanceId: record.processInstanceId,
            })
            .then((res) => {
              if (res.statusCode === 200) {
                that.$message.success(res.message);
                that.$refs.table.refresh();
                that.ids = "";
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
    // 获取流程详情
    handleTransaction(e) {
      const jsonData = "";
      this.$post("/workflow/apiFlowableTask/historyClickDetails", {
        processInstanceId: e.processInstanceId,
        modelKey: e.procDefKey,
        processDefinitionId: e.processDefinitionId,
        businessKey: e.businessKey,
      }).then((res) => {
        if (res.statusCode == 300) {
          this.$message.error(res.message);
        } else {
          const jsonData = res;
          this.$refs.taskModal.loadData(e, jsonData);
          this.taskVisible = true;
        }
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
