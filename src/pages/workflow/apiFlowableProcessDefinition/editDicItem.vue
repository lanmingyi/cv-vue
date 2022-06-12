<template>
	<t-modal title="新增编辑" :width="640" :visible="visible" :confirmLoading="loading" @ok="() => { $emit('ok') }"
		@cancel="() => { $emit('cancel') }">
		<a-spin :spinning="loading">
			<a-form :form="form">
				<a-form-item class="hiddenItem">
					<!-- uuid隐藏 -->
					<a-input v-decorator="['uuid']" disabled type="hidden" />
				</a-form-item>
				<a-form-item class="hiddenItem">
					<a-input v-decorator="['puuid']" disabled type="hidden" />
				</a-form-item>
				<a-form-item label="字典项名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input v-decorator="['code']" disabled type="hidden" />
					<a-input v-decorator="['text', { rules: [{required: true, min: 1, message: '请输入至少一个字符的名称！'}]}]" />
				</a-form-item>
				<a-form-item label="字典项值" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input v-decorator="['value', {rules: [{required: true, min: 1, message: '请输入至少一个字符的名称！'}]}]" />
				</a-form-item>
				<a-form-item label="默认选中" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-select v-decorator="['selected']">
						<a-select-option value="true">
							是
						</a-select-option>
						<a-select-option value="false">
							否
						</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-textarea placeholder="备注" :auto-size="{ minRows: 2, maxRows: 6 }" v-decorator="['remark']" />
				</a-form-item>
			</a-form>
		</a-spin>
	</t-modal>
</template>

<script>
	import pick from 'lodash.pick'

	// 表单字段
	const fields = ['uuid', 'text', 'value', 'selected', 'remark', 'code', 'puuid']

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
		}
	}
</script>
