<!--
 * @Description: 发送验证码模板
 * @Author: lmy
 * @Date: 2021-06-02 13:38:09
 * @LastEditTime: 2021-06-23 17:26:50
 * @LastEditors: lmy
 * @FilePath: \vue-antd-admine:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\message\msgShortMessage\subEdit.vue
-->
<template>
	<t-modal
		title="模板"
		:width="800"
		:visible="visible"
		:confirmLoading="loading"
		okText="发送验证码"
		cancelText="关闭"
		@ok="
			() => {
				$emit('ok');
			}
		"
		@cancel="
			() => {
				$emit('update:visible', false);
			}
		"
	>
		<a-spin :spinning="loading">
			<a-form :form="form">
				<!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
				<a-form-item label="手机号码" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input
						placeholder="请输入手机号码"
						v-decorator="[
							'phoneNumber',
							{ initialValue: '15573425646' },
							{ rules: [{ required: true, min: 1, message: '请输入至少一个字符的名称！' }] },
						]"
					/>
				</a-form-item>
				<a-form-item label="短信签名" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input
						placeholder="请填写在阿里短信控制台申请的签名"
						v-decorator="[
							'signName',
							{ initialValue: '佐佑科技' },
							{ rules: [{ required: true, min: 1, message: '请输入至少一个字符的名称！' }] },
						]"
					/>
				</a-form-item>
				<a-form-item label="短信模板CODE" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input
						placeholder="请填写短信模板的CODE"
						v-decorator="['templateCode', { initialValue: 'SMS_169110450' }]"
					/>
				</a-form-item>
				<a-form-item label="短信模板参数" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input
						placeholder="短信模板参数"
						v-decorator="['templateParam', { initialValue: '{code:114323}' }]"
					/>
				</a-form-item>
			</a-form>
		</a-spin>
	</t-modal>
</template>

<script>
import pick from 'lodash.pick';

// 表单字段
const fields = ['uuid', 'phoneNumber', 'signName', 'templateCode', 'templateParam'];

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
			title: '',
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
			// model: null
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
	methods: {},
};
</script>
