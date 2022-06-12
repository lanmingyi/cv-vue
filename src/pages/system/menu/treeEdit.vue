<template>
	<t-drawer title="新增编辑" placement="right" :closable="false" :width="640"
		:visible="visible" :confirmLoading="loading" @close="() => { $emit('cancel') }">
		<a-spin :spinning="loading">
			<a-form :form="form">
				<a-form-item label="父级资源" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="type==='2'">
					<tree-select v-decorator="['pid', { initialValue: pid,rules: [{required: true, message: '请输入资源类型！'}] }]" placeholder="请选择菜单"
						:parameter="parameter" :url="url" :data="treeData" idfield="id" textfield="text" />
				</a-form-item>
				<a-form-item class="hiddenItem" v-else>
					<a-input v-decorator="['pid', { initialValue: 1 }]" disabled type="hidden" />
					<a-input v-decorator="['levelId', { initialValue: 1 }]" disabled type="hidden" />
				</a-form-item>
				<a-form-item label="资源类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-select v-decorator="['resourceType', { rules: [{required: true, message: '请输入资源类型！'}]}]" @change="handleChange">
						<a-select-option v-for="(item, index) in resourceType" :key="index" :value="item.type">
							{{ item.text }}
						</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item label="资源名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input v-decorator="['text', { rules: [{required: true, message: '请输入资源名称！'}]}]" placeholder="资源名称" />
				</a-form-item>
				<a-form-item label="菜单路径" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input v-decorator="['url',{ rules: [{required: true, message: '请输入菜单路径'}]}]" placeholder="不能重复" />
				</a-form-item>
				<a-form-item label="前端组件" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="resourceTypeValue!=='button'">
					<a-input v-decorator="['remark',{ rules: [{required: true, message: '请输入前端组件'}]}]" placeholder="PageView/RouteView/具体路径" />
				</a-form-item>
				<a-form-item label="资源排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input-number id="inputNumber" style="width: 100%;" :min="0" placeholder="资源排序" v-decorator="['sort',{ rules: [{required: true, message: '必填'}]}]" />
				</a-form-item>
				<a-form-item label="资源图标" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<icon-font-picker v-decorator="['iconCls', { initialValue: '' }]" @change="handleIconChoose"></icon-font-picker>
				</a-form-item>
				<a-form-item
					v-if="resourceTypeValue==='APP'"
					label="图标背景颜色"
					:labelCol="labelCol"
					:wrapperCol="wrapperCol"
					>
					<color-picker v-decorator="['iconClsColour', { initialValue: iconClsColour }]" @change="changeClsColour" />
				</a-form-item>
				<a-form-item label="是否缓存该路由" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-radio-group name="radioGroup" v-decorator="['keepAlive', {initialValue: false}]">
						<a-radio :value="true">
							是
						</a-radio>
						<a-radio :value="false">
							否
						</a-radio>
					</a-radio-group>
				</a-form-item>
				<a-form-item label="是否启用" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-radio-group name="radioGroup" v-decorator="['status', {initialValue: 1},{ rules: [{required: true, message: '请选择此处！'}]}]">
						<a-radio :value="0">
							禁用
						</a-radio>
						<a-radio :value="1">
							启用
						</a-radio>
					</a-radio-group>
				</a-form-item>
				<a-form-item label="子节点" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-radio-group name="radioGroup" v-decorator="['state', {initialValue: 'closed'},{ rules: [{required: true, message: '请选择此处！'}]}]">
						<a-radio value="closed">
							有子节点
						</a-radio>
						<a-radio value="open">
							无子节点
						</a-radio>
					</a-radio-group>
				</a-form-item>
				<a-form-item label="配置说明" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<div style="color: gray;font-size: 12px;line-height: 18px;padding-bottom:20px;">
						<p> 菜单路径配置说明：
							1. 子菜单页面（即具体的页面），URL配置规则：按照功能模块定义的关键根路径即可，不能重复。</br>
							2. 普通的子菜单（即有下级的菜单），URL和前端组件配置保持一致即可</p>
						<p>前端组件配置说明:
							1. 子菜单页面（即具体的页面）配置相对于src/views目录的路径，</br>
							2. 普通的子菜单（即有下级的菜单）配置固定 前端组件TabsView(最外层菜单tab)/PageView(页面视图)/RouteView(路由视图)
						</p>
					</div>
				</a-form-item>
				<a-form-item class="hiddenItem">
					<a-input v-decorator="['uuid']" disabled type="hidden" />
				</a-form-item>
				<a-form-item class="hiddenItem">
					<a-input v-decorator="['codeSetId']" disabled type="hidden" />
				</a-form-item>
				<a-form-item class="hiddenItem">
					<a-input v-decorator="['levelId']" disabled type="hidden" />
				</a-form-item>
			</a-form>
		</a-spin>
		<div :style="{
				background:'rgba(255,255,255,1)',
				position: 'absolute',
				right: 0,
				bottom: 0,
				width: '100%',
				borderTop: '1px solid #e9e9e9',
				padding: '10px 16px',
				textAlign: 'right',
				zIndex: 1,
			}">
			<a-button :style="{ marginRight: '8px' }" @click="() => { $emit('cancel') }">
				取消
			</a-button>
			<a-button type="primary" @click="() => { $emit('ok') }">
				确认
			</a-button>
		</div>
	</t-drawer>
</template>

<script>
	import pick from 'lodash.pick';
	import TreeSelect from '@/components/TopVUI/custom/TreeSelect';	
	import colorPicker from '@/components/TopVUI/color/colorPicker';
	import iconFontPicker from '@/components/TopVUI/font/iconFontPicker';
	const fields = ['uuid', 'pid', 'levelId', 'resourceType', 'text', 'keepAlive', 'status', 'state', 'iconCls', 'url',  'remark', 'sort', 'codeSetId','iconClsColour'
	]
	export default {
		props: {
			visible: {
				type: Boolean,
				default: () => false
			},
			loading: {
				type: Boolean,
				default: () => false
			},
			model: {
				type: Object,
				default: () => null
			},
			type: {
				type: String
			}
		},
		components: {
			TreeSelect,
			iconFontPicker,
			colorPicker
		},
		data() {
			return {
				resourceType: [{
						text: '菜单',
						type: 'menu'
					},
					{
						text: '按钮',
						type: 'button'
					},
					{
						text: '链接-新窗口',
						type: 'urlNewWindows'
					},{
						text: 'APP菜单',
						type: 'APP'
					},
					// {
					// 	text: '链接-外链',
					// 	type: 'outerChain'
					// },
					// {
					//   text: '链接-内页',
					//   type: 'urlInsidePage'
					// },
				],
				treeData: [],
				icon: [],
				status: [{
						text: '启用',
						value: 1
					},
					{
						text: '禁用',
						value: 0
					}
				],
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
						span: 18
					}
				},
				form: this.$form.createForm(this),
				treeData: [],
				levelId: 1,
				pid: 1,
				url: {
					fathersUrl: '/system/menu/getListByLevelId',
					expandUrl: '/system/menu/getListByPid'
				},
				parameter: {
					father: {
						levelId: 1
					},
					children: {}
				},
				resourceTypeValue:'',
				iconClsColour:''
			}
		},
		mounted: function() {},
		created() {
			// 防止表单未注册
			fields.forEach(v => this.form.getFieldDecorator(v))
			// 当 model 发生改变时，为表单设置值
			this.$watch('model', () => {
				this.model && this.form.setFieldsValue(pick(this.model, fields))
				console.log(pick(this.model, fields))
			})
		},
		methods: {
			handleChange(value) {
				this.form.setFieldsValue({
					codeSetId: value
				});
				this.resourceTypeValue = value
			},
			add(m, data) {
				this.treeData = data ? data : []
				this.pid = m ? m.id : ''
			},
			edit(m, data) {
				this.treeData = data
				this.pid = m.pid
				this.resourceTypeValue = m.resourceType
				this.iconClsColour = m.iconClsColour
			},
			handleIconChoose(value) {
				this.form.setFieldsValue({
					iconCls: value
				});
			},
			changeClsColour(val){
				this.form.setFieldsValue({
					iconClsColour: val
				});
			},
		}
	}
</script>

<style>
</style>
