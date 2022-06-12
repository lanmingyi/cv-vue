<template>
	<div>
		<t-modal
			:title="btnType === 'edit' ? '编辑' : '新增'"
			:width="640"
			:visible="btnType === 'edit' ? editBox : addBox"
			:confirmLoading="confirmLoading"
			@ok="handleSubmit()"
			@cancel="handleCancel()"
		>
			<a-form :form="form">
				<a-form-item>
					<a-spin :spinning="confirmLoading">
						<a-form-item
							label="父级机构"
							:labelCol="labelCol"
							:wrapperCol="wrapperCol"
							v-if="btnType === 'addChildNode'"
						>
							<a-tree-select
								tree-data-simple-mode
								style="width: 100%"
								:dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
								:tree-data="treeData"
								:load-data="onLoadData"
								v-decorator="['parent', { initialValue: tableRecord.id }]"
								@change="achange"
							/>
						</a-form-item>
						<a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['text', { initialValue: tableRecord.title }]" />
						</a-form-item>
						<a-form-item label="代码" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['code', { initialValue: tableRecord.code }]" />
						</a-form-item>
						<a-form-item label="类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-select :size="size" @change="orgTypeChange">
								<a-select-option v-for="item in orgType" :key="item.sort">
									{{ item.text }}
								</a-select-option>
							</a-select>
						</a-form-item>
						<a-form-item label="负责人" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-select :size="size" @change="principalChange">
								<a-select-option v-for="(item, index) in principal" :key="index">
									{{ item.userName }}
								</a-select-option>
							</a-select>
						</a-form-item>
						<a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-select :size="size" @change="statusChange">
								<a-select-option v-for="item in status" :key="item.value">
									{{ item.text }}
								</a-select-option>
							</a-select>
						</a-form-item>
						<a-form-item label="是否有子节点" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-select :size="size" @change="nodeChange">
								<a-select-option v-for="(item, index) in node" :key="index">
									{{ item.text }}
								</a-select-option>
							</a-select>
						</a-form-item>
						<a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input-number
								id="inputNumber"
								style="width: 100%;"
								:min="-100"
								:max="100"
								v-decorator="['sort', { initialValue: tableRecord.sort }]"
							/>
						</a-form-item>
						<a-form-item label="图标" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['icon', { initialValue: tableRecord.icon }]" />
						</a-form-item>
					</a-spin>
				</a-form-item>
			</a-form>
		</t-modal>
	</div>
</template>

<script>

export default {
	name: 'tableModal',
	props: {
		tableRecord: {
			type: Object,
		},
		btnType: {
			type: String,
			default: 'add',
		},
		editBox: {
			type: Boolean,
			default: false,
		},
		addBox: {
			type: Boolean,
			default: false,
		},
		status: {
			type: Array,
		},
		orgType: {
			type: Array,
		},
		systemName: {
			type: Array,
		},
		principal: {
			type: Array,
		},
		node: {
			type: Array,
		},
		remark: {
			type: String,
		},
		treeData: {
			type: Array,
		},
		extraPid: {
			type: Number,
		},
		extraLevelId: {
			type: Number,
		},
	},
	data() {
		return {
			confirmLoading: false,
			size: 'default',
			nodeIndex: 0,
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
					span: 12,
				},
			},
			data: [],
			form: this.$form.createForm(this),
			url: {
				orgGetListByPid: '/mdata/organization/getListByPid',
				saveRoot: '/mdata/organization/saveRoot',
				update: '/mdata/organization/update',
			},
		};
	},
	mounted() {},
	methods: {
		onLoadData(item) {
			return new Promise((resolve) => {
				const params = {
					pid: Number(item.dataRef.id),
				};
				this.$post(this.url.orgGetListByPid, params).then((res) => {
					const treeData = res;
					let data = [];
					treeData.forEach((e, index) => {
						treeData[index].title = e.text;
						treeData[index].label = e.text;
						treeData[index].index = index;
						treeData[index].value = e.id;
						treeData[index].levelId = e.levelId;
					});
					item.dataRef.children = treeData;
					data = [...this.treeData];
					this.$emit('setTreeData', data);
					resolve();
				});
			});
		},
		achange(value, node, extra) {
			this.$emit('achange', extra);
		},
		handleCancel() {
			this.$emit('handleCancel');
			this.form.resetFields();
		},
		handleSubmit(e) {
			const obj = {
				orgType: this.orgType[this.orgTypeIndex].value,
				leader: this.principal[this.principalIndex].userName,
				leaderId: this.principal[this.principalIndex].userNameId,
				status: this.statusIndex,
				state: this.node[this.nodeIndex].value,
			};
			if (this.btnType === 'edit') {
				const {
					form: { validateFields },
				} = this;
				validateFields((errors, values) => {
					delete values.parent;
					const params = {
						...values,
						...obj,
						uuid: this.tableRecord.uuid,
						id: this.tableRecord.id,
						levelId: this.tableRecord.levelId,
					};
					this.$post(this.url.update, params).then((res) => {
						this.$message.success(res.message);
					});
				});
				this.$emit('handleSubmit');
				this.form.resetFields();
			} else {
				const {
					form: { validateFields },
				} = this;
				validateFields((errors, values) => {
					delete values.parent;
					const params = {
						...values,
						...obj,
						levelId: this.extraLevelId,
						pid: this.extraPid,
					};
					this.$post(this.url.saveRoot, params).then((res) => {
						if (res.statusCode === 200) {
							this.$message.success(res.message);
						} else {
							this.$message.error(res.message);
						}
					});
				});
				this.form.resetFields();
				this.$emit('handleSubmit');
			}
		},
		orgTypeChange(value) {
			this.orgTypeIndex = value;
		},
		principalChange(value) {
			this.principalIndex = value;
		},
		statusChange(value) {
			this.statusIndex = value;
		},
		nodeChange(value) {
			this.nodeIndex = value;
		},
		systemNameChange(value) {
			this.systemNameIndex = value;
		},
	},
};
</script>

<style></style>
