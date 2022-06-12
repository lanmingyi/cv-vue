<template>
	<t-drawer
		title="详情"
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
			<div class="account-center-title">{{ data.title }}</div>
			<div class="account-center-info">
				<div>{{ data.publishingDepartmentName }}</div>
				<div>{{ data.createTime }}</div>
			</div>
			<div class="account-center-avatarHolder" v-html="data.content"></div>
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
	},
	data() {
		return {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 7 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 13 },
			},
			form: this.$form.createForm(this),
			data: '',
			oaTopicBase: {},
			oaTopicDocument: {},
			url: {
				getDetail: '/office/officePublicAnnouncement/getDetailByUuid',
			},
		};
	},
	methods: {
		onLoadData(e) {
			this.$axios('get', `${this.url.getDetail}?uuid=${e.uuid}`).then((res) => {
				console.log('res', res);
				this.data = res;
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
		border: 1px solid #000;
	}
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
