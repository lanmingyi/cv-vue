<!--
 * @Description: 
 * @Author: 黄婷
 * @Date: 2021-07-05 14:11:25
 * @LastEditTime: 2021-07-05 14:12:15
 * @LastEditors: 黄婷
 * @FilePath: \misboot-cloud-vue\src\pages\system\sysSample\modal\seniorFormsEdit.vue
-->
<template>
	<t-modal
		title="新增/编辑"
		:width="640"
		:visible="visible"
		:switchFullscreen="true"
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
				<a-row :gutter="16">
					<a-form-item class="hiddenItem">
						<!-- uuid隐藏 -->
						<a-input v-decorator="['uuid']" disabled type="hidden" />
					</a-form-item>
					<a-form-item class="hiddenItem">
						<!-- uuid隐藏 -->
						<a-input v-decorator="['puuid']" disabled type="hidden" />
					</a-form-item>
					<a-col class="gutter-row" :span="24">
						<a-form-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['name']" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="24">
						<a-form-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-radio-group name="radioGroup" v-decorator="['sex']">
								<a-radio value="0">
									女
								</a-radio>
								<a-radio value="1">
									男
								</a-radio>
							</a-radio-group>
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="24">
						<a-form-item label="年龄" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input-number v-decorator="['age']" :min="1" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="24">
						<a-form-item label="生日" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<t-date
								v-decorator="['testDate']"
								style="width: 100%;"
								:trigger-change="true"
								dateFormat="YYYY-MM-DD"
								allowClear
							/>
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="24">
						<a-form-item label="注册时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<t-date
								v-decorator="['testDatetime']"
								style="width: 100%;"
								:trigger-change="true"
								:showTime="true"
								dateFormat="YYYY-MM-DD HH:mm:ss"
								allowClear
							/>
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="24">
						<a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<TDictSelectTag
								placeholder="请选择排序方式"
								dictCode="sortFields"
								v-decorator="['testCombobox']"
							></TDictSelectTag>
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
		</a-spin>
	</t-modal>
</template>

<script>
import pick from 'lodash.pick';
// 表单字段
const fields = ['uuid', 'name', 'sex', 'age', 'testDate', 'testDatetime', 'testCombobox', 'puuid'];
import TDictSelectTag from '@/components/TopVUI/dict/TDictSelectTag';
export default {
	// props: {
	// 	visible: {
	// 		type: Boolean,
	// 		required: true,
	// 	},
	// 	loading: {
	// 		type: Boolean,
	// 		default: () => false,
	// 	},
	// 	model: {
	// 		type: Object,
	// 		default: () => null,
	// 	},
	// },
	components: {
		TDictSelectTag,
	},
	data() {
		return {
			visible: false,
			loading: false,
			model: null,
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
					span: 16,
				},
			},
			form: this.$form.createForm(this),
		};
	},
	methods: {
		add(m, data) {
			console.log(m, data);
		},
		edit(m, data) {
			console.log(m, data);
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
