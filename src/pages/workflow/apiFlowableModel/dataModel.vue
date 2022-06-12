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
        :isEdit="isEdit"
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
    isEdit: {
      type: Boolean,
      default: () => false,
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
    // 保存获取流程表单数据
    setFlowXml() {
      let that = this;
      this.uuid = "";
      setTimeout(function() {
        that.$refs.bpmnData.initDiagramAgain();
        that.$refs.bpmnData.getFormLists();
      }, 100);
    },
    // 获取表单流程数据
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
