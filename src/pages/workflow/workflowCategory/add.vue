<template>
  <div>
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
            label="分类名称"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input
              v-decorator="[
                'categoryName',
                { rules: [{ required: true, message: '请输入分类名称！' }] },
              ]"
            />
          </a-form-item>
          <a-form-item
            label="唯一标识"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input
              v-decorator="[
                'categoryCode',
                { rules: [{ required: true, message: '请输入唯一标识！' }] },
              ]"
            />
          </a-form-item>
        </a-form>
      </a-spin>
    </t-modal>
  </div>
</template>

<script>
import pick from "lodash.pick";
const fields = ["categoryName", "categoryCode", "uuid"];
export default {
  props: {
    visible: {
      type: Boolean,
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

<style></style>
