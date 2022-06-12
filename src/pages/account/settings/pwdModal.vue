<template>
  <t-modal
    title="修改密码"
    :width="640"
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
        <a-form-item
          label="原密码"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            v-decorator="[
              'originalPassword',
              { rules: [{ required: true, min: 1, message: '必填' }] },
            ]"
            autoComplete="off"
          />
        </a-form-item>
        <a-form-item
          label="新密码"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input-password
            autoComplete="off"
            v-decorator="[
              'password',
              {
                rules: [
                  {
                    pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,
                    required: true,
                    min: 1,
                    maxLength: 11,
                    message: '必须有数字和字母组合的6到16位长度密码',
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item
          label="重复新密码"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input-password
            autoComplete="off"
            v-decorator="[
              'password2',
              {
                rules: [
                  {
                    pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,
                    required: true,
                    min: 1,
                    maxLength: 11,
                    message: '必须有数字和字母组合的6到16位长度密码',
                  },
                ],
              },
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
const fields = ["originalPassword", "userNameId", "password", "password2"];

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
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 7,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 13,
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
};
</script>
