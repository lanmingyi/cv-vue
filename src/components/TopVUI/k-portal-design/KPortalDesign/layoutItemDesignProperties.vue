<!--
 * @Description: 表单控件属性设置组件,因为配置数据是引用关系，所以可以直接修改/用户界面
 * @Author: lmy
 * @Date: 2021-05-20 18:13:04
 * @LastEditTime: 2021-06-03 16:05:17
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
	<div class="properties-centent kk-checkbox">
		<div class="head-title">
			控件属性设置
		</div>
		<div class="properties-body padding-sm">
			<p class="hint-box" v-show="selectItem.key === ''">未选择控件</p>
			<a-form v-show="selectItem.key !== '' || selectItem.type == 'grid' || selectItem.type == 'tabs'">
				<a-form-item v-if="selectItem.type === 'grid'" label="栅格间距">
					<div class="flex">
						水平间距：<a-input-number
							style="width:70% !important;"
							:min="0"
							:max="48"
							v-model="options.gutters"
							placeholder="请输入水平间距："
						/>
					</div>
					<div class="flex">
						垂直间距：<a-input-number
							style="width:70% !important;"
							:min="0"
							:max="48"
							v-model="options.vgutters"
							placeholder="请输入垂直间距"
						/>
					</div>
				</a-form-item>
				<a-form-item v-if="selectItem.type === 'grid'" label="列配置项">
					<KChangeOption v-model="selectItem.columns" type="colspan" />
				</a-form-item>
				<!-- tabs开始 -->
				<template v-if="selectItem.type === 'tabs'">
					<!-- 标签间距 start -->
					<a-form-item label="标签间距">
						<a-input-number v-model="options.tabBarGutter" placeholder="请输入" />
					</a-form-item>
					<!-- 页签位置 start -->
					<!-- tabs配置 start -->
					<a-form-item label="页签配置">
						<KChangeOption v-model="selectItem.columns" type="tab" />
					</a-form-item>
					<!-- tabs配置 end -->
					<a-form-item label="页签位置">
						<a-radio-group buttonStyle="solid" v-model="options.tabPosition">
							<a-radio value="top">top</a-radio>
							<a-radio value="right">right</a-radio>
							<a-radio value="bottom">bottom</a-radio>
							<a-radio value="left">left</a-radio>
						</a-radio-group>
					</a-form-item>
					<!-- 页签位置 end -->
					<!-- 页签类型 start -->
					<a-form-item label="页签类型">
						<a-radio-group buttonStyle="solid" v-model="options.type">
							<a-radio-button value="line">line</a-radio-button>
							<a-radio-button value="card">card</a-radio-button>
							<a-radio-button value="editable-card">editable-card</a-radio-button>
						</a-radio-group>
					</a-form-item>
					<!-- 页签类型 end -->
					<!-- 页签大小 start -->
					<a-form-item label="大小">
						<a-radio-group buttonStyle="solid" v-model="options.size">
							<a-radio-button value="large">large</a-radio-button>
							<a-radio-button value="default">default</a-radio-button>
							<a-radio-button value="small">small</a-radio-button>
						</a-radio-group>
					</a-form-item>
					<!-- 页签大小 end -->
					<!-- 操作属性 start -->
					<a-form-item label="操作属性">
						<KCheckbox v-model="options.animated" label="动画切换" />
					</a-form-item>
					<!-- 操作属性 end -->
				</template>
				<!-- tabs结束 -->
			</a-form>
			<p class="hint-box" v-if="!~['grid', 'tabs'].indexOf(selectItem.type)">选择控件无属性配置</p>
		</div>
		<!-- <div class="close-box" @click="$emit('handleHide')">
			<a-icon type="double-right" />
		</div> -->
	</div>
</template>
<script>
import KChangeOption from '../KChangeOption/index.vue';
import KCheckbox from '@/components/TopVUI/k-form-design/packages/KCheckbox/index.vue';

export default {
	name: 'formItemProperties',
	data() {
		return {
			options: {},
			activeKey: 1,
		};
	},
	watch: {
		selectItem(val) {
			this.options = val.options || {};
		},
	},
	props: {
		selectItem: {
			type: Object,
			required: true,
		},
		hideModel: {
			type: Boolean,
			default: true,
		},
		tName: {
			type: String,
		},
	},
	components: {
		KChangeOption,
		KCheckbox,
	},
	methods: {
		changeDataType(e, ty) {
			// let type = '';
			// if (ty === 0) {
			// 	type = e;
			// } else {
			// 	type = e.target.value;
			// }
			// let optionsList = [];
			// if (type === 'static') {
			// 	this.options.options = this.options.staticList;
			// } else if (type === 'dynamic') {
			// 	this.fetchData();
			// } else {
			// 	this.$emit('get-code-data', this.selectItem);
			// }
			// this.$set(this.selectItem, 'options', this.options)
			this.fetchData();
		},
		changeTextColor(val) {
			this.options.textColor = val;
			console.log(this.options);
		},
		fetchData() {
			// console.log(123);
			if (this.options.method && this.options.url) {
				this.$emit('fetch-data', this.selectItem);
			}
		},
		handleChangeCol(e) {
			this.options.col.xs = this.options.col.sm = this.options.col.md = this.options.col.lg = this.options.col.xl = this.options.col.xxl = e;

			// this.config.wrapperCol.xs = this.config.wrapperCol.sm = this.config.wrapperCol.md = this.config.wrapperCol.lg = this.config.wrapperCol.xl = this.config.wrapperCol.xxl =
			// 	24 - e;
		},
		changeFormType(val) {},
	},
};
</script>
<style scoped="scoped">
.right .ant-form-item-control {
	line-height: 32px !important;
}
</style>
