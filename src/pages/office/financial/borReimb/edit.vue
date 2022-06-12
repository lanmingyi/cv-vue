<template>
	<t-modal
		title="延迟还款"
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
				<a-row>
					<a-col :span="24">
						<a-form-item label="延迟至日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<t-date
								v-decorator="['delayTime', { rules: [{ required: true, message: '请选择开始时间' }] }]"
								style="width: 100%;"
								:showTime="true"
								dateFormat="YYYY-MM-DD HH:mm:ss"
								allowClear
							/>
						</a-form-item>
						<a-form-item label="延迟原因" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-textarea
								:rows="4"
								v-decorator="['delayReason', { rules: [{ required: true, message: '必填' }] }]"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="24" style="padding-bottom: 200px;">
						<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['uuid']" type="hidden" />
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
		</a-spin>
	</t-modal>
</template>

<script>
import pick from 'lodash.pick';

// 表单字段
const fields = ['uuid', 'delayReason', 'delayTime'];

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
			isClear: true,
			uuid: '',
			trainContent: '',
		};
	},
	updated() {
		this.isClear = false;
		this.trainContent = this.form.getFieldValue('trainContent');
	},
	methods: {
		add(m) {
			console.log('add', m);
		},
		edit(m) {
			this.form.setFieldsValue(pick(m, fields));
		},
		changeEditor(e) {
			this.trainContent = e;
			this.form.setFieldsValue({
				trainContent: e,
			});
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
