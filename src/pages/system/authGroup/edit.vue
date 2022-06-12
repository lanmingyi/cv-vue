<template>
	<div>
		<t-modal
			title="新增/编辑"
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
			<a-form :form="form">
				<a-form-item>
					<a-spin :spinning="confirmLoading">
						<a-form-item label="角色名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input placeholder="请输入角色名称" v-decorator="['text', { rules: [{ required: true, message: '必填' }] }]" />
						</a-form-item>
						<a-form-item label="上级分组ID" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input
								:disabled="true"
								v-decorator="[
									'pid',
									{ initialValue: pid },
									{ rules: [{ required: true, message: '必填' }] },
								]"
							/>
						</a-form-item>
						<a-form-item label="系统名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-select v-decorator="['menuId', { rules: [{ required: true, message: '必填' }] }]">
								<a-select-option v-for="(item, index) in systemNameList" :key="index" :value="item.id">
									{{ item.text }}
								</a-select-option>
							</a-select>
						</a-form-item>
						<a-form-item label="菜单状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-select v-decorator="['roleType', { rules: [{ required: true, message: '必填' }] }]">
								<a-select-option value="menu">
									系统菜单
								</a-select-option>
								<a-select-option value="APP">
									APP菜单
								</a-select-option>
							</a-select>
						</a-form-item>
						<a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input-number
								id="inputNumber"
								style="width: 100%;"
								:min="-100"
								:max="100"
								v-decorator="['sort', { rules: [{ required: true, message: '必填' }] }]"
							/>
						</a-form-item>
						<a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-select :size="size" v-decorator="['status', { initialValue: '1' }]">
								<a-select-option value="1">
									启用
								</a-select-option>
								<a-select-option value="0">
									禁用
								</a-select-option>
							</a-select>
						</a-form-item>
						<a-form-item label="是否可展开" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-select :size="size" v-decorator="['state', { initialValue: 'closed' }]">
								<a-select-option value="closed">
									是
								</a-select-option>
								<a-select-option value="open">
									否
								</a-select-option>
							</a-select>
						</a-form-item>
						<a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-textarea :rows="4" v-decorator="['remark']" />
						</a-form-item>
						<a-form-item class="hiddenItem">
							<a-input v-decorator="['levelId', { initialValue: levelId }]" type="hidden" />
						</a-form-item>
						<a-form-item class="hiddenItem">
							<a-input v-decorator="['value']" type="hidden" />
						</a-form-item>
						<a-form-item class="hiddenItem">
							<a-input v-decorator="['uuid']" type="hidden" />
						</a-form-item>
					</a-spin>
				</a-form-item>
			</a-form>
		</t-modal>
	</div>
</template>

<script>
import pick from 'lodash.pick';

// 表单字段
const fields = ['uuid', 'id', 'state', 'menuId', 'remark', 'status', 'text', 'levelId', 'pid', 'sort', 'roleType'];
export default {
	name: 'TableModal',
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		model: {
			type: Object,
			default: () => null,
		},
		type: {
			type: String,
		},
	},
	data() {
		return {
			confirmLoading: false,
			size: 'default',
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
			systemNameList: [],
			pid: '',
			levelId: 1,
		};
	},
	mounted() {},
	created() {
		// 防止表单未注册
		fields.forEach((v) => this.form.getFieldDecorator(v));

		// 当 model 发生改变时，为表单设置值
		this.$watch('model', () => {
			this.model && this.form.setFieldsValue(pick(this.model, fields));
		});
	},
	methods: {
		add(val, data) {
			if (!val) {
				this.pid = 1;
				this.levelId = 0;
			} else {
				this.pid = val.id;
				this.levelId = val.levelId + 1;
			}
			this.getSystemName();
		},
		edit(val, data) {
			this.getSystemName();
		},
		getSystemName() {
			this.$post('/system/menu/getListByLevelId', {
				levelId: 1,
			}).then((res) => {
				this.systemNameList = res;
			});
		},
		statusChange(value) {
			this.$emit('statusChange', value);
		},
		nodeChange(value) {
			this.$emit('nodeChange', value);
		},
		systemNameChange(value) {
			this.$emit('systemNameChange', value);
		},
	},
};
</script>

<style></style>
