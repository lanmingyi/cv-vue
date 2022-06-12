<template>
	<t-modal title="新增/编辑" :width="640" :visible="visible" :confirmLoading="loading" @ok="() => { $emit('ok') }" @cancel="() => { $emit('cancel') }">
		<a-spin :spinning="loading">
			<a-form :form="form">
				<a-row :gutter="16">
					<a-form-item class="hiddenItem">
						<!-- uuid隐藏 -->
						<a-input v-decorator="['uuid']" type="hidden" />
					</a-form-item>
					<a-form-item class="hiddenItem">
						<!-- uuid隐藏 -->
						<a-input v-decorator="['puuid']" type="hidden" />
					</a-form-item>
					<a-col class="gutter-row" :span="24">
						<a-form-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['name',{ rules: [{ required: true, message: '必填' }]}]" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="24">
						<a-form-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<TDictSelectTag placeholder="请选择" dictCode="sex" v-decorator="['sex',{ rules: [{ required: true, message: '必填' }]}]"></TDictSelectTag>
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="24">
						<a-form-item label="年龄" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input-number v-decorator="['age',{ rules: [{ required: true, message: '必填' }]}]" :min="1" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="24">
						<a-form-item label="生日" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<t-date v-decorator="['testDate',{ rules: [{ required: true, message: '必填' }]}]" style="width: 100%;" :trigger-change="true" dateFormat="YYYY-MM-DD"
							 allowClear />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="24">
						<a-form-item label="注册时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<t-date v-decorator="['testDatetime']" style="width: 100%;" :trigger-change="true" :showTime="true" dateFormat="YYYY-MM-DD HH:mm:ss"
							 allowClear />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="24">
						<a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<TDictSelectTag placeholder="请选择排序方式" dictCode="sortFields" v-decorator="['testCombobox',{ rules: [{ required: true, message: '必填' }]}]"></TDictSelectTag>
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
		</a-spin>
	</t-modal>
</template>

<script>
	import pick from 'lodash.pick'
	// 表单字段
	const fields = ['uuid', 'name', 'sex', 'age', 'testDate', 'testDatetime', 'testCombobox', 'puuid']
	import TDictSelectTag from '@/components/TopVUI/dict/TDictSelectTag'
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
		components: {
			TDictSelectTag
		},
		data() {
			return {
				title: '',
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
				form: this.$form.createForm(this)
			}
		},
		methods: {
			add(m, data) {
				this.form.setFieldsValue(pick(m, fields))	//新增赋值主表的参数
			},
			edit(m, data) {
				console.log(m, data)
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
