<template>
  <t-modal
    title="发布"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form">
		<a-form-item class="hiddenItem">
			<a-input v-decorator="['modelId']" type="hidden" />
		</a-form-item>
        <a-form-item
          label="分类"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select v-decorator="['categoryCode']">
            <a-select-option value="project">
              (office) 办公流程
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </t-modal>
</template>

<script>
import pick from 'lodash.pick'
// 表单字段
const fields = ['modelId',
'categoryCode']
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      form: this.$form.createForm(this),
      id: ''
    }
  },
  created () {
    fields.forEach(v => this.form.getFieldDecorator(v))
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  }

}
</script>
