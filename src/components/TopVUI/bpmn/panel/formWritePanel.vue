<!--
 * @Description: 外置表单配置
 * @Author: lmy
 * @Date: 2021-06-11 16:02:32
 * @LastEditTime: 2021-09-16 09:32:26
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <div>
    <a-form :form="form">
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="表单配置"
      >
        <a-radio-group v-model="formModuleType" @change="changeFormModuleType">
          <a-radio-button value="dynamic">
            动态表单
          </a-radio-button>
          <a-radio-button value="extraposition">
            外置表单
          </a-radio-button>
        </a-radio-group>
      </a-form-item>
      <template v-if="formModuleType">
        <div style="padding:0 20px 10px;" v-if="formModuleType == 'dynamic'">
          <table-form :nodeElement="element" :modeler="modeler"></table-form>
        </div>
        <template v-else>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="外置表单"
          >
            <!-- <a-input
              v-model="businessObject.formDesignUrl"
              placeholder="表单页面"
            ></a-input> -->
            <a-input-search
              placeholder="表单页面路径"
              v-model="businessObject.formDesignUrl"
              @search="
                () => {
                  externalFormVisible = true;
                }
              "
            >
              <a-button slot="enterButton" type="primary">
                选择
              </a-button>
            </a-input-search>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="表单详情"
          >
            <a-input
              v-model="businessObject.formDesignDetailUrl"
              placeholder="表单详情地址"
            ></a-input>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="表单保存"
          >
            <a-input
              v-model="businessObject.nodeFormSavePathUrl"
              placeholder="表单保存地址"
            ></a-input>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="表单更新"
          >
            <a-input
              v-model="businessObject.nodeFormUpdatePathUrl"
              placeholder="表单更新地址"
            ></a-input>
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="表单可编辑"
          >
            <!-- <a-input v-model="formData.formEditable" placeholder="表单可编辑"></a-input> -->
            <a-checkbox v-model="businessObject.formEditable"></a-checkbox>
          </a-form-item>
        </template>
      </template>
      <!-- 外置表单弹窗 -->
      <external-form
        :visible.sync="externalFormVisible"
        @ok="handleChangeForm"
      ></external-form>
    </a-form>
  </div>
</template>

<script>
import tableForm from "./modal/tableForm";
import externalForm from "./modal/externalForm";
export default {
  name: "processUser",
  props: {
    element: {
      type: Object,
    },
    modeler: {
      type: Object,
    },
  },
  components: { tableForm, externalForm },
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
      businessObject: null,
      externalFormVisible: false,
      formModuleType: "",
    };
  },
  watch: {
    // 监听节点属性变化
    element: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        this.businessObject = newVal.businessObject;
        this.formModuleType = this.businessObject.formModuleType;
        if (!this.businessObject.formModuleType) {
          this.updateProperties({ formModuleType: "dynamic" }, true);
          this.formModuleType = "dynamic";
        }
      },
    },
    "businessObject.formDesignUrl": function(val) {
      if (val === "") val = null;
      this.updateProperties({ formDesignUrl: val }, true);
    },
    "businessObject.formDesignDetailUrl": function(val) {
      if (val === "") val = null;
      this.updateProperties({ formDesignDetailUrl: val }, true);
    },
    "businessObject.nodeFormUpdatePathUrl": function(val) {
      if (val === "") val = null;
      this.updateProperties({ nodeFormUpdatePathUrl: val }, true);
    },
    "businessObject.nodeFormSavePathUrl": function(val) {
      if (val === "") val = null;
      this.updateProperties({ nodeFormSavePathUrl: val }, true);
    },
    "businessObject.formEditable": function(val) {
      if (val === "") val = null;
      this.updateProperties({ formEditable: val }, true);
    },
  },
  methods: {
    // 表单类型
    changeFormModuleType(val) {
      this.formModuleType = val.target.value;
      this.updateProperties({ formModuleType: this.formModuleType }, true);
      console.log(val.target.value);
    },
    // 更新属性
    updateProperties(properties, type) {
      this.modeler.get("modeling").updateProperties(this.element, properties);
      if (type) {
        this.updateBtnList();
      }
    },
    // 更换外置表单
    handleChangeForm(val) {
      if (val.length > 0) {
        this.businessObject.formDesignUrl = val[0].nodeFormPath;
        this.businessObject.formDesignDetailUrl = val[0].nodeFormEditPath;
        this.businessObject.nodeFormUpdatePathUrl = val[0].nodeFormUpdatePath;
        this.businessObject.nodeFormSavePathUrl = val[0].nodeFormSavePath;
        this.externalFormVisible = false;
      } else {
        this.$message.warn("请选择需要配置的表单！");
      }
    },
    // 更新按钮数据
    updateBtnList() {
      let extensionElements = this.element.businessObject.get(
        "extensionElements"
      );
      if (!extensionElements) {
        extensionElements = this.modeler
          .get("moddle")
          .create("bpmn:ExtensionElements");
      }
      // 清除旧值
      let btnGroup =
        extensionElements.values?.filter(
          (item) => item.$type === "flowable:Button"
        ) ?? [];
      console.log(btnGroup);
      if (btnGroup?.length) {
        extensionElements.values =
          extensionElements.values?.filter(
            (item) => item.$type !== "flowable:Button"
          ) ?? [];
        btnGroup.forEach((item) => {
          item["nodeFormPath"] = this.businessObject.formDesignUrl;
          item["nodeFormEditPath"] = this.businessObject.formDesignDetailUrl;
          item["whetherUpdate"] = this.businessObject.formEditable;
          item[
            "nodeFormUpdatePath"
          ] = this.businessObject.nodeFormUpdatePathUrl;
          extensionElements.get("values").push(item);
        });
        this.updateProperties({ extensionElements: extensionElements }, false);
      }
      // else {
      // 	// 清除旧值
      // 	extensionElements.values =
      // 		extensionElements.values?.filter((item) => item.$type !== 'flowable:Button') ?? [];
      // 	let executionListener = this.modeler.get('moddle').create('flowable:Button');
      // 	executionListener['id'] = this.businessObject.id;
      // 	executionListener['modalKey'] = this.businessObject.$parent.id;
      // 	executionListener['nodeFormPath'] = this.businessObject.formDesignUrl;
      // 	executionListener['nodeFormEditPath'] = this.businessObject.formDesignDetailUrl;
      // 	executionListener['whetherUpdate'] = this.businessObject.formEditable;
      // 	executionListener['nodeFormUpdatePath'] = this.businessObject.nodeFormUpdatePathUrl;
      // 	extensionElements.get('values').push(executionListener);
      // 	this.updateProperties({ extensionElements: extensionElements });
      // }
    },
  },
};
</script>

<style lang="scss" scoped></style>
