<!--
 * @Description: 设计界面右侧配置
 * @Author: 黄婷
 * @Date: 2021-01-18 15:17:26
 * @LastEditTime: 2021-09-16 09:20:42
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\bpmn\panel\designPanel.vue
-->
<template>
  <div class="bpmn-panel">
    <a-tabs v-model="current">
      <!-- 节点属性 -->
      <a-tab-pane v-if="current === '1'" key="1" tab="节点属性">
        <node-property-panel
          :modeler="modeler"
          @modifyConfigTab="modifyConfigTab"
          :nodeElement="nodeElement"
          :formData="formData"
          @modifyFormData="modifyFormData"
          formDesinType="custom"
        ></node-property-panel>
      </a-tab-pane>
      <!-- 流程属性 -->
      <a-tab-pane v-else key="3" tab="流程属性" force-render>
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
    </a-tabs>
  </div>
</template>

<script>
import NodePropertyPanel from "./NodePropertyPanel";
import ProcessPropertyPanel from "./ProcessPropertyPanel";
export default {
  name: "index",
  data() {
    return {
      configTab: "node",
      element: {},
      nodeElement: {},
      formData: {},
      isProcess: false,
      authData: {},
      formBtnList: [], //按钮
      notificationList: [], //通知
      formFieldArray: [], //动态表单配置
      formDesignUrl: "", //表单
      formDesignDetailUrl: "", //表单详情接口地址
      nodeFormUpdatePathUrl: "", //表单更新接口地址
      nodeFormSavePathUrl: "", //表单保存接口地址
      current: "1",
      permissionType: "",
      permissionValue: "", //权限值
      formModuleType: "", //表单类型
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
  mounted() {
    this.handleModeler();
    this.processData = this.process;
  },
  methods: {
    // 页面初始化设置配置数据
    getFormList(e) {
      this.current = "1";
      this.isProcess = false;
      this.formBtnList = []; //按钮配置
      this.notificationList = []; //通知
      this.formFieldArray = []; //动态表单
      this.permissionType = this.permissionType ? this.permissionType : "all";
    },
    // 保存时获取配置参数
    getFormData() {
      let process = this.process;
      let businessObjectArr = this.element.businessObject;
      // let formDesignInfo = businessObjectArr.flowElements?(businessObjectArr.flowElements[0]):(businessObjectArr.$parent.flowElements[0])	//当没有编辑开始节点时获取表单配置
      // this.formBtnList.forEach(e=>{
      // 	e.nodeFormPath = this.formDesignUrl?this.formDesignUrl:formDesignInfo.formDesignUrl
      // 	e.nodeFormEditPath = this.formDesignDetailUrl?this.formDesignDetailUrl:formDesignInfo.formDesignDetailUrl
      // })
      process.formFieldList = this.formFieldArray;
      process.formBtnList = this.formBtnList;
      process.formNoticeList = this.notificationList;
      process.permissionType = this.permissionType;
      process.permissionValue = this.permissionValue;
      process.formModuleType = this.formModuleType;
      return process;
    },
    changeActivekey(key) {
      console.log(key);
    },
    handleConfigSelect(value) {
      this.configTab = value;
    },
    // 流程模型节点变化
    handleModeler() {
      const _this = this;
      this.modeler.on("shape.added", (e) => {
        let element = e.element;
        if (this.isImplicitRoot(element)) {
          return;
        }
        this.element = element;
        // console.log(this.element,'this.element====')
        /* 按钮通知数据配置后显示不正常处理*/
        let businessObjectLoad = element.businessObject;
        if (element.type == "bpmn:Process") {
          this.isProcess = true;
          this.current = "3";
          this.authData = {
            /* 权限数据获取 */
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
        // 用户节点
        if (this.element.type === "bpmn:UserTask") {
          if (businessObjectLoad.btnGroup) {
            //按钮数据
            let btnGroup = businessObjectLoad.btnGroup
              ? JSON.parse(businessObjectLoad.btnGroup)
              : [];
            let formBtnList = this.formBtnList.filter(
              (obj) => obj.id != businessObjectLoad.id
            );
            btnGroup.forEach((e) => {
              (e.id = businessObjectLoad.id), (e.modalKey = this.process.key);
              e.nodeFormPath = businessObjectLoad.formDesignUrl;
              e.nodeFormEditPath = businessObjectLoad.formDesignDetailUrl;
              e.nodeFormUpdatePath = businessObjectLoad.nodeFormUpdatePathUrl;
              e.nodeFormSavePath = businessObjectLoad.nodeFormSavePathUrl;
              e.whetherUpdate = businessObjectLoad.formEditable;
              formBtnList.push(e);
            });
            this.formBtnList = formBtnList;
          }
          // 动态表单
          // let formPropertyList = [];
          // if (businessObjectLoad.extensionElements) {
          //   let list = businessObjectLoad.extensionElements.get("values");
          //   list.forEach((e) => {
          //     if (e.$type.indexOf("flowable:FormProperty") === 0) {
          //       formPropertyList.push(e.$attrs);
          //     }
          //   });
          // }
          let formFieldArray =
            businessObjectLoad.extensionElements?.values
              .filter((item) => item.$type === "flowable:FormProperty")
              .map((item) => {
                return item;
              }) ?? [];
          console.log(formFieldArray);
          // if (businessObjectLoad.formFieldList) {
          let formFieldArray1 = this.formFieldArray.filter(
            (obj) => obj.id != businessObjectLoad.id
          );
          formFieldArray.forEach((e) => {
            (e.id = businessObjectLoad.id), (e.modalKey = this.process.key);
            formFieldArray1.push(e);
          });
          this.formFieldArray = formFieldArray1;
          this.formModuleType = businessObjectLoad.formModuleType;
          // if (formPropertyList) {
          //   /* 表单字段 */
          //   let formFieldArray = formPropertyList;
          //   let formFieldArray1 = this.formFieldArray.filter(
          //     (obj) => obj.id != businessObjectLoad.id
          //   );
          //   formFieldArray.forEach((e) => {
          //     // e.id = businessObjectLoad.id,
          //     e.modalKey = this.process.key;
          //     formFieldArray1.push(e);
          //   });
          //   this.formFieldArray = formFieldArray1;
          // }
          // 节点通知获取
          if (businessObjectLoad.notification) {
            //通知数据
            let notificationList =
              businessObject.notification &&
              businessObject.notification.length != 0
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
      // 点击节点获取节点相关属性
      this.modeler.on("element.click", (e) => {
        const { element } = e;
        let _businessObject = element.businessObject;
        if (element.type == this.modeler._definitions.rootElements[0].$type) {
          this.modifyConfigTab(0);
          if (element.type == "bpmn:Process") {
            this.element = element;
            this.isProcess = true;
            this.current = "3";
            this.authData = {
              //权限数据配置
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
          }
          // 流程信息
          this.processData.description = _businessObject.documentation
            ? _businessObject.documentation[0].text
            : "";
          this.processData.name = _businessObject.name;
          this.processData.id = _businessObject.id;
        } else {
          this.current = "1";
          this.isProcess = false;
          this.modifyConfigTab(1);
          if (element.type == "bpmn:UserTask") {
            //结点处理人数据获取，处理数据配置后显示不正常
            if (_businessObject.useType === "assignee") {
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
          // if (element.type == "bpmn:StartEvent") {
          // 	_this.formData.formDesignUrl = _businessObject.formDesignUrl?_businessObject.formDesignUrl:'';		//外置表单路径配置
          // 	_this.formData.formDesignDetailUrl = _businessObject.formDesignDetailUrl?_businessObject.formDesignDetailUrl:'';		//外置表单路径配置
          // }
        }
        if (element.type == "bpmn:SequenceFlow") {
          let _businessObject = element.businessObject;
          // _this.formData.sequenceFlow = _businessObject.conditionExpression ? _businessObject.conditionExpression.body : '${outcome == '同意'}'
        }
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
      this.authData = {
        //获取节点权限设置
        authType: businessObject.authType ? businessObject.authType : "all",
        candidateStarterGroups: businessObject.candidateStarterGroups,
        candidateStarterGroupsName: businessObject.candidateStarterGroupsName,
        candidateStarterUsers: businessObject.candidateStarterUsers,
        candidateStarterUsersName: businessObject.candidateStarterUsersName,
      };
      this.formData = {
        //获取当前节点配置的数据
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
        sequenceFlow: businessObject.conditionExpression
          ? businessObject.conditionExpression.body
          : "",
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
        formDesignUrl: businessObject.formDesignUrl, //表单
        formDesignDetailUrl: businessObject.formDesignDetailUrl,
        nodeFormUpdatePathUrl: businessObject.nodeFormUpdatePathUrl,
        nodeFormSavePathUrl: businessObject.nodeFormSavePathUrl,
        formModuleType: businessObject.formModuleType,
        formEditable: Boolean(Number(businessObject.formEditable)),
      };
      let eventDefinitions = businessObject.get("eventDefinitions");
      if (eventDefinitions) {
        //定时器
        eventDefinitions.forEach((item) => {
          if (item.$type === "bpmn:TimerEventDefinition") {
            if (item["timeDate"]) this.formData.timer = "timeDate";
            if (item["timeDuration"]) this.formData.timer = "timeDuration";
            if (item["timeCycle"]) this.formData.timer = "timeCycle";
            if (item[this.formData.timer])
              this.formData.timerValue = item[this.formData.timer].body;
          }
        });
      }
      this.nodeElement = element;
      console.log(businessObject);
      if (type === "el" && businessObject.$type === "bpmn:StartEvent") {
        //外置表单路径
        this.formDesignUrl = businessObject.formDesignUrl;
        this.formDesignDetailUrl = businessObject.formDesignDetailUrl;
        this.nodeFormUpdatePathUrl = businessObject.nodeFormUpdatePathUrl;
        this.nodeFormSavePathUrl = businessObject.nodeFormSavePathUrl;
      }
      if (type === "el" && businessObject.$type === "bpmn:UserTask") {
        if (businessObject.btnGroup) {
          //按钮
          let btnGroup = JSON.parse(businessObject.btnGroup);
          let formBtnList = this.formBtnList.filter(
            (obj) => obj.id != businessObject.id
          );
          btnGroup.forEach((e) => {
            (e.id = this.formData.id), (e.modalKey = this.formData.key);
            e.nodeFormPath = businessObject.formDesignUrl;
            e.nodeFormEditPath = businessObject.formDesignDetailUrl;
            e.whetherUpdate = businessObject.formEditable;
            e.nodeFormUpdatePath = businessObject.nodeFormUpdatePathUrl;
            e.nodeFormSavePath = businessObject.nodeFormSavePathUrl;
            formBtnList.push(e);
          });
          this.formBtnList = formBtnList;
        }
        // 动态表单
        let formFieldArray =
          businessObject.extensionElements?.values
            .filter((item) => item.$type === "flowable:FormProperty")
            .map((item) => {
              return item;
            }) ?? [];
        console.log(formFieldArray);
        // if (businessObject.formFieldList) {
        let formFieldArray1 = this.formFieldArray.filter(
          (obj) => obj.id != businessObject.id
        );
        formFieldArray.forEach((e) => {
          (e.id = businessObject.id), (e.modalKey = this.process.key);
          formFieldArray1.push(e);
        });
        this.formFieldArray = formFieldArray1;
        this.formModuleType = businessObject.formModuleType;
        // let formPropertyList = [];
        // if (businessObject.extensionElements) {
        //   let list = businessObject.extensionElements.get("values");
        //   list.forEach((e) => {
        //     if (e.$type.indexOf("flowable:FormProperty") === 0) {
        //       formPropertyList.push(e.$attrs);
        //     }
        //   });
        // }
        // if (formPropertyList) {
        //   /* 表单字段 */
        //   let formFieldArray = formPropertyList;
        //   let formFieldArray1 = this.formFieldArray.filter(
        //     (obj) => obj.id != businessObject.id
        //   );
        //   formFieldArray.forEach((e) => {
        //     // e.id = this.formData.id,
        //     e.modalKey = this.formData.key;
        //     formFieldArray1.push(e);
        //   });
        //   this.formFieldArray = formFieldArray1;
        // }
        if (businessObject.notification) {
          //通知
          let notificationList =
            businessObject.notification &&
            businessObject.notification.length != 0
              ? businessObject.notification.split(",")
              : [];
          let notificationList1 = this.notificationList.filter(
            (obj) => obj.nodeId != businessObject.id
          );
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
    // 更新表单 节点属性值
    modifyFormData(data) {
      console.log(data);
      //设置节点处理人
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
      this.permissionType = type;
      this.permissionValue = properties;
    },
  },
  components: {
    NodePropertyPanel,
    ProcessPropertyPanel,
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
