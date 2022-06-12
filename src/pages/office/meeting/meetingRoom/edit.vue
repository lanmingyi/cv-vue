<template>
	<a-modal
		title="新增/编辑"
		:width="1000"
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
					<a-col :span="12">
						<a-form-item label="会议室名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['name', { rules: [{ required: true, message: '必填' }] }]" />
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="地点" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['address', { rules: [{ required: true, message: '必填' }] }]" />
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="会议室容纳人数" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input
								v-decorator="['numberOfPeople', { rules: [{ required: true, message: '必填' }] }]"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="所属单位" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<tree-select
								v-decorator="[
									'departmentName',
									{ initialValue: departmentName, rules: [{ required: true, message: '必填' }] },
								]"
								:treeValueText="departmentName"
								placeholder="所属单位"
								:parameter="parameterOrg"
								:url="urlOrg"
								:data="treeData"
								idfield="id"
								textfield="text"
								@change="selectOrg"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="会议室状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-select
								v-decorator="[
									'stateName',
									{ initialValue: stateName, rules: [{ required: true, message: '必填' }] },
								]"
							>
								<a-select-option
									v-for="(item, index) in meetingList"
									:key="index"
									:value="item.text"
									@click="change(item)"
								>
									{{ item.text }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="会议室管理员" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<user-popup
								:visible="visiblePopup"
								style="width: 100%;"
								@change="(value, other) => popupCallback(value, other)"
								@close="() => (visiblePopup = false)"
								:typeNum="1"
							/>
							<a-input
								@click="() => (visiblePopup = true)"
								v-decorator="[
									'managementName',
									{ initialValue: managementName, rules: [{ required: true, message: '必填' }] },
								]"
								placeholder="管理员"
								readOnly
							>
								<a-icon slot="prefix" type="user" />
							</a-input>
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="保障部门" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<tree-select
								v-decorator="[
									'securityDepartmentName',
									{
										initialValue: securityDepartmentName,
										rules: [{ required: true, message: '必填' }],
									},
								]"
								:treeValueText="securityDepartmentName"
								placeholder="保障部门"
								:parameter="parameterOrg"
								:url="urlOrg"
								:data="treeData"
								idfield="id"
								textfield="text"
								@change="securitySelect"
							/>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="24">
						<a-form-item label="会议室设备" :labelCol="labelColfull" :wrapperCol="wrapperColfull">
							<a-textarea :rows="4" v-decorator="['equipment']" />
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item label="会议室规章制度" :labelCol="labelColfull" :wrapperCol="wrapperColfull">
							<a-textarea :rows="4" v-decorator="['rules']" />
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item label="备注" :labelCol="labelColfull" :wrapperCol="wrapperColfull">
							<a-textarea :rows="4" v-decorator="['remark']" />
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['uuid']" type="hidden" />
						</a-form-item>
						<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['managementUuid']" type="hidden" />
						</a-form-item>
						<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['departmentId']" type="hidden" />
						</a-form-item>
						<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['securityDepartmentId']" type="hidden" />
						</a-form-item>
						<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['state']" type="hidden" />
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
		</a-spin>
	</a-modal>
</template>

<script>
import pick from 'lodash.pick';

import UserPopup from '@/components/TopVUI/custom/userPopup';
import TreeSelect from '@/components/TopVUI/custom/TreeSelect';
// 表单字段
const fields = [
	'uuid',
	'name',
	'address',
	'numberOfPeople',
	'departmentId',
	'equipment',
	'managementName',
	'managementUuid',
	'securityDepartmentId',
	'rules',
	'remark',
	'departmentName',
	'securityDepartmentName',
	'meetingRoomState',
	'state',
	'stateName',
];

export default {
	components: {
		UserPopup,
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
		organList: {
			type: Array,
			default: () => [],
		},
		meetingList: {
			type: Array,
			default: () => [],
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
			urlOrg: {
				fathersUrl: '/mdata/organization/getListByLevelId?levelId=1',
				expandUrl: '/mdata/organization/getListByPid',
			},
			parameterOrg: {
				father: {
					levelId: 1,
				},
				children: {},
			},
			isClear: true,
			uuid: '',
			managementName: '',
			securityDepartmentName: '',
			departmentName: '',
			visiblePopup: false,
			treeData: [],
			stateName: '',
		};
	},
	updated() {
		this.isClear = false;
	},
	methods: {
		add(m) {
			console.log('add', m);
			this.managementName = '';
			this.departmentName = '';
			this.securityDepartmentName = '';
			this.form.setFieldsValue(pick(m, fields));
		},
		edit(m) {
			this.form.setFieldsValue(pick(m, fields));
			if (m && m.state) {
				this.meetingList.forEach((val) => {
					if (val.value === m.state) {
						this.stateName = val.text;
						this.form.setFieldsValue({
							stateName: this.stateName,
						});
					}
				});
			}
			this.$nextTick(() => {
				this.departmentName = m && m.departmentName ? m.departmentName : '';
				this.securityDepartmentName = m && m.securityDepartmentName ? m.securityDepartmentName : '';
			});
		},
		popupCallback(value, other) {
			this.$nextTick(() => {
				this.managementName = value.userName;
				this.form.setFieldsValue({
					managementName: this.managementName,
					managementUuid: value.userNameId,
				});
			});
		},
		change(item) {
			console.log('value', item);
			this.form.setFieldsValue({
				stateName: item.text,
				state: item.value,
			});
		},
		changeDep(value) {
			console.log('cahnge', value);
			this.form.setFieldsValue({
				departmentId: value,
			});
		},
		changeSec(value) {
			console.log('cahnge', value);
			this.form.setFieldsValue({
				securityDepartmentId: value,
			});
		},
		selectOrg(value, node) {
			this.$nextTick(() => {
				this.departmentName = node ? node.toString() : '';
				this.form.setFieldsValue({
					departmentId: value,
					departmentName: node ? node.toString() : '',
				});
			});
		},
		securitySelect(value, node) {
			this.$nextTick(() => {
				this.securityDepartmentName = node ? node.toString() : '';
				this.form.setFieldsValue({
					securityDepartmentId: value,
					securityDepartmentName: node ? node.toString() : '',
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
		this.$post(this.urlOrg.fathersUrl).then((res) => {
			this.treeData = res;
			this.treeData.forEach((e, index) => {
				this.treeData[index].title = e.text;
				this.treeData[index].label = e.text;
				this.treeData[index].index = index;
				this.treeData[index].value = e.text;
				this.treeData[index].key = e.id;
				this.treeData[index].levelId = e.levelId;
			});
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
