<template>
	<t-modal title="新增编辑" :width="640" :visible="visible" :confirmLoading="loading" @ok="() => { $emit('ok') }" @cancel="() => { $emit('cancel') }">
		<a-spin :spinning="loading">
			<a-form :form="form">
				<!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
				<a-form-item v-if="model && model.uuid">
					<a-input v-decorator="['uuid']" disabled type="hidden" />
				</a-form-item>
				<a-form-item label="客户端IP" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input v-decorator="['aliClientIp']" />
				</a-form-item>
				<a-form-item label="URL" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input v-decorator="['aliUri']" />
				</a-form-item>
				<a-form-item label="类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input v-decorator="['aliType']" />
				</a-form-item>
				<a-form-item label="请求方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input v-decorator="['aliMethod']" />
				</a-form-item>
				<a-form-item label="数据参数" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input v-decorator="['aliParamData']" />
				</a-form-item>
				<a-form-item label="Session" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input v-decorator="['aliSessionId']" />
				</a-form-item>
				<a-form-item label="HTTP状态码" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input v-decorator="['aliHttpStatusCode']" />
				</a-form-item>
			</a-form>
		</a-spin>
	</t-modal>
</template>

<script>
	import pick from 'lodash.pick'

	// 表单字段
	const fields = ['uuid', 'aliClientIp', 'aliUri', 'aliType', 'aliMethod', 'aliParamData', 'aliSessionId',
		'aliHttpStatusCode'
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
			add() {},
			edit() {}
		}
	}
</script>
