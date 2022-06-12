<template>
	<div>
		<t-modal :title="btnType === 'edit' ? '编辑' : '新增'" :width="640" :visible="btnType === 'edit' ? editNodeBox : addNodeBox"
		 :confirmLoading="confirmLoading" @ok="handleSubmit()" @cancel="handleCancel()">
			<a-form :form="form">
				<a-spin :spinning="confirmLoading">
					<a-form-item v-if="btnType === 'addChildNode'" label="父级分类" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<a-input v-decorator="['parent', {initialValue: tableRecord.text}]" />
					</a-form-item>
					<a-form-item label="分类名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<a-input v-decorator="['text', {initialValue: tableRecord.text, rules: [{required: true}]}]" />
					</a-form-item>
					<a-form-item label="是否有子节点" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<a-select :size="size" @change="nodeChange">
							<a-select-option v-for="(item, index) in node" :key="index">
								{{ item.text }}
							</a-select-option>
						</a-select>
					</a-form-item>
					<a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<a-input-number id="inputNumber" style="width: 100%;" :min="-100" :max="100" v-decorator="['sort', {initialValue: tableRecord.sort, rules: [{required: true}]}]" />
					</a-form-item>
					</a-form-item>
					<a-form-item label="描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<a-textarea v-decorator="['description', {initialValue: tableRecord.description}]" />
					</a-form-item>
				</a-spin>
			</a-form>
		</t-modal>
		<t-modal :title="btnType === 'add' ? '新增' : '编辑'" :width="640" :visible="btnType === 'add' ? addBox : editBox"
		 :confirmLoading="confirmLoading" @ok="submit()" @cancel="cancel()">
			<a-form :form="form">
				<a-spin :spinning="confirmLoading">
					<a-form-item label="规则名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<a-input v-decorator="['ruleName', {initialValue: tableRecord.ruleName, rules: [{required: true}]}]" />
					</a-form-item>
					<a-form-item label="接口地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<a-input v-decorator="['ruleHref', {initialValue: tableRecord.ruleHref, rules: [{required: true}]}]" />
					</a-form-item>
					<a-form-item label="SQL条件语句" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<a-input v-decorator="['ruleSql', {initialValue: tableRecord.ruleSql, rules: [{required: true}]}]" />
					</a-form-item>
					<a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<a-input-number id="inputNumber" style="width: 100%;" :min="-100" :max="100" v-decorator="['ruleSort', {initialValue: tableRecord.ruleSort, rules: [{required: true}]}]" />
					</a-form-item>
					</a-form-item>
					<a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
						<a-textarea v-decorator="['ruleRemark', {initialValue: tableRecord.ruleRemark}]" />
					</a-form-item>
				</a-spin>
			</a-form>
		</t-modal>
	</div>
</template>

<script>

	export default {
		props: {
			tableRecord: {
				type: Object
			},
			btnType: {
				type: String
			},
			addNodeBox: {
				type: Boolean
			},
			editNodeBox: {
				type: Boolean
			},
			addBox: {
				type: Boolean
			},
			editBox: {
				type: Boolean
			},
			node: {
				type: Array
			}
		},
		data() {
			return {
				selectedRowKeys: [],
				loading: false,
				size: 'default',
				nodeIndex: '',
				labelCol: {
					xs: {
						span: 24
					},
					sm: {
						span: 7
					}
				},
				wrapperCol: {
					xs: {
						span: 24
					},
					sm: {
						span: 13
					}
				},
				confirmLoading: false,
				tableIndex: 0,
				form: this.$form.createForm(this),
				url: {
					SDAGsave: '/system/sysDataAuthGroup/save',
					SDAGupdate: '/system/sysDataAuthGroup/update',
					SDAupdate: '/system/sysDataAuth/update',
					SDAsave: '/system/sysDataAuth/save'
				}
			}
		},
		methods: {
			handleCancel() {
				this.$emit('handleCancel')
				this.form.resetFields()
			},
			handleSubmit() {
				if (this.btnType === 'edit') {
					const {
						form: {
							validateFields
						}
					} = this
					validateFields((errors, values) => {
						values.state = values.state === 1 ? 'open' : 'closed'
						values.pid = this.tableRecord.pid
						const param = {
							uuid: this.tableRecord.uuid,
							...values
						}
						this.$post(this.url.SDAGupdate, param).then((res) => {
							this.$emit('handleSubmit')
						})
					})
				} else {
					const {
						form: {
							validateFields
						}
					} = this
					validateFields((errors, values) => {
						values.state = values.state === 1 ? 'open' : 'closed'
						values.pid = this.tableRecord.id
						this.$post(this.url.SDAGsave, values).then((res) => {
							this.$emit('handleSubmit', res.rows)
						})
					})
				}
				this.form.resetFields()
			},
			cancel() {
				this.$emit('cancel')
				this.form.resetFields()
			},
			submit() {
				if (this.btnType === 'edit') {
					const {
						form: {
							validateFields
						}
					} = this
					validateFields((errors, values) => {
						values.pid = this.tableRecord.pid
						const param = {
							uuid: this.tableRecord.uuid,
							...values
						}
						SDAupdate(this.url.orgGetListByPid, param).then((res) => {
							this.$emit('submit')
						})
					})
				} else {
					const {
						form: {
							validateFields
						}
					} = this
					validateFields((errors, values) => {
						values.pid = this.tableRecord.id
						this.$post(this.url.SDAsave, values).then((res) => {
							this.$emit('submit', res.rows)
						})
					})
				}
				this.form.resetFields()
			},
			nodeChange(value) {
				this.nodeIndex = value
			}
		}
	}
</script>

<style>
</style>
