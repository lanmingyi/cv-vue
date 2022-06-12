<!--
 * @Description: 流程基础配置
 * @Author: 黄婷
 * @Date: 2021-01-18 15:17:26
 * @LastEditTime: 2021-09-16 10:29:49
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\bpmn\panel\ProcessPropertyPanel.vue
-->
<template>
  <div class="margin-top-sm">
    <a-form-model
      :inline="false"
      :model="processData"
      label-width="100px"
      size="small"
      label-position="left"
    >
      <a-form-model-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="流程标识"
      >
        <a-input
          v-model="processData.id"
          @change="
            (e) => {
              updateId(e.target.value);
            }
          "
          :disabled="isEdit"
        ></a-input>
        <!-- <a-input v-model="processData.id" type="hidden"></a-input> -->
      </a-form-model-item>
      <a-form-model-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="流程名称"
      >
        <a-input
          v-model="processData.name"
          :disabled="isEdit"
          @change="
            (e) => {
              updateName(e.target.value);
            }
          "
        >
        </a-input>
      </a-form-model-item>
      <a-form-model-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="流程描述"
      >
        <a-input
          v-model="processData.description"
          @change="
            (e) => {
              updateDesc(e.target.value);
            }
          "
        ></a-input>
      </a-form-model-item>
      <template v-if="isProcess">
        <a-divider>权限设置</a-divider>
        <a-form-model-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="允许启动"
        >
          <a-radio-group
            v-model="authData.authType"
            @change="changeAuthType(authData.authType)"
          >
            <a-radio-button value="all">
              所有人
            </a-radio-button>
            <a-radio-button value="appoint">
              指定人员
            </a-radio-button>
            <a-radio-button value="role">
              指定角色
            </a-radio-button>
          </a-radio-group>
        </a-form-model-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="指定人员"
          v-if="authData.authType === 'appoint'"
        >
          <a-input
            key="1"
            v-model="authData.candidateStarterUsersName"
            placeholder="请选择"
            readOnly
          >
            <a-icon
              slot="addonAfter"
              type="user"
              @click="() => (isUserPopup = true)"
            />
          </a-input>
          <user-popup
            :visible="isUserPopup"
            style="width: 100%;"
            :typeForm="true"
            :typeNum="1"
            @change="(value) => addUser(value, 'appoint')"
            @close="() => (isUserPopup = false)"
          />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="指定角色"
          v-else-if="authData.authType === 'role'"
        >
          <a-input
            key="3"
            v-model="authData.candidateStarterGroupsName"
            placeholder="请选择"
            readOnly
          >
            <a-icon
              slot="addonAfter"
              type="user"
              @click="() => (isRolePopup = true)"
            />
          </a-input>
          <role-popup
            :userList="authData.candidateStarterGroups"
            :visible="isRolePopup"
            style="width: 100%;"
            :typeNum="2"
            @change="(value) => addUser(value, 'role')"
            @close="() => (isRolePopup = false)"
          />
        </a-form-item>
      </template>
      <!-- <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="信号定义">
		  <a-button type="primary" size="small" @click="showSignal('signal')">编辑</a-button>
	  </a-form-model-item>
	  <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="消息定义">
	  		  <a-button type="primary" size="small" @click="showSignal('msg')">编辑</a-button>
	  </a-form-model-item> -->
      <!-- <signal ref="signal" :visible="signalVisible" :refType="refType" :element="element" :modeler="modeler" @ok="finishSignal" @close="()=>{signalVisible = false}"></signal> -->
    </a-form-model>
  </div>
</template>

<script>
import signal from "./modal/signal";
import userPopup from "@/components/TopVUI/custom/userPopup";
import rolePopup from "@/components/TopVUI/custom/rolePopup";
export default {
  name: "ProcessProperty",
  components: { signal, userPopup, rolePopup },
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
      signalVisible: false,
      refType: "",
      isUserPopup: false,
      isRolePopup: false,
      description: "",
    };
  },
  props: {
    processData: {
      type: Object,
      required: true,
    },
    modeler: {
      type: Object,
      required: true,
    },
    element: {
      type: Object,
      required: true,
    },
    authData: {
      type: Object,
      required: true,
    },
    isProcess: {
      type: Boolean,
      default: false,
    },
    isEdit: {
      type: Boolean,
    },
  },
  watch: {
    element(val) {
      /* 流程描述设置 */
      this.description = "";
      if (val.businessObject.documentation) {
        this.description = val.businessObject.documentation[0].text;
      }
    },
  },
  methods: {
    updateProperties(properties) {
      this.modeler.get("modeling").updateProperties(this.element, properties);
    },
    finishSignal(data) {
      this.signalVisible = false;
      this.$emit("setFormBtnData", "signalRefList", data);
    },
    // 信号定义
    showSignal(type) {
      this.refType = type;
      this.signalVisible = true;
    },
    // 流程id
    updateId(name) {
      this.updateProperties({ id: name });
    },
    // 流程名称
    updateName(name) {
      this.updateProperties({ name: name });
      this.$emit("updateProcesName", name);
    },
    // 描述
    updateDesc(name) {
      let doc = this.modeler
        .get("bpmnFactory")
        .create("bpmn:Documentation", { text: name });
      this.updateProperties({ documentation: [doc] });
    },
    // 设置权限
    addUser(properties, type) {
      console.log(properties, type);
      let params = {};
      if (type === "appoint") {
        params = {
          candidateStarterUsers: properties.userNameId,
          candidateStarterUsersName: properties.userName,
          candidateStarterGroups: "",
          candidateStarterGroupsName: "",
        };
      } else if (type === "role") {
        params = {
          candidateStarterUsers: "",
          candidateStarterUsersName: "",
          candidateStarterGroups: properties.id,
          candidateStarterGroupsName: properties.userName,
        };
      } else {
        params = {
          candidateStarterUsers: "",
          candidateStarterUsersName: "",
          candidateStarterGroups: "",
          candidateStarterGroupsName: "",
        };
      }
      this.updateProperties(params);
      this.$emit("setStarterData", type, properties.id?properties.id:properties.userNameId);
      // this.updateProperties({ 'flowable:candidateStarterGroups': val })
    },
    changeAuthType(val) {
      this.updateProperties({ authType: val });
			this.$emit("setStarterData", val, "");
    },
  },
};
</script>

<style scoped></style>
