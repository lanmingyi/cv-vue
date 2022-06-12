<!--
 * @Description: 执行，任务监听器编辑
 * @Author: 黄婷
 * @Date: 2021-01-18 15:17:26
 * @LastEditTime: 2021-09-02 17:06:20
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\bpmn\panel\modal\eventListenerEdit.vue
-->
<template>
  <t-modal
    title="新增/编辑"
    :width="800"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :form="form">
      <a-input v-decorator="['uuid']" type="hidden" />
      <a-form-item label="事件" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select v-decorator="['event']" v-if="type === 1">
          <a-select-option value="start">
            start
          </a-select-option>
          <a-select-option value="end">
            end
          </a-select-option>
          <a-select-option value="take">
            take
          </a-select-option>
        </a-select>
        <a-select v-decorator="['event']" v-else>
          <a-select-option value="create">
            create
          </a-select-option>
          <a-select-option value="assignment">
            assignment
          </a-select-option>
          <a-select-option value="complete">
            complete
          </a-select-option>
          <a-select-option value="delete">
            delete
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select v-decorator="['type']">
          <a-select-option value="class">
            类
          </a-select-option>
          <a-select-option value="expression">
            表达式
          </a-select-option>
          <a-select-option value="delegateExpression">
            委托表达式
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="java类名"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          v-decorator="[
            'className',
            { rules: [{ required: true, min: 1, message: '必填' }] },
          ]"
        />
      </a-form-item>
    </a-form>
    <!-- 参数配置 -->
    <executrParam ref="executrParam"></executrParam>
  </t-modal>
</template>

<script>
import pick from "lodash.pick";
import executrParam from "./executrParam1";
// 表单字段
const fields = ["uuid", "event", "type", "className"];
export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    model: {
      type: Object,
      default: () => null,
    },
    type: {
      type: Number,
    },
  },
  components: { executrParam },
  data() {
    return {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 4,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 19,
        },
      },
      form: this.$form.createForm(this),
    };
  },
  created() {
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v));
    // 当 model 发生改变时，为表单设置值
    this.$watch("model", () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields));
    });
  },
  methods: {
    add() {
      if (this.$refs.executrParam) this.$refs.executrParam.data = [];
    },
    edit() {},
    handleOk() {
      let params = this.$refs.executrParam.getParamData();
      this.$emit("ok", params);
    },
    handleCancel() {
      this.$emit("update:visible", false);
    },
  },
};
</script>
