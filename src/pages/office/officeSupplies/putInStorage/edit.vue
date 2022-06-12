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
						<a-form-item label="入库单号" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['warehouseTicketNumbers']" placeholder="自动生成" disabled />
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item label="用品库名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-select
								v-decorator="['warehouseName', { rules: [{ required: true, message: '必填' }] }]"
								:disabled="uuid"
							>
								<a-select-option
									v-for="(item, index) in warehouseList"
									:key="index"
									:value="item.warehouseName"
									@click="changeWare(item)"
								>
									{{ item.warehouseName }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item label="办公用品类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-select
								v-decorator="['useType', { rules: [{ required: true, message: '必填' }] }]"
								:disabled="uuid"
							>
								<a-select-option
									v-for="(item, index) in typeList"
									:key="index"
									:value="item.value"
									@click="changeType(item)"
								>
									{{ item.text }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item label="办公用品名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-select
								v-decorator="['useName', { rules: [{ required: true, message: '必填' }] }]"
								:disabled="uuid"
							>
								<a-select-option
									v-for="(item, index) in suplistList"
									:key="index"
									:value="item.useName"
									@click="changeUseName(item)"
								>
									{{ item.useName }}
								</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item label="数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['counts', { rules: [{ required: true, message: '必填' }] }]" />
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item label="入库人" :labelCol="labelCol" :wrapperCol="wrapperCol">
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
									'warehouseMan',
									{ initialValue: warehouseMan, rules: [{ required: true, message: '必填' }] },
								]"
								placeholder="入库人"
								readOnly
							>
								<a-icon slot="prefix" type="user" />
							</a-input>
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item label="入库备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-textarea :rows="4" v-decorator="['remark']" />
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['uuid']" type="hidden" />
						</a-form-item>
						<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['type', { initialValue: 'entrySave' }]" type="hidden" />
						</a-form-item>
						<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['warehouseManId']" type="hidden" />
						</a-form-item>
						<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['suplistUuid']" type="hidden" />
						</a-form-item>
						<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['warehouseUuid']" type="hidden" />
						</a-form-item>
						<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['useTypeName']" type="hidden" />
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
	'warehouseTicketNumbers',
	'warehouseName',
	'useType',
	'useName',
	'useTypeName',
	'counts',
	'warehouseMan',
	'warehouseManId',
	'remark',
	'suplistUuid',
	'warehouseUuid',
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
		typeList: {
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
			url: {
				getSerialNumber: '/office/officeMeetingRegister/getSerialNumber',
				getPageSetSupplies: '/office/oaWorkSupplies/getPageSet',
				getPageSetSuplist: '/office/oaWorkSuplist/getPageSet',
			},
			uuid: false,
			warehouseMan: '',
			visiblePopup: false,
			titleList: [],
			warehouseList: [],
			suplistList: [],
			useType: '',
			params: {},
		};
	},
	methods: {
		add(m) {
			console.log('add', m);
			this.uuid = false;
			this.warehouseMan = '';
			this.params = {};
			this.form.setFieldsValue(pick(m, fields));
			this.$post(this.url.getPageSetSupplies).then((res) => {
				this.warehouseList = res.rows;
			});
			this.$post(this.url.getSerialNumber).then((res) => {
				this.form.setFieldsValue({
					warehouseTicketNumbers: res,
				});
			});
		},
		edit(m) {
			this.form.setFieldsValue(pick(m, fields));
			this.uuid = m && m.uuid ? true : false;
			this.params = {};
		},
		changeUseName(item) {
			this.$nextTick(() => {
				this.form.setFieldsValue({
					suplistUuid: item.uuid,
				});
			});
		},
		changeWare(item) {
			this.$nextTick(() => {
				this.form.setFieldsValue({
					warehouseName: item.warehouseName,
					warehouseUuid: item.uuid,
				});
				this.params.suppliesUuid = item.uuid;
				this.getSuplist();
			});
		},
		changeType(item) {
			this.$nextTick(() => {
				console.log('item', item);
				this.form.setFieldsValue({
					useTypeName: item.text,
					useType: item.value,
				});
				this.params.useType = item.value;
				this.getSuplist();
			});
		},
		getSuplist() {
			if (this.params.suppliesUuid && this.params.useType) {
				this.form.setFieldsValue({
					useName: '',
					suplistUuid: '',
				});
				this.$post(this.url.getPageSetSuplist, {
					suppliesUuid: this.params.suppliesUuid,
					useType: this.params.useType,
				}).then((res) => {
					this.suplistList = res.rows;
				});
			}
		},
		popupCallback(value) {
			this.$nextTick(() => {
				this.warehouseMan = value.userName;
				this.form.setFieldsValue({
					warehouseMan: this.warehouseMan,
					warehouseManId: value.userNameId,
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
