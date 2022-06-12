<template>
  <t-drawer
    title=""
    :width="1000"
    :visible="visible"
    :confirmLoading="loading"
    :closable="false"
    :fullscreen="fullscreen"
    :switchFullscreen="fullscreen"
    @close="
      () => {
        $emit('cancel');
      }
    "
  >
    <a-radio-group v-model="mode" class="margin-bottom-xs" @change="changeMode">
      <a-radio-button value="1">
        <a-icon type="edit" class="margin-right-xs" />表单信息</a-radio-button
      >
      <!-- <a-radio-button value="2">
        <a-icon
          type="snippets"
          class="margin-right-xs"
        />审批记录</a-radio-button
      > -->
      <a-radio-button value="4">
        <a-icon type="picture" class="margin-right-xs" />流程图</a-radio-button
      >
    </a-radio-group>
    <a-button
      class="delete-btn margin-left-sm"
      icon="printer"
      v-print="printObj"
      >打印</a-button
    >
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
    <div v-show="mode === '1'">
      <a-form :form="formOpinion" @submit="handleSubmit">
        <a-card class="missionForm">
          <template>
            <!-- <previewModal id="printForm" ref="previewModal" :drawingList="drawingList" @getJsonData="getJsonData" /> -->
            <component
              id="printForm"
              ref="previewModal"
              :isView="isView"
              :drawingList="drawingList"
              @getJsonData="getJsonData"
              :is="plugItem"
              v-for="(plugItem, plugIndex) in plugs"
              :key="plugIndex"
            ></component>
          </template>
        </a-card>
        <a-card class="margin-top-sm">
          <template>
            <a-form-item label="审批意见">
              <a-textarea
                :rows="4"
                v-decorator="[
                  'message',
                  { rules: [{ required: true, message: '必填' }] },
                ]"
              />
            </a-form-item>
            <a-form-item class="hiddenItem">
              <a-input v-decorator="['processInstanceId']" type="hidden" />
            </a-form-item>
            <a-form-item class="hiddenItem">
              <a-input v-decorator="['taskId']" type="hidden" />
            </a-form-item>
            <a-form-item class="hiddenItem">
              <a-input v-decorator="['processDefinitionId']" type="hidden" />
            </a-form-item>
            <a-form-item label="">
              <a-checkbox
                @change="changeDuplicate"
                v-model="isDuplicate"
              /><span class="margin-left-xs">是否抄送</span>
            </a-form-item>
            <a-form-item label="抄送给" v-if="isDuplicate">
              <a-input
                @click="() => $refs.userPopup.show()"
                placeholder="请选择"
                v-decorator="[
                  'duplicateUserName',
                  { rules: [{ required: true, message: '必填' }] },
                ]"
              >
                <a-icon
                  slot="addonAfter"
                  type="user"
                  @click="() => $refs.userPopup.show()"
                />
              </a-input>
              <t-select-role
                ref="userPopup"
                :visible="isUserPopups"
                :showBtn="false"
                :typeNum="2"
                @changeData="(value) => setUser(value, 1)"
                @close="() => (isUserPopups = false)"
              />
            </a-form-item>
            <a-form-item label="">
              <a-checkbox @change="changeAssign" v-model="isAssign" /><span
                class="margin-left-xs"
                >是否指定下一节点处理人</span
              >
            </a-form-item>
            <a-form-item label="指定" v-if="isAssign">
              <a-input
                @click="() => (isUserPopup = true)"
                placeholder="请选择"
                v-decorator="[
                  'assignUserName',
                  { rules: [{ required: true, message: '必填' }] },
                ]"
              >
                <a-icon
                  slot="addonAfter"
                  type="user"
                  @click="() => (isUserPopup = true)"
                />
              </a-input>
              <user-popup
                :typeForm="true"
                :visible="isUserPopup"
                :typeNum="1"
                @change="(value) => setUser(value, 2)"
                @close="() => (isUserPopup = false)"
              />
            </a-form-item>
            <a-form-item class="hiddenItem">
              <a-input v-decorator="['assignUser']" type="hidden" />
            </a-form-item>
            <a-form-item class="hiddenItem">
              <a-input v-decorator="['duplicateUser']" type="hidden" />
            </a-form-item>
            <template v-for="(item, index) in flowNodeButtons">
              <a-button
                class="margin-buttom"
                :key="index"
                type="primary"
                html-type="submit"
                :data-node="item.nodeButtonCode"
                :data-name="item.nodeButtonName"
                :style="{ marginRight: '8px' }"
                >{{ item.nodeButtonName }}</a-button
              >
            </template>
          </template>
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
      </a-form>
    </div>
    <!-- <div v-show="mode === '2'">
      <a-card>
        <a-table
          bordered
          size="small"
          :rowKey="(record, index) => record.comment.id"
          :columns="columns"
          :data-source="dataList"
          :pagination="false"
        ></a-table>
      </a-card>
    </div> -->
    <div v-show="mode === '4'">
      <bpmn-viewer
        ref="bpmView"
        :params="params"
        :inProgress="inProgress"
        :notInProgress="notInProgress"
        :nodeParam="nodeParam"
      ></bpmn-viewer>
    </div>
    <taskTransfer
      ref="taskTransfer"
      :title="transferTitle"
      :transferType="transferType"
      :confirmLoading="transferConfirmLoading"
      :model="taskModel"
      :visible="taskVisible"
      @cancel="
        () => {
          taskVisible = false;
        }
      "
      @ok="handleTransfer"
    ></taskTransfer>
    <taskReject
      ref="taskReject"
      :title="rejectTitle"
      :rejectType="rejectType"
      :rejectList="rejectList"
      :model="rejectModel"
      :visible="taskRejectVisible"
      :confirmLoading="rejectConfirmLoading"
      @cancel="
        () => {
          taskRejectVisible = false;
        }
      "
      @ok="handleReject"
    ></taskReject>
  </t-drawer>
</template>

<script>
import BpmnViewer from "@/components/TopVUI/bpmn/Viewer";
// import previewModal from '@/components/TopVUI/k-form-design/packages/KFormPreview/preview.vue';
import taskTransfer from "./taskTransfer.vue";
import taskReject from "./taskReject.vue";

import { setTypeList, getTypeListByFiled } from "@/utils/formatter";
import { PageView } from "@/layouts";
import draggable from "vuedraggable";
import pick from "lodash.pick";
import userPopup from "@/components/TopVUI/custom/userPopup";
import TSelectRole from "@/components/TopVUI/custom/TSelectRole";
// 表单字段
const fields = [
  "processInstanceId",
  "taskId",
  "message",
  "processDefinitionId",
  "duplicateUserName",
  "assignUserName",
  "assignUser",
  "duplicateUser",
];
const columns = [
  {
    title: "当前环节",
    dataIndex: "activityName",
    align: "center",
  },
  {
    title: "流程发起人",
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
    // customRender:function(text){
    //   var json_date = new Date(text).toJSON();
    //   return new Date(new Date(json_date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
    // }
  },
];
export default {
  name: "TreeList",
  components: {
    draggable,
    BpmnViewer,
    taskTransfer,
    taskReject,
    userPopup,
    TSelectRole,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
    model: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      columns,
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 3,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 21,
        },
      },
      currentItem: "",
      index: "",
      drawingList: {},
      activeId: "",
      formConf: "",
      formOpinion: this.$form.createForm(this),
      type: "",
      tableName: "",
      fullscreen: true,
      isTask: true,
      mode: "1",
      params: "",
      dataList: [],
      inProgress: [],
      notInProgress: [],
      flowNodeButtons: [],
      uuid: "",
      tableName: "",
      formUuid: "",
      fieldList: {},
      btnType: "",
      taskModel: null,
      taskVisible: false,
      taskRejectVisible: false,
      transferConfirmLoading: false,
      rejectConfirmLoading: false,
      rejectList: [],
      rejectModel: null,
      transferType: 0,
      transferTitle: "",
      rejectType: 0,
      rejectTitle: "",
      printObj: {
        id: "printForm", //打印标签的id
        popTitle: "流程表单", //文件标题
        // extraCss: 'https://www.google.com,https://www.google.com',
        extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>',
      },
      nodeParam: {},
      plugs: [],
      modelType: 0,
      json: "",
      isUserPopups: false,
      isUserPopup: false,
      isDuplicate: false,
      isAssign: false,
      isView: true,
      outComeType: "",
      pagination: {
        pageSize: 5,
        hideOnSinglePage: true,
      },
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
  created() {
    // 防止表单未注册
    fields.forEach((v) => this.formOpinion.getFieldDecorator(v));
    // 当 model 发生改变时，为表单设置值
    this.$watch("model", () => {
      this.model && this.formOpinion.setFieldsValue(pick(this.model, fields));
    });
  },
  methods: {
    // 流程图信息
    changeMode(e) {
      this.mode = e.target.value;
      if (this.$refs.bpmView && this.mode == "4")
        this.$refs.bpmView.initDiagramAgain(
          this.json.lists.actDeModelId,
          this.json.lists.actDeModelKey,
          this.json.lists.actDeModelName,
          this.params
        );
    },
    // 加载办理数据
    loadData(e, json) {
      this.formOpinion.setFieldsValue(pick(this.model, fields));
      this.isDuplicate = false;
      this.isAssign = false;
      this.json = json;
      this.mode = "1";
      this.modelType = json.lists.modelType;
      let flowNodeField = json.flowNodeField;
      this.modelKey = e.modelKey;
      this.uuid = e.businessKey;
      this.nodeParam = {
        procdefId: e.processDefinitionId,
        processInstanceId: e.processInstanceId,
      };
			console.log(this.modelType)
      if (this.modelType === "2") {
        //2为可视化，1为自定义
        this.plugs = [];
        this.plugs.push(() =>
          import(
            `@/components/TopVUI/k-form-design/packages/KFormPreview/preview.vue`
          )
        ); //默认加载表单预览页面
        this.drawingList = JSON.parse(json.lists.formDesign);
        this.drawingList.list.forEach((e, index) => {
          getTypeListByFiled(e, flowNodeField);
        });
        if (this.$refs.previewModal)
          this.$refs.previewModal.jsonData = this.drawingList; //表单数据设置
        this.tableName = json.lists.formTableName;
        console.log("this.drawingList====", this.drawingList);
      } else {
        this.plugs = [];
        this.drawingList = json.businessData;
        this.plugs.push(() =>
          import(`@/pages${json.flowNodeButtons[0].nodeFormPath}`)
        ); //动态加载外联表单页
        this.isView = Boolean(Number(json.flowNodeButtons[0].whetherUpdate));
        // if(this.$refs.previewModal) this.$refs.previewModal.drawingList = this.drawingList
      }
      this.params = json.lists.flowDesign;
      // if(this.$refs.bpmView) this.$refs.bpmView.initDiagramAgain(json.lists.actDeModelId,json.lists.actDeModelKey, json.lists.actDeModelName, this.params)		//流程数据设置
      this.dataList = json.commentBeanList; //流程处理意见
      this.inProgress = json.inProgress; //正在走的结点数组
      this.notInProgress = json.notInProgress; //已走完的结点数组
      this.flowNodeButtons = json.flowNodeButtons; //路程处理按钮
      this.formUuid = json.lists.uuid;
    },
    toHump(name) {
      return name.replace(/\_(\w)/g, function(all, letter) {
        return letter.toUpperCase();
      });
    },
    // 流程处理节点人员设置
    changeDuplicate(e) {
      this.isDuplicate = e.target.checked;
      if (!this.isDuplicate) {
        this.formOpinion.setFieldsValue({
          duplicateUser: "",
          duplicateUserName: "",
        });
      }
    },
    // 下一节点处理人
    changeAssign(e) {
      this.isAssign = e.target.checked;
      if (!this.isAssign) {
        this.formOpinion.setFieldsValue({
          assignUser: "",
          assignUserName: "",
        });
      }
    },
    // 设置节点人员
    setUser(val, type) {
      if (type == 2) {
        this.formOpinion.setFieldsValue({
          assignUser: val.userNameId,
          assignUserName: val.userName,
        });
      } else {
        this.formOpinion.setFieldsValue({
          duplicateUser: val.userNameId,
          duplicateUserName: val.userName,
        });
      }
      console.log(this.nodeForm);
    },
    //保存是获取表单数据   表单流程适用
    getJsonData(fieldList) {
      if (this.modelType == "2") {
        this.fieldList = fieldList;
        this.drawingList.list.forEach((e, index) => {
          let obj = setTypeList(e, fieldList);
          e = obj.e;
          fieldList = obj.list;
        });
      }
      if (
        this.type === "agree" ||
        this.type === "reject" ||
        this.type == "onLine"
      ) {
        fieldList.outcome = this.outComeType;
        this.$emit("ok", this.type, this.drawingList, fieldList);
      } else if (this.type === "update") {
        this.handleUpdate();
      } else if (
        [
          "transfer",
          "withdraw",
          "delegate",
          "signatureBefore",
          "signatureAfter",
        ].includes(this.type)
      ) {
        this.taskVisible = true;
        const form = this.$refs.taskTransfer.form;
        form.resetFields(); // 清理表单数据（可不做）
        this.taskModel = this.model;
        this.taskModel.instanceId = this.model.processInstanceId;
        if (this.transferType === 4) {
          this.$refs.taskTransfer.typeNum = 2;
          this.taskModel.signature = "before";
        } else if (this.transferType === 5) {
          this.$refs.taskTransfer.typeNum = 2;
          this.taskModel.signature = "after";
        }
        // this.handleTransfer()
      } else if (["returnAnyNode", "termination"].includes(this.type)) {
        const form = this.$refs.taskReject.form;
        form.resetFields(); // 清理表单数据（可不做）
        this.taskRejectVisible = true;
        this.rejectModel = this.model;
        console.log(this.rejectModel);
        this.getBackNodesByProcessInstanceId();
      }
    },
    //获取可驳回节点列表
    getBackNodesByProcessInstanceId() {
      this.confirmLoading = true;
      this.$post("/workflow/apiFlowableTask/getBackNodesByProcessInstanceId", {
        taskId: this.model.taskId,
        processInstanceId: this.model.processInstanceId,
      }).then((res) => {
        if (res.statuCode != 300) {
          this.rejectList = res;
        }
        this.confirmLoading = false;
      });
    },
    // 表单提交
    handleSubmit(event) {
			event.preventDefault(); // 阻止默认事件,防止表单提交刷新页面
      let e = event.submitter.dataset.node; //此获取方法不适用与所有浏览器，可切换handleAgree事件
      let title = event.submitter.dataset.name;
      this.type = e;
      let arr4 = [
        "transfer",
        "withdraw",
        "delegate",
        "signatureBefore",
        "signatureAfter",
      ];
      let arr5 = ["returnAnyNode", "termination"];
      // console.log(['transfer','withdraw','delegate','signatureBefore','signatureAfter'].includes(e))

      // if (this.modelType === "1") {
      if (e == "agree" || e == "reject" || e == "onLine") {
        // const form = this.$refs.previewModal[0].form;
        this.formOpinion.validateFields((errors, values) => {
          if (!errors) {
						let formData = {}
            if (this.modelType === "2") {
							this.drawingList.list.forEach(item => {
								if(item.type === "card"){
									item.list.forEach(val => {
										if(typeof val.options.defaultValue === "object"){
											formData[val.model] = JSON.stringify(val.options.defaultValue)
										}else{
											formData[val.model] = val.options.defaultValue
										}
									})
								}else if(~['grid','tabs'].indexOf(item.type)){
									item.columns.forEach(val1 => {
										val1.list.forEach(val2 => {
											if(typeof val2.options.defaultValue === "object"){
												formData[val2.model] = JSON.stringify(val2.options.defaultValue)
											}else{
												formData[val2.model] = val2.options.defaultValue
											}
										})
									})
								}else if(item.type === "table"){
									item.trs.forEach(val1 => {
										val1.tds.forEach(val2 => {
											val2.list.forEach(val3 => {
												if(typeof val3.options.defaultValue === "object"){
													formData[val3.model] = JSON.stringify(val3.options.defaultValue)
												}else{
													formData[val3.model] = val3.options.defaultValue
												}
											})
										})
									})
								}else{
									if(typeof item.options.defaultValue === "object"){
										formData[item.model] = JSON.stringify(item.options.defaultValue)
									}else{
										formData[item.model] = item.options.defaultValue
									}
								}
							})
              values.formDesign = JSON.stringify(this.drawingList);
              values.formModel = JSON.stringify(this.drawingList.config);
            }
						formData.tableName = this.tableName;
						formData.uuid = this.uuid;
            values.outcome = title;
						values = Object.assign(values,formData)
            // this.$emit("ok", values);
            this.$emit("ok", this.type, this.drawingList, values);
          }
        });
      } else if (arr5.includes(e)) {
        this.rejectType = arr5.indexOf(e) + 1;
        this.rejectTitle = title;
        this.rejectType = arr5.indexOf(e) + 1;
        this.rejectTitle = title;
        const form = this.$refs.taskReject.form;
        form.resetFields(); // 清理表单数据（可不做）
        this.taskRejectVisible = true;
        this.rejectModel = this.model;
        this.getBackNodesByProcessInstanceId();
        // this.getJsonData();
      } else if (["update"].includes(e)) {
          // 判断是自己写的表单还是通过拖动出来的表单  1自己写的表单  2拖动设计的
        if(2 == this.modelType){
					this.formOpinion.validateFields((errors, values) => {
						if (!errors) {
							this.handleUpdate();
						}
					})
        }else{
            let nodeFormUpdatePath = this.flowNodeButtons[0].nodeFormUpdatePath;
            if (nodeFormUpdatePath) {
                // const form = this.$refs.previewModal[0].form;
                this.formOpinion.validateFields((errors, values) => {
                    if (!errors) {
                        this.$post(nodeFormUpdatePath, values).then((res) => {
                            if (res.statusCode === 200) {
                                this.$message.success(res.message, 1.5);
                                this.$emit("close");
                            } else {
                                this.$message.error(res.message, 1.5);
                            }
                        });
                    }
                });
            }
        }


      } else if (arr4.includes(e)) {
        let index = [
          "transfer",
          "withdraw",
          "delegate",
          "signatureBefore",
          "signatureAfter",
        ].indexOf(e);
        this.transferType = index + 1;
        this.transferTitle = title;
        this.taskVisible = true;
        const form = this.$refs.taskTransfer.form;
        form.resetFields(); // 清理表单数据（可不做）
        this.taskModel = this.model;
        this.taskModel.instanceId = this.model.processInstanceId;
        if (this.transferType === 4) {
          this.$refs.taskTransfer.typeNum = 2;
          this.taskModel.signature = "before";
        } else if (this.transferType === 5) {
          this.$refs.taskTransfer.typeNum = 2;
          this.taskModel.signature = "after";
        }
      } else if (e === "rejectPreviousStep") {
        const values = {
          processInstanceId: this.model.processInstanceId,
          currentActivityId: this.model.nodeId,
          processDefinitionId: this.model.processDefinitionId,
        };
        this.$post(
          "/workflow/apiFlowableTask/goBackToThePreviousStep",
          values
        ).then((res) => {
          if (res.statusCode === 200) {
            this.$message.success(res.message, 1.5);
            this.$emit("close");
          } else {
            this.$message.error(res.message, 1.5);
          }
        });
      }
    },
    // 流程按钮统一处理事件
    handleAgree(e, title) {
      let arr4 = [
        "transfer",
        "withdraw",
        "delegate",
        "signatureBefore",
        "signatureAfter",
      ];
      let arr5 = ["returnAnyNode", "termination"];
      // console.log(['transfer','withdraw','delegate','signatureBefore','signatureAfter'].includes(e))
      let index = [
        "transfer",
        "withdraw",
        "delegate",
        "signatureBefore",
        "signatureAfter",
      ].indexOf(e);
      // if (this.modelType === "1") {
      if (e == "agree" || e == "reject" || e == "onLine") {
        // const form = this.$refs.previewModal[0].form;
        if (this.modelType === "1") {
          this.formOpinion.validateFields((errors, values) => {
            if (!errors) {
              // console.log(values);
              values.outcome = title;
              this.$emit("ok", e, null, values);
            }
          });
        }
      } else if (arr5.includes(e)) {
        this.rejectType = arr5.indexOf(e) + 1;
        this.rejectTitle = title;
        this.type = e;
        this.getJsonData();
      } else if (["update"].includes(e)) {
        let nodeFormUpdatePath = this.flowNodeButtons[0].nodeFormUpdatePath;
        if (nodeFormUpdatePath) {
          // const form = this.$refs.previewModal[0].form;
          this.formOpinion.validateFields((errors, values) => {
            if (!errors) {
              this.$post(nodeFormUpdatePath, values).then((res) => {
                if (res.statusCode === 200) {
                  this.$message.success(res.message, 1.5);
                  this.$emit("close");
                } else {
                  this.$message.error(res.message, 1.5);
                }
              });
            }
          });
        }
      } else {
        console.log(arr4.includes(e));
        if (arr4.includes(e)) {
          this.transferType = index + 1;
          this.transferTitle = title;
          console.log(this.transferType);
        } else if (arr5.includes(e)) {
          this.rejectType = arr5.indexOf(e) + 1;
          this.rejectTitle = title;
        }
        this.type = e;
        this.outComeType = title;
        if (this.modelType === "1") {
          this.getJsonData();
        } else {
          this.$refs.previewModal[0].getJsonData();
        }
      }
    },
    // 更新
    handleUpdate() {
			console.log(this.drawingList.list)
      // this.nodeParam = {
      //   procdefId: e.processDefinitionId,
      //   processInstanceId: e.processInstanceId,
      // };
      let pramer = {
        uuid: this.formUuid,
        formDesign: JSON.stringify(this.drawingList),
        formModel: JSON.stringify(this.drawingList.config),
        processInstanceId: this.nodeParam.processInstanceId,
        procdefId: this.nodeParam.procdefId,
        actDeModelKey: this.json.lists.actDeModelKey,
      };
			// let pramar = this.fieldList;
			let pramar = {}
			if (this.modelType === "2") {
				this.drawingList.list.forEach(item => {
					if(item.type === "card"){
						item.list.forEach(val => {
							if(typeof val.options.defaultValue === "object"){
								pramar[val.model] = JSON.stringify(val.options.defaultValue)
							}else{
								pramar[val.model] = val.options.defaultValue
							}
						})
					}else if(~['grid','tabs'].indexOf(item.type)){
						item.columns.forEach(val1 => {
							val1.list.forEach(val2 => {
								if(typeof val2.options.defaultValue === "object"){
									pramar[val2.model] = JSON.stringify(val2.options.defaultValue)
								}else{
									pramar[val2.model] = val2.options.defaultValue
								}
							})
						})
					}else if(item.type === "table"){
						item.trs.forEach(val1 => {
							val1.tds.forEach(val2 => {
								val2.list.forEach(val3 => {
									if(typeof val3.options.defaultValue === "object"){
										pramar[val3.model] = JSON.stringify(val3.options.defaultValue)
									}else{
										pramar[val3.model] = val3.options.defaultValue
									}
								})
							})
						})
					}else{
						if(typeof item.options.defaultValue === "object"){
							pramar[item.model] = JSON.stringify(item.options.defaultValue)
						}else{
							pramar[item.model] = item.options.defaultValue
						}
					}
				})
			}
      pramar.tableName = this.tableName;
      pramar.uuid = this.uuid;
      this.$emit("update", pramer, pramar);
    },
    //转办
    handleTransfer() {
      let transferUrl = "";
      const form = this.$refs.taskTransfer.form;
      form.validateFields((errors, values) => {
        if (!errors) {
          if (this.transferType === 1) {
            transferUrl = "/workflow/apiFlowableTask/transfer";
          } else if (this.transferType === 2) {
            transferUrl = "/workflow/apiFlowableTask/revokeProcess";
          } else if (this.transferType === 3) {
            transferUrl = "/workflow/apiFlowableTask/delegate";
          } else if (this.transferType === 4 || this.transferType === 5) {
            transferUrl = "/workflow/apiFlowableTask/signature";
          }
          console.log(values, transferUrl);
          this.transferConfirmLoading = true;
          this.$post(transferUrl, values).then((res) => {
            if (res.statusCode === 200) {
              this.taskVisible = false;
              this.$message.info(res.message, 1.5);
              this.$emit("close");
            } else {
              this.$message.info(res.message, 1.5);
            }
            this.transferConfirmLoading = false;
          });
        }
      });
    },
    // 驳回到任意节点
    handleReject() {
      let rejectUrl = "";
      const form = this.$refs.taskReject.form;
      form.validateFields((errors, values) => {
        if (!errors) {
          if (this.rejectType === 1) {
            rejectUrl = "/workflow/apiFlowableTask/reject";
          } else {
            rejectUrl =
              "/workflow/apiFlowableProcessInstance/stopProcessInstanceById";
          }
          console.log(values, rejectUrl);
          this.rejectConfirmLoading = true;
          this.$post(rejectUrl, values).then((res) => {
            if (res.statusCode === 200) {
              this.taskRejectVisible = false;
              this.$message.info(res.message, 1.5);
              this.$emit("close");
            } else {
              this.$message.info(res.message, 1.5);
            }
            this.rejectConfirmLoading = false;
          });
        }
      });
    }
  },
};
</script>

<style scoped="scoped">
.ant-form {
  height: auto;
  width: 100%;
}

/* .ant-modal-footer {
    border: none !important;
  } */

/deep/ .ant-card {
  /* box-shadow: rgba(0, 0, 0, 0.1) 0px 5px 20px 0px !important; */
}
/deep/ .my-bpmn-con .bpmn-viewer-content {
  height: calc(100vh - 120px) !important;
}
/deep/.my-bpmn-con .bpmn-viewer-content {
  height: calc(100vh - 120px) !important;
}
.missionForm {
  /* height: calc(100vh - 605px) !important; */
  /* overflow: hidden;
	   overflow-y: auto; */
}
</style>
