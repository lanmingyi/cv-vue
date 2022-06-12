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
						<a-form-item label="申请单号" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['warehouseTicketNumbers']" placeholder="自动生成" disabled />
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item label="用品库名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-select v-decorator="['warehouseName', { rules: [{ required: true, message: '必填' }] }]">
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
							<a-select v-decorator="['useType', { rules: [{ required: true, message: '必填' }] }]">
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
							<a-select v-decorator="['useName', { rules: [{ required: true, message: '必填' }] }]">
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
						<a-form-item label="申请数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input
								v-decorator="[
									'counts',
									{ initialValue: countsNum, rules: [{ required: true, message: '必填' }] },
								]"
								@input="search($event)"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item label="申请人" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<user-popup
								:visible="visibleDelivery"
								:typeNum="1"
								style="width: 100%;"
								@change="(value, other) => popupCallbackDelivery(value, other)"
								@close="() => (visibleDelivery = false)"
							/>
							<a-input
								@click="() => (visibleDelivery = true)"
								v-decorator="[
									'applyName',
									{ initialValue: applyName, rules: [{ required: true, message: '必填' }] },
								]"
								placeholder="申请人"
								readOnly
							>
								<a-icon slot="prefix" type="user" />
							</a-input>
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item label="审核人" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<user-popup
								:visible="visibleSign"
								:typeNum="1"
								style="width: 100%;"
								@change="(value, other) => popupCallbackSign(value, other)"
								@close="() => (visibleSign = false)"
							/>
							<a-input
								@click="() => (visibleSign = true)"
								v-decorator="[
									'approverName',
									{ initialValue: approverName, rules: [{ required: true, message: '必填' }] },
								]"
								placeholder="审核人"
								readOnly
							>
								<a-icon slot="prefix" type="user" />
							</a-input>
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item label="申请备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-textarea
								:rows="4"
								v-decorator="['remark', { rules: [{ required: true, message: '必填' }] }]"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['uuid']" type="hidden" />
						</a-form-item>
						<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['type', { initialValue: 'quitSave' }]" type="hidden" />
						</a-form-item>
						<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['applyId']" type="hidden" />
						</a-form-item>
						<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['suplistUuid']" type="hidden" />
						</a-form-item>
						<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['warehouseUuid']" type="hidden" />
						</a-form-item>
						<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['approverId']" type="hidden" />
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
	'approverName',
	'approverId',
	'counts',
	'applyName',
	'applyId',
	'remark',
	'suplistUuid',
	'warehouseUuid',
	'type',
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
				getPageSetList: '/office/oaWorkSuplist/getPageSetList',
			},
			uuid: '',
			applyName: '',
			approverName: '',
			visibleDelivery: false,
			visibleSign: false,
			titleList: [],
			warehouseList: [],
			suplistList: [],
			countsNum: '',
			params: {},
		};
	},
	methods: {
		search(event) {
			if (this.countsNum && event.currentTarget.value > this.countsNum) {
				this.$message.info('当前存库最大数量为' + this.countsNum);
			}
		},
		add(m) {
			console.log('add', m);
			this.uuid = '';
			this.approverName = '';
			this.applyName = '';
			this.countsNum = '';
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
			this.params = {};
			this.form.setFieldsValue(pick(m, fields));
		},
		changeUseName(item) {
			this.countsNum = '';
			this.$nextTick(() => {
				this.countsNum = item.counts;
				this.form.setFieldsValue({
					suplistUuid: item.uuid,
					counts: item.counts,
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
		popupCallbackSign(value) {
			this.$nextTick(() => {
				this.approverName = value.userName;
				this.form.setFieldsValue({
					approverName: this.approverName,
					approverId: value.userNameId,
				});
			});
		},
		popupCallbackDelivery(value) {
			this.$nextTick(() => {
				this.applyName = value.userName;
				this.form.setFieldsValue({
					applyName: this.applyName,
					applyId: value.userNameId,
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
