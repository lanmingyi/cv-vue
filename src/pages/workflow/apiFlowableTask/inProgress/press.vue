<template>
  <t-modal
    title="流程催办"
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
          label="催办方式"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <!-- <a-checkbox-group :options="pressList" v-decorator="['comment',{ rules: [{required: true,message: '必填'}]}]" /> -->
          <t-multi-select-tag
            :dataList="pressList"
            dataType="static"
            v-decorator="[
              'type',
              { rules: [{ required: true, message: '必填' }] },
            ]"
            type="checkbox"
          ></t-multi-select-tag>
          <!-- <t-multi-select-tag v-model="selMuti" :dataList="pressList" type="checkbox" placeholder="请选择"></t-multi-select-tag> -->
        </a-form-item>
        <a-form-item
          label="催办内容"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-textarea
            :rows="4"
            v-decorator="[
              'content',
              { rules: [{ required: true, message: '必填' }] },
            ]"
          />
        </a-form-item>
        <a-form-item class="hiddenItem">
          <a-input v-decorator="['formName']" type="hidden" />
        </a-form-item>
        <a-form-item class="hiddenItem">
          <a-input v-decorator="['processDefinitionId']" type="hidden" />
        </a-form-item>
        <a-form-item class="hiddenItem">
          <a-input v-decorator="['processInstanceId']" type="hidden" />
        </a-form-item>
        <a-form-item class="hiddenItem">
          <a-input v-decorator="['taskId']" type="hidden" />
        </a-form-item>
        <a-form-item class="hiddenItem">
          <a-input v-decorator="['assignee']" type="hidden" />
        </a-form-item>
        <a-form-item class="hiddenItem">
          <a-input v-decorator="['startUserId']" type="hidden" />
        </a-form-item>
      </a-form>
    </a-spin>
  </t-modal>
</template>

<script>
import pick from "lodash.pick";
import TMultiSelectTag from "@/components/TopVUI/dict/TMultiSelectTag";
// 表单字段
const fields = [
  "type",
  "content",
  "formName",
  "processDefinitionId",
  "processInstanceId",
  "taskId",
  "assignee",
  "startUserId",
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
      pressList: [
        {
          text: "站内信",
          value: "note",
        },
        {
          text: "短信",
          value: "message",
        },
        {
          text: "邮件",
          value: "mail",
        },
      ],
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
