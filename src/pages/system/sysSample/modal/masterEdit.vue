<!--
 * @Description: 新增编辑
 * @Author: lmy
 * @Date: 2021-06-02 13:38:09
 * @LastEditTime: 2021-07-29 14:42:59
 * @LastEditors: lmy
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\system\sysSample\modal\masterEdit.vue
-->
<template>
  <t-modal
    title="新增编辑"
    :width="640"
    :maskClosable="false"
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
        <a-row :gutter="16">
          <a-form-item class="hiddenItem">
            <!-- uuid隐藏 -->
            <a-input v-decorator="['uuid']" disabled type="hidden" />
          </a-form-item>
          <a-col class="gutter-row" :span="24">
            <a-form-item
              label="姓名"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input v-decorator="['name']" />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="24">
            <a-form-item
              label="性别"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <TDictSelectTag placeholder="请选择" dictCode="sex" v-decorator="['sex']"></TDictSelectTag>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="24">
            <a-form-item
              label="年龄"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-input-number v-decorator="['age']" :min="1" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </t-modal>
</template>

<script>
import pick from "lodash.pick";
import TDictSelectTag from "@/components/TopVUI/dict/TDictSelectTag";
// 表单字段
const fields = ["uuid", "name", "sex", "age", "puuid"];

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
	components:{TDictSelectTag},
  data() {
    return {
      title: "",
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
  methods: {
    edit(e) {},
    add(e) {},
  },
};
</script>
