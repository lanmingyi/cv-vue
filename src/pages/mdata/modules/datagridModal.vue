<template>
	<div>
		<t-modal
			:title="btnType === 'add' ? '新增' : '编辑'"
			:width="640"
			:visible="btnType === 'add' ? addBox : editBox"
			:confirmLoading="confirmLoading"
			@ok="handleSubmit()"
			@cancel="handleCancel()"
		>
			<a-spin :spinning="confirmLoading">
				<a-form :form="form">
					<a-form-item label="名字" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<a-input
							v-decorator="[
								'userName',
								{ initialValue: tableRecord.userName, rules: [{ required: true }] },
							]"
						/>
					</a-form-item>
					<a-form-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<a-input
							v-decorator="[
								'userSex',
								{ initialValue: tableRecord.userSex, rules: [{ required: true }] },
							]"
						/>
					</a-form-item>
				</a-form>
			</a-spin>
		</t-modal>
	</div>
</template>

<script>

export default {
	props: {
		tableRecord: {
			type: Object,
		},
		btnType: {
			type: String,
		},
		addBox: {
			type: Boolean,
		},
		editBox: {
			type: Boolean,
		},
	},
	data() {
		return {
			selectedRowKeys: [],
			loading: false,
			labelCol: {
				xs: { span: 24 },
				sm: { span: 7 },
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 13 },
			},
			confirmLoading: false,
			tableIndex: 0,
			form: this.$form.createForm(this),
			url: {
				SDGsave: '/system/sysDatagrid/save',
				SDGupdate: '/system/sysDatagrid/update',
			},
		};
	},
	methods: {
		handleCancel() {
			this.$emit('handleCancel');
			this.form.resetFields();
		},
		handleSubmit() {
			if (this.btnType === 'add') {
				const {
					form: { validateFields },
				} = this;
				validateFields((errors, values) => {
					this.$post(this.url.SDGsave, values).then((res) => {
						this.$emit('handleSubmit', res.rows);
					});
				});
			} else {
				const {
					form: { validateFields },
				} = this;
				validateFields((errors, values) => {
					const param = {
						uuid: this.tableRecord.uuid,
						...values,
					};
					this.$post(this.url.SDGupdate, param).then((res) => {
						this.$emit('handleSubmit');
					});
				});
			}
			this.form.resetFields();
		},
	},
};
</script>

<style></style>
