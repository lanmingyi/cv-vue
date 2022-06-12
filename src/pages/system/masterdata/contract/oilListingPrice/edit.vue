<template>
	<t-modal title="新增/编辑" :width="640" :visible="visible" :switchFullscreen="true" :confirmLoading="loading"
		@ok="() => { $emit('ok') }" @cancel="() => { $emit('cancel') }">
		<a-spin :spinning="loading">
			<a-form :form="form">
				<a-row :gutter="16">
					<!-- <a-form-item label="标识" :labelCol="labelCol" :wrapperCol="wrapperCol" >
						<a-input v-decorator="['uuid']" disabled type="hidden"/>
					</a-form-item> -->
					<a-form-item class="hiddenItem">
						<!-- uuid隐藏 -->
						<a-input v-decorator="['uuid']" disabled type="hidden" />
					</a-form-item>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="起始时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<t-date placeholder="请选择起始时间" v-decorator="['startTime',
                                      {rules: [{required: true,message: '请输入正确参数'}] }]" style="width: 100%;"
								:trigger-change="true" dateFormat="YYYY-MM-DD HH:mm:ss" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="截至时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<t-date placeholder="请选择截至时间" v-decorator="['endTime',
                                      {rules: [{required: true,message: '请输入正确参数'}] }]" style="width: 100%;"
								:trigger-change="true" dateFormat="YYYY-MM-DD HH:mm:ss" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="挂牌油价" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['oilListingPrice',
                                     {rules: [{required: true,message: '请输入正确参数'}] }]" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['notes',
                                     {rules: [{required: false,message: '请输入正确参数'}] }]" />
						</a-form-item>
					</a-col>
					<!-- <a-col class="gutter-row" :span="12">
						<a-form-item label="创建人ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['creatorId',
                                     {rules: [{required: false,message: '请输入正确参数'}] }]" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="创建人" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['creator',
                                     {rules: [{required: false,message: '请输入正确参数'}] }]" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="创建时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<t-date placeholder="请选择创建时间" v-decorator="['createTime',
                                      {rules: [{required: false,message: '请输入正确参数'}] }]" style="width: 100%;"
								:trigger-change="true" dateFormat="YYYY-MM-DD HH:mm:ss" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="修改人ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['modifierId',
                                     {rules: [{required: false,message: '请输入正确参数'}] }]" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="修改人" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['modifier',
                                     {rules: [{required: false,message: '请输入正确参数'}] }]" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="修改时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<t-date placeholder="请选择修改时间" v-decorator="['modifyTime',
                                      {rules: [{required: false,message: '请输入正确参数'}] }]" style="width: 100%;"
								:trigger-change="true" dateFormat="YYYY-MM-DD HH:mm:ss" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="组织机构ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['creatorOrgId',
                                     {rules: [{required: false,message: '请输入正确参数'}] }]" />
						</a-form-item>
					</a-col> -->
				</a-row>
			</a-form>
		</a-spin>
	</t-modal>
</template>

<script>
	import pick from 'lodash.pick'
	// 表单字段
	const fields = [
		'uuid',
		'startTime',
		'endTime',
		'oilListingPrice',
		'notes',
		'creatorId',
		'creator',
		'createTime',
		'modifierId',
		'modifier',
		'modifyTime',
		'creatorOrgId'
	]
	import TDictSelectTag from '@comp/TopVUI/dict/TDictSelectTag'
	import TMultiSelectTag from '@comp/TopVUI/dict/TMultiSelectTag'

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
			TDictSelectTag,
			TMultiSelectTag
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
				console.log(m, data)
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
