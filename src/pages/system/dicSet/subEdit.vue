<template>
  <t-modal
    title="新增编辑"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="
      () => {
				test1(),
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
        <a-form-item
          label="字典项名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            v-decorator="[
              'text',
              {
                rules: [
                  { required: true, message: '请输入至少一个字符的名称！' },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item
          label="字典项值"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            v-decorator="[
              'value',
              {
                rules: [
                  { required: true, message: '请输入至少一个字符的名称！' },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item class="hiddenItem">
          <a-input v-decorator="['uuid']" type="hidden" />
        </a-form-item>
        <a-form-item class="hiddenItem">
          <a-input v-decorator="['puuid']" type="hidden" />
        </a-form-item>
        <a-form-item class="hiddenItem">
          <a-input v-decorator="['code']" type="hidden" />
        </a-form-item>
      </a-form>
    </a-spin>
  </t-modal>
</template>

<script>
import pick from "lodash.pick";

// 表单字段
const fields = ["uuid", "text", "value", "selected", "remark", "code", "puuid"];

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
			this.$nextTick(() => {
			  this.form.setFieldsValue({
			    puuid: m.puuid,
			    code: m.code
			  });
			});
    },
    edit(m) {
      console.log("edit------m", m);
    },
		test1(){
			console.log(this.model)
		}
  },
};
</script>
