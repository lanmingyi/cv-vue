<!--
 * @Description: 
 * @Author: 黄婷
 * @Date: 2021-06-15 14:23:00
 * @LastEditTime: 2021-06-15 15:57:12
 * @LastEditors: 黄婷
 * @FilePath: \vue-antd-admine:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\system\sysQyweixin\modal\searchModal.vue
-->
<template>
	<t-modal
		title="查询"
		:width="640"
		:visible="visible"
		:confirmLoading="loading"
		@ok="
			() => {
				$emit('ok');
			}
		"
		@cancel="
			() => {
				$emit('update:visible', false);
			}
		"
	>
		<a-spin :spinning="loading">
			<a-form :form="form">
				<!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
				<a-form-item label="部门" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<!-- <a-input v-decorator="['orgName']" /> -->
					<tree-select
						style="width: 100%;"
						v-decorator="['orgIds']"
						placeholder="请选择菜单"
						:parameter="parameter"
						:url="url"
						idfield="id"
						textfield="name"
						@change="seleteOrg"
						allowClear
					/>
				</a-form-item>
				<a-form-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<!-- <a-input v-decorator="['userName']" /> -->
					<a-select style="width: 100%" v-decorator="['userIds']" allowClear>
						<a-select-option v-for="(item, index) in userList" :key="index" :value="item.userid">
							{{ item.name }}
						</a-select-option></a-select
					>
				</a-form-item>
				<a-form-item label="年月" :labelCol="labelCol" :wrapperCol="wrapperCol" allowClear>
					<t-date
						v-decorator="['years']"
						style="width: 100%;"
						:trigger-change="true"
						:showTime="false"
						dateFormat="YYYY-MM"
						allowClear
						type="month"
					/>
				</a-form-item>
			</a-form>
		</a-spin>
	</t-modal>
</template>

<script>
import pick from 'lodash.pick';
import TreeSelect from '@/components/TopVUI/custom/TreeSelect';
// 表单字段
const fields = ['orgIds', 'years', 'userIds'];

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
	components: { TreeSelect },
	data() {
		return {
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
			form: this.$form.createForm(this),
			url: {
				fathersUrl: '/system/sysQyweixinOrganization/getDatList',
				expandUrl: '/system/sysQyweixinOrganization/getDatList',
				subList: '/system/sysQyweixinUser/getPageSet',
			},
			parameter: {
				father: {
					pid: 0,
				},
				children: {},
			},
			userList: [],
		};
	},
	created() {
		// 防止表单未注册
		fields.forEach((v) => this.form.getFieldDecorator(v));

		// 当 model 发生改变时，为表单设置值
		this.$watch('model', () => {
			this.model && this.form.setFieldsValue(pick(this.model, fields));
		});
	},
	methods: {
		seleteOrg(value, node) {
			console.log('value,node', value, node);
			this.$post(this.url.subList, { orgId: value }).then((res) => {
				this.userList = res.rows;
			});
		},
	},
};
</script>
