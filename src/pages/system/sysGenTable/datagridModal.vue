<template>
  <div>
    <t-modal
      title="单表代码生成"
      :width="640"
      :visible="visible"
      :confirmLoading="loading"
      @ok="handleSubmit()"
      @cancel="handleCancel()"
      okText="生成代码"
      cancelText="关闭"
    >
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item
            label="基础包"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input
              v-decorator="[
                'packetPath',
                {
                  initialValue: 'com.misboot',
                  rules: [{ required: true, message: '请输入基础包' }],
                },
              ]"
            />
          </a-form-item>
          <a-form-item
            label="系统名"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input
              v-decorator="[
                'moduleName',
                {
                  initialValue: 'system',
                  rules: [{ required: true, message: '请输入系统名必填' }],
                },
              ]"
            />
          </a-form-item>
          <a-form-item
            label="作者"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input
              v-decorator="[
                'author',
                {
                  initialValue: '佐佑科技',
                  rules: [{ required: true, message: '请输入作者必填' }],
                },
              ]"
            />
          </a-form-item>
          <a-form-item
            label="邮箱"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input
              v-decorator="[
                'mailbox',
                {
                  initialValue: 'fengkai@zuoyo.com',
                  rules: [{ required: true, message: '请输入邮箱必填' }],
                },
              ]"
            />
            <a-input v-decorator="['functionDescription']" type="hidden" />
          </a-form-item>
        </a-form>
      </a-spin>
    </t-modal>
  </div>
</template>

<script>
import { baseUrl } from "@/services/baseUrl.js";
import { ACCESS_TOKEN } from "@/store/mutation-types";
import { submitForm } from "@/utils/util";
import Vue from "vue";
import { message } from "ant-design-vue";
export default {
  props: {
    // puuid: {
    //   type: String
    // },
    loading: {
      type: Boolean,
      default: () => false,
    },
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      selectedRowKeys: [],
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
      confirmLoading: false,
      tableIndex: 0,
      form: this.$form.createForm(this),
      uuid: "",
      url: {
        generateCodeSave: "/system/sysGenTable/generateCodeSave",
      },
      puuid: "",
    };
  },
  methods: {
    add(data) {
      console.log(data, "add");
      this.puuid = data.uuid;
    },
    handleCancel() {
      this.$emit("handleCancel");
      this.form.resetFields();
    },
    handleSubmit() {
      const puuid = this.puuid;
      this.form.validateFields((errors, values) => {
        if (!errors) {
          // 这里做逻辑处理
          values.uuid = puuid;
          window.location.href =
            baseUrl +
            "/system/sysGenTable/generateCodeSave?packetPath=" +
            values.packetPath +
            "&moduleName=" +
            values.moduleName +
            "&author=" +
            values.author +
            "&mailbox=" +
            values.mailbox +
            "&uuid=" +
            values.uuid +
            "&token=" +
            Vue.ls.get(ACCESS_TOKEN);
          this.$emit("ok");
          // let data = {
          //  packetPath:values.packetPath,
          //  moduleName:values.moduleName,
          //  author:values.author,
          //  mailbox:values.mailbox,
          //  uuid:values.uuid,
          //  token:Vue.ls.get(ACCESS_TOKEN)
          // }
          // console.log(data)
          // new submitForm(baseUrl+'/system/sysGenTable/generateCodeSave',data).post();
        }
      });
    },
  },
};
</script>

<style></style>
