<!--
 * @Description: 权限设置
 * @Author: 黄婷
 * @Date: 2021-06-11 14:32:58
 * @LastEditTime: 2021-09-02 17:25:57
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\bpmn\panel\modal\permission.vue
-->
<template>
  <div class="">
    <a-form :form="form">
      <a-form-item
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
      </a-form-item>
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
    </a-form>
  </div>
</template>

<script>
import userPopup from "@/components/TopVUI/custom/userPopup";
import rolePopup from "@/components/TopVUI/custom/rolePopup";
export default {
  components: { userPopup, rolePopup },
  data() {
    return {
      form: this.$form.createForm(this),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
      isRolePopup: false,
      isUserPopup: false,
      authData: {
        authType: "",
      },
    };
  },
  props: {
    modeler: {
      type: Object,
      required: true,
    },
    element: {
      type: Object,
      required: true,
    },
  },
  watch: {
    //   监听元素变化获取节点属性、权限
    element: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        console.log(newVal, oldVal);
        let businessObjectLoad = newVal.businessObject;

        if (businessObjectLoad.authType === "appoint") {
          this.authData = {
            authType: businessObjectLoad.authType,
            candidateStarterUsers: businessObjectLoad.candidateStarterUsers,
            candidateStarterUsersName:
              businessObjectLoad.candidateStarterUsersName,
          };
        } else if (businessObjectLoad.authType === "role") {
          this.authData = {
            authType: businessObjectLoad.authType,
            candidateStarterGroups: businessObjectLoad.candidateStarterGroups,
            candidateStarterGroupsName:
              businessObjectLoad.candidateStarterGroupsName,
          };
        } else {
          if (!businessObjectLoad.authType) {
            this.updateProperties({ authType: "all" });
            this.authData = {
              authType: businessObjectLoad.authType,
            };
          } else {
            this.authData = {
              authType: businessObjectLoad.authType,
            };
          }
        }
        console.log(this.authData);
      },
    },
  },
  methods: {
    //   更新流程节点属性
    updateProperties(properties) {
      this.modeler.get("modeling").updateProperties(this.element, properties);
    },
    // 设置权限
    addUser(properties, type) {
      console.log(properties, type);
      let params = {};
      if (type === "appoint") {
        this.authData = {
          authType: type,
          candidateStarterUsers: properties.userNameId,
          candidateStarterUsersName: properties.userName,
          candidateStarterGroups: "",
          candidateStarterGroupsName: "",
        };
      } else if (type === "role") {
        this.authData = {
          authType: type,
          candidateStarterUsers: "",
          candidateStarterUsersName: "",
          candidateStarterGroups: properties.userNameId,
          candidateStarterGroupsName: properties.userName,
        };
      } else {
        this.authData = {
          authType: type,
          candidateStarterUsers: "",
          candidateStarterUsersName: "",
          candidateStarterGroups: "",
          candidateStarterGroupsName: "",
        };
      }
      this.updateProperties(this.authData);
    },
    // 切换权限
    changeAuthType(val) {
      this.updateProperties({ authType: val });
    },
  },
};
</script>

<style lang="scss" scoped></style>
