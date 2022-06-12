<template>
	<!-- j-modal :title="title" placement="right" width="60%" :visible="visible" :fullscreen="false" :switchFullscreen="true" -->
	<j-modal :title="title" :width="800" :visible="visible" placement="right"  :confirmLoading="loading" :switchFullscreen="false" @ok="() => { $emit('ok')}"
		@cancel="() => { $emit('cancel')}">
		<a-spin :spinning="loading" class="log-container">
			<a-form :form="form">
				<a-row>
					<a-col :span="24">
						<a-form-item label="日志标题" :labelCol="labelColfull" :wrapperCol="wrapperColfull">
							<a-input v-decorator="['logTitle', {rules: [{required: true, message: '必填'}]}]"/>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row v-if="typeId && typeId == 1">
					<a-col :span="24">
						<a-form-item label="日志内容" :labelCol="labelColfull" :wrapperCol="wrapperColfull">
							<a-input type="textarea" :rows="4"
								v-decorator="['logContent', {rules: [{required: true, message: '必填'}]}]" />
						</a-form-item>
					</a-col>
				</a-row>
				
				<a-row v-if="typeId && typeId == 2">
					<a-col :span="24">
						<a-form-item label="今日完成工作" :labelCol="labelColfull" :wrapperCol="wrapperColfull">
							<a-input type="textarea" :rows="4" v-decorator="['logContent', {rules: [{required: true, message: '必填'}]}]" />
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item label="未完成工作" :labelCol="labelColfull" :wrapperCol="wrapperColfull">
							<a-input type="textarea" :rows="4" v-decorator="['logPlan']" />
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item label="需协调工作" :labelCol="labelColfull" :wrapperCol="wrapperColfull">
							<a-input type="textarea" :rows="4" v-decorator="['logCoordinate']" />
						</a-form-item>
					</a-col>
				</a-row>
				
				<a-row v-if="typeId && typeId == 3">
					<a-col :span="24">
						<a-form-item label="本周完成工作" :labelCol="labelColfull" :wrapperCol="wrapperColfull">
							<a-input type="textarea" :rows="4" v-decorator="['logContent', {rules: [{required: true, message: '必填'}]}]" />
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item label="本周工作总结" :labelCol="labelColfull" :wrapperCol="wrapperColfull">
							<a-input type="textarea" :rows="4" v-decorator="['logSummary']" />
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item label="下周工作计划" :labelCol="labelColfull" :wrapperCol="wrapperColfull">
							<a-input type="textarea" :rows="4" v-decorator="['logPlan']" />
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item label="需协调工作" :labelCol="labelColfull" :wrapperCol="wrapperColfull">
							<a-input type="textarea" :rows="4" v-decorator="['logCoordinate']" />
						</a-form-item>
					</a-col>
				</a-row>
				
				<a-row v-if="typeId && typeId == 4">
					<a-col :span="24">
						<a-form-item label="本月完成工作" :labelCol="labelColfull" :wrapperCol="wrapperColfull">
							<a-input type="textarea" :rows="4" v-decorator="['logContent',{ rules: [{required: true, message: '必填'}]}]" />
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item label="本月工作总结" :labelCol="labelColfull" :wrapperCol="wrapperColfull">
							<a-input type="textarea" :rows="4" v-decorator="['logSummary']" />
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item label="下月工作计划" :labelCol="labelColfull" :wrapperCol="wrapperColfull">
							<a-input type="textarea" :rows="4" v-decorator="['logPlan']" />
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item label="需协调工作" :labelCol="labelColfull" :wrapperCol="wrapperColfull">
							<a-input type="textarea" :rows="4" v-decorator="['logCoordinate']" />
						</a-form-item>
					</a-col>
					
				</a-row>
				
<!-- 				<a-col :span="24">
					<a-form-item label="附件" :labelCol="labelColfull" :wrapperCol="wrapperColfull">
						<a-input v-decorator="['logTitle']" />
					</a-form-item>
				</a-col> -->
				
				<a-row>
					<a-col :span="24" v-if="typeId && typeId != 1">
						<a-form-item label="备注" :labelCol="labelColfull" :wrapperCol="wrapperColfull">
							<a-input type="textarea" :rows="4" v-decorator="['logRemarks']" />
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item label="接收人" :labelCol="labelColfull" :wrapperCol="wrapperColfull">
							<div class="item-box">
								<div class="tab_table">
									<a-tag closable v-for="(tag, index) in attendData" :key="tag.uuid"
										@close="attendPrevent(tag, index)">
										{{ tag.userName }}
									</a-tag>
								</div>
								<t-select-role ref="attendModal" @change="attendSelect" @changeData="changeattend"
									@show="attendAdd" :isSelect="false" :visible="attendVisible" />
							</div>
							<a-input
								v-decorator="['logReceive', {initialValue: logReceive, rules: [{required: true, message: '必填'}]}]"
								readOnly type="hidden" />
						</a-form-item>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="24">
						<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['logStatus']" type="hidden" />
						</a-form-item>
						<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['uuid']" type="hidden" />
						</a-form-item>
						<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['logReceiveName']" type="hidden" />
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
		</a-spin>
	</j-modal>
</template>

<script>
	import pick from 'lodash.pick'
	import moment from 'moment'
	import TSelectRole from '@/components/TopVUI/custom/TSelectRole'
	import Editor from '@/components/TopVUI/custom/Editor/index.vue'
	// 表单字段
	const fields = ['uuid', 'logTitle', 'logContent', 'logReceive','logReceiveName', 'logStatus', 'logCoordinate','logPlan','logSummary', 'logRemarks']

	export default {
		components: {
			Editor,
			TSelectRole
		},
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
		},
		data() {
			return {
				labelCol: {
					xs: {
						span: 24
					},
					sm: {
						span: 24
					}
				},
				labelColfull: {
					xs: {
						span: 24
					},
					sm: {
						span: 24
					}
				},
				wrapperCol: {
					xs: {
						span: 24
					},
					sm: {
						span: 24
					}
				},
				wrapperColfull: {
					xs: {
						span: 24
					},
					sm: {
						span: 24
					}
				},
				form: this.$form.createForm(this),
				url: {
					getListByUuids: '/mdata/user/getListByUuids',
				},
				isClear: true,
				uuid: '',
				logContent: '',
				attendData: [],
				attendList: [],
				attendUserName: [],
				visiblePopup: false,
				attendVisible: false,
				logReceive: '',
				logReceiveName: '',
				title: '',
				typeId: '',
				logStatus: ''
			}
		},
		updated() {
			this.isClear = false
			this.logContent = this.form.getFieldValue('logContent')
		},
		methods: {
			moment,
			onLoad(e) {
				this.typeId = e
				if (e == 1) {
					this.title = '写日报'
					this.logStatus = '日志'
				} else if (e == 2) {
					this.title = '写日报'
					this.logStatus = '日报'
				} else if (e == 3) {
					this.title = '写周报'
					this.logStatus = '周报'
				} else if (e == 4) {
					this.title = '写月报'
					this.logStatus = '月报'
				}
				this.$nextTick(()=>{
					this.form.setFieldsValue({
						logStatus: this.logStatus,
						logTitle: this.logStatus
					})
					console.log("logStatus-----",this.logStatus)
				})
			},
			changeEditor(e) {
				this.logContent = e
				this.form.setFieldsValue({
					logContent: e
				})
			},
			//多选人员
			changeattend(data) {
				data.forEach(val => {
					console.log('val', val)
					if (this.attendList.find(e => val.userNameId === e)) {} else {
						this.attendList.push(val.userNameId)
						this.attendUserName.push(val.userName)
						this.attendData.push(val)
					}
				})
				this.logReceive = this.attendList.join(',')
				this.logReceiveName = this.attendUserName.join(',')
				this.form.setFieldsValue({
					logReceive: this.logReceive,
					logReceiveName: this.logReceiveName
				})
			},
			attendPrevent(tag, index) {
				console.log('tag, index', tag, index)
				this.attendData.splice(index, 1)
				this.attendUserName= []
				this.attendList.splice(this.attendList.indexOf(tag.userNameId), 1)
				this.attendData.forEach(val=>{
					this.attendUserName.push(val.userName)
				})
				this.logReceive = this.attendList.toString()
				this.logReceiveName = this.attendUserName.toString()
				this.form.setFieldsValue({
					logReceive: this.logReceive,
					logReceiveName: this.logReceiveName
				})
			},
			attendAdd() {
				this.$refs.attendModal.show()
			},
			attendSelect(e) {
				// console.log('e------------', e)
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

<style lang="less" scoped>
	/deep/.ant-form-item-label{
		text-align: left !important;
		font-weight: bold;
	}
	/deep/.ant-input{
		border: none !important;
	}
	/deep/.ant-form-item-children{
		padding-bottom: 10px;
		border-bottom: 1px solid #303030  !important;
		margin-bottom: 2px;
	}
	/deep/.ant-form label {
		font-size: 16px !important;
	}
	
	.log-container{
		width: 85%;
		margin: 0 auto;
	}
	
	.tab_table {
		width: 100%;
		min-height: 100px;
		background: #ffffff;
		// border-radius: 8px;
		// border: 1px solid #e7e7e7;
		border-bottom: 1px solid #303030;
		margin-right: 10px;
		padding: 5px 5px 0 5px;
		max-height: 300px;
		overflow: auto;

		& span {
			padding: 3px 8px;
			margin-bottom: 5px;
		}
	}

	.item-box {
		display: flex;
		align-items: flex-start;
	}
</style>
