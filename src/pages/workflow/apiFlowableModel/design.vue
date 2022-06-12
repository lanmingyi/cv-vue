<template>
	<t-drawer class="t-drf" :visible="visible" :closable="false" :fullscreen="fullscreen" :switchFullscreen="fullscreen"
		@close="
      () => {
        $emit('cancel');
      }
    ">
		<a-spin :spinning="loading">
			<a-steps v-model="current" type="navigation" size="default" :style="stepStyle">
				<a-step title="表单设计" />
				<a-step title="流程设计" />
			</a-steps>
			<form-view ref="formView1" :parentFormDesignUuid="formDesignUuid" :formTableName="formTableName" v-show="current === 0"
				@sendFormData="sendFormData" @updateList="updateList" @formSave="formSave" @close="
          () => {
            $emit('cancel');
          }
        "></form-view>
			<vue-bpmn ref="bpmnData1" :isEdit="isEdit" :pramas="pramas" :formTableName="formTableName"
				v-show="current === 1" style="overflow: hidden" product="flowable" @bpmSave="bpmSave" @close="
          () => {
            $emit('cancel');
          }
        " :formFeildList="formFeildList"></vue-bpmn>
		</a-spin>
		<div :style="{
        background: 'rgba(255,255,255,1)',
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        textAlign: 'right',
        zIndex: 1,
      }">
			<a-button type="primary" :style="{ marginRight: '8px' }" @click="onChange">
				{{ current === 0 ? "下一步" : "上一步" }}
			</a-button>
			<a-button :style="{ marginRight: '8px' }" @click="
          () => {
            $emit('cancel');
          }
        ">
				取消
			</a-button>
			<a-button type="primary" @click="ok">
				确定
			</a-button>
		</div>
		<table-form ref="tableForm" :visible="visibleTable" :loading="confirmLoading" @cancel="tableHandleCancel"
			@ok="tableHandleOk"></table-form>
	</t-drawer>
</template>

<script>
	import VueBpmn from "@/components/TopVUI/bpmn/VueBpmn";
	import formView from "@/components/TopVUI/k-form-design/packages/KFormDesign/workFlowForm.vue";
	// import formView from "@/components/TopVUI/k-form-design/packages/KFormPreview/workFlowPreview.vue";
	import tableForm from "../../form/formModule/formModule.vue";

	export default {
		name: "design",
		props: {
			visible: {
				type: Boolean,
				required: true,
			},
			model: {
				type: Object,
				default: () => null,
			},
			loading: {
				type: Boolean,
				required: false,
			},
			isEdit: {
				type: Boolean,
				required: false,
			},
			formDesignUuid: {
				type: String,
				required: true
			},
		},
		data() {
			return {
				fullscreen: true,
				current: 0,
				stepStyle: {
					// background:'#fafafa',
					boxShadow: "0px -1px 0 0 #e8e8e8 inset",
				},
				visibleTable: false,
				confirmLoading: false,
				formTableName: "",
				formData: "",
				bpmData: "",
				pramas: "",
				type: 0,
				uuid: "",
				formFeildList: [],
			};
		},
		components: {
			VueBpmn,
			formView,
			tableForm
		},
		methods: {
			getData(e) {},
			// 设置表单配置参数
			sendFormData(e) {
				if (e === 300) {
					this.$message.error("表单数据获取失败！");
					this.$emit("cancel");
				} else {
					this.$refs.bpmnData1.getFormLists(e);
				}
			},
			// 更新表单配置参数
			updateList(e) {
				this.$refs.bpmnData1.updateFormList(e);
			},
			// 设置数据表格
			setTable() {
				this.current = 0;
				this.visibleTable = true;
				this.uuid = "";
				if (this.$refs.tableForm) this.$refs.tableForm.getRefresh();
			},
			// 流程保存
			bpmSave(data) {
				this.bpmData = data;
				console.log(data);
				this.$refs.formView1.handleSave();
			},
			// 表单保存
			formSave(data) {
				console.log(data);
				this.formData = data;
				this.$emit(
					"ok",
					this.bpmData,
					this.formData,
					this.formTableName,
					this.uuid
				);
			},
			deploy() {},
			onChange() {
				this.current = this.current === 0 ? 1 : 0;
			},
			tableHandleCancel() {
				this.visibleTable = false;
				this.$emit("cancel");
			},
			tableHandleOk(e) {
				this.formTableName = e.tableName;
				this.visibleTable = false;
				this.$refs.formView1.loadData(this.formTableName);
				this.$refs.bpmnData1.initDiagramAgain();
			},
			ok() {
				this.$refs.bpmnData1.save();
			},
			//setAllData(e,procdefId){
			//this.current = 0
			//this.loading = true
			//this.$post('/workflow/flowModel/getDetailByModelKey',{modelKey:e,procdefId:procdefId}).then((res) => {
			// 	if(res.statusCode !==300){
			// 		let flowModel = res.flowModel
			// 		this.uuid = res.uuid
			// 		this.formTableName = flowModel.formTableName
			// 		this.$refs.formView1.getFormJson(flowModel.formDesign,flowModel.formModel,flowModel.formTableName)
			// 		this.pramas = flowModel.flowDesign
			// 		this.$refs.bpmnData1.initDiagramAgain(flowModel.actDeModelId,flowModel.actDeModelKey,flowModel.actDeModelName,flowModel.flowDesign)
			// 	} else {
			// 		this.$emit('cancel')
			// 		this.$message.error(res.message)
			// 	}
			// this.loading = false
			//})
			//},
			// 编辑时设置表单流程数据
			setAllData(res) {
				this.current = 0;
				let flowModel = res.flowModel;
				this.uuid = flowModel.uuid;
				this.formTableName = flowModel.formTableName;
				this.$refs.formView1.getFormJson(
					flowModel.formDesign,
					flowModel.formModel,
					flowModel.formTableName
				); //表单户数
				this.pramas = flowModel.flowDesign;
				this.$refs.bpmnData1.initDiagramAgain(
					flowModel.actDeModelKey,
					flowModel.actDeModelName,
					flowModel.flowDesign,
					flowModel.permissionType,
					flowModel.permissionValue
				); //流程数据
			},
		},
	};
</script>

<style>
	.t-drf .ant-drawer-body {
		padding: 0 !important;
	}

	.t-drf .ant-modal-body {
		padding: 0 !important;
	}

	.right-board .right-scrollbar {
		height: calc(100vh - 42px - 50px);
	}

	.t-drf .form-designer-container-9136076486841527 .content.show-head {
		height: calc(100vh - 56px - 53px) !important;
	}

	.t-drf .form-designer-container-9136076486841527 {
		height: calc(100vh - 56px - 53px) !important;
	}

	.t-drf .close-box {
		bottom: 53px !important;
	}
</style>
