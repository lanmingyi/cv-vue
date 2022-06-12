<!--
 * @Description: 流程设计
 * @Author: 黄婷
 * @Date: 2021-01-18 15:17:31
 * @LastEditTime: 2021-09-16 11:53:31
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\workflow\workflowDesign\index.vue
-->
<template>
  <t-drawer
    class="t-drf"
    :visible="visible"
    :closable="false"
    :fullscreen="true"
    :switchFullscreen="true"
    @close="
      () => {
        $emit('cancel');
      }
    "
  >
    <a-spin :spinning="loading">
      <vue-bpmn
        ref="bpmnData"
        :bpmnClose="true"
        style="overflow: hidden"
        product="flowable"
        @bpmSave="bpmSave"
        @close="
          () => {
            $emit('cancel');
          }
        "
      ></vue-bpmn>
    </a-spin>
  </t-drawer>
</template>

<script>
import VueBpmn from "@/components/TopVUI/bpmn/bpmnDesign";

export default {
  name: "bpmnDesign",
  data() {
    return {
      bpmData: "",
      spinning: false,
      uuid: "",
    };
  },
  components: {
    VueBpmn,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    loading: {
      type: Boolean,
      default: () => false,
    },
    model: {
      type: Object,
      default: () => null,
    },
  },
  methods: {
    bpmSave(data) {
      this.bpmData = data;
      this.$emit("ok", this.bpmData, this.uuid);
    },
    ok() {
      this.spinning = true;
      this.$refs.bpmnData.save();
    },
    setFlowXml() {
      let that = this;
      this.uuid = "";
      setTimeout(function() {
        that.$refs.bpmnData.initDiagramAgain();
        that.$refs.bpmnData.getFormLists();
      }, 100);
    },
    setAllData(res) {
      let flowModel = res.flowModel;
      this.uuid = flowModel.uuid;
      this.pramas = flowModel.flowDesign;
      this.$refs.bpmnData.initDiagramAgain(
        flowModel.actDeModelKey,
        flowModel.actDeModelName,
        flowModel.flowDesign,
        flowModel.permissionType,
        flowModel.permissionValue
      );
      this.$refs.bpmnData.getFormLists();
    },
  },
};
</script>

<style scoped="scoped">
.design_bpmn .bpmn-viewer-container {
  height: calc(100vh - 135px);
}
.ant-modal-body {
  padding: 0 !important;
}
</style>
