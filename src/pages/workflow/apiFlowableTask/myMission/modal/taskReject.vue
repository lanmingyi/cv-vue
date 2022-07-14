<!--
 * @Description: 驳回
 * @Author: lmy
 * @Date: 2021-06-02 13:38:09
 * @LastEditTime: 2021-09-16 11:47:55
 * @LastEditors: lmy
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\workflow\apiFlowableTask\myMission\modal\taskReject.vue
-->
<template>
  <t-modal
    :title="title"
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
          label="节点"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="rejectType === 1"
        >
          <a-select
            v-decorator="[
              'distFlowElementId',
              { rules: [{ required: true, message: '必填' }] },
            ]"
          >
            <a-select-option
              v-for="(item, index) in rejectList"
              :value="item.nodeId"
              :key="index"
            >
              {{ item.nodeName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="优先级"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="rejectType === 1"
        >
          <a-radio-group
            name="radioGroup"
            v-decorator="['priority', { initialValue: 0 }]"
          >
            <a-radio :value="50">
              无
            </a-radio>
            <a-radio :value="150">
              高
            </a-radio>
            <a-radio :value="100">
              中
            </a-radio>
            <a-radio :value="80">
              低
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          label="备注/意见"
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
          <a-input v-decorator="['taskId']" type="hidden" />
        </a-form-item>
        <a-form-item class="hiddenItem">
          <a-input v-decorator="['nodeId']" type="hidden" />
        </a-form-item>
        <a-form-item class="hiddenItem">
          <a-input v-decorator="['processInstanceId']" type="hidden" />
        </a-form-item>
      </a-form>
    </a-spin>
  </t-modal>
</template>

<script>
import pick from "lodash.pick";
// 表单字段
const fields = ["taskId", "processInstanceId", "nodeId"];
import userPopup from "@/components/TopVUI/custom/userPopup";
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
    rejectList: {
      type: Array,
    },
    rejectType: {
      type: Number,
    },
    title: {
      type: String,
    },
  },
  components: { userPopup },
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
      id: "",
      isUserPopup: false,
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
