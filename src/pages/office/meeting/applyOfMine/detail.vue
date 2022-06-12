<template>
	<t-drawer
		title="申请详情"
		placement="right"
		:closable="false"
		:width="800"
		:visible="visible"
		:confirmLoading="loading"
		@close="
			() => {
				$emit('cancel');
			}
		"
	>
		<a-card :bordered="false">
			<div class="account-center-avatarHolder">
				<table class="table-ant" style="table-layout: fixed; word-break: break-all;" v-if="data">
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
							{{ data.applicationDepartmentName }}
						</td>
						<td>申请时间</td>
						<td colspan="2">
							{{ data.applicatioNtime }}
						</td>
					</tr>
					<tr class="table_tr">
						<td>拟定会议名称</td>
						<td colspan="5">
							{{ data.nameOfProposedMeeting }}
						</td>
					</tr>
					<tr class="table_tr line-height-80">
						<td>会议内容</td>
						<td colspan="5">
							{{ data.primaryCoverage }}
						</td>
					</tr>
					<tr class="table_tr">
						<td>会议开始时间</td>
						<td colspan="2">
							{{ data.startTime }}
						</td>
						<td>会议结束时间</td>
						<td colspan="2">
							{{ data.endTime }}
						</td>
					</tr>
					<tr class="table_tr">
						<td>会议时长</td>
						<td colspan="2">
							{{ data.duration }}
						</td>
						<td>会议地点</td>
						<td colspan="2">
							{{ data.conferenceRoomName }}
						</td>
					</tr>
					<tr class="table_tr">
						<td>会议类型</td>
						<td colspan="2">
							{{ data.typees }}
						</td>
						<td>会议主持人</td>
						<td colspan="2">
							{{ data.hostess }}
						</td>
					</tr>
					<tr class="table_tr line-height-80">
						<td>拟参会人员</td>
						<td colspan="5">
							<div class="item-box">
								<div class="tab_table">
									<a-tag v-for="(tag, index) in attendData" :key="tag.uuid">
										{{ tag.userName }}
									</a-tag>
								</div>
							</div>
						</td>
					</tr>
					<tr class="table_tr">
						<td>会议保障</td>
						<td colspan="5">
							<span
								v-for="(item, index) in securityData"
								:key="index"
								style="white-space: nowrap;padding-right: 15px;"
								>{{ item.text }}</span
							>
						</td>
					</tr>
					<tr class="table_tr line-height-80">
						<td>申请单位意见</td>
						<td colspan="5">
							{{ data.applicantOpinion }}
						</td>
					</tr>
					<tr class="table_tr line-height-80">
						<td>领导意见</td>
						<td colspan="5">
							{{ data.leaderOpinion }}
						</td>
					</tr>
					<tr class="table_tr line-height-80">
						<td>备注</td>
						<td colspan="5">
							{{ data.remark }}
						</td>
					</tr>
				</table>
			</div>
		</a-card>
	</t-drawer>
</template>
<script>
export default {
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
		meetingList: {
			type: Array,
			default: () => [],
		},
		securityList: {
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
					span: 7,
				},
			},
			wrapperCol: {
				xs: {
					span: 24,
				},
				sm: {
					span: 13,
				},
			},
			form: this.$form.createForm(this),
			data: '',
			oaTopicBase: {},
			oaTopicDocument: {},
			url: {
				getDetail: '/office/officePublicAnnouncement/getDetailByUuid',
				getListByUuids: '/mdata/user/getListByUuids',
			},
			attendanceUsers: '',
			attendList: [],
			attendData: [],
			securityData: [],
			conferenceGuarantee: [],
		};
	},
	methods: {
		onLoadData(m) {
			this.data = m;
			this.conferenceGuarantee = [];
			this.attendData = [];
			this.attendList = [];
			this.securityData = [];
			this.attendanceUsers = '';
			this.$nextTick(() => {
				if (m.conferenceGuarantee) this.conferenceGuarantee = m.conferenceGuarantee.split(',');
				this.securityList.forEach((val) => {
					this.conferenceGuarantee.forEach((el) => {
						if (el === val.value) {
							this.securityData.push(val);
						}
					});
				});
				if (m.attendanceUsers) {
					let list = m.attendanceUsers.split(',');
					list.forEach((val, index) => {
						this.attendData.push({ userName: val, uuid: index + 'szd10' });
					});
				}
			});
		},
	},
};
</script>
<style scoped="scoped" lang="less">
/deep/.content-picture {
	width: 100%;
}

/deep/.account-center-avatarHolder {
	img {
		max-width: 100% !important;
	}

	td {
		// border: 1px solid #000;
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
