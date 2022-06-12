<template>
	<t-modal title="新增/编辑" :width="640" :visible="visible" :confirmLoading="loading" @ok="
			() => {
				$emit('ok');
			}
		" @cancel="
			() => {
				$emit('cancel');
			}
		">
		<a-spin :spinning="loading">
			<a-form :form="form">
				<a-row :gutter="16">
					<a-form-item class="hiddenItem">
						<!-- uuid隐藏 -->
						<a-input v-decorator="['uuid']" disabled type="hidden" />
					</a-form-item>
					<a-col class="gutter-row" :span="24">
						<a-form-item label="父级" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<tree-select v-decorator="['puuid', { initialValue: puuid }]" placeholder="请选择菜单"
								:parameter="parameter" :url="url" :data="treeData" idfield="id" textfield="text"
								@change="seleteOrg" />
							<!-- <a-input v-decorator="['puuid', { initialValue: puuid }]" disabled type="hidden" /> -->
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="24">
						<a-form-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['name',{ rules: [{ required: true, message: '必填' }]}]" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="24">
						<a-form-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<TDictSelectTag placeholder="请选择" dictCode="sex"
								v-decorator="['sex',{ rules: [{ required: true, message: '必填' }]}]"></TDictSelectTag>
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="24">
						<a-form-item label="年龄" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input-number v-decorator="['age']" :min="1" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="24">
						<a-form-item label="生日" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<t-date v-decorator="['testDate',{ rules: [{ required: true, message: '必填' }]}]" style="width: 100%;" :trigger-change="true"
								dateFormat="YYYY-MM-DD" allowClear />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="24">
						<a-form-item label="注册时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<t-date v-decorator="['testDatetime']" style="width: 100%;" :trigger-change="true"
								:showTime="true" dateFormat="YYYY-MM-DD HH:mm:ss" allowClear />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="24">
						<a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<TDictSelectTag placeholder="请选择排序方式" dictCode="sortFields" v-decorator="['testCombobox']">
							</TDictSelectTag>
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
	const fields = ['uuid', 'puuid', 'puuidName', 'name', 'sex', 'age', 'testDate', 'testDatetime', 'testCombobox'];
	import TDictSelectTag from '@/components/TopVUI/dict/TDictSelectTag';
	import TreeSelect from '@/components/TopVUI/custom/TreeSelect';
	export default {
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
		components: {
			TDictSelectTag,
			TreeSelect,
		},
		data() {
			return {
				title: '',
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
				treeData: [],
				puuid: '',
				puuidName: '',
				url: {
					fathersUrl: '/workflow/testTreegrid/getListByLevelId',
					expandUrl: '/workflow/testTreegrid/getListByPid',
				},
				parameter: {
					father: {
						levelId: 1,
						type: 'topic',
					},
					children: {
						type: 'topic',
					},
				},
			};
		},
		methods: {
			add(m, data) {
				this.treeData = data;
				this.puuid = m.puuid;
				this.filterListById(m.puuid, data);
			},
			edit(m, data) {
				this.puuid = Number(m.puuid);
				this.treeData = data;
				this.filterListById(this.puuid, data);
			},
			filterListById(id, data) {
				data.forEach((e) => {
					if (id == e.id) {
						this.puuidName = e.text;
					} else {
						if (e.children) {
							this.filterListById(id, e.children);
						}
					}
				});
			},
			seleteOrg(value, node) {
				console.log('value,node', value, node);
				this.$nextTick(() => {
					this.puuid = value;
					this.puuidName = node.toString();
					this.form.setFieldsValue({
						puuid: this.puuid,
						puuidName: this.puuidName,
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
