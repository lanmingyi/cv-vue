<template>
	<!-- <j-modal :title="mettingTitle" placement="right" width="60%" :visible="visible" :fullscreen="true" :switchFullscreen="true" :confirmLoading="loading" @cancel="() => { $emit('cancel') }"> -->
	<t-drawer
		:title="mettingTitle"
		placement="right"
		:closable="true"
		:width="1000"
		:visible="visible"
		:confirmLoading="loading"
		@close="
			() => {
				$emit('cancel');
			}
		"
	>
		<a-spin :spinning="loading">
			<a-card :bordered="false">
				<!-- left: 'timeGridDay,timeGridWeek,dayGridMonth', -->
				<FullCalendar
					class="calendar"
					ref="fullCalendar"
					defaultView="timeGridWeek"
					locale="zh-cn"
					:header="{
						left: '',
						center: '',
						right: 'prev, today ,next ',
					}"
					:all-day-slot="calendarOptions.allDaySlot"
					:slot-duration="calendarOptions.slotDuration"
					:slot-label-interval="calendarOptions.slotLabelInterval"
					:slot-min-time="calendarOptions.slotMinTime"
					:slot-max-time="calendarOptions.slotMaxTime"
					:scroll-time="calendarOptions.scrollTime"
					:slot-label-format="calendarOptions.slotLabelFormat"
					:event-time-format="calendarOptions.eventTimeFormat"
					:editable="true"
					:selectable="true"
					:unselectAuto="false"
					:buttonText="buttonText"
					:plugins="calendarPlugins"
					:weekends="calendarWeekends"
					:events="getCalendarEvents"
					@eventDrop="eventDropStop"
					@eventResize="eventDropStop"
					:eventLimit="true"
					eventLimitText="更多"
					@eventClick="handleEventClick"
				/>
				<!-- @select="selectClick" 双击事件-->
			</a-card>
			<div class="add_event_button" @click="addScheduler()">
				<a-tooltip placement="left">
					<template slot="title">
						<span>会议室预定</span>
					</template>
					<a-icon type="plus" />
				</a-tooltip>
			</div>

			<edit-form
				ref="createModal"
				:meetingList="meetingList"
				:typeNum="2"
				:visible="masterVisible"
				:loading="confirmLoading"
				@cancel="
					() => {
						masterVisible = false;
					}
				"
				@ok="handleJsonOk()"
				@reply="handleJsonOk({ type: 'reApply' })"
				@switchPosition="handleJsonOk({ type: 'switchPosition' })"
			/>
		</a-spin>
		<t-drawer
			title="预定详情"
			width="500"
			:closable="false"
			:visible="childrenDrawer"
			@close="
				() => {
					childrenDrawer = false;
				}
			"
		>
			<table class="table-ant" style="table-layout: fixed; word-break: break-all;" v-if="reserveDate">
				<tr class="table_tr">
					<td>会议室名称</td>
					<td colspan="3">
						{{ reserveDate.conferenceRoomName }}
					</td>
				</tr>
				<tr class="table_tr">
					<td>会议议题</td>
					<td colspan="3">
						{{ reserveDate.topics }}
					</td>
				</tr>
				<tr class="table_tr">
					<td>参会人数</td>
					<td colspan="3">
						{{ reserveDate.attendNumberOfPeople }}
					</td>
				</tr>
				<tr class="table_tr">
					<td>预订人</td>
					<td colspan="3">
						{{ reserveDate.reserveName }}
					</td>
				</tr>
				<tr class="table_tr ">
					<td>预定开始时间</td>
					<td colspan="3">
						{{ reserveDate.reserveStartDate }}
					</td>
				</tr>
				<tr class="table_tr ">
					<td>预定结束时间</td>
					<td colspan="3">
						{{ reserveDate.reserveEndDate }}
					</td>
				</tr>
				<tr class="table_tr line-height-80">
					<td>备注</td>
					<td colspan="3">
						{{ reserveDate.reason }}
					</td>
				</tr>
			</table>
		</t-drawer>
	</t-drawer>
</template>

<script>
import FullCalendar from '@fullcalendar/vue';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';

import { simpleListMixin } from '@/mixins/simpleListMixin';
import editForm from './edit.vue';
export default {
	name: 'TableList',
	components: {
		FullCalendar,
		editForm,
	},
	mixins: [simpleListMixin],
	props: {
		visible: {
			type: Boolean,
			required: true,
		},
		loading: {
			type: Boolean,
			required: true,
		},
		model: {
			type: Object,
		},
	},
	data() {
		return {
			moment,
			buttonText: {
				today: '今天',
				month: '月',
				week: '周',
				day: '天',
			},
			url: {
				getReserveList: '/office/oaConferenceRoomReserve/getPageSetByMeetingUuid',
				save: '/office/oaConferenceRoomReserve/save',
				update: '/office/oaConferenceRoomReserve/update',
				deleteBatch: '/office/oaConferenceRoomReserve/deleteBatch',
				getDetailByUuid: '/office/oaConferenceRoomReserve/getDetailByUuid',
			},
			calendarPlugins: [
				// plugins must be defined in the JS
				dayGridPlugin,
				timeGridPlugin,
				interactionPlugin, // needed for dateClick
			],
			calendarOptions: {
				calendarAllDaySlot: false,
				slotLabelInterval: '1:00', // 时间间隔
				slotDuration: '01:00:00', // 时间间隔
				slotMinTime: '07:00',
				slotMaxTime: '22:00',
				scrollTime: '09:00', // 默认展示的时间
				slotLabelFormat: {
					// 周时间的左侧时间轴配置
					hour12: false,
					hour: '2-digit',
					minute: '2-digit',
				},
				eventTimeFormat: {
					hour12: false,
					hour: '2-digit',
					minute: '2-digit',
				},
			},
			calendarWeekends: true,
			calendarEvents: [],
			calendarApi: null,
			masterVisible: false,
			masterMdl: null,
			isEdit: false,
			isShowArea: false,
			editValue: '',
			parmasData: '',
			num: 0,
			timer: null,
			typeList: [
				{
					key: '',
					label: '请选择事件类型',
				},
				{
					key: '1',
					label: '工作',
				},
				{
					key: '2',
					label: '会议',
				},
				{
					key: '3',
					label: '出差',
				},
				{
					key: '4',
					label: '休闲',
				},
				{
					key: '5',
					label: '其它',
				},
			],
			params: {
				pageNo: 1,
				pageSize: 20,
			},
			childrenDrawer: false,
			mettingTitle: '',
			mettingUuid: '',
			reserveDate: '',
			confirmLoading: false,
			meetingList: [],
		};
	},
	mounted() {},
	methods: {
		onLoad(item) {
			this.mettingTitle = item.name;
			this.mettingUuid = item.uuid;
			console.log('item', item);
			this.$nextTick(() => {
				this.calendarApi = this.$refs.fullCalendar.getApi();
				this.calendarEvents = [];
				this.calendarApi.refetchEvents();
				this.$nextTick(() => {
					this.getData();
				});
			});
		},
		getData() {
			// var calendarInfo = {
			// 	date: moment(new Date()).format('YYYY-MM')
			// }
			this.$post(this.url.getReserveList, {
				mettingUuid: this.mettingUuid,
			}).then((res) => {
				console.log('res', res);
				if (res) {
					res.forEach((val) => {
						this.add(val);
					});
				}
			});
		},
		add(info) {
			var data = {
				title: info.topics + '-' + info.reserveName,
				// start: Date.parse(new Date(info.reserveDate.concat(' ' + info.startTime + ':00'))),
				// end: Date.parse(new Date(info.reserveDate.concat(' ' + info.endTime + ':00'))),
				start: Date.parse(new Date(info.reserveStartDate)),
				end: Date.parse(new Date(info.reserveEndDate)),
				uuid: info.uuid,
			};
			this.calendarEvents.push(data);
			console.log('this.calendarEvents----------', this.calendarEvents);
			this.calendarApi.refetchEvents();
		},
		changeColor(type) {
			if (type == 1) return '#ff9633';
			if (type == 2) return '#ff5722';
			if (type == 3) return '#9575cd';
			if (type == 4) return '#0fc4a7';
			return '';
		},
		getCalendarEvents(info, successCallback, failureCallback) {
			const events = [
				...this.calendarEvents,
				{
					title: info.title,
					text: info.text,
					start: Date.parse(new Date(info.startTime)),
					end: Date.parse(new Date(info.endTime)),
					eventType: info.eventType,
				},
			];
			successCallback(events);
		},
		toggleWeekends() {
			this.calendarWeekends = !this.calendarWeekends; // update a property
		},
		eventRender(info) {
			// var data = info
		},
		eventDropStop(event) {
			var data = event.event;
			var def = data._def.extendedProps;
			const fileData = {
				uuid: def.uuid,
				title: data.title,
				text: data.text,
				eventType: def.eventType,
				startTime: moment(data.start).format('yyyy-MM-DD HH:mm'),
				endTime: moment(data.end).format('yyyy-MM-DD HH:mm'),
			};
			this.$post(this.url.update, {
				calendarInfo: JSON.stringify(fileData),
			}).then((res) => {
				if (res === 1 || res.statusCode === 200) {
					this.masterVisible = false;
					this.$message.info('更新成功');
					this.calendarEvents = [];
					this.getData();
				} else {
					this.$message.error(res.message);
				}
			});
		},
		gotoPast() {
			this.calendarApi.gotoDate('2019-08-01'); // call a method on the Calendar object
		},
		handleEventClick(info) {
			var data = info;
			var event = info.event;
			var def = event._def.extendedProps;
			console.log('log-----', data);
			this.parmasData = {
				uuid: def.uuid,
				title: data.title,
				text: data.text,
				eventType: def.eventType,
				startTime: moment(data.start).format('yyyy-MM-DD HH:mm'),
				endTime: moment(data.end).format('yyyy-MM-DD HH:mm'),
			};
			console.log('data.view.type', data.view.type);
			// this.masterVisible = true
			// this.$refs.createModal.onLoad(this.parmasData)
			this.$post(this.url.getDetailByUuid, {
				uuid: def.uuid,
			}).then((res) => {
				this.reserveDate = res;
			});
			this.childrenDrawer = true;
		},
		addScheduler() {
			event.stopPropagation(); //防穿透
			this.masterVisible = true;
			let form = {};
			form = this.$refs.createModal.form;
			form.resetFields(); // 清理表单数据（可不做）
			this.$refs.createModal.onLoad(this.mettingTitle, this.mettingUuid);
			// this.mettingTitle = item.name
			// this.mettingUuid = item.uuid
		},
		handleJsonOk(paramar) {
			const form = this.$refs.createModal.form;
			this.confirmLoading = true;
			let url = '';
			form.validateFields((errors, values) => {
				let fromValue = {
					...values,
					...paramar,
				};
				console.log('fromValue', fromValue);
				console.log('fromValue', moment(fromValue.reserveStartDate).valueOf());
				console.log('fromValue', moment(fromValue.reserveEndDate).valueOf());
				if (!errors) {
					if (moment(fromValue.reserveStartDate).valueOf() > moment(fromValue.reserveEndDate).valueOf()) {
						this.$message.info('开始时间不能大于结束时间', 1.5);
						this.confirmLoading = false;
					} else {
						if (values.uuid) {
							// 修改 e.g.
							url = this.url.update;
						} else {
							url = this.url.save;
						}
						this.$post(url, fromValue)
							.then((res) => {
								if (res.statusCode === 200 || res === 1) {
									this.masterVisible = false;
									this.calendarEvents = [];
									this.getData();
									this.$message.success(res.message ? res.message : '操作成功', 1.5);
								} else {
									this.$message.error(res.message, 1.5);
								}
							})
							.finally(() => {
								this.confirmLoading = false;
							});
					}
				} else {
					this.confirmLoading = false;
				}
			});
		},
	},
};
</script>

<style lang="less" scoped>
@import '~@fullcalendar/core/main.css';
@import '~@fullcalendar/daygrid/main.css';
@import '~@fullcalendar/timegrid/main.css';
@import '~@assets/style/fullcalendar.css';
.table-ant {
	width: 100%;
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

	.table_tr > td {
		border-right: 1px solid #e7e7e7;
		text-align: center;
		font-weight: bold;
	}

	input {
		// border: none;
		width: 100%;
		height: 100%;
		// outline: none;
	}

	textarea {
		// border: none;
		width: 100%;
		height: 100%;
		// outline: none;
	}

	.table_tr > td:nth-child(2n) {
		text-align: left;
		padding-left: 20px;
		font-weight: normal;
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

.account-center-title {
	text-align: center;
	font-size: 26px;
	padding: 15px 0;
}

.account-center-info {
	padding-bottom: 30px;
	display: flex;
	justify-content: center;
	font-size: 12px;

	& > div {
		padding: 0 10px;
	}
}

.account-center-avatarHolder {
	// text-align: center;
	margin-bottom: 24px;

	& > .avatar {
		margin: 0 auto;
		width: 104px;
		height: 104px;
		margin-bottom: 20px;
		border-radius: 50%;
		overflow: hidden;

		img {
			height: 100%;
			width: 100%;
		}
	}

	.username {
		color: rgba(0, 0, 0, 0.85);
		font-size: 20px;
		line-height: 28px;
		font-weight: 500;
		margin-bottom: 4px;
	}
}
</style>
