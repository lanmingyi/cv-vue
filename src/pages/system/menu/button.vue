<template>
	<div>
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
					<a-form-item label="系统代码" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<a-input
							v-decorator="[
								'systemName',
								{ initialValue: systemName },
								{ rules: [{ required: true, message: '请输入系统代码！' }] },
							]"
						/>
					</a-form-item>
					<a-form-item label="模块代码" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<a-input
							v-decorator="[
								'modelName',
								{ initialValue: modelName },
								{ rules: [{ required: true, message: '请输入模块代码！' }] },
							]"
						/>
					</a-form-item>
					<a-form-item label="新增功能名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<a-input v-decorator="['add', { initialValue: '新增' }]" />
					</a-form-item>
					<a-form-item label="编辑功能名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<a-input v-decorator="['edit', { initialValue: '编辑' }]" />
					</a-form-item>
					<a-form-item label="删除功能名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<a-input v-decorator="['delete', { initialValue: '删除' }]" />
					</a-form-item>
					<!-- <a-form-item label="导入功能名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<a-input v-decorator="['import', { initialValue: '导入' }]" />
					</a-form-item>
					<a-form-item label="导出功能名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<a-input v-decorator="['export', { initialValue: '导出' }]" />
					</a-form-item>
					<a-form-item label="查看详细信息名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<a-input v-decorator="['view', { initialValue: '查看详细信息' }]" />
					</a-form-item> -->
					<a-form-item label="使用说明" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<div style="color: red;">如果不需要生成对应的功能，清空功能名称即可</div>
					</a-form-item>
					<a-form-item class="hiddenItem">
						<a-input v-decorator="['codeSetId']" type="hidden" />
					</a-form-item>
					<a-form-item class="hiddenItem">
						<a-input v-decorator="['pid']" type="hidden" />
					</a-form-item>
					<a-form-item class="hiddenItem">
						<a-input v-decorator="['levelId']" type="hidden" />
					</a-form-item>
				</a-form>
			</a-spin>
		</t-modal>
	</div>
</template>

<script>
import pick from 'lodash.pick';
const fields = ['codeSetId', 'pid', 'levelId', 'systemName', 'modelName', 'add', 'edit', 'delete', 'view'];
export default {
	props: {
		visible: {
			type: Boolean,
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
			systemName: '',
			modelName: '',
			pid: '',
		};
	},
	created() {
		// 防止表单未注册
		fields.forEach((v) => this.form.getFieldDecorator(v));

		// 当 model 发生改变时，为表单设置值
		this.$watch('model', () => {
			this.model && this.form.setFieldsValue(pick(this.model, fields));
			this.form.setFieldsValue({
				pid: this.pid,
			});
		});
	},
	methods: {
		show(e) {
			let url = e.remark.split('/');
			this.systemName = url[1];
			this.modelName = url[2];
			this.pid = e.id;
		},
	},
};
</script>

<style></style>
