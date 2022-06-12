<template>
	<t-modal
		title="新增/编辑"
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
				<a-row :gutter="24" type="flex" justify="start">
					<a-col :span="24">
						<a-form-item label="排序号" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input
								v-decorator="['sortNumber', { rules: [{ required: true, message: '必填' }] }]"
								disabled
							/>
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item label="库名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input
								v-decorator="['warehouseName', { rules: [{ required: true, message: '必填' }] }]"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item label="库密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input
								v-decorator="['warehousePassword', { rules: [{ required: true, message: '必填' }] }]"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item label="库管理员" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<user-popup
								:visible="visiblePopup"
								:typeNum="1"
								style="width: 100%;"
								@change="(value, other) => popupCallback(value, other)"
								@close="() => (visiblePopup = false)"
							/>
							<a-input
								@click="() => (visiblePopup = true)"
								v-decorator="[
									'warehouseAdministrator',
									{
										initialValue: warehouseAdministrator,
										rules: [{ required: true, message: '必填' }],
									},
								]"
								placeholder="库管理员"
								readOnly
							>
								<a-icon slot="prefix" type="user" />
							</a-input>
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item label="领用权限设置" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<!-- <a-select v-decorator="['receivePermission']">
								<a-select-option v-for="(item, index) in statusList" :key="index" :value="item.value">
									{{ item.text }}
								</a-select-option>
							</a-select> -->
							<a-input
								v-decorator="['promissionSettings', { rules: [{ required: true, message: '必填' }] }]"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item label="管理权限设置" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<!-- <a-select v-decorator="['managePermission']">
								<a-select-option v-for="(item, index) in statusList" :key="index" :value="item.value">
									{{ item.text }}
								</a-select-option>
							</a-select> -->
							<a-input
								v-decorator="['adminSettings', { rules: [{ required: true, message: '必填' }] }]"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-textarea :rows="4" v-decorator="['remark']" />
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['uuid']" type="hidden" />
						</a-form-item>
						<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['warehouseAdministratorId']" type="hidden" />
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
		</a-spin>
	</t-modal>
</template>

<script>
import pick from 'lodash.pick';

import UserPopup from '@/components/TopVUI/custom/userPopup';
// 表单字段
const fields = [
	'uuid',
	'sortNumber',
	'warehouseName',
	'warehousePassword',
	'warehouseAdministrator',
	'promissionSettings',
	'adminSettings',
	'remark',
	'warehouseAdministratorId',
];

export default {
	components: {
		UserPopup,
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
				getSerialNumber: '/office/officeMeetingRegister/getSerialNumber',
			},
			uuid: '',
			statusList: [],
			warehouseAdministrator: '',
			visiblePopup: false,
		};
	},
	methods: {
		add(m) {
			console.log('add', m);
			this.uuid = '';
			this.warehouseAdministrator = '';
			this.form.setFieldsValue(pick(m, fields));
			this.$post(this.url.getSerialNumber).then((res) => {
				this.form.setFieldsValue({
					sortNumber: res,
				});
			});
		},
		edit(m) {
			this.form.setFieldsValue(pick(m, fields));
		},
		popupCallback(value) {
			this.$nextTick(() => {
				this.warehouseAdministrator = value.userName;
				this.form.setFieldsValue({
					warehouseAdministrator: this.warehouseAdministrator,
					warehouseAdministratorId: value.userNameId,
				});
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
