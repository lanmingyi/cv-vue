<!--
 * @Description: 流程实例
 * @Author: lmy
 * @Date: 2021-06-02 13:38:09
 * @LastEditTime: 2021-09-16 11:52:37
 * @LastEditors: lmy
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\workflow\management\processInstance\index.vue
-->
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
            <a-input v-model="queryParam.name" placeholder="名称" />
          </a-form-item>
        </template>
      </tool-bar>
      <DataGrid
        ref="table"
        :columns="columns"
        :url="url"
        bordered
        rowKey="processInstanceId"
        showPagination="auto"
        :queryParam="queryParam"
      >
        <span slot="action" slot-scope="{ text, record }">
          <template>
            <a @click="flowChart(record)">流程图</a>
            <a-divider type="vertical" />
            <a @click="handleDel(record)">删除</a>
            <template v-if="!record.endTime">
              <a-divider type="vertical" />
              <a-dropdown>
                <a class="ant-dropdown-link"> 更多 <a-icon type="down" /> </a>
                <a-menu slot="overlay">
                  <a-menu-item>
                    <a @click="termination(record)">终止</a>
                  </a-menu-item>
                  <a-menu-item>
                    <a @click="freeJump(record)">自由跳转</a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </template>
          </template>
        </span>
      </DataGrid>
      <!--终止流程-->
      <edit-form
        ref="createModal"
        :visible="visible"
        :confirmLoading="confirmLoading"
        :model="mdl"
        @cancel="handleCancel()"
        @ok="handleOk()"
      />
      <!--自由跳转-->
      <freeJump-form
        ref="createModalFreeJump"
        :freeJumpData="freeJumpData"
        :JumpDataList="JumpDataList"
        :visible="visibleFreeJump"
        :confirmLoading="confirmLoadingFreeJump"
        :model="mdlFreeJump"
        @cancel="handleCancel()"
        @ok="handleOkProcessFreeJump()"
      />
      <!-- 流程图 -->
      <flow-chat ref="flowChatForm" />
    </div>
  </div>
</template>

<script>
import { DataGrid } from "@/components";
import { dataGridMixin } from "@/mixins/dataGridMixin";
import editForm from "./stop.vue";
import freeJumpForm from "./freeJump.vue";
import flowChat from "../../apiFlowableTask/myMission/flowChat.vue";

export default {
  name: "TableList",
  mixins: [dataGridMixin],
  components: { DataGrid, editForm, freeJumpForm, flowChat },
  data() {
    return {
      columns: [
        {
          title: "流程名称",
          dataIndex: "formName",
          align: "center",
          width: 300,
        },
        {
          title: "流程标识",
          dataIndex: "modelKey",
          align: "center",
        },
        {
          title: "发起人",
          dataIndex: "startUserId",
          align: "center",
        },
        {
          title: "发起时间",
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
          width: 180,
          scopedSlots: {
            customRender: "action",
          },
          align: "center",
        },
      ],
      confirmLoading: false,
      mdl: null,
      visible: false,
      // 查询参数
      queryParam: {},
      url: {
        getPageSet: "/workflow/apiFlowableProcessInstance/getPageSet",
        downLoadXmlByModelId: "/workflow/apiFlowableModel/downLoadXmlByModelId",
      },
      confirmLoadingFreeJump: false,
      mdlFreeJump: null,
      visibleFreeJump: false,
      freeJumpData: [],
      JumpDataList: [],
    };
  },
  methods: {
    termination(record) {
      const form = this.$refs.createModal.form;
      // 重置表单数据
      form.resetFields();
      this.mdl = { processInstanceId: record.processInstanceId };
      this.visible = true;
    },
    freeJump(record) {
      const form = this.$refs.createModalFreeJump.form;
      // 重置表单数据
      form.resetFields();
      this.mdlFreeJump = { processInstanceId: record.processInstanceId };
      this.visibleFreeJump = true;
      this.$post(
        "/workflow/apiFlowableProcessInstance/getProcessFreeJumpData",
        {
          processInstanceId: record.processInstanceId,
        }
      ).then((res) => {
        this.JumpDataList = res;
      });
      this.getAllUserTaskListByProcessInstanceId(record);
    },
    // 获取可跳转节点
    getAllUserTaskListByProcessInstanceId(record) {
      this.$post(
        "/workflow/apiFlowableProcessInstance/getAllUserTaskListByProcessInstanceId",
        {
          processInstanceId: record.processInstanceId,
        }
      ).then((res) => {
        this.freeJumpData = res;
      });
    },
    flowChart(record) {
      this.$post("/workflow/apiFlowableTask/historyClickDetails", {
        modelKey: record.modelKey,
        businessKey: record.businessKey,
        processInstanceId: record.processInstanceId,
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
            jsonData.lists.flowDesign
          );
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 取消
    handleCancel() {
      this.visible = false;
      this.visibleFreeJump = false;
    },
    handleOk: function(record) {
      const form = this.$refs.createModal.form;
      form.validateFields((errors, values) => {
        if (!errors) {
          this.confirmLoading = true;
          this.$post(
            "/workflow/apiFlowableProcessInstance/stopProcessInstanceByProcessInstanceId",
            values
          ).then((res) => {
            if (res.statusCode === 200) {
              this.visible = false;
              // 刷新表格
              this.$refs.table.refresh();
              this.$message.success(res.message);
            } else {
              this.$message.error(res.message);
            }
          });
        } else {
          this.confirmLoading = false;
        }
      });
    },
    handleOkProcessFreeJump: function(record) {
      const form = this.$refs.createModalFreeJump.form;
      form.validateFields((errors, values) => {
        if (!errors) {
          this.confirmLoadingFreeJump = true;
          this.$post(
            "/workflow/apiFlowableProcessInstance/processFreeJump",
            values
          ).then((res) => {
            if (res.statusCode === 200) {
              this.visibleFreeJump = false;
              // 刷新表格
              this.$refs.table.refresh();
              this.$message.success(res.message);
            } else {
              this.$message.error(res.message);
            }
          });
        }
        this.confirmLoadingFreeJump = false;
      });
    },
    handleDel(record) {
      let that = this;
      const h = that.$createElement;
      that.$confirm({
        title: "警告",
        content: h("div", {}, [
          h("p", "确定要删除当前流程实例历史数据吗?"),
          h(
            "p",
            "注意：它会级联删除流程实例及相关的任务。流程历史建议留存，请谨慎操作"
          ),
        ]),
        okText: "删除",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          // 在这里调用删除接口
          that
            .$post(
              "/workflow/apiFlowableProcessInstance/deleteProcessInstanceById",
              {
                processInstanceId: record.processInstanceId,
              }
            )
            .then((res) => {
              if (res.statusCode === 200) {
                that.$message.success(res.message, 1.5);
                that.$refs.table.refresh();
              } else {
                that.$message.error(res.message, 1.5);
              }
            });
        },
        onCancel() {},
      });
    },
  },
};
</script>

<style scoped="scoped">
p {
  margin: 0 !important;
}
</style>
