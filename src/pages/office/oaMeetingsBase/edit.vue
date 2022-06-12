<template>
	<t-modal
		title="新增/编辑"
		:width="1000"
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
					<a-col :span="12">
						<a-form-item label="会议名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['name', { rules: [{ required: true, message: '必填' }] }]" />
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="审批人" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="showUser">
							<user-popup
								:visible="visiblePopup"
								:typeNum="1"
								style="width: 100%;"
								@change="(value, other) => popupCallback(value, other)"
								@close="() => (visiblePopup = false)"
							/>
							<a-input
								@click="() => (visiblePopup = true)"
								v-decorator="[
									'userName',
									{ initialValue: userName, rules: [{ required: true, message: '必填' }] },
								]"
								placeholder="审批人"
								readOnly
							>
								<a-icon slot="prefix" type="user" />
							</a-input>
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="会议类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-select
								v-decorator="['typeName', { rules: [{ required: true, message: '必填' }] }]"
								@change="changeType"
							>
								<a-select-option v-for="(item, index) in typeList" :key="index" :value="item.value">
									{{ item.text }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="会议室" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-select
								v-decorator="['meetingRoomName', { rules: [{ required: true, message: '必填' }] }]"
								@change="changeMeeting"
							>
								<a-select-option v-for="(item, index) in meetingList" :key="index" :value="item.name">
									{{ item.name }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="开会时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-date-picker
								v-decorator="['meetingTime', { rules: [{ required: true, message: '必填' }] }]"
								:disabled-date="disabledStartDate"
								show-time
								format="YYYY-MM-DD HH:mm:ss"
								@openChange="handleStartOpenChange"
								@change="changeStart"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="会议截止时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-date-picker
								v-decorator="['blocking', { rules: [{ required: true, message: '必填' }] }]"
								:disabled-date="disabledEndDate"
								show-time
								format="YYYY-MM-DD HH:mm:ss"
								@openChange="handleEndOpenChange"
								@change="changeEnd"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="24" style="padding-left: 6px !important;">
						<a-form-item label="会议内容" :labelCol="labelColfull" :wrapperCol="wrapperColfull">
							<a-textarea
								:autoSize="{ minRows: 3 }"
								v-decorator="['content', { rules: [{ required: true, message: '必填' }] }]"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="24" style="padding-left: 6px !important;">
						<a-form-item label="有牌人员" :labelCol="labelColfull" :wrapperCol="wrapperColfull">
							<div class="item-box">
								<div class="tab_table">
									<a-tag
										closable
										v-for="(tag, index) in hasData"
										:key="tag.uuid"
										@close="hasDataPrevent(tag, index)"
									>
										{{ tag.userName }}
									</a-tag>
								</div>
								<t-select-role
									ref="hasDataModal"
									@change="hasDataSelect"
									@changeData="changeHasData"
									@show="hasDataAdd"
									:isSelect="false"
									:visible="hasDataVisible"
								/>
							</div>
							<a-input
								v-decorator="[
									'divWhether01',
									{ initialValue: divWhether01, rules: [{ required: true, message: '必填' }] },
								]"
								readOnly
								type="hidden"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="24" style="padding-left: 6px !important;">
						<a-form-item label="无牌人员" :labelCol="labelColfull" :wrapperCol="wrapperColfull">
							<div class="item-box">
								<div class="tab_table">
									<a-tag
										closable
										v-for="(tag, index) in noData"
										:key="tag.uuid"
										@close="noDataPrevent(tag, index)"
									>
										{{ tag.userName }}
									</a-tag>
								</div>
								<t-select-role
									ref="noDataModal"
									@change="noDataSelect"
									@changeData="changeNoData"
									@show="noDataAdd"
									:isSelect="false"
									:visible="noDataVisible"
								/>
							</div>
							<a-input
								v-decorator="[
									'divWhether02',
									{ initialValue: divWhether02, rules: [{ required: true, message: '必填' }] },
								]"
								readOnly
								type="hidden"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="24" style="padding-left: 6px !important;" v-if="showReset">
						<a-form-item label="驳回意见" :labelCol="labelColfull" :wrapperCol="wrapperColfull">
							<a-textarea :autoSize="{ minRows: 3 }" v-decorator="['remarks']" readOnly />
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item>
							<a-input v-decorator="['type']" type="hidden" />
						</a-form-item>
						<a-form-item>
							<a-input v-decorator="['meetingRoom']" type="hidden" />
						</a-form-item>
						<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['uuid', { initialValue: uuid }]" type="hidden" />
						</a-form-item>
						<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['participants', { initialValue: participants }]" type="hidden" />
						</a-form-item>
						<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['userNameId', { initialValue: userNameId }]" type="hidden" />
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
		</a-spin>
	</t-modal>
</template>

<script>
import moment from 'moment';
import pick from 'lodash.pick';
import UserPopup from '@/components/TopVUI/custom/userPopup';
import TSelectRole from '@/components/TopVUI/custom/TSelectRole';

// 表单字段
const fields = [
	'uuid',
	'name',
	'typeName',
	'type',
	'meetingRoom',
	'participants',
	'meetingTime',
	'meetingRoomName',
	'blocking',
	'content',
	'userName',
	'userNameId',
	'divWhether01',
	'divWhether02',
	'remarks',
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
		meetingList: {
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
					span: 12,
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
			url: {
				getCategorysByTypeAndLevelId: '/system/category/getCategorysByTypeAndLevelId',
				getListByPid: '/system/category/getListByPid',
				getTopicBaseDetailByUuid: '/system/topicBase/getDetailByUuid',
				getDetailByUuidAndUser: '/office/oaMeetingsBase/getDetailByUuidAndUser',
				editcontents: '/office/oaMeetingsBase/editcontents',
				getDetail: '/office/oaMeetingsBase/editcontents',
				getListByUuids: '/mdata/user/getListByUuids',
			},
			uuid: '',
			state: '',
			userName: '',
			userNameId: '',
			participants: '',
			meetingTime: '',
			blocking: '',
			divWhether01: '',
			divWhether02: '',
			hasData: [],
			noData: [],
			uuidHasList: [],
			uuidNoList: [],
			hasDataVisible: false,
			noDataVisible: false,
			visiblePopup: false,
			queryParam: {},
			showUser: false,
			showReset: false,
		};
	},
	methods: {
		moment,
		clearData() {
			this.hasData = [];
			this.noData = [];
			this.uuidHasList = [];
			this.uuidNoList = [];
			this.divWhether01 = '';
			this.divWhether02 = '';
		},
		add(m) {
			console.log('add', m);
			this.showUser = true;
			this.showReset = false;
			this.uuid = '';
			this.clearData();
			this.participants = '';
			this.userName = '';
			this.userNameId = '';
		},
		reset() {},
		edit(m) {
			this.showReset = m.state === 'meeting.foundation.state07' ? true : false;
			this.showUser = false;
			this.clearData();
			this.$axios('get', `${this.url.getDetailByUuidAndUser}?uuid=${m.uuid}`).then((res) => {
				console.log('res', res);
				this.form.setFieldsValue(pick(res, fields));
				this.meetingList.forEach((e) => {
					if (e.uuid === res.meetingRoom) {
						this.form.setFieldsValue({
							meetingRoom: e.uuid,
							meetingRoomName: e.name,
						});
					}
				});
				this.typeList.forEach((e) => {
					if (e.value === res.type) {
						console.log('e-------', e);
						this.form.setFieldsValue({
							type: e.value,
							typeName: e.text,
						});
					}
				});
				//接口获取
			});
			this.$axios('get', `${this.url.getDetail}?puuid=${m.uuid}`).then((res) => {
				//获取人员数据
				if (res.haveUserAdd) {
					res.haveUserAdd.forEach((val) => {
						let userIdList = val.userId.split(',');
						userIdList.forEach((e) => {
							this.uuidHasList.push(e);
							this.$post(this.url.getListByUuids, {
								uuids: e,
							}).then((res) => {
								res.forEach((el) => {
									var data = {};
									data.uuid = e;
									data.userName = el.userName;
									this.hasData.push(data);
								});
							});
						});
					});
					this.divWhether01 = this.uuidHasList.join(',');
				}
				if (res.noUserAdd) {
					res.noUserAdd.forEach((val) => {
						let noUserIdList = val.userId.split(',');
						noUserIdList.forEach((e) => {
							this.uuidNoList.push(e);
							this.$post(this.url.getListByUuids, {
								uuids: e,
							}).then((res) => {
								res.forEach((el) => {
									var data = {};
									data.uuid = e;
									data.userName = el.userName;
									this.noData.push(data);
								});
							});
						});
					});
					this.divWhether02 = this.uuidNoList.join(',');
				}
			});
		},
		changeType(val) {
			this.$nextTick(() => {
				this.typeList.forEach((e) => {
					if (e.value === val) {
						console.log('e-------', e);
						this.form.setFieldsValue({
							type: e.value,
							typeName: e.text,
						});
					}
				});
			});
		},
		changeMeeting(val) {
			this.$nextTick(() => {
				this.meetingList.forEach((e) => {
					if (e.name === val) {
						this.form.setFieldsValue({
							meetingRoom: e.uuid,
							meetingRoomName: val,
						});
					}
				});
			});
		},
		changeHasData(data) {
			data.forEach((val) => {
				console.log('this.uuidHasList', this.uuidHasList);
				if (this.uuidNoList.length != 0 && this.uuidHasList.find((e) => val.uuid === e)) {
					console.log('存在了', e);
				} else {
					this.uuidHasList.push(val.uuid);
					this.hasData.push(val);
				}
				this.divWhether01 = this.uuidHasList.join(',');
				this.form.setFieldsValue({
					divWhether01: this.divWhether01,
				});
			});
		},
		hasDataPrevent(tag, index) {
			var data = this.hasData;
			data.forEach((val, index) => {
				if (val.uuid === tag.uuid) {
					data.splice(index, 1);
				}
			});
			this.hasData = data;
			this.uuidHasList.splice(this.uuidHasList.indexOf(tag.uuid), 1);
			this.divWhether01 = this.uuidHasList.toString();
			this.form.setFieldsValue({
				divWhether01: this.divWhether01,
			});
		},
		hasDataSelect(e) {
			// console.log('e------------', e)
		},
		hasDataAdd() {
			this.$refs.hasDataModal.show();
		},
		changeNoData(data) {
			data.forEach((val) => {
				console.log('val', val);
				if (this.uuidNoList.find((e) => val.uuid === e)) {
					console.log('存在了', e);
				} else {
					this.uuidNoList.push(val.uuid);
					this.noData.push(val);
				}
			});
			this.divWhether02 = this.uuidNoList.join(',');
			this.form.setFieldsValue({
				divWhether02: this.divWhether02,
			});
		},
		noDataPrevent(tag, index) {
			var data = this.noData;
			data.forEach((val, index) => {
				if (val.uuid === tag.uuid) {
					data.splice(index, 1);
				}
			});
			this.noData = data;
			this.uuidNoList.splice(this.uuidNoList.indexOf(tag.uuid), 1);
			this.divWhether02 = this.uuidNoList.toString();
			this.form.setFieldsValue({
				divWhether02: this.divWhether02,
			});
		},
		noDataAdd() {
			this.$refs.noDataModal.show();
		},
		noDataSelect(e) {
			// console.log('e------------', e)
		},
		popupCallback(value) {
			this.$nextTick(() => {
				console.log('value,other', value);
				this.participants = value.userNameId;
				this.userName = value.userName;
				this.userNameId = value.userNameId;
				this.form.setFieldsValue({
					participants: this.participants,
					userName: this.userName,
					userNameId: this.userNameId,
				});
			});
		},
		changeStart(data, dateString) {
			this.$nextTick(() => {
				this.meetingTime = moment(dateString, 'YYYY-MM-DD HH:mm:ss')._i;
				this.form.setFieldsValue({
					meetingTime: this.meetingTime,
				});
			});
		},
		changeEnd(data, dateString) {
			this.$nextTick(() => {
				this.blocking = moment(dateString, 'YYYY-MM-DD HH:mm:ss')._i;
				this.form.setFieldsValue({
					blocking: this.blocking,
				});
			});
		},
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
		handleStartOpenChange(open) {},
		handleEndOpenChange(open) {
			this.endOpen = open;
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
