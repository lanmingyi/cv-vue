<template>
	<div>
		<t-modal title="新增编辑" :width="640" :visible="visible" :confirmLoading="loading" @ok="() => { $emit('ok') }"
			@cancel="() => { $emit('cancel') }">
			<a-spin :spinning="loading">
				<a-form :form="form">
					<a-form-item class="hiddenItem">
						<a-input v-decorator="['uuid']" disabled type="hidden" />
					</a-form-item>
					<a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<a-input v-decorator="['buttonName', { rules: [{required: true, message: '请输入名称！'}]}]" />
					</a-form-item>
					<a-form-item label="标识" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<a-input v-decorator="['buttonCode',{ rules: [{required: true, message: '请输入标识！'}]}]" />
					</a-form-item>
					<a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<a-input-number
								style="width: 100%"
										:min="0"  :precision="0"
								placeholder="请输入"
								v-decorator="['buttonSort', { rules: [{required: true, message: '请输入排序！'}]}]" />
					</a-form-item>
				</a-form>
			</a-spin>
		</t-modal>
	</div>
</template>

<script>
	import pick from 'lodash.pick'
	const fields = ['buttonName', 'buttonCode', 'buttonSort', 'uuid']
	export default {
		props: {
			visible: {
				type: Boolean
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
			fields.forEach(v => this.form.getFieldDecorator(v))
			this.$watch('model', () => {
				this.model && this.form.setFieldsValue(pick(this.model, fields))
			})
		}
	}
</script>

<style>
</style>
