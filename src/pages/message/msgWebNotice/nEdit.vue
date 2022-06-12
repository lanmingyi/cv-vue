<template>
	<t-modal title="新增编辑" :width="800" :visible="visible" :confirmLoading="loading" okText="保存" cancelText="关闭" @ok="() => { $emit('ok') }"
	 @cancel="() => { $emit('cancel') }">
		<a-spin :spinning="loading">
			<a-form :form="form">
				<!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
				<a-form-item class="hiddenItem">
					<a-input v-decorator="['uuid']" disabled type="hidden" />
				</a-form-item>
				<a-form-item label="信息标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input placeholder="信息标题" v-decorator="['title', { rules: [{required: true, min: 1, message: '请输入信息标题！'}]}]" />
				</a-form-item>
				<a-form-item label="信息类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input placeholder="信息类型" v-decorator="['type', {rules: [{required: false, min: 1, message: '请输入信息类型！'}]}]" />
				</a-form-item>
				<a-form-item label="信息描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input placeholder="信息描述" v-decorator="['description']" />
				</a-form-item>
				<!--<a-form-item label="业务表唯一标识" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
					<!--<a-input placeholder="业务表唯一标识(非必填)" v-decorator="['puuid']" />-->
				<!--</a-form-item>-->
				<a-form-item label="接收人" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input placeholder="接收人的员工号,逗号分隔" v-decorator="['receiverId',{ rules: [{required: true, message: '请输入接收人！'}]}]" />
				</a-form-item>
				<!--<a-form-item label="跳转URL" :labelCol="labelCol" :wrapperCol="wrapperCol">-->
					<!--<a-input placeholder="跳转URL" v-decorator="['url']" />-->
				<!--</a-form-item>-->
				<a-form-item label="消息内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-textarea placeholder="消息内容" :auto-size="{ minRows: 2, maxRows: 6 }" v-decorator="['content',{ rules: [{required: true, message: '请输入消息内容！'}]}]" />
				</a-form-item>
			</a-form>
		</a-spin>
	</t-modal>
</template>

<script>
	import pick from 'lodash.pick'

	// 表单字段
	const fields = ['uuid', 'title', 'type', 'description', 'puuid', 'url', 'receiverId', 'content']

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

			// 当 visible 发生改变时，为表单设置值
			this.$watch('visible', () => {
				this.model && this.form.setFieldsValue(pick(this.model, fields))
			})
		},
		methods: {
			// add(m){
			//   this.form.setFieldsValue(pick(m, fields))
			// }
			edit() {},
			add() {}
		}
	}
</script>
