<template>
	<t-modal
		:visible="visible"
		:width="800"
		title="详情"
		:fullscreen="fullscreen"
		:switchFullscreen="fullscreen"
		:confirmLoading="loading"
		@ok="onClose"
		@cancel="onClose"
		:footer="null"
	>
		<a-card :bordered="false">
			<div class="account-center-avatarHolder" v-if="dataList.oaMeetingsBase">
				<table class="table-ant" style="table-layout: fixed; word-break: break-all;">
					<thead>
						<tr>
							<th colspan="6" style="text-align: center">会议详细页面</th>
						</tr>
					</thead>
					<tr>
						<td>会议名称：</td>
						<td colspan="2">{{ dataList.oaMeetingsBase.name }}</td>
						<td>主办人：</td>
						<td colspan="2">{{ dataList.oaMeetingsBase.participantName }}</td>
					</tr>
					<tr>
						<td>会议室：</td>
						<td colspan="2">{{ dataList.oaMeetingsBase.meetingRoom }}</td>
						<td>会议类型：</td>
						<td colspan="2">{{ dataList.oaMeetingsBase.typeName }}</td>
					</tr>
					<tr>
						<td>会议状态：</td>
						<td colspan="5">{{ dataList.oaMeetingsBase.stateName }}</td>
					</tr>

					<tr>
						<td>开会时间：</td>
						<td colspan="2">{{ dataList.oaMeetingsBase.meetingTime }}</td>
						<td>截止时间：</td>
						<td colspan="2">{{ dataList.oaMeetingsBase.blocking }}</td>
					</tr>

					<tr>
						<td height="50">有牌人员：</td>
						<td height="50" colspan="5" style="clear:both;word-wrap:break-word;white-space: normal;">
							<div class="data-box">
								<div v-for="item in haveData" :key="item">
									<span>{{ item }}</span>
								</div>
							</div>
						</td>
					</tr>
					<tr>
						<td height="50">无牌人员：</td>
						<td height="50" colspan="5" style="clear:both;word-wrap:break-word;white-space: normal;">
							<div class="data-box">
								<div v-for="item in noData" :key="item">
									<span>{{ item }}</span>
								</div>
							</div>
						</td>
					</tr>
				</table>

				<div class="rate">
					<a-divider orientation="left">
						评论
					</a-divider>
					<div>暂无</div>
				</div>
				<div class="rate">
					<a-divider orientation="left">
						我的评论
					</a-divider>
					<template>
						<a-textarea placeholder="请输入" :auto-size="{ minRows: 4, maxRows: 6 }" />
					</template>
				</div>
				<div class="rate">
					<a-divider orientation="left">
						评分
					</a-divider>
					<div style="text-align: left;">
						<a-rate v-model="value" :tooltips="desc" />
						<span class="ant-rate-text">{{ desc[value - 1] }}</span>
					</div>
				</div>
			</div>
		</a-card>
	</t-modal>
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
	},
	data() {
		return {
			form: this.$form.createForm(this),
			data: '',
			fullscreen: false,
			url: {
				updateSarte: '/office/oaMeetingSingu/updateSarte', //puuid  签到
				indexdetails: '/office/oaMeetingsBase/indexdetails', //?uuid={uuid}&puuid={uuid}   获取详情
				getDetail: '/office/oaMeetingsBase/editcontents',
				getListByUuids: '/mdata/user/getListByUuids',
			},
			haveData: [],
			noData: [],
			dataList: [],
			value: 3,
			desc: ['极差', '差', '中等', '好', '极好'],
		};
	},
	methods: {
		afterVisibleChange(val) {
			console.log('visible', val);
		},
		onClose() {
			this.$emit('cancel');
		},
		onLoadData(e) {
			console.log('e', e);
			this.haveData = [];
			this.noData = [];
			this.$axios('get', `${this.url.indexdetails}?uuid=${e.uuid}&puuid=${e.uuid}`).then((res) => {
				console.log('res.OaMeetingsBasesList--------------', res.OaMeetingsBasesList);
				console.log('res.oaMeetingSingus1=======', res.oaMeetingSingus1);
				console.log('res.oaMeetingsBase--------------', res.oaMeetingsBase);
				this.dataList = res;
				this.$axios('get', `${this.url.getDetail}?puuid=${res.oaMeetingsBase.uuid}`).then((res) => {
					//获取人员数据
					console.log('res======', res);
				});
			});
		},
	},
};
</script>
<style scoped="scoped" lang="less">
.data-box {
	width: 100%;
	max-height: 150px;
	overflow-y: auto;
}

.test-box {
	width: 100%;
	min-height: 150px;
	border: none;
}

.test-box:focus {
	outline: none !important;
	border-color: transparent;
}
.rate {
	width: 80%;
	margin: 20px auto;
}
.table-ant {
	width: 80%;
	margin: 0 auto;
	border: 1px solid #e7e7e7;
	padding: 10px 20px;

	thead,
	& > tr {
		height: 40px;
		line-height: 40px;
		border-bottom: 1px solid #e7e7e7;
	}

	& > tr > td {
		border-right: 1px solid #e7e7e7;
	}

	& > tr > td:nth-child(2n) {
		text-align: left;
		padding-left: 20px;
	}
}

.account-center-avatarHolder {
	text-align: center;
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

	/deep/ img {
		width: 100%;
		height: 100%;
	}
}
</style>
