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
            <a-input v-model="queryParam.name" placeholder="流程名称" />
          </a-form-item>
        </template>
      </tool-bar>
      <DataGrid
        ref="table"
        :columns="columns"
        :url="url"
        bordered
        rowKey="procdefId"
        showPagination="auto"
        :queryParam="queryParam"
      >
        <span slot="suspensionState" slot-scope="{ text, record, index }">
          <a-tag v-if="text == 1" :color="'green'">
            激活
          </a-tag>
          <a-tag v-if="text == 2" :color="'red'">
            挂起
          </a-tag>
        </span>
        <span slot="version" slot-scope="{ text, record, index }">
          <a-tag v-if="text" :color="'geekblue'">
            {{ "V:" + record.version }}
          </a-tag>
        </span>
        <span slot="action" slot-scope="{ text, record }">
          <template>
            <a @click="flowChart(record)">流程图</a>
            <a-divider type="vertical" />
            <a
              @click="suspendProcess(record)"
              v-if="record.suspensionState == 1"
              :color="'green'"
            >
              挂起
            </a>
            <a
              @click="suspendProcess(record)"
              v-if="record.suspensionState == 2"
              :color="'green'"
            >
              激活
            </a>
<!--            <a-divider type="vertical" />-->
<!--            <a @click="deleteDeployment(record)">删除</a>-->
          </template>
        </span>
      </DataGrid>
      <!-- 流程图 -->
      <flow-chat ref="flowChatForm" />
    </div>
  </div>
</template>

<script>
import { dataGridMixin } from "@/mixins/dataGridMixin";
import { DataGrid } from "@/components";

import flowChat from "../../apiFlowableTask/myMission/flowChat.vue";

export default {
  name: "TableList",
  mixins: [dataGridMixin],
  components: {
    DataGrid,
    flowChat,
  },
  data() {
    return {
      columns: [
        {
          title: "流程名称",
          dataIndex: "name",
          width: 300,
          align: "center",
        },
        {
          title: "流程标识",
          dataIndex: "modelKey",
          align: "center",
        },
        {
          title: "流程分类",
          dataIndex: "category",
          align: "center",
        },
        {
          title: "流程版本",
          dataIndex: "version",
          sorter: false,
          scopedSlots: {
            customRender: "version",
          },
          align: "center",
        },
        {
          title: "流程状态",
          dataIndex: "suspensionState",
          scopedSlots: {
            customRender: "suspensionState",
          },
          align: "center",
        },
        {
          title: "操作",
          dataIndex: "action",
          scopedSlots: {
            customRender: "action",
          },
          align: "center",
        },
      ],
      queryParam: {},
      url: {
        getPageSet: "/workflow/apiFlowableProcessDefinition/getPageSet",
        deleteDeployment:
          "/workflow/apiFlowableProcessDefinition/deleteDeployment",
        saDefinitionById:
          "/workflow/apiFlowableProcessDefinition/saDefinitionById",
      },
    };
  },
  methods: {
    // 流程图
    flowChart(record) {
      this.$post("/workflow/apiFlowableTask/clickStartedViewFlowchart", {
        processDefinitionId: record.procdefId,
      }).then((res) => {
        if (res.statusCode != 300) {
          const jsonData = res;
          // this.$refs.flowChatForm.loadData(jsonData)
          this.$refs.flowChatForm.loadData(
            jsonData,
            jsonData.lists.actDeModelId,
            jsonData.lists.actDeModelKey,
            jsonData.lists.actDeModelName,
            jsonData.lists.flowDesign
          );
        } else {
          this.$message.error(res.message);
        }
      });
    },
    handleCancel() {
      this.visible = false;
    },
    // 删除
    deleteDeployment(record) {
      console.log(record);
      const that = this;
      that.$confirm({
        title: "警告",
        content: `确定要执行该操作吗?`,
        okText: "删除",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          console.log("OK");
          that
            .$post(that.url.deleteDeployment, {
              deploymentId: record.id,
            })
            .then((res) => {
              if (res.statusCode === 200) {
                that.$message.success(res.message);
                that.$refs.table.refresh();
              } else {
                that.$message.info(res.message);
              }
            });
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
    // 挂起激活
    suspendProcess(record) {
      let suspensionState = 1;
      if (record.suspensionState === 1) {
        suspensionState = 2;
      }
      this.$post(this.url.saDefinitionById, {
        processDefinitionId: record.procdefId,
        suspensionState: suspensionState,
      }).then((res) => {
        if (res.statusCode === 200) {
          this.$message.success(res.message);
          this.$refs.table.refresh();
        } else {
          this.$message.info(res.message);
        }
      });
    },
  },
};
</script>
<style lang="less"></style>
