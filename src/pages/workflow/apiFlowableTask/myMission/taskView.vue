<template>
  <t-drawer
    class="mL"
    title=""
    :width="1000"
    :visible="visible"
    :confirmLoading="loading"
    :closable="false"
    :fullscreen="fullscreen"
    :switchFullscreen="fullscreen"
    @cancel="
      () => {
        $emit('cancel');
      }
    "
  >
    <a-radio-group v-model="mode" class="margin-bottom-xs" @change="changeMode">
      <a-radio-button value="1">
        <a-icon type="edit" class="margin-right-xs" />表单信息</a-radio-button
      >
      <!-- <a-radio-button value="3">
        <a-icon
          type="snippets"
          class="margin-right-xs"
        />审批记录</a-radio-button
      > -->
      <a-radio-button value="2">
        <a-icon type="picture" class="margin-right-xs" />流程图</a-radio-button
      >
    </a-radio-group>
    <a-button
      class="delete-btn margin-left-sm"
      icon="close-circle"
      @click="
        () => {
          $emit('cancel');
        }
      "
      >关闭</a-button
    >
    <!-- 办理 -->
		<a-form :form="form">
			<div v-show="mode === '1'">
				<a-card>
					<!-- <previewModal ref="previewModal" :drawingList="drawingList" :isView="true" /> -->
					<component
						id="printForm"
						ref="previewModal"
						:isView="false"
						:drawingList="drawingList"
						:is="plugItem"
						v-for="(plugItem, plugIndex) in plugs"
						:key="plugIndex"
					></component>
				</a-card>
				<a-card class="margin-top-sm" title="审批记录">
					<a-table
						bordered
						size="small"
						:rowKey="(record, index) => record.comment.id"
						:columns="columns"
						:data-source="dataList"
						:pagination="pagination"
					></a-table>
				</a-card>
			</div>
			<!-- <div v-show="mode === '3'">
				<a-card>
					<a-table
						bordered
						:columns="columns"
						:data-source="dataList"
						:pagination="false"
					></a-table>
				</a-card>
			</div> -->
			<template>
				<bpmn-viewer
					ref="bpmView"
					v-show="mode === '2'"
					:params="params"
					:inProgress="inProgress"
					:notInProgress="notInProgress"
					:nodeParam="nodeParam"
				></bpmn-viewer>
			</template>
		</a-form>
  </t-drawer>
</template>

<script>
// import previewModal from '@/components/TopVUI/k-form-design/packages/KFormPreview/preview.vue';
import BpmnViewer from "@/components/TopVUI/bpmn/Viewer";
import { PageView, RouteView } from "@/layouts";
import draggable from "vuedraggable";
import pick from "lodash.pick";
import { getTypeListByFiled } from "@/utils/formatter";
// 表单字段
const fields = [
  "processInstanceId",
  "taskId",
  "message",
  "processDefinitionId",
];
const columns = [
  {
    title: "当前环节",
    dataIndex: "activityName",
    align: "center",
  },
  {
    title: "执行人",
    dataIndex: "userName",
    align: "center",
  },
  {
    title: "审批意见",
    dataIndex: "comment.message",
    align: "center",
  },
  {
    title: "处理时间",
    dataIndex: "comment.time",
    sorter: true,
    align: "center",
    customRender: function(text) {
      var json_date = new Date(text).toJSON();
      return new Date(new Date(json_date) + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, " ")
        .replace(/\.[\d]{3}Z/, "");
    },
  },
];
export default {
  name: "TreeList",
  components: {
    BpmnViewer,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    model: {
      type: Object,
    },
  },
  data() {
    return {
      columns,
      currentItem: "",
      index: "",
      drawingList: {},
      activeId: "",
      type: "",
      tableName: "",
      loading: false,
      fullscreen: true,
      isTask: true,
      mode: "1",
      params: "",
      dataList: [],
      inProgress: [],
      notInProgress: [],
      flowNodeButtons: [],
      nodeParam: {},
      modelType: 0,
      plugs: [],
      json: "",
      pagination: {
        pageSize: 5,
        hideOnSinglePage: true,
      },
      form: this.$form.createForm(this),
    };
  },
  mounted() {
    this.params = ``;
    this.plugs = [];
    this.plugs.push(() =>
      import(
        `@/components/TopVUI/k-form-design/packages/KFormPreview/preview.vue`
      )
    );
  },
  methods: {
    // 流程图
    changeMode(e) {
      this.mode = e.target.value;
      if (this.$refs.bpmView)
        this.$refs.bpmView.initDiagramAgain(
          this.json.lists.actDeModelId,
          this.json.lists.actDeModelKey,
          this.json.lists.actDeModelName,
          this.params
        );
    },
    // 获取数据
    loadData(record, json) {
      this.json = json;
      this.mode = "1";
      this.modelType = json.lists.modelType;
      if (this.modelType === "2") {
        this.plugs = [];
        this.plugs.push(() =>
          import(
            `@/components/TopVUI/k-form-design/packages/KFormPreview/preview.vue`
          )
        );
        this.drawingList = JSON.parse(json.lists.formDesign);
        this.drawingList.list.forEach((e, index) => {
          // e.options.disabled = true
          // e.options.hidden = false
          getTypeListByFiled(e, json.flowNodeField);
        });
        if (this.$refs.previewModal)
          this.$refs.previewModal.jsonData = this.drawingList;
      } else {
        this.plugs = [];
        this.drawingList = json.businessData;
        this.plugs.push(() =>
          import(`@/pages${json.flowNodeButtons[0].nodeFormPath}`)
        );
      }
      this.nodeParam = {
        procdefId: record.processDefinitionId,
        processInstanceId: record.processInstanceId,
      };
      // 设置流程图
      this.params = json.lists.flowDesign;
      if (this.$refs.bpmView)
        this.$refs.bpmView.initDiagramAgain(
          json.lists.actDeModelId,
          json.lists.actDeModelKey,
          json.lists.actDeModelName,
          this.params
        );
      this.dataList = json.commentBeanList;
      this.inProgress = json.inProgress;
      this.notInProgress = json.notInProgress;
    },
    activeFormItem(currentItem, index) {
      this.drawingList[index] = currentItem;
    },
  },
};
</script>

<style scoped="scoped">
.ant-form {
  height: auto;
}

.mL .ant-modal-footer {
  border: none !important;
}

/deep/ .ant-card {
  /* box-shadow: rgba(0, 0, 0, 0.1) 0px 5px 20px 0px !important; */
}
/deep/ .my-bpmn-con .bpmn-viewer-content {
  height: calc(100vh - 160px) !important;
}
/deep/ .my-bpmn-con .bpmn-viewer-container {
  height: calc(100vh - 160px) !important;
}
</style>
