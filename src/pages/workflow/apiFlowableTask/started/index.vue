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
            <a-input v-model="queryParam.modelName" placeholder="模型名称" />
          </a-form-item>
          <a-form-item label="">
            <a-input
              v-model="queryParam.modelKey"
              placeholder="模型key"
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
        <span slot="startTime" slot-scope="{ text, record, index }">
          {{ getLocalTime(text) }}
        </span>
        <span slot="action" slot-scope="{ text, record }">
          <template>
            <a @click="flowChart(record)">流程图</a>
          </template>
        </span>
      </DataGrid>
      <flow-chat ref="flowChatForm" />
    </div>
  </div>
</template>
<script>
import { dataGridMixin } from "@/mixins/dataGridMixin";
import { DataGrid } from "@/components";
import flowChat from "../myMission/flowChat.vue";
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
          dataIndex: "processDefinitionName",
        },
        {
          title: "流程标识",
          dataIndex: "key",
          align: "center",
        },
        {
          title: "流程定义Id",
          dataIndex: "processDefinitionId",
          align: "center",
        },
        {
          title: "流程实例Id",
          dataIndex: "id",
          align: "center",
        },
        {
          title: "流程启动时间",
          dataIndex: "startTime",
          scopedSlots: {
            customRender: "startTime",
          },
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
      visible: false,
      confirmLoading: false,
      mdl: null,
      queryParam: {},
      url: {
        getPageSet: "/workflow/apiFlowableTask/getStartedPageSet",
      },
    };
  },
  methods: {
    // 流程图
    flowChart(record) {
      this.$post("/workflow/apiFlowableTask/clickStartedViewFlowchart", {
        modelKey: record.modelKey,
        processDefinitionId: record.processDefinitionId,
        processInstanceId: record.processInstanceId,
      }).then((res) => {
        if (res.statusCode == 300) {
          this.$message.error(res.message);
        } else {
          const jsonData = res;
          this.$refs.flowChatForm.loadData(
            jsonData,
            res.lists.actDeModelId,
            res.lists.actDeModelKey,
            res.lists.actDeModelName,
            res.lists.flowDesign,
            record
          );
        }
      });
    },
    getLocalTime(nS) {
      //时间格式处理
      var dateee = new Date(nS).toJSON();
      var date = new Date(+new Date(dateee) + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, " ")
        .replace(/\.[\d]{3}Z/, "");
      return date;
    },
  },
};
</script>

<style lang="less"></style>
