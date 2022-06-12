<!--
//  * @Description: 
 * @Author: 黄婷
 * @Date: 2021-01-18 15:17:30
 * @LastEditTime: 2021-07-26 17:22:22
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\system\dicSet\masterEdit.vue
-->
<template>
  <t-modal
    title="新增编辑"
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
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item class="hiddenItem">
          <a-input v-decorator="['uuid']" type="hidden" />
        </a-form-item>
        <a-form-item
          label="字典集名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            v-decorator="[
              'text',
              {
                rules: [
                  { required: true, message: '请输入字典集名称！' },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item
          label="字典集代码"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            v-decorator="[
              'code',
              {
                rules: [
                  { required: true, message: '请输入字典集代码！' },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input-number :min="1" :max="9999" v-decorator="['sort',{rules: [{ required: true, message: '请输入排序！' }]}]" />
        </a-form-item>
        <!-- <a-form-item
         label="备注"
         :labelCol="labelCol"
         :wrapperCol="wrapperCol"
       >
         <a-textarea
           placeholder="备注"
           :auto-size="{ minRows: 2, maxRows: 6 }"
           v-decorator="['remark']"
         />
       </a-form-item> -->
      </a-form>
    </a-spin>
  </t-modal>
</template>

<script>
import pick from "lodash.pick";

// 表单字段
const fields = ["uuid", "text", "code", "sort"];

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
  methods: {
    add(m) {
      console.log("add------m", m);
    },
    edit(m) {
      console.log("edit------m", m);
      // fields.forEach((v) => this.form.getFieldDecorator(v));
      // this.form.setFieldsValue(pick(m, fields));
    },
  },
};
</script>
