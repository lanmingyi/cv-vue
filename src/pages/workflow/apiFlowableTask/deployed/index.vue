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
        <!-- <template slot="toolBtn">
        <a-button
          class="cu-btn-danger"
          icon="delete"
          @click="deleteData($refs.table.selectedRows)"
          >删除</a-button
        >
      </template> -->
        <template slot="toolForm">
          <a-form-item label="">
            <a-input v-model="queryParam.modelName" placeholder="流程名称" />
          </a-form-item>
          <a-form-item label="">
            <a-input
              v-model="queryParam.modelKey"
              placeholder="流程标识"
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
        <span slot="version" slot-scope="{ text, record, index }">
          <a-tag v-if="text" :color="'geekblue'">
            {{ "V:" + record.version }}
          </a-tag>
        </span>
        <span slot="action" slot-scope="{ text, record }">
          <template>
            <a @click="flowChart(record)">流程图</a>
            <a-divider type="vertical" />
            <a @click="deleteData(record)">删除</a>
          </template>
        </span>
      </DataGrid>
      <!-- 流程图 -->
      <flow-chat ref="flowChatForm" />
    </div>
  </div>
</template>

<script>
import { DataGrid } from "@/components";
import flowChat from "../myMission/flowChat.vue";
import { dataGridMixin } from "@/mixins/dataGridMixin";
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
        },
        {
          title: "流程标识",
          dataIndex: "key",
          align: "center",
        },
        {
          title: "流程版本",
          dataIndex: "version",
          scopedSlots: {
            customRender: "version",
          },
          align: "center",
        },
        {
          title: "流程描述",
          dataIndex: "description",
          align: "center",
        },
        {
          title: "操作",
          dataIndex: "action",
          width: 120,
          scopedSlots: {
            customRender: "action",
          },
          align: "center",
        },
      ],
      queryParam: {},
      url: {
        getPageSet: "/workflow/apiFlowableTask/getDeployedPageSet",
      },
    };
  },
  methods: {
    // 流程图
    flowChart(record) {
      this.$post("/workflow/flowModel/getDetailByModelKey", {
        modelKey: record.key,
        procdefId: record.procdefId,
        type: "mode",
      }).then((res) => {
        if(300==res.statusCode){
            return  this.$message.warn(res.message, 1.5);
        }
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
    // 删除
    deleteData(record) {
      let deploymentId = [],
        id = [],
        key = [];
      if (!record || record.length === 0) {
        this.$message.warn("请勾选需要删除的数据", 1.5);
        return;
      } else if (record && record[0]) {
        record.forEach((e) => {
          deploymentId.push(e.deploymentId);
          id.push(e.id);
          key.push(e.key);
        });
      } else {
        deploymentId = record.deploymentId;
        id = record.id;
        key = record.key;
      }
      const that = this;
      that.$confirm({
        title: "警告",
        content: `确定要执行该操作吗?`,
        okText: "删除",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          // 在这里调用删除接口
          that
            .$post("/workflow/apiFlowableTask/deployedDelete", {
              deploymentId: deploymentId.toString(),
              id: id.toString(),
              key: key.toString(),
            })
            .then((res) => {
              if (res.statusCode === 200) {
                that.$refs.table.refresh();
                that.$message.success(res.message);
              } else {
                that.confirmLoading = false;
                that.$message.error(res.message);
              }
            });
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
  },
};
</script>

<style lang="less"></style>
