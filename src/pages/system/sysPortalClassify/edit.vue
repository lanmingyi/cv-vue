<template>
  <t-modal
    title="新增/编辑"
    :width="640"
    :visible="visible"
    :switchFullscreen="true"
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
        <a-row :gutter="16">
          <a-form-item class="hiddenItem">
            <!-- 主键隐藏 -->
            <a-input v-decorator="['uuid']" disabled type="hidden" />
          </a-form-item>
          <a-col class="gutter-row" :span="24">
            <a-form-item
              label="分类名"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input
                v-decorator="[
                  'classifyName',
                  { rules: [{ required: true, message: '必填！' }] },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="24">
            <a-form-item
              label="标识"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input
                v-decorator="[
                  'classifyCode',
                  { rules: [{ required: true, message: '必填！' }] },
                ]"
                :disabled="disabled"
              />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="24">
            <a-form-item
              label="分类排序"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input-number
                :min="1"
                v-decorator="[
                  'classifySort',
                  { rules: [{ required: true, message: '必填！' }] },
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </t-modal>
</template>

<script>
import pick from "lodash.pick";
// 表单字段
const fields = ["uuid", "classifyName", "classifyCode", "classifySort"];
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
          span: 16,
        },
      },
      form: this.$form.createForm(this),
      disabled: false,
    };
  },
  methods: {
    add(m, data) {
      this.disabled = false;
    },
    edit(m, data) {
      this.disabled = true;
    },
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
