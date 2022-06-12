<!--
 * @Description: 表单流程右侧配置
 * @Author: 黄婷
 * @Date: 2021-01-18 15:17:26
 * @LastEditTime: 2021-09-16 10:24:37
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\bpmn\panel\index.vue
-->
<template>
  <div class="bpmn-panel">
    <a-tabs v-model="current">
      <template v-if="current !== '3'">
        <a-tab-pane key="1" tab="节点属性">
          <node-property-panel
            :modeler="modeler"
            @modifyConfigTab="modifyConfigTab"
            :nodeElement="nodeElement"
            :formData="formData"
            @modifyFormData="modifyFormData"
            :formFieldLists="formFieldLists"
            :updateList="updateList"
          ></node-property-panel>
        </a-tab-pane>
        <a-tab-pane key="2" tab="表单配置">
          <FormPanel
            ref="formPanels"
            :modeler="modeler"
            :nodeElement="nodeElement"
            :formData="formData"
            :formFieldLists="formFieldLists"
            :updateList="updateList"
          ></FormPanel>
        </a-tab-pane>
      </template>
      <template v-else>
        <a-tab-pane
          key="3"
          tab="流程属性"
          force-render
          v-if="isProcess && current === '3'"
        >
          <process-property-panel
            :modeler="modeler"
            :process-data="processData"
            :element="element"
            :authData="authData"
            :isProcess="isProcess"
            @setStarterData="setStarterData"
            :isEdit="isEdit"
          ></process-property-panel>
        </a-tab-pane>
      </template>
    </a-tabs>
  </div>
</template>

<script>
import NodePropertyPanel from "./NodePropertyPanel";
import ProcessPropertyPanel from "./ProcessPropertyPanel";
import FormPanel from "./formPanel";
export default {
  name: "index",
  data() {
    return {
      configTab: "node",
      panelIndex: 8,
      element: {},
      nodeElement: {},
      formData: {},
      formBtnList: [],
      formFieldLists: [],
      formFieldArray: [],
      notificationList: [],
      current: "1",
      updateList: [],
      isProcess: false,
      authData: {},
      processData: {},
      permissionType: "",
      permissionValue: "",
    };
  },
  props: {
    modeler: {
      type: Object,
      required: true,
    },
    process: {
      type: Object,
      required: true,
    },
    isEdit: {
      type: Boolean,
    },
  },
  computed: {
    nodeName() {
      if (this.element) {
        const bizObj = this.element.businessObject;
        const type = bizObj?.eventDefinitions
          ? bizObj.eventDefinitions[0].$type
          : bizObj.$type;
        return NodeName[type] || type;
      }
      return "";
    },
  },
  watch: {
    process(val) {
      this.processData = val;
    },
  },
  mounted() {
    this.handleModeler();
  },
  methods: {
    // 设置按钮表单配置数据
    getFormList(e) {
      this.isProcess = false;
      this.formBtnList = [];
      this.formFieldArray = [];
      this.notificationList = [];
      this.formFieldLists = e;
      this.current = "1";
      // this.permissionType = this.permissionType ? this.permissionType : "all";
    },
    // 获取表单更新数据
    updateFormLists(e) {
      this.updateList = e;
    },
    // 获取配置参数
    getFormData() {
			console.log(this.permissionType)
			console.log(this.processData)
      let process = this.process;
      process.formBtnList = this.formBtnList;
      process.formFieldList = this.formFieldArray;
      process.formNoticeList = this.notificationList;
      process.permissionType = this.permissionType?this.permissionType:this.processData.permissionType;
      process.permissionValue = this.permissionValue?this.permissionValue:this.processData.permissionValue;
			if(process.permissionType === "all"){
				process.permissionValue = ""
			}
			this.permissionType = ""
			this.permissionValue = ""
      return process;
    },
    changeActivekey(key) {
      console.log(key);
    },
    handleConfigSelect(value) {
      this.configTab = value;
    },
    handleModeler() {
      const _this = this;
      this.modeler.on("shape.added", (e) => {
        let element = e.element;
        if (this.isImplicitRoot(element)) {
          return;
        }
        this.element = element;
        // 初始化设置表单 按钮配置
        let businessObjectLoad = element.businessObject;
        if (element.type == "bpmn:Process") {
          this.isProcess = true;
          this.current = "3";
          this.authData = {
            /* 权限 */
            authType: _businessObject.authType
              ? _businessObject.authType
              : "all",
            candidateStarterGroups: _businessObject.candidateStarterGroups,
            candidateStarterGroupsName:
              _businessObject.candidateStarterGroupsName,
            candidateStarterUsers: _businessObject.candidateStarterUsers,
            candidateStarterUsersName:
              _businessObject.candidateStarterUsersName,
          };
          this.processData.description = _businessObject.documentation
            ? _businessObject.documentation[0].text
            : "";
          this.processData.name = _businessObject.name;
          this.processData.id = _businessObject.id;
        }
        if (this.element.type === "bpmn:UserTask") {
          /* 按钮 */
          if (businessObjectLoad.btnGroup) {
            let btnGroup = businessObjectLoad.btnGroup
              ? JSON.parse(businessObjectLoad.btnGroup)
              : [];
            let formBtnList = this.formBtnList.filter(
              (obj) => obj.id != businessObjectLoad.id
            );
            btnGroup.forEach((e) => {
              (e.id = businessObjectLoad.id), (e.modalKey = this.process.key);
              formBtnList.push(e);
            });
            this.formBtnList = formBtnList;
          }
          if (businessObjectLoad.formFieldList) {
            /* 表单字段 */
            let formFieldArray = businessObjectLoad.formFieldList
              ? JSON.parse(businessObjectLoad.formFieldList)
              : [];
            let formFieldArray1 = this.formFieldArray.filter(
              (obj) => obj.id != businessObjectLoad.id
            );
            formFieldArray.forEach((e) => {
              (e.id = businessObjectLoad.id), (e.modalKey = this.process.key);
              formFieldArray1.push(e);
            });
            this.formFieldArray = formFieldArray1;
          }
          console.log(this.notificationList);
          if (businessObjectLoad.notification) {
            /* 通知 */
            let notificationList =
              businessObjectLoad.notification &&
              businessObjectLoad.notification.length != 0
                ? businessObjectLoad.notification.split(",")
                : [];
            let notificationList1 = this.notificationList.filter(
              (obj) => obj.nodeId != businessObjectLoad.id
            );
            console.log(notificationList);
            notificationList.forEach((e) => {
              notificationList1.push({
                noticeName: e,
                nodeId: businessObjectLoad.id,
                actDeModelKey: this.process.key,
              });
            });
            this.notificationList = notificationList1;
          }
        }
      });
      this.modeler.on("commandStack.changed", (e) => {
        _this.modeler.saveXML(
          {
            format: true,
          },
          function(err, xml) {
            _this.$emit("updateXml", xml);
          }
        );
        console.log("commandStack.changed");
      });
      this.modeler.on("selection.changed", (e) => {
        const element = e.newSelection[0];
        if (!element) {
          return;
        }
        console.log("selection.changed");
        this.modifyConfigTab(element);
        this.handleFormData(element);
      });
      this.modeler.on("element.changed", (e) => {
        console.log("element.changed");
        const { element } = e;
        if (!element) {
          return;
        }
        this.handleFormData(element, "el");
      });
      // 节点点击事件
      this.modeler.on("element.click", (e) => {
        const { element } = e;
        console.log(element, "element.click===");
        let _businessObject = element.businessObject;

        if (element.type == this.modeler._definitions.rootElements[0].$type) {
          this.modifyConfigTab(0);
          // 流程属性
          if (element.type == "bpmn:Process") {
            this.isProcess = true;
            this.element = element;
            this.current = "3";
            this.authData = {
              /* 权限 */
              authType: _businessObject.authType
                ? _businessObject.authType
                : "all",
              candidateStarterGroups: _businessObject.candidateStarterGroups,
              candidateStarterGroupsName:
                _businessObject.candidateStarterGroupsName,
              candidateStarterUsers: _businessObject.candidateStarterUsers,
              candidateStarterUsersName:
                _businessObject.candidateStarterUsersName,
            };
            this.processData.description = _businessObject.documentation
              ? _businessObject.documentation[0].text
              : "";
            this.processData.name = _businessObject.name;
            this.processData.id = _businessObject.id;
          }
        } else {
          this.current = "1";
          this.isProcess = false;
          this.modifyConfigTab(1);
          if (element.type == "bpmn:UserTask") {
            this.formFieldLists.forEach((e) => {
              e.isEdit = false;
              e.isLook = false;
            });
            if (_businessObject.useType === "assignee") {
              /* 节点处理人 */
              _this.formData.useType = "assignee";
              _this.formData.assignee = _businessObject.assignee;
              _this.formData.assigneeName = _businessObject.assigneeName;
            } else if (_businessObject.userType === "candidateUsers") {
              _this.formData.useType = "candidateUsers";
              _this.formData.candidateUsers = _businessObject.candidateUsers;
              _this.formData.candidateUsersName =
                _businessObject.candidateUsersName;
            } else if (_businessObject.userType === "processInitiator") {
              _this.formData.useType = "processInitiator";
              _this.formData.processInitiator =
                _businessObject.processInitiator;
            } else if (
              _businessObject.userType === "candidateGroups" ||
              _businessObject.userType === "department"
            ) {
              _this.formData.useType =
                _businessObject.userType === "candidateGroups"
                  ? "candidateGroups"
                  : "department";
              _this.formData.candidateGroups = _businessObject.candidateGroups;
              _this.formData.candidateGroupsName =
                _businessObject.candidateGroupsName;
            }
          }
        }
        if (element.type == "bpmn:SequenceFlow") {
          let _businessObject = element.businessObject;
          console.log(_businessObject, "分支条件");
          // _this.formData.sequenceFlow = _businessObject.conditionExpression ? _businessObject.conditionExpression.body : '${outcome == '同意'}'
        }
        this.handleFormData(element, "el");
      });
    },
    isImplicitRoot(element) {
      return element.id === "__implicitroot";
    },
    modifyConfigTab(element) {
      let configTab = "node";
      if (!element) {
        configTab = "process";
      }
      this.configTab = configTab;
    },
    updateProperties(properties) {
      this.modeler
        .get("modeling")
        .updateProperties(this.nodeElement, properties);
    },
    handleFormData(element, type) {
      if (!element.id) {
        return;
      }
      let businessObject = element.businessObject;
      console.log(businessObject);
      this.authData = {
        /* 节点处理人 */
        authType: businessObject.authType ? businessObject.authType : "all",
        candidateStarterGroups: businessObject.candidateStarterGroups,
        candidateStarterGroupsName: businessObject.candidateStarterGroupsName,
        candidateStarterUsers: businessObject.candidateStarterUsers,
        candidateStarterUsersName: businessObject.candidateStarterUsersName,
      };
      this.formData = {
        /* 流程属性 */
        type: element.type,
        id: businessObject.id,
        key: this.process.key,
        name: businessObject.name,
        userType: businessObject.userType,
        assignee: businessObject.assignee,
        assigneeName: businessObject.assigneeName,
        candidateUsersName: businessObject.candidateUsersName,
        candidateGroups: businessObject.candidateGroups,
        candidateGroupsName: businessObject.candidateGroupsName,
        candidateUsers: businessObject.candidateUsers,
        processInitiator: businessObject.processInitiator,
        btnGroup: businessObject.btnGroup,
        sequenceFlow: businessObject.conditionExpression
          ? businessObject.conditionExpression.body
          : "",
        formFieldArray: businessObject.formFieldList,
        async: businessObject.async,
        isForCompensation: businessObject.isForCompensation,
        dueDate: businessObject.dueDate,
        priority: businessObject.priority,
        ruleVariablesInput: businessObject.ruleVariablesInput,
        rules: businessObject.rules,
        resultVariable: businessObject.resultVariable,
        exclude: businessObject.exclude,
        autoStoreVariables: businessObject.autoStoreVariables,
        triggerable: businessObject.triggerable,
        notification: businessObject.notification
          ? businessObject.notification.split(",")
          : [],
        skipExpression: businessObject.skipExpression,
        signalRefList: businessObject.$parent?.$attrs.signalRefList ?? [],
        messageRefList: businessObject.$parent?.$attrs.messageRefList ?? [],
        conditionalExpression: businessObject.$attrs.conditionalExpression,
        conditionalExpressionType:
          businessObject.$attrs.conditionalExpressionType,
        conditionalScript: businessObject.$attrs.conditionalScript,
        conditionalScriptType: businessObject.$attrs.conditionalScriptType,
        conditionType: businessObject.$attrs.conditionType,
      };
      let eventDefinitions = businessObject.get("eventDefinitions");
      if (eventDefinitions) {
        /* 定时器 */
        eventDefinitions.forEach((item) => {
          if (item.$type === "bpmn:TimerEventDefinition") {
            if (item["timeDate"]) this.formData.timer = "timeDate";
            if (item["timeDuration"]) this.formData.timer = "timeDuration";
            if (item["timeCycle"]) this.formData.timer = "timeCycle";
            console.log(item[this.formData.timer]);
            if (item[this.formData.timer])
              this.formData.timerValue = item[this.formData.timer].body;
          }
        });
      }
      console.log(this.formData);
      this.nodeElement = element;
      console.log(businessObject);
      if (type === "el" && businessObject.$type === "bpmn:UserTask") {
        /* 按钮 */
        if (businessObject.btnGroup) {
          let btnGroup = JSON.parse(businessObject.btnGroup);
          let formBtnList = this.formBtnList.filter(
            (obj) => obj.id != businessObject.id
          );
          btnGroup.forEach((e) => {
            (e.id = this.formData.id), (e.modalKey = this.formData.key);
            formBtnList.push(e);
          });
          this.formBtnList = formBtnList;
        }
        console.log(this.formBtnList, "=====================");
        if (businessObject.formFieldList) {
          /* 表单字段 */
          let formFieldArray = JSON.parse(businessObject.formFieldList);
          let formFieldArray1 = this.formFieldArray.filter(
            (obj) => obj.id != businessObject.id
          );
          formFieldArray.forEach((e) => {
            (e.id = this.formData.id), (e.modalKey = this.formData.key);
            formFieldArray1.push(e);
          });
          this.formFieldArray = formFieldArray1;
        }
        if (businessObject.notification) {
          /* 通知 */
          let notificationList =
            businessObject.notification &&
            businessObject.notification.length != 0
              ? businessObject.notification.split(",")
              : [];
          let notificationList1 = this.notificationList.filter(
            (obj) => obj.nodeId != businessObject.id
          );
          console.log(notificationList, notificationList1);
          notificationList.forEach((e) => {
            notificationList1.push({
              noticeName: e,
              nodeId: this.formData.id,
              actDeModelKey: this.formData.key,
            });
          });
          this.notificationList = notificationList1;
        }
      }
    },
    modifyFormData(data) {
      /* 节点处理人 */
      this.formData.userType = data.userType;
      if (data.userType === "assignee") {
        this.formData.assignee = data.assignee;
        this.formData.assigneeName = data.assigneeName;
      } else if (data.userType === "candidateUsers") {
        this.formData.candidateUsers = data.candidateUsers;
        this.formData.candidateUsersName = data.candidateUsersName;
      } else if (data.userType === "processInitiator") {
        this.formData.processInitiator = data.processInitiator;
      } else if (
        data.userType === "candidateGroups" ||
        data.userType === "department"
      ) {
        this.formData.candidateGroups = data.candidateGroups;
        this.formData.candidateGroupsName = data.candidateGroupsName;
      }
    },
    setFormBtnData(type, data) {
      this.formData[type] = data;
    },
    setStarterData(type, properties) {
      console.log(type, properties);
      this.permissionType = type;
      this.permissionValue = properties;
    },
  },
  components: {
    NodePropertyPanel,
    ProcessPropertyPanel,
    FormPanel,
  },
};
</script>

<style lang="less">
.bpmn-panel {
  width: 350px;
  border: 1px solid #eeeeee;
  padding: 0 5px;
  overflow-y: auto;
  .ant-tabs-nav {
    width: 100% !important;
    display: flex !important;
    justify-content: center !important;
    div:not(.ant-tabs-ink-bar) {
      width: 100% !important;
      display: flex !important;
      justify-content: center !important;
    }
  }
}
.config-tab {
  height: 43px;
  line-height: 43px;
  display: inline-block;
  width: 50%;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  position: relative;
  cursor: pointer;
}
.config-tab.active {
  border-bottom: solid 2px #409eff;
}
</style>
