<!--
 * @Description: 显示流程图、主要用于TOPJUI版本流程
 * @Author: lmy
 * @Date: 2021-03-09 09:30:01
 * @LastEditTime: 2021-09-16 11:53:28
 * @LastEditors: lmy
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\workflow\workflowDesign\flowDiagram.vue
-->
<template>
  <bpmn-viewer
    class="bpmn-viewer-con"
    ref="bpmView"
    :params="params"
    :inProgress="inProgress"
    :notInProgress="notInProgress"
    :nodeParam="nodeParam"
  ></bpmn-viewer>
</template>

<script>
import BpmnViewer from "@/components/TopVUI/bpmn/Viewer";
import { getQueryString } from "@/services/common.js";

export default {
  data() {
    return {
      params: "",
      notInProgress: "",
      inProgress: "",
      nodeParam: {},
      queryParam: {},
    };
  },
  components: {
    BpmnViewer,
  },
  mounted() {
    // 获取url拼接的参数
    this.queryParam = {
      modelKey: getQueryString("modelKey"),
      taskId: getQueryString("taskId"),
      processInstanceId: getQueryString("processInstanceId"),
      nodeId: getQueryString("nodeId"),
      processDefinitionId: getQueryString("processDefinitionId"),
      businessKey: getQueryString("businessKey"),
      procdefId: getQueryString("procdefId"),
      type: getQueryString("type"),
      modelType: getQueryString("modelType"), //ongoing 待办；history:历史；started：已启动；done:已部署
    };
    this.loadData();
    console.log(this.queryParam);
  },
  methods: {
    // 加载数据
    loadData() {
      let url = "";
      let ajaxData = {};
      if (this.queryParam.modelType === "ongoing") {
        url = "/workflow/apiFlowableProcessInstance/clickStartProcess"; //待办流程
        ajaxData = {
          modelKey: this.queryParam.modelKey,
          taskId: this.queryParam.taskId,
          processInstanceId: this.queryParam.processInstanceId,
          nodeId: this.queryParam.nodeId,
          processDefinitionId: this.queryParam.processDefinitionId,
        };
      } else if (this.queryParam.modelType === "history") {
        url = "/workflow/apiFlowableTask/historyClickDetails"; //历史流程
        ajaxData = {
          modelKey: this.queryParam.modelKey,
          processInstanceId: this.queryParam.processInstanceId,
          businessKey: this.queryParam.businessKey,
          processDefinitionId: this.queryParam.processDefinitionId,
          nodeId: this.queryParam.nodeId,
        };
      } else if (this.queryParam.modelType === "started") {
        url = "/workflow/apiFlowableTask/clickStartedViewFlowchart"; //已启动流程
        ajaxData = {
          processDefinitionId: this.queryParam.processDefinitionId,
        };
      } else {
        url = "/workflow/flowModel/getDetailByModelKey"; //已部署流程、进行中
        ajaxData = {
          modelKey: this.queryParam.modelKey,
          procdefId: this.queryParam.procdefId,
          type: this.queryParam.type,
        };
      }
      this.$post(url, ajaxData).then((res) => {
        if (res.statusCode != 300) {
          let jsonData = {},
            actDeModelId = "",
            actDeModelKey = "",
            actDeModelName = "";
          if (
            this.queryParam.modelType === "ongoing" ||
            this.queryParam.modelType === "history"
          ) {
            jsonData = res;
            this.params = jsonData.lists.flowDesign;
            actDeModelId = jsonData.lists.actDeModelId;
            actDeModelKey = jsonData.lists.actDeModelKey;
            actDeModelName = jsonData.lists.actDeModelName;
          } else {
            jsonData = res.flowModel;
            this.params = jsonData.flowDesign;
            actDeModelId = jsonData.actDeModelId;
            actDeModelKey = jsonData.actDeModelKey;
            actDeModelName = jsonData.actDeModelName;
          }
          this.inProgress = jsonData.inProgress;
          this.notInProgress = jsonData.notInProgress;
          this.nodeParam = {
            procdefId: this.queryParam.processDefinitionId,
            processInstanceId: this.queryParam.processInstanceId,
          };
          if (this.$refs.bpmView)
            this.$refs.bpmView.initDiagramAgain(
              actDeModelId,
              actDeModelKey,
              actDeModelName,
              this.params
            );
        } else {
          this.$message.error(res.message);
        }
      });
    },
  },
};
</script>

<style>
.my-bpmn-con .bpmn-viewer-container {
  height: 720px !important;
}
.my-bpmn-con .bpmn-viewer-content {
  height: 700px !important;
  min-height: 700px !important;
}
</style>
