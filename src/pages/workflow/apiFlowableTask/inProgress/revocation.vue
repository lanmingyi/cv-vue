<!--
 * @Description: 流程撤销
 * @Author: lmy
 * @Date: 2021-06-02 13:38:09
 * @LastEditTime: 2021-09-16 11:51:38
 * @LastEditors: lmy
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\workflow\apiFlowableTask\inProgress\revocation.vue
-->
<template>
  <t-modal
    title="流程撤销"
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
        <a-form-item
          label="撤销原因"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-textarea
            :rows="4"
            v-decorator="[
              'message',
              { rules: [{ required: true, message: '必填' }] },
            ]"
          />
        </a-form-item>
        <a-form-item class="hiddenItem">
          <a-input v-decorator="['processInstanceId']" type="hidden" />
        </a-form-item>
        <a-form-item class="hiddenItem">
          <a-input v-decorator="['taskId']" type="hidden" />
        </a-form-item>
      </a-form>
    </a-spin>
  </t-modal>
</template>

<script>
import pick from "lodash.pick";
import TMultiSelectTag from "@/components/TopVUI/dict/TMultiSelectTag";
// 表单字段
const fields = ["message", "processInstanceId", "taskId"];

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
  components: { TMultiSelectTag },
  data() {
    return {
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
          span: 17,
        },
      },
      form: this.$form.createForm(this),
    };
  },
  created() {
    fields.forEach((v) => this.form.getFieldDecorator(v));
    this.$watch("model", () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields));
    });
  },
  methods: {},
};
</script>
