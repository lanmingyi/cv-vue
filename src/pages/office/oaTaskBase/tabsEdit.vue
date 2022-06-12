<template>
	<t-modal title="新增/编辑" :width="640" :visible="visible" :confirmLoading="loading" @ok="() => { $emit('ok') }" @cancel="() => { $emit('cancel') }">
		<a-spin :spinning="loading">
			<a-form :form="form">
				<a-form-item label="开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input v-decorator="['startTime', {rules: [{required: true, message: '开始时间'}]}]" type="hidden"/>
					<a-date-picker v-model="startValue" :disabled-date="disabledStartDate"
					 show-time format="YYYY-MM-DD HH:mm:ss" placeholder="开始时间" @openChange="handleStartOpenChange" 
					 style="width: 100%" />
				</a-form-item>
				<a-form-item label="结束时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input v-decorator="['endTime', {rules: [{required: true, message: '结束时间'}]}]" type="hidden"/>
					<a-date-picker v-model="endValue" :disabled-date="disabledEndDate"
					 show-time format="YYYY-MM-DD HH:mm:ss" placeholder="结束时间" :open="endOpen" @openChange="handleEndOpenChange"
					 style="width: 100%" />
				</a-form-item>
				<a-form-item label="进度内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-textarea :rows="4" v-decorator="['content', {rules: [{required: tabKey!=1?true:false, message: '必填'}]}]" />
				</a-form-item>
				<a-form-item>
					<a-input v-decorator="['id', { initialValue: id }]" type="hidden" />
				</a-form-item>
				<a-form-item>
					<a-input v-decorator="['uuid']" type="hidden" />
				</a-form-item>
				<a-form-item>
					<a-input v-decorator="['puuid', { initialValue: puuid }]" type="hidden" />
				</a-form-item>
			</a-form>
		</a-spin>
	</t-modal>
</template>

<script>
	import pick from 'lodash.pick'
	import moment from 'moment'
	// 表单字段
	const fields = ['id', 'uuid', 'puuid', 'startTime', 'endTime', 'content']

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
			tabKey: {
				type: String,
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
				id: '',
				uuid: '',
				puuid: '',
				form: this.$form.createForm(this),
				endOpen: false,
				startTime: '',
				endTime: '',
				endValue: '',
				startValue: '',
			}
		},
		watch: {
			startValue(val) {
				this.form.setFieldsValue({
					startTime: moment(val).format('YYYY-MM-DD HH:mm:ss')
				})
			},
			endValue(val) {
				this.form.setFieldsValue({
					endTime: moment(val).format('YYYY-MM-DD HH:mm:ss')
				})
			},
		},
		methods: {
			add(data) {
				this.$nextTick(() => {
					this.startValue = ''
					this.endValue = ''
					this.form.setFieldsValue(pick(data, fields))
				})
			},
			edit(data) {
				this.$nextTick(() => {
					this.form.setFieldsValue(pick(data, fields))
					this.startValue = data.startTime
					this.endValue = data.endTime
				})
			},
			moment,
			// 开始时间
			disabledStartDate(startValue) {
				const endValue = this.endValue;
				if (!startValue || !endValue) {
					return false;
				}
				return startValue.valueOf() > endValue.valueOf();
			},
			disabledEndDate(endValue) {
				const startValue = this.startValue;
				if (!endValue || !startValue) {
					return false;
				}
				return startValue.valueOf() >= endValue.valueOf();
			},
			handleStartOpenChange(open) {
				if (!open) {
					this.endOpen = true;
				}
				console.log("start", this.startValue)
			},
			handleEndOpenChange(open) {
				this.endOpen = open;
				console.log("end", this.endValue)
			},
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
