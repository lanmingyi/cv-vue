<template>
	<t-modal
		title="新增编辑"
		:width="840"
		:visible="visible"
		:model="model"
		:confirmLoading="loading"
		@ok="ok"
		@cancel="
			() => {
				$emit('cancel');
			}
		"
	>
		<a-spin :spinning="loading">
			<a-form :form="form">
				<a-form-item label="父级" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<tree-select
						v-decorator="[
							'categoryId',
							{ initialValue: categoryId, rules: [{ required: true, message: '必填' }] },
						]"
						placeholder="请选择"
						:parameter="parameter"
						:url="url"
						:data="treeData"
					/>
				</a-form-item>
				<a-form-item label="资源名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input
						v-decorator="[
							'title',
							{ rules: [{ required: true, min: 1, message: '请输入至少一个字符的名称！' }] },
						]"
					/>
				</a-form-item>
				<a-form-item label="资源描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input type="hidden" v-decorator="['description']" />
					<Editor
						:value="description"
						:isClear="isClear"
						style="text-align:left"
						@onchange="changeEditor"
					></Editor>
				</a-form-item>
				<a-form-item class="hiddenItem">
					<a-input v-decorator="['uuid']" disabled type="hidden" />
				</a-form-item>
			</a-form>
		</a-spin>
	</t-modal>
</template>

<script>
import Editor from '@/components/TopVUI/custom/Editor/index.vue';
import TreeSelect from '@/components/TopVUI/custom/TreeSelect';
import pick from 'lodash.pick';
// 表单字段
const fields = ['uuid', 'categoryId', 'title', 'description'];
export default {
	components: {
		Editor,
		TreeSelect,
	},
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
				sm: { span: 3 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 21 },
			},
			form: this.$form.createForm(this),
			description: '',
			isClear: false,
			categoryId: '',
			url: {
				fathersUrl: '/system/channel/getChannelsByPid',
				expandUrl: '/system/channel/getChannelsByPid',
			},
			parameter: {
				father: { pid: 2 },
				children: {},
			},
			treeData: [],
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
	updated() {
		this.isClear = false;
		this.description = this.form.getFieldValue('description');
	},
	methods: {
		add(m, data) {
			console.log(m, data);
			this.treeData = data;
			this.categoryId = m?.id ?? '2';
			this.description = '';
		},
		edit(m, data) {
			this.treeData = data;
			this.categoryId = m.id;
		},
		changeEditor(e) {
			this.description = e;
			this.form.setFieldsValue({
				description: e,
			});
		},
		ok() {
			this.$emit('ok');
			this.isClear = true;
		},
	},
};
</script>
