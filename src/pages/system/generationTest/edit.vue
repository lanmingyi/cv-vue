<template>
  <t-modal title="新建" :width="640" okText="保存" cancelText="关闭" :visible="visible" :confirmLoading="loading" @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }">
    <a-spin :spinning="loading">
      <a-form :form="form">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item>
          <a-input v-decorator="['uuid']" disabled type="hidden" />
        </a-form-item>
        <a-row type="flex" justify="start">
          <a-col :span="12">
            <a-form-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['userName', { rules: [{required: true, min: 1, message: '请输入至少一个字符的名称！'}]}]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row type="flex" justify="start">
          <a-col :span="12">
            <a-form-item label="时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <t-date
                  v-decorator="['userTime', { rules: [{required: true, message: '必填'}]}]"
                  style="width: 100%;"
                  :trigger-change="true"
                  dateFormat="YYYY-MM-DD HH:mm:ss"
                  allowClear
                />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </t-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import moment from 'moment'
  // 表单字段
  const fields = [
    'uuid',
    'userName',
    'userTime'
  ]
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
    data() {
      return {
        userTime: '',
        labelCol: {
          xs: {
            span: 24
          },
          sm: {
            span: 7
          }
        },
        wrapperCol: {
          xs: {
            span: 24
          },
          sm: {
            span: 13
          }
        },
        form: this.$form.createForm(this)
      }
    },
    created() {
      // 防止表单未注册
      fields.forEach(v => this.form.getFieldDecorator(v))

      // 当 model 发生改变时，为表单设置值
      this.$watch('model', () => {
        this.model && this.form.setFieldsValue(pick(this.model, fields))
      })
    },
    methods: {
      moment,
      add(e) {
        this.userTime = e ? e.userTime : ''
        this.form.setFieldsValue({userTime:this.userTime})
      }
    }
  }
</script>
