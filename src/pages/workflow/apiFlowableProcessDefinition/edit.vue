<template>
  <t-drawer
    title="发起流程"
    :width="1000"
    :visible="visible"
    :confirmLoading="loading"
    :fullscreen="fullscreen"
    @close="cancel"
  >
    <a-form :form="form" @submit="handleSubmit">
      <a-spin :spinning="loading">
        <a-tabs
          v-model="currentIndex"
          @change="changCurrentTab"
          class="formTab"
          tabPosition="left"
        >
          <a-tab-pane key="1">
            <span slot="tab">
              <a-icon type="form" />
              表单信息
            </span>

            <a-card>
              <!-- <previewModal
                class="nodeForm"
                ref="previewModal"
                :drawing-list="drawingList"
                @getJsonData="getJsonData"
              ></previewModal> -->
              <component
                ref="previewModal"
                class="nodeForm"
                :drawing-list="drawingList"
                @getJsonData="getJsonData"
                :is="plugItem"
                v-for="(plugItem, plugIndex) in plugs"
                :key="plugIndex"
                :isview="false"
              ></component>
            </a-card>
            <a-card class="margin-top">
              <a-form-item label="流程标题">
                <a-input
                  v-decorator="[
                    'businessTitle',
                    {
                      initialValue: businessTitle,
                      rules: [{ required: true, message: '必填' }],
                    },
                  ]"
                />
              </a-form-item>
              <a-form-item class="hiddenItem">
                <a-input v-model="procdefId" type="hidden" />
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
                  key="1"
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
                  key="2"
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
              <a-form-item label="">
                <a-checkbox v-model="skipNode" /><span class="margin-left-xs"
                  >跳过第一个节点</span
                >
              </a-form-item>
              <a-form-item class="hiddenItem">
                <a-input v-decorator="['assignUser']" type="hidden" />
              </a-form-item>
              <a-form-item class="hiddenItem">
                <a-input v-decorator="['duplicateUser']" type="hidden" />
              </a-form-item>
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="2">
            <span slot="tab">
              <a-icon type="picture" />
              流程图
            </span>
            <bpmn-viewer ref="bpmView" :params="params"></bpmn-viewer>
          </a-tab-pane>
        </a-tabs>
      </a-spin>
      <div
        :style="{
          background: 'rgba(255,255,255,1)',
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          textAlign: 'right',
          zIndex: 1,
        }"
      >
        <a-button
          :style="{ marginRight: '8px' }"
          @click="
            () => {
              $emit('cancel');
            }
          "
        >
          取消
        </a-button>
        <a-button type="primary" html-type="submit">
          启动
        </a-button>
      </div>
    </a-form>
  </t-drawer>
</template>

<script>
// import viewForm from '../../form/formDefine/view.vue'
// import previewModal from "@/components/TopVUI/k-form-design/packages/KFormPreview/preview.vue";

import {
  setTypeList,
  loadTypeList,
  getTypeListByFiled,
} from "@/utils/formatter";
import BpmnViewer from "@/components/TopVUI/bpmn/Viewer";
import TSelectRole from "@/components/TopVUI/custom/TSelectRole";
import userPopup from "@/components/TopVUI/custom/userPopup";
export default {
  name: "apiFlowableProcessDefinitionEdit",
  components: {
    // previewModal,
    BpmnViewer,
    userPopup,
    TSelectRole,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 5,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 17,
        },
      },
      drawingList: {},
      form: this.$form.createForm(this),
      model: {},
      type: "",
      modelKey: "",
      loading: false,
      tableName: "",
      businessTitle: "",
      uuid: "",
      procdefId: "",
      fullscreen: true,
      currentIndex: "1",
      json: "",
      params: "",
      isUserPopups: false,
      isUserPopup: false,
      isDuplicate: false,
      isAssign: false,
      plugs: [],
      modelType: 0,
      saveUrl: "",
      skipNode: false,
    };
  },
  mounted() {
    this.plugs = [];
    this.plugs.push(() =>
      import(
        `@/components/TopVUI/k-form-design/packages/KFormPreview/preview.vue`
      )
    );
  },
  methods: {
    // 加载表单流程数据
    loadDataJson(e, procdefId, type, json) {
      // 清空数据
      this.isDuplicate = false;
      this.isAssign = false;
      this.skipNode = false;
      this.form.setFieldsValue({
        skipNode: false,
      });
      this.currentIndex = "1";
      this.modelKey = e;
      this.procdefId = procdefId;
      this.type = type;
      this.businessTitle = json.title;
      this.drawingList = {};
      // 获取json数据
      this.json = json.flowModel;
      this.modelType = json.flowModel.modelType;
      // this.colSpan = this.drawingList[0].__config__.span
      if (this.modelType === "2") {
        //2为可视化，1为自定义
        this.plugs = [];
        this.plugs.push(() =>
          import(
            `@/components/TopVUI/k-form-design/packages/KFormPreview/preview.vue`
          )
        ); //默认加载表单预览页面
        this.drawingList = JSON.parse(json.flowModel.formDesign);
        this.params = json.flowModel.flowDesign;
        this.tableName = json.flowModel.formTableName;
        this.labelCol = this.drawingList.config.labelCol;
        this.wrapperCol = this.drawingList.config.wrapperCol;
        let flowNodeField = json.flowNodeField;
        // 匹配数据字段编辑查看状态
        this.drawingList.list.forEach((e, index) => {
          if (type === 1) {
            getTypeListByFiled(e, flowNodeField);
          }
        });
        // 传递表单数据到预览界面
        if (this.$refs.previewModal)
          this.$refs.previewModal.jsonData = this.drawingList;
        this.uuid = json.flowModel.actDeModelKey;
      } else {
        this.plugs = [];
        this.drawingList = {};
        this.plugs.push(() => import(`@/pages${json.flowModel.formDesign}`)); //动态加载外联表单页
        this.saveUrl = json.flowModel.nodeFormSaveUrl;
      }
    },
    // tab切换
    changCurrentTab(e) {
      this.currentIndex = e;
      if (this.$refs.bpmView && this.currentIndex == "2")
        this.$refs.bpmView.initDiagramAgain(
          this.json.actDeModelId,
          this.json.actDeModelKey,
          this.json.actDeModelName,
          this.json.flowDesign
        );
    },
    toHump(name) {
      return name.replace(/\_(\w)/g, function(all, letter) {
        return letter.toUpperCase();
      });
    },
    // 提交时获取表单的数据
    getJsonData(fieldList) {
      this.loading = true;
      this.drawingList.list.forEach((e, index) => {
        let obj = setTypeList(e, fieldList);
        e = obj.e;
        fieldList = obj.list;
      });
      // 更新表单数据
      let pramar = fieldList;
      pramar.tableName = this.tableName;
      console.log(pramar, this.type);
      if (this.type === 1) {
        pramar.uuid = "";
        this.$post("/form/formField/commonSave", pramar).then((res) => {
          if (res.statusCode === 200) {
            this.startProcessInstanceByKey(res.businessUuid,pramar);
          } else {
            this.$message.warn(res.message, 1.5);
            this.loading = false;
          }
        });
      } else {
        pramar.uuid = this.model.uuid;
        pramar.procdefId = this.procdefId;
        this.$post("/form/formField/commonUpdate", pramar).then((res) => {
          if (res.statusCode === 200) {
            this.$message.success("修改成功！", 1.5);
            this.$emit("ok");
            this.$refs.previewModal[0].resetForm();
          } else {
            this.$message.warn(res.message, 1.5);
            this.loading = false;
          }
        });
      }
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values);
          if (this.modelType === "2") {
            this.$refs.previewModal[0].getJsonData();
          } else {
            let val = values;
            values.skipNode = this.skipNode;
            this.customizeFormStartProcessInstance(val);
          }
        }
      });
    },
    // 外置表单启动流程
    customizeFormStartProcessInstance(formVal) {
      console.log(formVal);
      let formParma = {
        modelKey: this.modelKey,
        ...formVal,
      };
      console.log(formParma);
      // this.form.validateFields((err, values) => {
      //   if (!err) {
      //   formParma.businessTitle = values.businessTitle;
      // formParma.assignUser = values.assignUser;
      //   }
      // });
      this.$post(
        "/workflow/apiFlowableProcessInstance/customizeFormStartProcessInstance",
        formParma
      )
        .then((res) => {
          if (res.statusCode != 300) {
            this.$message.success("流程启动成功！", 1.5);
          } else {
            this.$message.warn(res.message, 1.5);
          }
        })
        .finally(() => {
          this.$emit("ok");
          this.loading = false;
        });
    },
    // 启动流程
    startProcessInstanceByKey(e,formData) {
      console.log(e, "内置表单++");
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values);
          let businessTitle = values.businessTitle;
          this.$post(
            "/workflow/apiFlowableProcessInstance/startProcessInstanceByKey",
            {
              modelKey: this.modelKey,
              businessTitle: businessTitle,
              businessUuid: e,
              skipNode: this.skipNode,
              assignUser: values.assignUser,
              duplicateUser: values.duplicateUser,
							...formData
            }
          ).then((res) => {
            if (res.statusCode !== 300) {
              if (values.assignUser) {
                this.$post("/workflow/actMyProcessCopy/save", {
                  //是否抄送
                  userNameId: values.duplicateUser,
                  processInstanceId: res.processInstanceId,
                  processDefinitionId: res.processDefinitionId,
                  formName: businessTitle,
                })
                  .then((res) => {
                    if (res.status !== 300) {
                      this.$message.success("流程启动成功！", 1.5);
                      this.$refs.previewModal[0].resetForm();
                    } else {
                      this.$message.warn(res.message, 1.5);
                    }
                  })
                  .finally(() => {
                    this.$emit("ok");
                    this.loading = false;
                  });
              } else {
                this.$message.success("流程启动成功！", 1.5);
                this.$emit("ok");
                this.$refs.previewModal[0].resetForm();
                this.loading = false;
              }
              let pramer = {
                actDeModelKey: this.json.actDeModelKey,
                formDesign: JSON.stringify(this.drawingList),
                formModel: JSON.stringify(this.drawingList.config),
                processInstanceId: res.processInstanceId,
                procdefId: res.processDefinitionId,
              };
              this.$post("/workflow/flowModel/updateFormDesign", pramer).then(
                (res) => {
                  console.log("res======", res);
                }
              );
            } else {
              this.$message.warn(res.message, 1.5);
							this.loading = false;
            }
          });
        }
      });
    },
    activeFormItem(currentItem, index) {
      this.drawingList[index] = currentItem;
    },
    cancel() {
      if (this.modelType === "2") {
        this.$refs.previewModal[0].resetForm();
      } else {
        this.form.resetFields(); // 清理表单数据（可不做）
      }
      this.$emit("cancel");
    },
    // 抄送
    changeDuplicate(e) {
      this.isDuplicate = e.target.checked;
      if (!this.isDuplicate) {
        this.form.setFieldsValue({
          duplicateUser: "",
          duplicateUserName: "",
        });
      }
    },
    // 下一节点处理人
    changeAssign(e) {
      this.isAssign = e.target.checked;
      if (!this.isAssign) {
        this.form.setFieldsValue({
          assignUser: "",
          assignUserName: "",
        });
      }
    },
    // 设置抄送、节点处理人
    setUser(val, type) {
      if (type == 2) {
        this.form.setFieldsValue({
          assignUser: val.userNameId,
          assignUserName: val.userName,
        });
      } else {
        this.form.setFieldsValue({
          duplicateUser: val.userNameId,
          duplicateUserName: val.userName,
        });
      }
    },
  },
};
</script>

<style>
.ant-form {
  height: auto;
  width: 100%;
}

/* /deep/.ant-modal-footer {
		border: none !important;
	} */
.ant-modal-footer button + button {
  display: initial !important;
}

.my-bpmn-con .bpmn-viewer-container {
  height: calc(100% - 42px - 53px - 50px) !important;
}

.my-bpmn-con .bpmn-viewer-content {
  height: calc(100vh - 42px - 53px - 50px - 70px) !important;
  min-height: calc(100vh - 42px - 53px - 50px - 70px) !important;
}
/* .nodeForm {
		max-height: calc(100vh - 42px - 53px - 50px - 300px);
		height: 100%;
		overflow: hidden;
		overflow-y: auto;
	} */
.work-form .ant-modal-body {
  overflow: hidden;
  overflow-y: auto;
}
</style>
