<template>
	<t-modal
		title="新增编辑"
		:width="640"
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
				<!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
				<a-form-item class="hiddenItem">
					<a-input v-decorator="['endpoint']" type="hidden" />
				</a-form-item>
				<a-form-item label="原存储空间" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input
						v-decorator="['sourceBucketName', { rules: [{ required: true, message: '必填！' }] }]"
						disabled
					/>
				</a-form-item>
				<a-form-item label="文件名" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input v-decorator="['sourceKey', { rules: [{ required: true, message: '必填！' }] }]" disabled />
				</a-form-item>
				<a-form-item label="目标存储空间" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-select
						v-decorator="['destinationBucketName', { rules: [{ required: true, message: '必填！' }] }]"
					>
						<a-select-option :value="item.name" v-for="(item, index) in bucketList" :key="index">
							{{ item.name }}
						</a-select-option>
					</a-select>
				</a-form-item>
			</a-form>
		</a-spin>
	</t-modal>
</template>

<script>
import pick from 'lodash.pick';

// 表单字段
const fields = ['sourceBucketName', 'endpoint', 'destinationBucketName', 'sourceKey'];

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
		bucketList: {
			type: Array,
			default: [],
		},
	},
	data() {
		return {
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
					span: 17,
				},
			},
			form: this.$form.createForm(this),
		};
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
