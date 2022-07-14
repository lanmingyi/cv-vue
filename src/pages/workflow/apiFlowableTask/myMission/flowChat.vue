<!--
 * @Description: 流程图
 * @Author: lmy
 * @Date: 2021-06-02 13:38:09
 * @LastEditTime: 2021-08-06 14:03:43
 * @LastEditors: lmy
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\workflow\apiFlowableTask\myMission\flowChat.vue
-->
<template>
  <t-modal
    title="流程图"
    :width="1200"
    :visible="visible"
    @ok="
      () => {
        this.visible = false;
      }
    "
    @cancel="
      () => {
        this.visible = false;
      }
    "
    :footer="null"
  >
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
  </t-modal>
</template>

<script>
import BpmnViewer from "@/components/TopVUI/bpmn/Viewer";
export default {
  data() {
    return {
      visible: false,
      params: "",
      notInProgress: "",
      inProgress: "",
      nodeParam: {},
    };
  },
  components: {
    BpmnViewer,
  },
  methods: {
    // 加载数据
    loadData(
      json,
      actDeModelId,
      actDeModelKey,
      actDeModelName,
      flowDesign,
      record
    ) {
      this.params = flowDesign;
      this.visible = true;
      this.inProgress = json.inProgress;
      this.notInProgress = json.notInProgress;
      this.nodeParam = {
        procdefId: json.lists?.procdefId,
        processInstanceId: record?.processInstanceId,
      };
      if (this.$refs.bpmView)
        this.$refs.bpmView.initDiagramAgain(
          actDeModelId,
          actDeModelKey,
          actDeModelName,
          this.params
        );
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
