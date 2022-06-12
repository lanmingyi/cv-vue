<template>
	<a-modal
		title="自由跳转"
		:width="640"
		:visible="visible"
		:confirmLoading="confirmLoading"
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
		<a-spin :spinning="confirmLoading">
			<a-form :form="form">
				<a-row :gutter="16">
					<a-col class="gutter-row" :span="24">
						<a-form-item label="当前环节" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-select
								v-decorator="[
									'nodeId',
									{
										initialValue:
											JumpDataList && JumpDataList.length != 0 ? JumpDataList[0].nodeId : '',
										rules: [{ required: true, message: '请输入当前环节' }],
									},
								]"
							>
								<a-select-option v-for="item in JumpDataList" :value="item.nodeId">
									{{ item.taskName }}
								</a-select-option>
							</a-select>
						</a-form-item>
						<a-form-item label="目标环节" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-select
								v-decorator="['toNodeId', { rules: [{ required: true, message: '请输入目标环节' }] }]"
							>
								<a-select-option v-for="item in freeJumpData" :value="item.id">
									{{ item.name }}
								</a-select-option>
							</a-select>
						</a-form-item>
						<a-form-item class="hiddenItem">
							<a-input v-decorator="['processInstanceId']" type="hidden" />
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
		</a-spin>
	</a-modal>
</template>

<script>
import pick from 'lodash.pick';
// 表单字段
const fields = ['message', 'processInstanceId', 'nodeId', 'toNodeId'];
export default {
	props: {
		visible: {
			type: Boolean,
			required: true,
		},
		confirmLoading: {
			type: Boolean,
			default: () => false,
		},
		model: {
			type: Object,
			default: () => null,
		},
		freeJumpData: {
			type: Array,
		},
		JumpDataList: {
			type: Array,
		},
	},
	data() {
		return {
			title: '',
			labelCol: {
				xs: {
					span: 24,
				},
				sm: {
					span: 5,
				},
			},
			wrapperCol: {
				xs: {
					span: 24,
				},
				sm: {
					span: 16,
				},
			},
			form: this.$form.createForm(this),
		};
	},
	methods: {},
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
