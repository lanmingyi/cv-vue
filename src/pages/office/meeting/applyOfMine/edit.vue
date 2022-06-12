<template>
	<t-modal :visible="visible" :width="1000" title="会议申请" :fullscreen="false" :switchFullscreen="false" :confirmLoading="loading"
	 @cancel="() => { $emit('cancel') }">
		<template slot="footer">
			<!-- <a-button class="cu-btn-primary" v-print="'printBox'">打印</a-button> -->
			<a-button class="cu-btn-primary" @click="() => {$emit('save')}">保存</a-button>
			<a-button class="cu-btn-primary" @click="() => {$emit('ok')}">提交</a-button>
			<a-button key="back" @click="() => { $emit('cancel')}">关闭</a-button>
		</template>
		<a-col :md="24" :sm="24">
			<a-card :bordered="false">
				<div v-show="keys === 1">
					<a-spin :spinning="loading" id="printBox">
						<a-form :form="form" id="form">
							<div class="account-center-avatarHolder">
								<table class="table-ant" style="table-layout: fixed; word-break: break-all;">
									<thead>
										<tr>
											<th colspan="6" style="text-align: center;padding-bottom: 30px;">
												会议申请
											</th>
										</tr>
									</thead>
									<tr class="table_tr">
										<td>申请单位</td>
										<td colspan="2">
											<a-form-item>
												<tree-select v-decorator="['applicationDepartmentName', { initialValue: applicationDepartmentName ,rules: [{required: true, message: '必填'}]}]"
													:treeValueText="applicationDepartmentName" placeholder="申请单位" :parameter="parameterOrg" :url="urlOrg" 
													:data="treeData" idfield="id" textfield="text" @change="selectOrg"/>
											</a-form-item>
										</td>
										<td>申请时间</td>
										<td colspan="2">
											<a-form-item>
												<t-date v-decorator="['applicatioNtime', { rules: [{required: true, message: '申请时间'}]}]" style="width: 100%;"
												 :showTime="true" dateFormat="YYYY-MM-DD HH:mm:ss" allowClear />
											</a-form-item>
										</td>
									</tr>
									<tr class="table_tr">
										<td>拟定会议名称</td>
										<td colspan="5">
											<a-form-item>
												<a-input v-decorator="['nameOfProposedMeeting', {rules: [{required: true, message: '必填'}]}]" />
											</a-form-item>
										</td>
									</tr>
									<tr class="table_tr line-height-80">
										<td>会议内容</td>
										<td colspan="5">
											<a-form-item>
												<a-input type="textarea" v-decorator="['primaryCoverage', {rules: [{required: true, message: '必填'}]}]" />
											</a-form-item>
										</td>
									</tr>
									<tr class="table_tr">
										<td>会议开始时间</td>
										<td colspan="2">
											<a-form-item>
												<a-input v-decorator="['startTime', {rules: [{required: true, message: '会议开始时间'}]}]" type="hidden"/>
												<a-date-picker v-model="startValue" :disabled-date="disabledStartDate" :show-today="false" @change="panelStartChange"
												 :show-time="{ format: 'HH:mm','minute-step':30 }" format="YYYY-MM-DD HH:mm" placeholder="会议开始时间" @openChange="handleStartOpenChange"
												 style="width: 100%" />
											</a-form-item>
										</td>
										<td>会议结束时间</td>
										<td colspan="2">
											<a-form-item>
												<a-input v-decorator="['endTime', {rules: [{required: true, message: '会议结束时间'}]}]" type="hidden"/>
												<a-date-picker v-model="endValue" :disabled-date="disabledEndDate" :show-today="false" @change="panelEndChange"
												  :show-time="{ format: 'HH:mm','minute-step':30 }" format="YYYY-MM-DD HH:mm" placeholder="会议结束时间" :open="endOpen" @openChange="handleEndOpenChange"
												 style="width: 100%" />
											</a-form-item>
										</td>
									</tr>
									<tr class="table_tr">
										<td>会议时长(小时)</td>
										<td colspan="2">
											<a-form-item>
												<a-input v-decorator="['duration', {rules: [{required: true, message: '必填'}]}]" />
											</a-form-item>
										</td>
										<td>会议室</td>
										<td colspan="2">
											<a-form-item>
												<a-input v-decorator="['conferenceRoomName', {rules: [{required: true, message: '必填'}]}]" @click="attendAddMeeting" readOnly />
												<t-select-meeting ref="attendMeetingModal" @change="attendSelectMeeting" @changeData="changeattendMeeting" :isSelect="false" :visible="attendVisible"
												 @close="close" :paramList="paramList" />
											</a-form-item>
										</td>
									</tr>
									<tr class="table_tr">
										<td>会议类型</td>
										<td colspan="2">
											<a-form-item>
												<a-select v-decorator="['typees', {rules: [{required: true, message: '必填'}]}]">
													<a-select-option v-for="(item, index) in typeList" :key="index" :value="item.value" @click="changeType(item)">
														{{ item.text }}
													</a-select-option>
												</a-select>
											</a-form-item>
										</td>
										<td>会议主持人</td>
										<td colspan="2">
											<a-form-item>
												<user-popup :visible="visiblePopup" style="width: 100%;" @change="(value,other)=>popupCallback(value,other)"
												 @close="() => visiblePopup = false" :typeNum="1"/>
												<a-input @click="() => visiblePopup = true" v-decorator="['hostess', {initialValue: hostess, rules: [{required: true, message: '必填'}]}]"
												 placeholder="会议主持人" readOnly>
													<a-icon slot="prefix" type="user" />
												</a-input>
											</a-form-item>
										</td>
									</tr>
									<tr class="table_tr line-height-80">
										<td>拟参会人员</td>
										<td colspan="5">
											<a-form-item>
												<div class="item-box">
													<div class="tab_table">
														<a-tag closable v-for="(tag, index) in attendData" :key="tag.uuid" @close="attendPrevent(tag, index)">
															{{ tag.userName }}
														</a-tag>
													</div>
													<t-select-role ref="attendModal" @change="attendSelect" @changeData="changeattend" @show="attendAdd"
													 :isSelect="false" :visible="attendVisible" />
												</div>
												<a-input v-decorator="['attendanceUsers', {initialValue: attendanceUsers, rules: [{required: true, message: '必填'}]}]"
												 readOnly type="hidden" />
											</a-form-item>
										</td>
									</tr>
									<tr class="table_tr">
										<td>参会人数</td>
										<td colspan="2">
											<a-form-item>
												<a-input v-decorator="['numberParticipants', {rules: [{required: true, message: '必填'}]}]" />
											</a-form-item>
										</td>
									</tr>
									<tr class="table_tr">
										<td>会议保障</td>
										<td colspan="5">
											<a-form-item>
												<a-input v-decorator="['conferenceGuarantee', {rules: [{required: true, message: '必填'}]}]" type="hidden" />
												<a-checkbox-group :options="securityList" v-model="conferenceGuarantee" @change="onChange">
													<span slot="label" slot-scope="{ text }">{{ text }}</span>
												</a-checkbox-group>
											</a-form-item>
											</a-form-item>
										</td>
									</tr>
									<!-- <tr class="table_tr line-height-80">
										<td>申请单位意见</td>
										<td colspan="5">
											<a-form-item>
												<a-input type="textarea" style="width: 100%;height: 100%;margin-top: 5px;" v-decorator="['applicantOpinion']" />
											</a-form-item>
										</td>
									</tr>
									<tr class="table_tr line-height-80">
										<td>领导意见</td>
										<td colspan="5">
											<a-form-item>
												<a-input type="textarea" style="width: 100%;height: 100%;margin-top: 5px;" v-decorator="['leaderOpinion']" />
											</a-form-item>
										</td>
									</tr> -->
									<tr class="table_tr line-height-80">
										<td>备注</td>
										<td colspan="5">
											<a-form-item>
												<a-input type="textarea" v-decorator="['remark']" />
											</a-form-item>
											<a-form-item>
												<a-input v-decorator="['uuid']" type="hidden" />
												<a-input v-decorator="['hostessId']" type="hidden" />
												<a-input v-decorator="['conferenceRoomUuid']" type="hidden" />
												<a-input v-decorator="['type']" type="hidden" />
												<a-input v-decorator="['applicationDepartmentId']" type="hidden" />
												<a-input v-decorator="['attendanceUserId']" type="hidden" />
											</a-form-item>
										</td>
									</tr>
								</table>
							</div>
						</a-form>
					</a-spin>
				</div>
			</a-card>
		</a-col>
	</t-modal>
</template>

<script>
	import pick from 'lodash.pick'
	import moment from 'moment'
	import UserPopup from '@/components/TopVUI/custom/userPopup'
	import TSelectRole from '@/components/TopVUI/custom/TSelectRole'
	import TSelectMeeting from '@/components/TopVUI/custom/TSelectMeeting'
	import TreeSelect from "@/components/TopVUI/custom/TreeSelect"


	const fields = ['applicationDepartmentName', 'applicatioNtime', 'nameOfProposedMeeting', 'primaryCoverage',
		'startTime', 'endTime', 'duration', 'conferenceRoomName',
		'hostess', 'attendanceUsers', 'conferenceGuarantee', 'hostessId', 'conferenceRoomUuid', 'uuid',
		'applicantOpinion', 'leaderOpinion',
		'remark', 'type', 'numberParticipants', 'applicationDepartmentId','attendanceUserId','typees'
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
			typeList: {
				type: Array,
				default: () => []
			},
			meetingList: {
				type: Array,
				default: () => []
			},
			securityList: {
				type: Array,
				default: () => []
			},
			organList: {
				type: Array,
				default: () => []
			},
		},
		components: {
			UserPopup,
			TSelectRole,
			TSelectMeeting,
			TreeSelect
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
				form: this.$form.createForm(this),
				fullscreen: false,
				viewUrl: '',
				keys: 1,
				fileName: '关于公开遴选公务员的通知.doc',
				fileList: [{
					fileName: '附件1',
				}, {
					fileName: '附件2',
				}],
				titleList: [],
				hostess: '',
				attendanceUsers: '',
				attendanceUserId: '',
				attendData: [],
				attendList: [],
				visiblePopup: false,
				conferenceGuarantee: [],
				numberParticipants: '',
				url: {
					getListByUuids: '/mdata/user/getListByUuids',
				},
				urlOrg: {
					fathersUrl: "/mdata/organization/getListByLevelId?levelId=1",
					expandUrl: "/mdata/organization/getListByPid",
				},
				parameterOrg: {
					father: {
						levelId: 1,
					},
					children: {},
				},
				treeData: [],
				endOpen: false,
				startTime: '',
				endTime: '',
				endValue: '',
				startValue: '',
				attendVisible: false,
				paramList: [],
				assetUuid: [],
				assetData: [],
				applicationDepartmentName: '',
				numberOfPeople: '',
				nowValue: new Date(),
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
		created() {
			this.viewUrl =
				'http://view.officeapps.live.com/op/view.aspx?src=http%3a%2f%2fvideo.ch9.ms%2fbuild%2f2011%2fslides%2fTOOL-532T_Sutter.pptx'
			// 防止表单未注册
			fields.forEach(v => this.form.getFieldDecorator(v))
			// 当 model 发生改变时，为表单设置值
			this.$watch('model', () => {
				this.model && this.form.setFieldsValue(pick(this.model, fields))
			})
			this.$post(this.urlOrg.fathersUrl).then(res => {
				this.treeData = res
				this.treeData.forEach((e, index) => {
					this.treeData[index].title = e.text
					this.treeData[index].label = e.text
					this.treeData[index].index = index
					this.treeData[index].value = e.text
					this.treeData[index].key = e.id
					this.treeData[index].levelId = e.levelId
				})
			})
		},
		methods: {
			moment,
			add(m) {
				this.conferenceGuarantee = []
				this.hostess = ''
				this.startValue = ''
				this.endValue = ''
				this.attendData = []
				this.attendList = []
				this.applicationDepartmentName= ''
			},
			edit(e) {
				const m = Object.assign({}, e)
				console.log("m", m)
				this.conferenceGuarantee = []
				this.hostess = ''
				this.attendData = []
				this.attendList = []
				this.$nextTick(() => {
					this.applicationDepartmentName = m && m.applicationDepartmentName ? m.applicationDepartmentName : ''
					console.log(e, m)
					this.form.setFieldsValue(pick(m, fields))
					if (m && m.conferenceGuarantee) this.conferenceGuarantee = m.conferenceGuarantee.split(",")
					if(m.attendanceUsers){
						let list = m.attendanceUsers.split(",")
						this.attendList = m.attendanceUserId.split(",")
						list.forEach((val,index)=>{
							this.attendData.push({userName: val,uuid: index+'szd10' })
						})
					}
					// this.nowValue = m.startTime
					this.startValue = m.startTime
					this.endValue = m.endTime
				})
			},
			//选择会议室
			onChange(checkedValues) {
				console.log('checked = ', checkedValues);
				console.log('value = ', this.conferenceGuarantee);
				this.form.setFieldsValue({
					conferenceGuarantee: this.conferenceGuarantee.toString(),
				})
			},
			attendAddMeeting() {
				this.attendVisible = true
			},
			attendSelectMeeting(e) {
			},
			close(){
				this.attendVisible = false
			},
			changeattendMeeting(data) {
				console.log("data", data[0])
				this.$nextTick( ()=> {
					this.form.setFieldsValue({
						conferenceRoomUuid: data[0].uuid,
						conferenceRoomName: data[0].name
					})
					this.numberOfPeople = data[0].numberOfPeople
				})
			},
			//-----结束
			// 开始时间
			getChangeDate(val){
				let time = moment(val).format('yyyy-MM-DD HH:mm').split(" ")[1]
				let data = moment(val).format('yyyy-MM-DD')
				let hour = time.split(":")[0]
				let minute = time.split(":")[1]
				console.log("minute---",minute)
				if (minute > 30) {
					hour++;
					minute = '00'
				} else if (minute == '00') {
					minute = '00'
				} else if (minute <=30) {
					minute = '30'
				}
				return data.concat(" " + hour + ":" + minute + ':00');
			},
			disabledStartDate(startValue) {
				const endValue = moment(this.nowValue);
				if (!startValue || !endValue) {
					return false;
				}
				return startValue.valueOf() < endValue.valueOf() + (2*60*1000);
			},
			disabledEndDate(endValue) {
				const startValue = moment(this.startValue);
				if (!endValue || !startValue) {
					return false;
				}
				return startValue.valueOf()+(30*60*1000) >= endValue.valueOf();
			},
			handleStartOpenChange(open) {
				if (!open) {
					// this.endOpen = true;
				}
				this.nowValue =  this.startValue
				if(this.startValue && this.endValue){
					var time = moment(this.endValue).valueOf() - moment(this.startValue).valueOf()  //时间差  毫秒
					this.form.setFieldsValue({
						duration: Number(time/(1000*3600)),
					})
				}
			},
			handleEndOpenChange(open) {
				if(this.startValue){
					this.endOpen = open;
				} else {
					this.$message.info("请先选择会议开始日期")
				}
				if(this.startValue && this.endValue){
					var time = moment(this.endValue).valueOf() - moment(this.startValue).valueOf()  //时间差  毫秒
					this.form.setFieldsValue({
						duration: Number(time/(1000*3600)),
					})
				}
			},
			panelStartChange(date, dateString){
				this.form.setFieldsValue({
					reserveStartDate: this.getChangeDate(date)
				})
				this.startValue = this.getChangeDate(date)
			},
			panelEndChange(date, dateString){
				this.form.setFieldsValue({
					reserveEndDate: this.getChangeDate(date)
				})
				this.endValue = this.getChangeDate(date)
				this.nowValue = date
			},
			//-------结束
			popupCallback(value, other) {
				this.$nextTick(() => {
					this.hostess = value.userName
					this.form.setFieldsValue({
						hostess: this.hostess,
						hostessId: value.userNameId
					})
				})
			},
			changeType(item) {
				console.log(item)
				this.form.setFieldsValue({
					typees:item.text,
					type: item.value,
				})
			},
			changeAddress(item) {
				console.log("item", item)
				this.form.setFieldsValue({
					conferenceRoomUuid: item.uuid,
				})
			},
			changeattend(data) {
				let datList = []
				data.forEach(val => {
					console.log('val', val)
					if (this.attendList.find(e => val.userNameId === e)) {} else {
						this.attendList.push(val.userNameId)
						this.attendData.push(val)
					}
				})
				this.attendData.forEach(val => {
					datList.push(val.userName)
				})
				this.attendanceUserId = this.attendList.join(',')
				this.attendanceUsers = datList.join(',')
				this.form.setFieldsValue({
					attendanceUsers: this.attendanceUsers,
					attendanceUserId: this.attendanceUserId,
					numberParticipants: this.attendData.length
				})
			},
			attendPrevent(tag, index) {
				console.log('tag, index', tag, index)
				let datList = []
				this.attendData.splice(index, 1)
				if(tag.userNameId){
					this.attendList.splice(this.attendList.indexOf(tag.userNameId) || index , 1)
				} else {
					this.attendList.splice(index, 1)
				}
				this.attendData.forEach(val => {
					datList.push(val.userName)
				})
				this.attendanceUserId = this.attendList.toString()
				this.attendanceUsers = datList.join(',')
				this.form.setFieldsValue({
					attendanceUsers: this.attendanceUsers,
					attendanceUserId: this.attendanceUserId,
					numberParticipants: this.attendData.length
				})
			},
			attendAdd() {
				this.$refs.attendModal.show()
			},
			attendSelect(e) {
				// console.log('e------------', e)
			},
			handleSave() {
				this.form.validateFields((errors, values) => {
					console.log(values)
				})
			},
			handleSign() {
				this.form.validateFields((errors, values) => {
					console.log(values)
				})
			},
			selectOrg(value,node) {
				this.$nextTick(() => {
					this.applicationDepartmentName = node ? node.toString() : ''
					this.form.setFieldsValue({
						applicationDepartmentId: value,
						applicationDepartmentName: node ? node.toString() : ''
					})
				})
			},
		}
	}
</script>

<style scoped lang="less">
	/deep/.ant-col .ant-form-item-control-wrapper {
		width: 100%;
	}

	.account-center-avatarHolder {
		padding-top: 20px;
		margin-bottom: 50px;
	}

	.item-box {
		display: flex;
	}

	.tab_table {
		width: 95%;
	}

	.box_title {
		padding-bottom: 30px;
	}

	.box_container {
		padding: 40px 30px;
		background: #fafafa;
		border-radius: 10px;

		.box_art {
			display: flex;
			align-items: center;
			margin-bottom: 20px;

			.box_name {
				width: 20%;
				text-align: right;
				padding-right: 10px;
				white-space: nowrap;
			}

			.box_filename,
			.box_filelist {
				width: 65%;

				div {
					margin-bottom: 10px;
				}
			}
		}
	}

	.table-ant {
		width: 80%;
		margin: 0 auto;
		padding: 10px 20px 10px;

		thead {
			font-size: 20px;
			font-weight: bold;
		}

		.table_tr {
			height: 40px;
			line-height: 40px;
			border: 1px solid #e7e7e7;
		}

		.line-height-80 {
			line-height: 80px;
		}

		.table_tr>td {
			border-right: 1px solid #e7e7e7;
			text-align: center;
		}

		input {
			// border: none;
			width: 100%;
			height: 100%;
			outline: none;
		}

		textarea {
			border: none;
			width: 100%;
			height: 100%;
			outline: none;
		}

		.table_tr>td:nth-child(2n) {
			text-align: left;
			// padding-left: 20px;
		}
	}

	.ant-form-item {
		display: flex;
		margin-bottom: 0 !important;
	}

	.ant-input:focus {
		border: none;
		box-shadow: none;
	}

	textarea,
	textarea.ant-input:hover,
	textarea:focus {
		// border: 1px solid #DAE2F3;
		-webkit-box-shadow: none;
		box-shadow: none;
	}


	/*去除页眉页脚*/
	@page {
		size: auto;
		/* auto is the initial value */
		margin: 3mm;
		/* this affects the margin in the printer settings */
	}

	html {
		background-color: #FFFFFF;
		margin: 0;
		/* this affects the margin on the html before sending to printer */
	}

	body {
		border: solid 1px blue;
		margin: 10mm 15mm 10mm 15mm;
		/* margin you want for the content */
	}

	/*去除页眉页脚*/
</style>
