<template>
	<t-modal title="详情" :width="640" :visible="visible" @ok="() => { $emit('ok') }" @cancel="() => { $emit('cancel') }">
		<a-spin :spinning="loading">
			<a-form :form="form">
				<!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
				<!-- <a-form-item label="父级" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<tree-select v-decorator="['puuid', { initialValue: puuid,rules: [{required: true,message:'必填'}] }]" placeholder="请选择" :parameter="parameter" :url="url" :data="treeData"/>
				</a-form-item> -->
				<a-form-item label="文件名" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input v-decorator="['bucketName']" disabled />
				</a-form-item>
				<a-form-item label="文件 ACL" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input v-decorator="['acl']" disabled />
				</a-form-item>
				<a-form-item label="URL" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<!-- <a-input v-decorator="['url']" disabled /> -->
					<a-input v-decorator="['url']" disabled>
						<a-icon slot="addonAfter" type="copy" @click="copyLink()" data-clipboard-action="copy" :class="['cobyOrderSnUrl']" :data-clipboard-text="url"/>
					</a-input>
				</a-form-item>
			</a-form>
		</a-spin>
	</t-modal>
</template>

<script>
	import pick from 'lodash.pick'
	// 表单字段
	const fields = ['uuid', 'catalog', 'bucketName', 'acl', 'url']
	export default {
		props: {
			visible: {
				type: Boolean,
				required: true
			},
			loading: {
				type: Boolean,
				default: () => false
			},
			model: {
				type: Object,
				default: () => null
			}
		},
		data() {
			return {
				labelCol: {
					xs: {
						span: 24
					},
					sm: {
						span: 5
					}
				},
				wrapperCol: {
					xs: {
						span: 24
					},
					sm: {
						span: 17
					}
				},
				form: this.$form.createForm(this),
				url:''
			}
		},
		created() {

			// 防止表单未注册
			fields.forEach(v => this.form.getFieldDecorator(v))

			// 当 model 发生改变时，为表单设置值
			this.$watch('model', () => {
				this.model && this.form.setFieldsValue(pick(this.model, fields))
				this.url = this.model.url
			})
		},
		methods:{
			// 复制图标
			copyLink() {
				let _this = this;
				let clipboard = new this.clipboard(".cobyOrderSnUrl");
				clipboard.on('success', function () {
					_this.$message.success('复制成功！')
					clipboard.destroy()
				});
				clipboard.on('error', function () {
					_this.$message.success('复制失败！')
					clipboard.destroy()
				});
			}
		}
	}
</script>
