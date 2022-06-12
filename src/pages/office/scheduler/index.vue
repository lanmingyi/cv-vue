<template>
	<div>
		<a-card :bordered="false">
			<FullCalendar
				class="calendar"
				ref="fullCalendar"
				defaultView="dayGridMonth"
				locale="zh-cn"
				:header="{
					left: 'timeGridDay,timeGridWeek,dayGridMonth',
					center: 'title',
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
				@dateClick="handleDateClick"
				@eventClick="handleEventClick"
				@select="selectClick"
			/>
		</a-card>
		<edit-form
			ref="masterModal"
			:visible="masterVisible"
			:model="masterMdl"
			:typeList="typeList"
			@cancel="handleCancel('master')"
			@ok="handleJsonOk('master')"
		/>
		<div class="add_event_button" @click="addScheduler()">
			<a-tooltip placement="left">
				<template slot="title">
					<span>新建日程</span>
				</template>
				<a-icon type="plus" />
			</a-tooltip>
		</div>

		<div class="event-edit-wrap" id="event-edit-l">
			<a-textarea
				style="padding: 0;height: -webkit-fill-available"
				v-model="editValue"
				ref="textareaFile"
				id="textareaFile"
				@focus="
					() => {
						event.stopPropagation();
						$refs.textareaFile.focus();
					}
				"
			/>
		</div>
		<div class="event-detail-wrap" id="event-detail-l" style="display: none;">
			<div class="action-group" id="checkBtn" style="display: none;">
				<a-tooltip placement="right">
					<template slot="title">
						<span>保存</span>
					</template>
					<a-icon @click="checkScheduler()" type="check" />
				</a-tooltip>
			</div>
			<div class="action-group" id="stopBtn" style="display: none;">
				<a-tooltip placement="right">
					<template slot="title">
						<span>关闭</span>
					</template>
					<a-icon @click="closeScheduler()" type="stop" />
				</a-tooltip>
			</div>
			<div class="action-group" id="snippetsBtn">
				<a-tooltip placement="right">
					<template slot="title">
						<span>详情</span>
					</template>
					<a-icon @click="addScheduler()" type="snippets" />
				</a-tooltip>
			</div>
			<div class="action-group" id="editBtn">
				<a-tooltip placement="right">
					<template slot="title">
						<span>编辑</span>
					</template>
					<a-icon @click="editScheduler()" type="edit" />
				</a-tooltip>
			</div>
			<div class="action-group" id="deleteBtn">
				<a-tooltip placement="right">
					<template slot="title">
						<span>删除</span>
					</template>
					<a-icon @click="deleteScheduler()" type="delete" />
				</a-tooltip>
			</div>
		</div>
	</div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';

import { dataListMixin } from '@/mixins/dataListMixin';
import editForm from './edit.vue';
export default {
	name: 'TableList',
	components: {
		FullCalendar,
		editForm,
	},
	mixins: [dataListMixin],
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
				getMyScheduler: '/office/scheduler/getMyScheduler',
				save: '/office/scheduler/save',
				update: '/office/scheduler/update',
				delete: '/office/scheduler/delete',
			},
			calendarPlugins: [
				// plugins must be defined in the JS
				dayGridPlugin,
				timeGridPlugin,
				interactionPlugin, // needed for dateClick
			],
			calendarOptions: {
				calendarAllDaySlot: false,
				slotLabelInterval: '01:00', // 时间间隔
				slotDuration: '01:00:00', // 时间间隔
				slotMinTime: '06:00',
				slotMaxTime: '24:00',
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
			calendarEvents: [
				// {
				// 	title: '固定测试',
				// 	start: '2021-01-20T08:58:54.281Z',
				// 	end: '2021-01-20T10:58:56.000Z',
				// 	eventType: 2,
				// 	backgroundColor: this.changeColor(2)
				// }
			],
			calendarApi: null,
			masterVisible: false,
			masterMdl: null,
			visible: false,
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
		};
	},
	mounted() {
		this.calendarApi = this.$refs.fullCalendar.getApi();
		this.$nextTick(() => {
			this.getData();
		});
	},
	methods: {
		getData() {
			var calendarInfo = {
				date: moment(new Date()).format('YYYY-MM'),
			};
			this.$post(this.url.getMyScheduler, calendarInfo).then((res) => {
				if (res) {
					res.forEach((val) => {
						this.add(val);
					});
				}
			});
		},
		add(info) {
			var data = {
				title: info.title,
				text: info.text,
				start: Date.parse(new Date(info.startDate)),
				end: Date.parse(new Date(info.endDate)),
				eventType: info.eventType,
				uuid: info.uuid,
				organizer: info.organizer,
				organizerId: info.organizerId,
				joinUser: info.joinUser,
				joinUserId: info.joinUserId,
				backgroundColor: this.changeColor(info.eventType),
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
					start: Date.parse(new Date(info.startDate)),
					end: Date.parse(new Date(info.endDate)),
					eventType: info.eventType,
					organizer: info.organizer,
					organizerId: info.organizerId,
					joinUser: info.joinUser,
					joinUserId: info.joinUserId,
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
			// console.log("start", data.start);
			// console.log("end", data.end);
			// console.log("date", new Date());
			// let startDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
			// console.log("startDate", startDate);
			// return;
			var def = data._def.extendedProps;
			// console.log("data = " , data)
			// console.log("def = " , def)
			const fileData = {
				uuid: def.uuid,
				title: data.title,
				text: data.text,
				eventType: def.eventType,
				startDate: moment(data.start).format('YYYY-MM-DD HH:mm:ss'),
				endDate: moment(data.end).format('YYYY-MM-DD HH:mm:ss'),
				organizer: def.organizer,
				organizerId: def.organizerId,
				joinUser: def.joinUser,
				joinUserId: def.joinUserId,
				evType: "1",
			};
			this.$post(this.url.update, fileData).then((res) => {
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
			this.isEdit = false;
			var user = document.getElementById('event-detail'); //获取蓝色盒子的引用
			var edit = document.getElementById('event-edit');
			if (user) {
				var parent = user.parentNode;
				parent.removeChild(user);
				if (edit) parent.removeChild(edit);
			}
			console.log('log-----', data);
			this.parmasData = {
				uuid: def.uuid,
				title: data.title,
				text: data.text,
				eventType: def.eventType,
				startDate: moment(data.start).format('yyyy-MM-DD HH:mm'),
				endDate: moment(data.end).format('yyyy-MM-DD HH:mm'),
				organizer: data.organizer,
				organizerId: data.organizerId,
				joinUser: data.joinUser,
				joinUserId: data.joinUserId,
			};
			console.log('data.view.type', data.view.type);
			this.$nextTick(() => {
				if (data.view.type == 'timeGridWeek' || data.view.type == 'timeGridDay') {
					var evenDetail = document.getElementById('event-detail-l').cloneNode(true);
					evenDetail.setAttribute('id', 'event-detail');
					data.el.firstChild.appendChild(evenDetail);
					var user = document.getElementById('event-detail');
					user.style.display = 'block';
					user.style.backgroundColor = user.parentNode.parentNode.style.backgroundColor;

					this.$nextTick(() => {
						setTimeout(() => {
							document.getElementById('snippetsBtn').onclick = () => this.editAddScheduler();
							document.getElementById('deleteBtn').onclick = () => this.deleteScheduler();
							document.getElementById('checkBtn').onclick = () => this.checkScheduler();
							document.getElementById('editBtn').onclick = () => this.editScheduler();
							document.getElementById('stopBtn').onclick = () => this.closeScheduler();
						});
					});
				}
				if (data.view.type == 'dayGridMonth') {
					this.num++;
					this.$nextTick(() => {
						setTimeout(() => {
							if (this.num >= 2) {
								var user = document.getElementById('event-detail'); //获取蓝色盒子的引用
								var edit = document.getElementById('event-edit');
								if (user) {
									var parent = user.parentNode;
									parent.removeChild(user);
									if (edit) parent.removeChild(edit);
								}
								// this.editAddScheduler(data)
								console.log('this.parmasData--------', this.parmasData);
								this.masterVisible = true;
								this.$refs.masterModal.edit(this.parmasData);
								this.num = 0;
							} else {
								this.num = 0;
							}
						}, 300);
					});
				}
			});
		},
		checkScheduler() {
			event.stopPropagation(); //防穿透
			// this.parmasData.text = this.editValue
			this.parmasData.text = document.getElementById('textareaFile').value;
			this.$post(this.url.update, {
				calendarInfo: JSON.stringify(this.parmasData),
			}).then((res) => {
				if (res === 1 || res.statusCode === 200) {
					this.masterVisible = false;
					this.$message.info('更新成功');
					this.isShowArea = false;
					this.isEdit = false;
					this.calendarEvents = [];
					this.getData();
				} else {
					this.$message.error(res.message);
				}
			});
		},
		closeScheduler() {
			event.stopPropagation(); //防穿透
			this.isShowArea = false;
			this.isEdit = false;
			var edit = document.getElementById('event-edit');
			edit.style.display = 'none';
			var userCheck = document.getElementById('checkBtn');
			var userClose = document.getElementById('stopBtn');
			var user = document.getElementById('snippetsBtn');
			var userEdit = document.getElementById('editBtn');
			var userDel = document.getElementById('deleteBtn');
			userCheck.style.display = 'none';
			userClose.style.display = 'none';
			user.style.display = 'block';
			userEdit.style.display = 'block';
			userDel.style.display = 'block';
		},
		deleteScheduler() {
			event.stopPropagation(); //防穿透
			var that = this;
			that.$nextTick(() => {
				that.$confirm({
					title: '警告',
					content: `确定要执行该操作吗?`,
					okText: '删除',
					okType: 'danger',
					cancelText: '取消',
					onOk() {
						var user = document.getElementById('event-detail'); //获取蓝色盒子的引用
						var edit = document.getElementById('event-edit');
						var parent = user.parentNode; //获取蓝色盒子父元素的引用
						parent.removeChild(user);
						if (edit) parent.removeChild(edit);
						that.$post(that.url.delete, {
							uuid: that.parmasData.uuid,
						}).then((res) => {
							if (res === 1 || res.statusCode === 200) {
								that.masterVisible = false;
								that.$message.info('删除成功');
								that.calendarEvents = [];
								that.getData();
							} else {
								that.$message.error(res.message);
							}
						});
					},
					onCancel() {
						console.log('Cancel');
					},
				});
			});
		},
		selectClick(info) {
			event.stopPropagation(); //防穿透
			var data = info;
			this.num++;
			this.$nextTick(() => {
				setTimeout(() => {
					if (this.num >= 2) {
						var user = document.getElementById('event-detail'); //获取蓝色盒子的引用
						var edit = document.getElementById('event-edit');
						if (user) {
							var parent = user.parentNode;
							parent.removeChild(user);
							if (edit) parent.removeChild(edit);
						}
						this.editAddScheduler(data);
						this.num = 0;
					} else {
						this.num = 0;
					}
				}, 300);
			});
			// && Date.parse(new Date(info.endStr)) - 1800000 == Date.parse(new Date(info.startStr))
			if (data.view.type != 'dayGridMonth') {
				return;
			}
			if (
				data.view.type === 'dayGridMonth' &&
				Date.parse(new Date(info.endStr)) - 86400000 == Date.parse(new Date(info.startStr))
			) {
				return;
			}
			this.editAddScheduler(data);
		},
		handleDateClick(arg) {
			// console.log("arg====",arg)
			var that = this;
			var highlight = document.getElementsByClassName('fc-highlight')[0];
			var highlightParent = highlight.parentNode;
			highlightParent.removeChild(highlight);
			if (that.masterVisible) {
				that.$confirm({
					title: '警告',
					content: `确定要取消该操作吗?`,
					okText: '确定',
					okType: 'danger',
					cancelText: '取消',
					onOk() {
						var user = document.getElementById('event-detail'); //获取蓝色盒子的引用
						var edit = document.getElementById('event-edit');
						var parent = user.parentNode;
						parent.removeChild(user);
						if (edit) parent.removeChild(edit);
					},
					onCancel() {},
				});
			} else {
				var user = document.getElementById('event-detail'); //获取蓝色盒子的引用
				var edit = document.getElementById('event-edit');
				if (user) {
					var parent = user.parentNode;
					parent.removeChild(user);
					if (edit) parent.removeChild(edit);
				}
			}
		},
		addScheduler() {
			event.stopPropagation(); //防穿透
			this.masterVisible = true;
			let form = {};
			form = this.$refs.masterModal.form;
			form.resetFields(); // 清理表单数据（可不做）
			this.$refs.masterModal.add();
		},
		editAddScheduler(data) {
			// event.stopPropagation(); //防穿透
			this.masterVisible = true;
			let form = {};
			form = this.$refs.masterModal.form;
			form.resetFields(); // 清理表单数据（可不做）
			console.log('data---------', data);
			if (data) {
				this.$refs.masterModal.select(data.start, data.end);
			} else {
				this.$refs.masterModal.edit(this.parmasData);
			}
		},
		editScheduler() {
			event.stopPropagation(); //防穿透
			var edit = document.getElementById('event-edit-l').cloneNode(true);
			edit.setAttribute('id', 'event-edit');
			edit.style.display = 'block';
			var detail = document.getElementById('event-detail'); //获取蓝色盒子的引用
			var parent = detail.parentNode; //获取蓝色盒子父元素的引用
			parent.appendChild(edit);
			if (parent.childNodes[1].className === 'fc-title') {
				document.getElementById('textareaFile').value = parent.childNodes[1].innerHTML;
			} else {
				document.getElementById('textareaFile').value = '';
			}
			var userCheck = document.getElementById('checkBtn');
			var userClose = document.getElementById('stopBtn');
			var user = document.getElementById('snippetsBtn');
			var userEdit = document.getElementById('editBtn');
			var userDel = document.getElementById('deleteBtn');
			userCheck.style.display = 'block';
			userClose.style.display = 'block';
			user.style.display = 'none';
			userEdit.style.display = 'none';
			userDel.style.display = 'none';

			document.getElementById('textareaFile').onclick = () => this.editFocus();
		},
		changeText(e) {},
		editFocus() {
			event.stopPropagation(); //防穿透
			this.$refs.textareaFile.focus();
			document.getElementById('textareaFile').focus();
		},
		handleJsonOk(type) {
			let form = this.$refs.masterModal.form;
			form.validateFields((errors, values) => {
				var url = '';
				if (values.uuid) {
					url = this.url.update;
				} else {
					url = this.url.save;
					values.type = 'mySave';
				}
				values.startDate = moment(values.startDate).format('yyyy-MM-DD HH:mm:ss');
				values.endDate = moment(values.endDate).format('yyyy-MM-DD HH:mm:ss');
				console.log('values----', values);
				if (!errors) {
					if (moment(values.startDate).valueOf() < moment(new Date()).valueOf()) {
						this.$message.info('开始时间不能选择已过时间', 1.5);
						this.confirmLoading = false;
					} else {
						this.$post(url, values).then((res) => {
							if (res === 1 || res.statusCode === 200) {
								this.masterVisible = false;
								this.$message.info(res.message);
								this.calendarEvents = [];
								this.getData();
							} else {
								this.$message.error(res.message);
							}
						});
					}
				}
			});
		},
	},
};
</script>

<style lang="less">
@import '~@fullcalendar/core/main.css';
@import '~@fullcalendar/daygrid/main.css';
@import '~@fullcalendar/timegrid/main.css';
@import '~@assets/style/fullcalendar.css';
</style>
