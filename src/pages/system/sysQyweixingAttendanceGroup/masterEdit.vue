<template>
	<t-modal :title="title" :width="640" :maskClosable="false" :visible="visible" :confirmLoading="loading" @ok="() => { $emit('ok') }"
	 @cancel="() => { $emit('cancel') }">
		<a-spin :spinning="loading">
			<a-form :form="form">
				<a-row :gutter="16">
					<a-col class="gutter-row" :span="24">
						<a-form-item label="考勤组" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['atendanceName']" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="24">
						<a-form-item label="负责人" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<user-popup :visible="visiblePopup" style="width: 100%;" @change="(value,other)=>popupCallback(value,other)"
							 @close="() => visiblePopup = false" :typeNum="1" :typeForm="true"/>
							<a-input @click="() => visiblePopup = true" v-decorator="['userName', { rules: [{required: true, message: '必填'}]}]"
							 placeholder="负责人" readOnly>
								<a-icon slot="prefix" type="user" />
							</a-input>
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="24">
						<a-form-item>
							<a-input v-decorator="['userNameId']" disabled type="hidden" />
						</a-form-item>
						<a-form-item>
							<a-input v-decorator="['uuid']" disabled type="hidden" />
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
		</a-spin>
	</t-modal>
</template>

<script>
	import pick from 'lodash.pick'
	import UserPopup from '@/components/TopVUI/custom/userPopup'

	// 表单字段
	const fields = ['uuid', 'atendanceName', 'userName', 'userNameId']

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
		components:{UserPopup},
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
				visiblePopup:false,
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
			edit(e) {},
			add(e) {},
			popupCallback(value, other) {
				this.$nextTick(() => {
					this.form.setFieldsValue({
						userName: value.userName,
						userNameId: value.userNameId
					})
				})
			},
		}
	}
</script>
