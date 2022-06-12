<template>
  <t-drawer
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
      <a-radio-button value="2">
        <a-icon
          type="snippets"
          class="margin-right-xs"
        />审批记录</a-radio-button
      >
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
          <a-form :form="formOpinion">
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
            <template v-for="item in flowNodeButtons">
              <a-button
                v-if="isTask && item.nodeButtonCode === 'onLine'"
                type="primary"
                :style="{ marginRight: '8px' }"
                @click="handleAgree(1, 0, item.nodeButtonName)"
                >{{ item.nodeButtonName }}</a-button
              >
              <a-button
                v-if="isTask && item.nodeButtonCode === 'agree'"
                type="primary"
                :style="{ marginRight: '8px' }"
                @click="handleAgree(1, 0, item.nodeButtonName)"
                >{{ item.nodeButtonName }}</a-button
              >
              <a-button
                v-if="isTask && item.nodeButtonCode === 'update'"
                type="primary"
                :style="{ marginRight: '8px' }"
                @click="handleAgree(3)"
                >{{ item.nodeButtonName }}</a-button
              >
              <a-button
                v-if="isTask && item.nodeButtonCode === 'reject'"
                type="primary"
                :style="{ marginRight: '8px' }"
                @click="handleAgree(2, 0, item.nodeButtonName)"
                >{{ item.nodeButtonName }}</a-button
              >
              <a-button
                v-if="isTask && item.nodeButtonCode === 'transfer'"
                type="primary"
                :style="{ marginRight: '8px' }"
                @click="handleAgree(4, 1, item.nodeButtonName)"
                >{{ item.nodeButtonName }}</a-button
              >
              <a-button
                v-if="isTask && item.nodeButtonCode === 'returnAnyNode'"
                type="primary"
                :style="{ marginRight: '8px' }"
                @click="handleAgree(5, 1, item.nodeButtonName)"
                >{{ item.nodeButtonName }}</a-button
              >

              <a-button
                v-if="isTask && item.nodeButtonCode === 'withdraw'"
                type="primary"
                :style="{ marginRight: '8px' }"
                @click="handleAgree(4, 2, item.nodeButtonName)"
                >{{ item.nodeButtonName }}</a-button
              >
              <a-button
                v-if="isTask && item.nodeButtonCode === 'delegate'"
                type="primary"
                :style="{ marginRight: '8px' }"
                @click="handleAgree(4, 3, item.nodeButtonName)"
                >{{ item.nodeButtonName }}</a-button
              >
              <a-button
                v-if="isTask && item.nodeButtonCode === 'signatureBefore'"
                type="primary"
                :style="{ marginRight: '8px' }"
                @click="handleAgree(4, 4, item.nodeButtonName)"
                >{{ item.nodeButtonName }}</a-button
              >
              <a-button
                v-if="isTask && item.nodeButtonCode === 'signatureAfter'"
                type="primary"
                :style="{ marginRight: '8px' }"
                @click="handleAgree(4, 5, item.nodeButtonName)"
                >{{ item.nodeButtonName }}</a-button
              >
              <a-button
                v-if="isTask && item.nodeButtonCode === 'termination'"
                type="primary"
                :style="{ marginRight: '8px' }"
                @click="handleAgree(5, 2, item.nodeButtonName)"
                >{{ item.nodeButtonName }}</a-button
              >
            </template>
          </a-form>
        </template>
      </a-card>
    </div>
    <div v-show="mode === '2'">
      <a-card>
        <a-table
          bordered
          :rowKey="(record, index) => record.comment.id"
          :columns="columns"
          :data-source="dataList"
          :pagination="false"
        ></a-table>
      </a-card>
    </div>
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
    sorter: true,
    align: "center",
  },
  {
    title: "执行人",
    dataIndex: "userName",
    sorter: true,
    align: "center",
  },
  {
    title: "审批意见",
    dataIndex: "comment.message",
    sorter: true,
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
      type: 0,
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
        popTitle: "Document", //文件标题
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
          getTypeListByFiled(e, json.flowNodeField);
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
    changeAssign(e) {
      this.isAssign = e.target.checked;
      if (!this.isAssign) {
        this.formOpinion.setFieldsValue({
          assignUser: "",
          assignUserName: "",
        });
      }
    },
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
    //保存是获取表单数据
    getJsonData(fieldList) {
      console.log(fieldList);
      if (this.modelType == "2") {
        this.fieldList = fieldList;
        this.drawingList.list.forEach((e, index) => {
          let obj = setTypeList(e, fieldList);
          e = obj.e;
          fieldList = obj.list;
        });
      }
      if (this.type === 1 || this.type === 2) {
        fieldList.outcome = this.outComeType;
        console.log(fieldList);
        this.$emit("ok", this.type, this.drawingList, fieldList);
      } else if (this.type === 3) {
        this.handleUpdate();
      } else if (this.type === 4) {
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
      } else if (this.type === 5) {
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
    // 流程按钮统一处理事件
    handleAgree(e, type, title) {
      // console.log(this.modelType === "1");
      if (this.modelType === "1") {
        if (e === 1 || e === 2) {
          const form = this.$refs.previewModal[0].form;
          form.validateFields((errors, values) => {
            if (!errors) {
              values.outcome = title;
              this.$emit("ok", e, null, values);
            }
          });
        } else if (e === 5) {
          this.rejectType = type;
          this.rejectTitle = title;
          this.type = e;
          this.getJsonData();
        }
      } else {
        if (e === 4) {
          this.transferType = type;
          this.transferTitle = title;
        } else if (e === 5) {
          this.rejectType = type;
          this.rejectTitle = title;
        }
        this.outComeType = title;
        this.type = e;
        this.$refs.previewModal[0].getJsonData();
      }
    },
    // 更新
    handleUpdate() {
      let pramer = {
        uuid: this.formUuid,
        formDesign: JSON.stringify(this.drawingList),
        formModel: JSON.stringify(this.drawingList.config),
      };
      let pramar = this.fieldList;
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
              this.$message.info(res.message);
              this.$emit("close");
            } else {
              this.$message.info(res.message);
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
              this.$message.info(res.message);
              this.$emit("close");
            } else {
              this.$message.info(res.message);
            }
            this.rejectConfirmLoading = false;
          });
        }
      });
    },
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
