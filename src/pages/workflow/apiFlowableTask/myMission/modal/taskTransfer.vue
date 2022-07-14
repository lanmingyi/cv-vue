<!--
 * @Description: 流转
 * @Author: lmy
 * @Date: 2021-06-02 13:38:09
 * @LastEditTime: 2021-09-16 11:48:02
 * @LastEditors: lmy
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\workflow\apiFlowableTask\myMission\modal\taskTransfer.vue
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
        <a-form-item class="hiddenItem">
          <a-input v-decorator="['taskId']" type="hidden" />
        </a-form-item>
        <a-form-item class="hiddenItem">
          <a-input v-decorator="['instanceId']" type="hidden" />
        </a-form-item>
        <a-form-item class="hiddenItem">
          <a-input v-decorator="['userNameId']" type="hidden" />
        </a-form-item>
        <a-form-item class="hiddenItem">
          <a-input v-decorator="['signature']" type="hidden" />
        </a-form-item>
        <a-form-item
          label="备注/意见"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-textarea
            :rows="4"
            v-decorator="[
              'comment',
              { rules: [{ required: true, message: '必填' }] },
            ]"
          />
        </a-form-item>
        <a-form-item
          label="办理人"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="transferType != 2"
        >
          <a-input
            @click="() => (isUserPopup = true)"
            key="1"
            v-decorator="[
              'userName',
              { rules: [{ required: true, message: '必填' }] },
            ]"
            placeholder="请选择"
            readOnly
          >
            <a-icon slot="prefix" type="user" />
          </a-input>
          <user-popup
            :visible="isUserPopup"
            :typeForm="true"
            :typeNum="typeNum"
            style="width: 100%;"
            @change="(value) => addUser(value)"
            @close="() => (isUserPopup = false)"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </t-modal>
</template>

<script>
import pick from "lodash.pick";
// 表单字段
const fields = ["taskId", "instanceId", "signature"];
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
    transferType: {
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
      typeNum: 1,
    };
  },
  created() {
    fields.forEach((v) => this.form.getFieldDecorator(v));
    this.$watch("model", () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields));
    });
  },
  methods: {
    addUser(e) {
      this.form.setFieldsValue({
        userName: e.userName,
        userNameId: e.userNameId,
      });
    },
  },
};
</script>
