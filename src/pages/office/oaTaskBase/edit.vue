<template>
	<t-modal title="新增/编辑" :width="800" :visible="visible" :confirmLoading="loading" @ok="() => { $emit('ok') }" @cancel="() => { $emit('cancel') }">
		<a-spin :spinning="loading">
			<a-form :form="form">
				<a-row :gutter="24" type="flex" justify="start">
					<a-col :span="12">
						<a-form-item label="任务标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['title', {rules: [{required: true, message: '必填'}]}]" />
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="优先级" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-select v-decorator="['priorityName', {rules: [{required: true, message: '必填'}]}]">
								<a-select-option v-for="(item,index) in priorityArr" :value="item.text" @click="changePriority(item)">
									{{item.text}}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="任务类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-select v-decorator="['taskType', {rules: [{required: true, message: '必填'}]}]" @change="taskTypeChange">
								<a-select-option v-for="(item,index) in taskTypeArr" :value="item.value">
									{{item.text}}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="指派人" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<user-popup :visible="visiblePopup" style="width: 100%;" @change="(value,other)=>popupCallback(value,other)"
							 @close="() => visiblePopup = false" :typeNum="1"/>
							<a-input @click="() => visiblePopup = true" v-decorator="['assigner', {rules: [{required: true, message: '必填'}]}]"
							 placeholder="指派人" readOnly>
								<a-icon slot="prefix" type="user" />
							</a-input>
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="任务状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-select v-decorator="['status', {rules: [{required: true, message: '必填'}]}]">
								<a-select-option :value="0">
									未开始
								</a-select-option>
								<a-select-option :value="1">
									已接受
								</a-select-option>
								<a-select-option :value="2">
									已完成
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['sort', {rules: [{required: true, message: '必填'}]}]" />
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="计划开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['planStartTime', {rules: [{required: true, message: '开始时间'}]}]" type="hidden"/>
							<a-date-picker v-model="startValue" :disabled-date="disabledStartDate"
							 show-time format="YYYY-MM-DD HH:mm:ss" placeholder="计划开始时间" @openChange="handleStartOpenChange" 
							 style="width: 100%" />
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="计划结束时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['planEndTime', {rules: [{required: true, message: '开始时间'}]}]" type="hidden"/>
							<a-date-picker v-model="endValue" :disabled-date="disabledEndDate"
							 show-time format="YYYY-MM-DD HH:mm:ss" placeholder="计划结束时间" :open="endOpen" @openChange="handleEndOpenChange"
							 style="width: 100%" />
						</a-form-item>

					</a-col>
					<a-col :span="12">
						<a-form-item label="实际开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['actualStartTime']" type="hidden"/>
							<a-date-picker v-model="startActualValue" :disabled-date="disabledActualStartDate"
							 show-time format="YYYY-MM-DD HH:mm:ss" placeholder="实际开始时间" @openChange="handleStartOpenActualChange" 
							 style="width: 100%" />
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="实际结束时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['actualEndTime']" type="hidden"/>
							<a-date-picker v-model="endActualValue" :disabled-date="disabledActualEndDate"
							 show-time format="YYYY-MM-DD HH:mm:ss" placeholder="实际结束时间" :open="endOpenActual" @openChange="handleEndOpenActualChange"
							 style="width: 100%" />
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item label="任务内容" :labelCol="labelColfull" :wrapperCol="wrapperColfull">
							<a-textarea :rows="10" v-decorator="['content', {rules: [{required: true, message: '必填'}]}]" />
						</a-form-item>
					</a-col>
					
					<a-form-item >
						<a-input v-decorator="['pid']" type="hidden" />
					</a-form-item>
					<a-form-item >
						<a-input v-decorator="['levelId']" type="hidden" />
					</a-form-item>
					<a-form-item>
						<a-input v-decorator="['taskTypeText']" type="hidden" />
					</a-form-item>
					<a-form-item>
						<a-input v-decorator="['assignerId']" type="hidden" />
					</a-form-item>
					<a-form-item>
						<a-input v-decorator="['uuid']" type="hidden" />
					</a-form-item>
					<a-form-item>
						<a-input v-decorator="['priority']" type="hidden" />
					</a-form-item>
				</a-row>
			</a-form>
		</a-spin>
	</t-modal>
</template>

<script>
	import pick from 'lodash.pick'
	import moment from 'moment'

	import UserPopup from '@/components/TopVUI/custom/userPopup'
	// 表单字段
	const fields = ['uuid', 'levelId', 'pid', 'title', 'priority', 'taskTypeText', 'taskType', 'assigner', 'assignerId',
		'status', 'sort', 'planStartTime', 'planEndTime', 'actualStartTime', 'actualEndTime', 'content', 'priorityName'
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
			},
			type: {
				type: String,
			},
		},
		components: {
			UserPopup
		},
		data() {
			return {
				title: '',
				labelCol: {
					xs: {
						span: 24
					},
					sm: {
						span: 6
					}
				},
				labelColfull: {
					xs: {
						span: 24
					},
					sm: {
						span: 3
					}
				},
				wrapperCol: {
					xs: {
						span: 24
					},
					sm: {
						span: 17
					}
				},
				wrapperColfull: {
					xs: {
						span: 24
					},
					sm: {
						span: 20
					}
				},
				taskTypeArr: [],
				priorityArr: [],
				assignerArr: [],
				url: {
					getDicItemByCode: '/system/dicSet/getDicItemByCode',
					getListByKeywords: '/mdata/user/getListByKeywords'
				},
				form: this.$form.createForm(this),
				visiblePopup: false,
				endOpen: false,
				planStartTime: '',
				planEndTime: '',
				endValue: '',
				startValue: '',
				actualStartTime: '',
				actualEndTime: '',
				endOpenActual: false,
				endActualValue: '',
				startActualValue: ''
			}
		},
		watch: {
			startValue(val) {
				this.form.setFieldsValue({
					planStartTime: moment(val).format('YYYY-MM-DD HH:mm:ss')
				})
			},
			endValue(val) {
				this.form.setFieldsValue({
					planEndTime: moment(val).format('YYYY-MM-DD HH:mm:ss')
				})
			},
			startActualValue(val) {
				this.form.setFieldsValue({
					actualStartTime: moment(val).format('YYYY-MM-DD HH:mm:ss')
				})
			},
			endActualValue(val) {
				this.form.setFieldsValue({
					actualEndTime: moment(val).format('YYYY-MM-DD HH:mm:ss')
				})
			},
		},
		mounted: function() {
			this.$post(this.url.getDicItemByCode + '?code=taskType').then((res) => {
				this.taskTypeArr = res
			})
			this.$post(this.url.getDicItemByCode + '?code=priority').then((res) => {
				this.priorityArr = res
			})
			this.$post(this.url.getListByKeywords).then((res) => {
				this.assignerArr = res
			})
		},
		methods: {
			moment,
			add(m,data) {
				console.log("add",m,data)
				this.startValue = ''
				this.endValue = ''
				this.startActualValue = ''
				this.endActualValue = ''
				this.$nextTick(()=>{
					this.form.setFieldsValue({
						pid: m&&m.id?m.id: '1',
						levelId:m&&m.levelId? m.levelId: '1'
					})
				})
			},
			edit(m) {
				console.log("m", m)
				
				this.startValue = m.planStartTime
				this.endValue = m.planEndTime
				this.startActualValue = m.actualStartTime
				this.endActualValue = m.actualEndTime
				this.$nextTick(()=>{
					this.form.setFieldsValue(pick(m, fields))
					if (m && m.priority) {
						var num = m.priority == '1' ? '一级' : (m.priority == '2' ? '二级' : '三级')
						this.form.setFieldsValue({
							priorityName: num
						})
					}
				})
			},
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
			changeStart(data, dateString) {
				this.$nextTick(() => {
					this.planStartTime = moment(dateString, 'YYYY-MM-DD HH:mm:ss')._i
					this.form.setFieldsValue({
						planStartTime: this.planStartTime
					})
				})
			},
			changeEnd(data, dateString) {
				this.$nextTick(() => {
					this.planEndTime = moment(dateString, 'YYYY-MM-DD HH:mm:ss')._i
					this.form.setFieldsValue({
						planEndTime: this.planEndTime
					})
				})
			},
			handleStartOpenChange(open) {
				if (!open) {
					this.endOpen = true;
				}
			},
			handleEndOpenChange(open) {
				this.endOpen = open;
			},
			// 实际开始时间
			disabledActualStartDate(startValue) {
				const endValue = this.endActualValue;
				if (!startValue || !endValue) {
					return false;
				}
				return startValue.valueOf() > endValue.valueOf();
			},
			disabledActualEndDate(endValue) {
				const startValue = this.startActualValue;
				if (!endValue || !startValue) {
					return false;
				}
				return startValue.valueOf() >= endValue.valueOf();
			},
			handleStartOpenActualChange(open) {
				if (!open) {
					this.endOpenActual = true;
				}
			},
			handleEndOpenActualChange(open) {
				this.endOpenActual = open;
			},
			// 结束
			changePriority(item) {
				this.$nextTick(() => {
					console.log("item----", item)
					this.form.setFieldsValue({
						priority: item.value
					})
				})
			},
			taskTypeChange(e) {
				this.form.setFieldsValue({
					taskTypeText: this.taskTypeArr[e - 1].text
				})
			},
			popupCallback(value, other) {
				this.$nextTick(() => {
					this.form.setFieldsValue({
						assigner: value.userName,
						assignerId: value.userNameId
					})
				})
			},
			assignerIdChange(value) {
				this.assignerArr.forEach(e => {
					if (e.userNameId == value) {
						this.form.setFieldsValue({
							assigner: e.userName
						})
					}
				})
			},
		},
		created() {
			// 防止表单未注册
			fields.forEach(v => this.form.getFieldDecorator(v))
			// // 当 model 发生改变时，为表单设置值
			this.$watch('model', () => {
				// this.model && this.form.setFieldsValue(pick(this.model, fields))
			})
		}
	}
</script>
