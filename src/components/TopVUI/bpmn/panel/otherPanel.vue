<!--
 * @Description: 其他配置
 * @Author: 黄婷
 * @Date: 2021-06-11 16:02:32
 * @LastEditTime: 2021-09-16 10:28:59
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\bpmn\panel\otherPanel.vue
-->
<template>
  <div>
    <a-form :form="form">
      <!-- 通知配置 -->
      <template v-if="~['bpmn:UserTask'].indexOf(businessObject.$type)">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="通知类型"
        >
          <a-select v-model="notification" placeholder="请选择" mode="multiple">
            <a-select-option value="note">短信</a-select-option>
            <a-select-option value="mail">邮件</a-select-option>
            <a-select-option value="message">站内信</a-select-option>
          </a-select>
        </a-form-item>
        <!-- 跳过表达式 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="跳过表达式"
        >
          <a-input v-model="skipExpression"></a-input>
        </a-form-item>
        <!-- 优先级 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="优先级"
        >
          <!-- <a-input v-model="businessObject.priority" @change="(e)=>{ updatePriority(e.target.value)}"></a-input> -->
          <a-select v-model="priority" placeholder="请选择">
            <a-select-option value="50">无</a-select-option>
            <a-select-option value="150">高</a-select-option>
            <a-select-option value="100">中</a-select-option>
            <a-select-option value="80">低</a-select-option>
          </a-select>
        </a-form-item></template
      >
      <a-form-item
        v-if="
          ~['bpmn:UserTask', 'bpmn:ExclusiveGateway'].indexOf(
            businessObject.$type
          )
        "
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="异步"
      >
        <a-switch v-model="async" />
      </a-form-item>
      <a-form-item
        v-if="~['bpmn:UserTask'].indexOf(businessObject.$type)"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="是否为补偿"
      >
        <a-switch v-model="isForCompensation" />
      </a-form-item>
      <!-- <a-form-item
				:labelCol="labelCol"
				:wrapperCol="wrapperCol"
				label="到期时间"
				v-if="formData.type == 'bpmn:BusinessRuleTask'"
			>
				<t-date
					v-model="formData.dueDate"
					placeholder="请选择日期"
					style="width: 100%"
					@change="(value) => updateDueDate(value)"
				></t-date>
			</a-form-item> -->
    </a-form>
  </div>
</template>

<script>
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
      skipExpression: null,
      priority: "",
      async: false,
      isForCompensation: false,
      notification: null,
    };
  },
  watch: {
    element: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        console.log(newVal);
        this.businessObject = newVal.businessObject;
        this.notification = this.businessObject.notification
          ? this.businessObject.notification
          : [];
        this.skipExpression = this.businessObject.skipExpression;
        this.priority = this.businessObject.priority;
        this.async = this.businessObject.async;
        this.isForCompensation = this.businessObject.isForCompensation;
      },
    },
    // 异步
    async: function(val) {
      if (val === "") val = null;
      this.updateProperties({ "flowable:async": val });
    },
    // 补偿
    isForCompensation: function(val) {
      if (val === "") val = null;
      this.updateProperties({ isForCompensation: val });
    },
    // 跳过表达式
    skipExpression: function(val) {
      if (val === "") val = null;
      this.updateProperties({ skipExpression: val });
    },
    // 通知类型
    notification: function(val) {
      if (val === "") val = null;
      this.updateProperties({ notification: val });
    },
    // 优先级
    priority: function(val) {
      if (val === "") val = null;
      this.updateProperties({ priority: val });
    },
  },
  methods: {
    updateProperties(properties) {
      this.modeler.get("modeling").updateProperties(this.element, properties);
    },
  },
};
</script>

<style lang="scss" scoped></style>
