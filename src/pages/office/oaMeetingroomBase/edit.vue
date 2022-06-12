<template>
  <t-modal
    title="新增/编辑"
    :width="800"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok')}"
    @cancel="() => { $emit('cancel')}">
    <a-spin :spinning="loading">
      <a-form :form="form">
        <a-form-item label="序号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['number', {rules: [{required: true, message: '必填'}]}]" />
        </a-form-item>
        <a-form-item label="会议室名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['name', {rules: [{required: true, message: '必填'}]}]" />
        </a-form-item>
        <a-form-item label="门禁系统识别编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['doorControl', {rules: [{required: true, message: '必填'}]}]" />
        </a-form-item>
        <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="['stateName',{rules: [{required: true, message: '必填'}]}]" @change="changeState">
            <a-select-option v-for="(item, index) in meetingList" :key="index" :value="item.text">
              {{ item.text }}
            </a-select-option>
          </a-select>
          <a-input v-decorator="['state', {initialValue: state}]" type="hidden"/>
        </a-form-item>
        <a-form-item label="地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['address', {rules: [{required: true, message: '必填'}]}]" />
        </a-form-item>
        <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['remarks']" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-input v-decorator="['uuid', {initialValue: uuid}]" type="hidden"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </t-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import Editor from '@/components/TopVUI/custom/Editor/index.vue'
  // 表单字段
  const fields = ['uuid', 'number', 'name', 'doorControl', 'stateName', 'address', 'remarks', 'state']

  export default {
    components: { Editor },
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
      },
      meetingList: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        labelCol: {
          xs: {
            span: 24
          },
          sm: {
            span: 5
          }
        },
        wrapperCol: {
          xs: {
            span: 24
          },
          sm: {
            span: 16
          }
        },
        form: this.$form.createForm(this),
        url: {
          getCategorysByTypeAndLevelId: '/system/category/getCategorysByTypeAndLevelId',
          getListByPid: '/system/category/getListByPid',
          getTopicBaseDetailByUuid: '/system/topicBase/getDetailByUuid'
        },
        uuid: '',
        state: ''
      }
    },
    methods: {
      add (m) {
        console.log('add',m)
        this.uuid = ''
      },
      edit (m) {
        console.log('edit',m)
        this.uuid = m ? m.uuid : ''
        this.form.setFieldsValue({
          uuid: this.uuid
        })
      },
      changeState (val) {
        this.meetingList.forEach( e => {
          if (e.text === val) {
            this.state = e.value
            this.form.setFieldsValue({
              state: this.state
            })
          }
        })
      }
    },
    created () {
      // 防止表单未注册
      fields.forEach(v => this.form.getFieldDecorator(v))
      // 当 model 发生改变时，为表单设置值
      this.$watch('model', () => {
        this.model && this.form.setFieldsValue(pick(this.model, fields))
      })
    }
  }
</script>
