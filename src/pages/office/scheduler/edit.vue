<template>
	<t-modal
		title="新建日程"
		:width="800"
		:visible="visible"
		:confirmLoading="loading"
		@ok="
			() => {
				$emit('ok');
			}
		"
		@cancel="
			() => {
				$emit('cancel');
			}
		"
	>
		<a-spin :spinning="loading">
			<a-form :form="form">
				<a-row :gutter="24" type="flex" justify="start">
					<a-col :span="24">
						<a-form-item label="日程名称" :labelCol="labelColfull" :wrapperCol="wrapperColfull">
							<a-input v-decorator="['title', { rules: [{ required: true, message: '必填' }] }]" />
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item label="事件描述" :labelCol="labelColfull" :wrapperCol="wrapperColfull">
							<a-input v-decorator="['text', { rules: [{ required: true, message: '必填' }] }]" />
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item label="事件类型" :labelCol="labelColfull" :wrapperCol="wrapperColfull">
							<a-select v-decorator="['eventType']">
								<a-select-option v-for="(item, index) in typeList" :key="index" :value="item.key">
									{{ item.label }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<!-- 					<a-col :span="24">
						<a-form-item label="组织人" :labelCol="labelColfull" :wrapperCol="wrapperColfull">
							<user-popup :visible="visiblePopup" style="width: 100%;"
								@change="(value,other)=>popupCallback(value,other)" @close="() => visiblePopup = false"
								:typeNum="1" />
							<a-input @click="() => visiblePopup = true"
								v-decorator="['organizer', {rules: [{required: true, message: '必填'}]}]"
								placeholder="组织人" readOnly>
								<a-icon slot="prefix" type="user" />
							</a-input>
						</a-form-item>
					</a-col> -->
					<a-col :span="12">
						<a-form-item label="开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-date-picker
								v-decorator="['startDate', { rules: [{ required: true, message: '必填' }] }]"
								:show-today="false"
								:disabled-date="disabledStartDate"
								:show-time="{ format: 'HH:mm', 'minute-step': 30 }"
								format="YYYY-MM-DD HH:mm"
								@change="changeStart"
								placeholder="Start"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="结束时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-date-picker
								v-decorator="['endDate', { rules: [{ required: true, message: '必填' }] }]"
								:show-today="false"
								:disabled-date="disabledEndDate"
								:show-time="{ format: 'HH:mm', 'minute-step': 30 }"
								format="YYYY-MM-DD HH:mm"
								@change="changeEnd"
								placeholder="End"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item label="参与人" :labelCol="labelColfull" :wrapperCol="wrapperColfull">
							<div class="item-box">
								<div class="tab_table">
									<a-tag
										closable
										v-for="(tag, index) in attendData"
										:key="tag.uuid"
										@close="attendPrevent(tag, index)"
									>
										{{ tag.userName }}
									</a-tag>
								</div>
								<t-select-role
									ref="attendModal"
									@change="attendSelect"
									@changeData="changeattend"
									@show="attendAdd"
									:isSelect="false"
									:visible="attendVisible"
								/>
							</div>
							<a-input v-decorator="['joinUser']" readOnly type="hidden" />
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item>
							<a-input v-decorator="['uuid']" hidden />
						</a-form-item>
						<a-form-item>
							<a-input v-decorator="['organizerId']" hidden />
						</a-form-item>
						<a-form-item>
							<a-input v-decorator="['joinUserId']" hidden />
						</a-form-item>
						<a-form-item>
							<a-input v-decorator="['organizer']" hidden />
						</a-form-item>
						<a-form-item>
							<a-input v-decorator="['evType']" hidden />
						</a-form-item>
						<a-form-item>
							<a-input v-decorator="['pid']" hidden />
						</a-form-item>
						<a-form-item>
							<a-input v-decorator="['creator']" hidden />
						</a-form-item>
						<a-form-item>
							<a-input v-decorator="['creatorId']" hidden />
						</a-form-item>
						<a-form-item>
							<a-input v-decorator="['creatorOrgId']" hidden />
						</a-form-item>
						<a-form-item>
							<a-input v-decorator="['createTime']" hidden />
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
		</a-spin>
	</t-modal>
</template>

<script>
import moment from 'moment';

import UserPopup from '@/components/TopVUI/custom/userPopup';
import TSelectRole from '@/components/TopVUI/custom/TSelectRole';
import pick from 'lodash.pick';
// 表单字段
const fields = [
	'uuid',
	'title',
	'text',
	'eventType',
	'startDate',
	'endDate',
	'joinUser',
	'organizerId',
	'organizer',
	'joinUserId',
	'evType',
	'pid',
	'creator',
	'creatorId',
	'creatorOrgId',
	'createTime',
];

export default {
	components: {
		UserPopup,
		TSelectRole,
	},
	props: {
		visible: {
			type: Boolean,
			required: true,
		},
		loading: {
			type: Boolean,
			default: () => false,
		},
		model: {
			type: Object,
			default: () => null,
		},
		typeList: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			labelCol: {
				xs: {
					span: 24,
				},
				sm: {
					span: 8,
				},
			},
			labelColfull: {
				xs: {
					span: 24,
				},
				sm: {
					span: 4,
				},
			},
			wrapperCol: {
				xs: {
					span: 24,
				},
				sm: {
					span: 14,
				},
			},
			wrapperColfull: {
				xs: {
					span: 24,
				},
				sm: {
					span: 18,
				},
			},
			form: this.$form.createForm(this),
			title: '新建',
			eventType: '',
			startDate: null,
			endDate: null,
			joinUser: '',
			joinUserId: '',
			attendData: [],
			attendList: [],
			datList: [],
			attendVisible: false,
			visiblePopup: false,
			paramList: [],
			assetUuid: [],
			assetData: [],
			applicationDepartmentName: '',
		};
	},
	methods: {
		moment,
		select(start, end) {
			console.log('start,end=====', start, end);
			this.$nextTick(() => {
				this.form.setFieldsValue({
					text: '新建日程',
					startDate: moment(start),
					endDate: moment(end),
					eventType: '',
				});
				this.attendList = [];
				this.attendData = [];
			});
		},
		add(m) {
			console.log('m=====', m);
			this.form.setFieldsValue(pick(m, fields));
			this.attendList = [];
			this.attendData = [];
		},
		edit(data) {
			console.log('edit=====', data.uuid);
			this.attendList = [];
			this.attendData = [];
			this.$nextTick(() => {
				if (data) {
					this.$post('/office/scheduler/getDetailByUuid', { uuid: data.uuid }).then((res) => {
						console.log('res----', res);
						this.form.setFieldsValue(pick(res, fields));
						if (res.joinUser) {
							let list = res.joinUser.split(',');
							this.attendList = res.joinUserId.split(',');
							list.forEach((val, index) => {
								this.attendData.push({ userName: val, uuid: index + 'szd10' });
							});
						}
						this.typeList.forEach((val) => {
							if (val.key == res.eventType) {
								this.form.setFieldsValue({
									eventType: val.key,
								});
							}
						});
						this.startDate = res.startDate;
						this.endDate = res.endDate;
					});
				}
			});
		},
		//选择人
		popupCallback(value, other) {
			this.$nextTick(() => {
				this.form.setFieldsValue({
					organizer: value.userName,
					organizerId: value.userNameId,
				});
			});
		},
		changeattend(data) {
			var that = this;
			that.$nextTick(() => {
				let datList = [];
				data.forEach((val) => {
					console.log('val-----', val, that.attendList);
					if (that.attendList.find((e) => val.userNameId === e)) {
					} else {
						that.attendData.push(val);
						that.attendList.push(val.userNameId);
					}
				});
				that.attendData.forEach((val) => {
					datList.push(val.userName);
				});
				that.joinUserId = that.attendList.join(',');
				that.joinUser = datList.join(',');
				console.log('tag, index-----1111', that.joinUserId, that.joinUser);
				that.form.setFieldsValue({
					joinUser: that.joinUser,
					joinUserId: that.joinUserId,
				});
			});
		},
		attendPrevent(tag, index) {
			var that = this;
			let datList = [];
			that.attendData.splice(index, 1);
			console.log('attendData-----22222', that.attendData);
			if (tag.userNameId) {
				that.attendList.splice(that.attendList.indexOf(tag.userNameId) || index, 1);
			} else {
				that.attendList.splice(index, 1);
			}
			that.attendData.forEach((val) => {
				datList.push(val.userName);
			});
			that.joinUserId = that.attendList.toString();
			that.joinUser = datList.toString();
			console.log('tag, index-----22222', that.joinUserId, that.joinUser);
			that.form.setFieldsValue({
				joinUser: that.joinUser,
				joinUserId: that.joinUserId,
			});
		},
		attendAdd() {
			this.$refs.attendModal.show();
		},
		attendSelect(e) {
			// console.log('e------------', e)
		},
		//时间
		getChangeDate(val) {
			let time = moment(val)
				.format('yyyy-MM-DD HH:mm')
				.split(' ')[1];
			let data = moment(val).format('yyyy-MM-DD');

			let hour = time.split(':')[0];
			let minute = time.split(':')[1];
			console.log('minute---', minute);
			if (minute > 30) {
				hour++;
				minute = '00';
			} else if (minute == '00') {
				minute = '00';
			} else if (minute <= 30) {
				minute = '30';
			}
			return data.concat(' ' + hour + ':' + minute + ':00');
		},
		changeStart(dates, dateStrings) {
			this.$nextTick(() => {
				this.startDate = dates;
			});
		},
		changeEnd(dates, dateStrings) {
			this.$nextTick(() => {
				this.endDate = dates;
			});
		},
		disabledStartDate(startValue) {
			const endValue = moment(this.endDate);
			if (!startValue || !endValue) {
				return false;
			}
			return startValue.valueOf() > endValue.valueOf();
		},
		disabledEndDate(endValue) {
			const startValue = moment(this.startDate);
			if (!endValue || !startValue) {
				return false;
			}
			return startValue.valueOf() + 30 * 60 * 1000 >= endValue.valueOf();
		},
	},
	created() {
		// 防止表单未注册
		fields.forEach((v) => this.form.getFieldDecorator(v));
		// 当 model 发生改变时，为表单设置值
		this.$watch('model', () => {
			this.model && this.form.setFieldsValue(pick(this.model, fields));
		});
	},
};
</script>

<style lang="less" scoped>
.tab_table {
	width: 100%;
	min-height: 100px;
	background: #ffffff;
	border-radius: 8px;
	border: 1px solid #e7e7e7;
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
