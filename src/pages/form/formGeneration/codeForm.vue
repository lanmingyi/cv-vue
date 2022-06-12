<template>
	<div>
		<t-modal title="下载代码" :width="640" :visible="visible" :confirmLoading="loading" @ok="handleSubmit()"
			@cancel="handleCancel()" okText="下载" cancelText="取消">
			<a-spin :spinning="confirmLoading">
				<a-form :form="form">
					<a-form-item label="基础包" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<a-input v-decorator="[
								'packetPath',
								{ initialValue: 'com.misboot', rules: [{ required: true, message: '请输入基础包' }] },
							]" />
					</a-form-item>
					<a-form-item label="系统名" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<a-input v-decorator="[
								'moduleName',
								{ initialValue: 'system', rules: [{ required: true, message: '请输入系统名必填' }] },
							]" />
					</a-form-item>
					<a-form-item label="作者" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<a-input v-decorator="[
								'author',
								{ initialValue: '佐佑科技', rules: [{ required: true, message: '请输入作者必填' }] },
							]" />
					</a-form-item>
					<a-form-item label="邮箱" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<a-input v-decorator="[
								'mailbox',
								{ initialValue: 'zuoyou@.com', rules: [{ required: true, message: '请输入邮箱必填' }] },
							]" />
						<a-input v-decorator="['functionDescription']" type="hidden" />
					</a-form-item>
				</a-form>
			</a-spin>
		</t-modal>
	</div>
</template>

<script>
	import { baseUrl } from '@/services/baseUrl.js';
	import { ACCESS_TOKEN } from '@/store/mutation-types'
	import Vue from 'vue'
	export default {
		props: {
			loading: {
				type: Boolean,
				default: () => false,
			},
			visible: {
				type: Boolean,
				required: true,
			},
			basicsUuid: {
				type: String
			}
		},
		data() {
			return {
				selectedRowKeys: [],
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
				confirmLoading: false,
				tableIndex: 0,
				form: this.$form.createForm(this)
			};
		},
		methods: {
			handleCancel() {
				this.$emit('cancel');
				this.form.resetFields();
			},
			handleSubmit() {
				this.form.validateFields((errors, values) => {
					if (!errors) {
						window.location.href =
							baseUrl +
							"/system/sysAppBasics/generateCodeSave?uuid=" +
							this.basicsUuid +
							"&token=" +
							Vue.ls.get(ACCESS_TOKEN) +
							"&author=" +
							values.author +
							"&mailbox=" +
							values.mailbox +
							"&moduleName=" +
							values.moduleName +
							"&packetPath=" +
							values.packetPath
							this.$emit('ok');
					}
				});
			},
		},
	};
</script>

<style></style>
