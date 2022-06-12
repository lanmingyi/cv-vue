<template>
	<t-modal title="写邮件" :width="800" :visible="visible" :confirmLoading="loading" okText="发送邮件" cancelText="关闭" @ok="() => { $emit('ok') }"
	 @cancel="() => { $emit('cancel') }">
		<a-spin :spinning="loading">
			<a-form :form="form">
				<!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
				<a-form-item label="收件人" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input placeholder="请输入收件人" v-decorator="['toMail', {initialValue: 'message@zuoyo.com'},{ rules: [{required: true, min: 1,message: '请输入至少一个字符的名称！'}]}]" />
				</a-form-item>
				<a-form-item label="邮件主题" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input placeholder="请输入邮件主题" v-decorator="['subject', {initialValue: '【测试邮箱】'}, {rules: [{required: true, min: 1, message: '请输入至少一个字符的名称！'}]}]" />
				</a-form-item>
				<a-form-item label="抄送" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input placeholder="请选择抄送人" v-decorator="['wcc', {initialValue: 'message@zuoyo.com'}]" />
				</a-form-item>
				<a-form-item label="密送" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input placeholder="请选择密送人" v-decorator="['bcc', {initialValue: 'message@zuoyo.com'}]" />
				</a-form-item>
				<a-form-item label="内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input placeholder="短信模板参数" v-decorator="['content', {initialValue: `{businessStatus:'这是一条测试信息，打扰了~'}`}]" />
				</a-form-item>
			</a-form>
		</a-spin>
	</t-modal>
</template>

<script>
	import pick from 'lodash.pick'

	// 表单字段
	const fields = ['uuid', 'toMail', 'subject', 'wcc', 'bcc', 'content']

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
				title: '',
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
				// model: null
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
			// edit (e) {
			//   this.model = e
			//   console.log(this.model)
			// }
			add() {}
		}
	}
</script>
