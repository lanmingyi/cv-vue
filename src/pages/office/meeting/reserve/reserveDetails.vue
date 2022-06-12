<template>
	<t-modal
		title="预定详情"
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
		<template slot="footer"> </template>
		<a-spin :spinning="loading">
			<table class="table-ant" style="table-layout: fixed; word-break: break-all;" v-if="reserveDate">
				<thead>
					<tr>
						<th colspan="6" style="text-align: center;padding-bottom: 30px;">
							{{ reserveDate.title }}
						</th>
					</tr>
				</thead>
				<tr class="table_tr">
					<td>会议室名称</td>
					<td colspan="2">
						{{ reserveDate.conferenceRoomName }}
					</td>
					<td>会议议题</td>
					<td colspan="2">
						{{ reserveDate.topics }}
					</td>
				</tr>
				<tr class="table_tr">
					<td>参会人数</td>
					<td colspan="2">
						{{ reserveDate.attendNumberOfPeople }}
					</td>
					<td>预订人</td>
					<td colspan="2">
						{{ reserveDate.reserveName }}
					</td>
				</tr>
				<tr class="table_tr line-height-80">
					<td>预定开始时间</td>
					<td colspan="5">
						{{ reserveDate.reserveStartDate }}
					</td>
				</tr>
				<tr class="table_tr line-height-80">
					<td>预定结束时间</td>
					<td colspan="5">
						{{ reserveDate.reserveEndDate }}
					</td>
				</tr>
				<tr class="table_tr line-height-80">
					<td>备注</td>
					<td colspan="5">
						{{ reserveDate.reason }}
					</td>
				</tr>
			</table>
		</a-spin>
	</t-modal>
</template>

<script>
import pick from 'lodash.pick';
import moment from 'moment';


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
	},
	data() {
		return {
			form: this.$form.createForm(this),
			url: {
				getDetailByUuid: '/office/oaConferenceRoomReserve/getDetailByUuid',
			},
			reserveDate: '',
			nowValue: new Date(),
		};
	},
	methods: {
		onLoad(parmas) {
			console.log('parmas', parmas);
			this.$post(this.url.getDetailByUuid, {
				uuid: parmas.uuid,
			}).then((res) => {
				console.log('res-----', res);
				this.reserveDate = res;
			});
		},
		moment,
	},
	created() {},
};
</script>

<style lang="less" scoped>
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
