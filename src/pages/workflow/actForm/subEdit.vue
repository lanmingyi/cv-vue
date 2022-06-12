<!--
 * @Description: 
 * @Author: 黄婷
 * @Date: 2021-08-16 17:46:15
 * @LastEditTime: 2021-08-25 16:03:40
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\workflow\actForm\subEdit.vue
-->
<!--
 * @Description: 
 * @Author: 黄婷
 * @Date: 2021-08-16 17:45:49
 * @LastEditTime: 2021-08-16 17:55:05
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\workflow\actForm\masterEdit.vue
-->
<template>
  <t-modal
    title="新增/编辑"
    :width="800"
    :visible="visible"
    :confirmLoading="loading"
    @ok="
      () => {
        $emit('ok');
      }
    "
    @cancel="
      () => {
        $emit('cancel');
      }
    "
  >
    <a-spin :spinning="loading">
      <a-form :form="form">
        <a-form-item class="hiddenItem">
          <!-- uuid隐藏 -->
          <a-input v-decorator="['uuid']" disabled type="hidden" />
        </a-form-item>
        <a-form-item class="hiddenItem">
          <!-- uuid隐藏 -->
          <a-input v-decorator="['puuid']" disabled type="hidden" />
        </a-form-item>
        <a-form-item
          label="表单页面路径"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            v-decorator="[
              'nodeFormPath',
              { rules: [{ required: true, message: '必填！' }] },
            ]"
          />
        </a-form-item>
        <a-form-item
          label="表单保存接口地址"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            v-decorator="[
              'nodeFormSavePath',
              { rules: [{ required: true, message: '必填！' }] },
            ]"
          />
        </a-form-item>
        <a-form-item
          label="表单更新接口地址"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            v-decorator="[
              'nodeFormUpdatePath',
              { rules: [{ required: true, message: '必填！' }] },
            ]"
          />
        </a-form-item>
        <a-form-item
          label="表单详情接口地址"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            v-decorator="[
              'nodeFormEditPath',
              { rules: [{ required: true, message: '必填！' }] },
            ]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </t-modal>
</template>

<script>
import pick from "lodash.pick";
// 表单字段
const fields = [
  "uuid",
  "puuid",
  "nodeFormPath",
  "nodeFormSavePath",
  "nodeFormUpdatePath",
  "nodeFormEditPath",
];
export default {
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    loading: {
      type: Boolean,
      default: () => false,
    },
    model: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      title: "",
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      form: this.$form.createForm(this),
    };
  },
  methods: {
    edit() {},
    add() {},
  },
  created() {
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v));
    // 当 model 发生改变时，为表单设置值
    this.$watch("model", () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields));
    });
  },
};
</script>
