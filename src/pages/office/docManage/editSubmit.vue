<template>
	<t-modal
		title="流转"
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
						<a-form-item label="当前用户" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['uaerName']" type="hidden" />
						</a-form-item>
					</a-col>
					<a-col :span="12">
						<a-form-item label="当前环节" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['trainContent']" type="hidden" />
						</a-form-item>
					</a-col>
				</a-row>
				<a-divider />
				<a-row>
					<a-col :span="24">
						<a-form-item label="流转方式" :labelCol="labelColfull" :wrapperCol="wrapperColfull">
							<a-radio-group v-model="transferName" :options="transfer" @change="changeTransfer" />
							<a-input v-decorator="['transferName']" type="hidden" />
						</a-form-item>
					</a-col>
					<a-col :span="24" v-show="transferName === 1 || transferName === 2 || transferName === 5">
						<a-form-item label="选择环节" :labelCol="labelColfull" :wrapperCol="wrapperColfull">
							<a-radio-group v-model="linkName" :options="link" @change="changeLink" />
							<a-input v-decorator="['linkName']" type="hidden" />
							<a-radio-group
								style="font-size: 14px;"
								v-show="linkName === 2 && (transferName === 1 || transferName === 2)"
								v-model="seleteName"
								:options="selete"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="24" v-show="transferName <= 2">
						<a-form-item label="选择办理人" :labelCol="labelColfull" :wrapperCol="wrapperColfull">
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
									'userName',
									{ initialValue: userName, rules: [{ required: true, message: '必填' }] },
								]"
								placeholder="办理人"
								readOnly
							>
								<a-icon slot="prefix" type="user" />
							</a-input>
						</a-form-item>
					</a-col>
					<a-col :span="24" v-show="transferName >= 4">
						<a-form-item label="回退原因" :labelCol="labelColfull" :wrapperCol="wrapperColfull">
							<a-input v-decorator="['returnReason']" type="textarea" />
						</a-form-item>
					</a-col>
					<a-col :span="24" v-show="transferName <= 3">
						<a-form-item label="选择传阅人" :labelCol="labelColfull" :wrapperCol="wrapperColfull">
							<div class="item-box">
								<div class="tab_table">
									<a-tag
										closable
										v-for="(tag, index) in hasData"
										:key="tag.uuid"
										@close="hasDataPrevent(tag, index)"
									>
										{{ tag.userName }}
									</a-tag>
								</div>
								<t-select-role
									ref="hasDataModal"
									@change="hasDataSelect"
									@changeData="changeHasData"
									@show="hasDataAdd"
									:isSelect="false"
									:visible="hasDataVisible"
								/>
							</div>
							<a-input
								v-decorator="[
									'divWhether01',
									{ initialValue: divWhether01, rules: [{ required: true, message: '必填' }] },
								]"
								readOnly
								type="hidden"
							/>
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['uuid', { initialValue: uuid }]" type="hidden" />
						</a-form-item>
						<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['userNameId', { initialValue: userNameId }]" type="hidden" />
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
		</a-spin>
	</t-modal>
</template>

<script>
import pick from 'lodash.pick';

import Editor from '@/components/TopVUI/custom/Editor/index.vue';
import UserPopup from '@/components/TopVUI/custom/userPopup';
import TSelectRole from '@/components/TopVUI/custom/TSelectRole';
// 表单字段
const fields = [
	'uuid',
	'postName',
	'status',
	'trainStartTime',
	'trainEndTime',
	'trainContent',
	'userNameId',
	'userName',
];

export default {
	components: {
		Editor,
		UserPopup,
		TSelectRole,
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
				getCategorysByTypeAndLevelId: '/system/category/getCategorysByTypeAndLevelId',
				getListByPid: '/system/category/getListByPid',
				getTopicBaseDetailByUuid: '/system/topicBase/getDetailByUuid',
				getDetailByUuidAndUser: '/office/oaMeetingsBase/getDetailByUuidAndUser',
				editcontents: '/office/oaMeetingsBase/editcontents',
				getDetail: '/office/oaMeetingsBase/editcontents',
				getListByUuids: '/mdata/user/getListByUuids',
			},
			isClear: true,
			uuid: '',
			trainContent: '',
			transferName: 1,
			transferId: '',
			transfer: [
				{ label: '提交下一步', value: 1 },
				{ label: '自由提交', value: 2 },
				{ label: '仅传阅', value: 3 },
				{ label: '回退上一步', value: 4 },
				{ label: '自由回退', value: 5 },
			],
			linkName: 1,
			linkId: '',
			link: [
				{ label: '主任审核', value: 1, disabled: false },
				{ label: '承办处室', value: 2, disabled: false },
				{ label: '分局、支队、中心、市场处', value: 3, disabled: false },
				{ label: '传阅', value: 4, disabled: false },
				{ label: '副处长分件', value: 5, disabled: true },
				{ label: '处室经办人', value: 6, disabled: true },
				{ label: '市局分管领导', value: 7, disabled: true },
				{ label: '分管领导批示', value: 8, disabled: true },
			],
			seleteName: 1,
			selete: [
				{ label: '办公室', value: 1 },
				{ label: '综合处', value: 2 },
				{ label: '人事教育处', value: 3 },
				{ label: '计划与财务处', value: 4 },
				{ label: '自然资源督查和执法监察', value: 5 },
				{ label: '测绘地理和科技信息处', value: 6 },
			],
			hasData: [],
			divWhether01: '',
			hasDataVisible: false,
			uuidHasList: [],
			visiblePopup: false,
			userName: '',
			userNameId: '',
			showSelete: false,
		};
	},
	updated() {
		this.isClear = false;
		this.trainContent = this.form.getFieldValue('trainContent');
	},
	methods: {
		add(m) {
			console.log('add', m);
		},
		edit(m) {
			this.form.setFieldsValue(pick(m, fields));
		},
		changeTransfer(e) {
			console.log('e----trabsfer', e.target.value, e);
			this.transferName = e.target.value;
			this.linkId = 1;
			this.linkName = 1;
			if (this.transferName === 2 || this.transferName === 5) {
				this.link.forEach((val) => {
					val.disabled = false;
				});
			} else if (this.transferName === 1) {
				this.link.forEach((val, index) => {
					if (index >= 3) {
						val.disabled = true;
					}
				});
			}
		},
		changeLink(e) {
			console.log('e----link', e.target.value);
			this.linkId = e.target.value;
			// if(e.target.value === '承办处室'){
			// 	this.showSelete = true
			// }else {
			// 	this.showSelete = false
			// }
		},
		changeHasData(data) {
			data.forEach((val) => {
				if (this.uuidHasList.length != 0 && this.uuidHasList.find((e) => val.uuid === e)) {
					console.log('存在了', e);
				} else {
					this.uuidHasList.push(val.uuid);
					this.hasData.push(val);
				}
				this.divWhether01 = this.uuidHasList.join(',');
				this.form.setFieldsValue({
					divWhether01: this.divWhether01,
				});
			});
		},
		hasDataPrevent(tag, index) {
			var data = this.hasData;
			data.forEach((val, index) => {
				if (val.uuid === tag.uuid) {
					data.splice(index, 1);
				}
			});
			this.hasData = data;
			this.uuidHasList.splice(this.uuidHasList.indexOf(tag.uuid), 1);
			this.divWhether01 = this.uuidHasList.toString();
			this.form.setFieldsValue({
				divWhether01: this.divWhether01,
			});
		},
		hasDataSelect(e) {
			// console.log('e------------', e)
		},
		hasDataAdd() {
			this.$refs.hasDataModal.show();
		},
		popupCallback(value) {
			this.$nextTick(() => {
				this.userName = value.userName;
				this.userNameId = value.userNameId;
				this.form.setFieldsValue({
					userName: this.userName,
					userNameId: this.userNameId,
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
