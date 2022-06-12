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
				<a-form-item label="所属指标" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="type === '2'">
					<tree-select
						v-decorator="['pid', { initialValue: pid, rules: [{ required: true, message: '必填！' }] }]"
						placeholder="请选择菜单"
						:parameter="parameter"
						:url="url"
						:data="treeData"
						idfield="id"
						textfield="text"
					/>
				</a-form-item>
				<a-form-item class="hiddenItem" v-else>
					<a-input v-decorator="['pid', { initialValue: 1 }]" disabled type="hidden" />
				</a-form-item>
				<a-form-item class="hiddenItem">
					<a-input v-decorator="['uuid']" disabled type="hidden" />
				</a-form-item>
				<a-form-item class="hiddenItem">
					<a-input v-decorator="['id']" disabled type="hidden" />
				</a-form-item>
				<a-form-item class="hiddenItem">
					<a-input v-decorator="['levelId', { initialValue: levelId }]" disabled type="hidden" />
				</a-form-item>
				<a-form-item label="体系代码" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input v-decorator="['codeSetId', { rules: [{ required: true, min: 1, message: '必填！' }] }]" />
				</a-form-item>
				<a-form-item label="指标名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input v-decorator="['text', { rules: [{ required: true, min: 1, message: '必填！' }] }]" />
				</a-form-item>
				<a-form-item label="指标代码" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input v-decorator="['code', { rules: [{ required: true, min: 1, message: '必填！' }] }]" />
				</a-form-item>
				<a-form-item label="是否可展开" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-radio-group name="radioGroup" v-decorator="['state', { initialValue: 'open' }]">
						<a-radio value="closed">
							是
						</a-radio>
						<a-radio value="open">
							否
						</a-radio>
					</a-radio-group>
				</a-form-item>
				<a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input-number id="inputNumber" style="width: 100%;" :min="0" :max="9999" v-decorator="['sort']" />
				</a-form-item>
				<a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-textarea placeholder="备注" :auto-size="{ minRows: 2, maxRows: 6 }" v-decorator="['remark']" />
				</a-form-item>
			</a-form>
		</a-spin>
	</t-modal>
</template>

<script>
import pick from 'lodash.pick';

import TreeSelect from '@/components/TopVUI/custom/TreeSelect';
// 表单字段
const fields = ['uuid', 'codeSetId', 'text', 'code', 'id', 'remark', 'pid', 'levelId', 'state', 'sort'];

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
		type: {
			type: String,
		},
	},
	components: {
		TreeSelect,
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
			treeData: [],
			levelId: 1,
			pid: 1,
			pidName: '',
			showFlag: true,
			url: {
				fathersUrl: '/system/codeItem/getListByLevelId',
				expandUrl: '/system/codeItem/getListByPid',
			},
			parameter: {
				father: {
					levelId: 1,
				},
				children: {},
			},
		};
	},
	methods: {
		add(m, data) {
			this.treeData = data ? data : [];
			this.pid = m ? m.id : '';
			this.pidName = m ? m.text : '';
			// console.log(this.pid,this.pidName)
		},
		edit(m, data) {
			this.treeData = data;
			this.pid = m.pid;
			console.log('edit', m, this.pid);
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
