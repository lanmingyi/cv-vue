<!--
 * @Description: 表单属性设置
 * @Author: 黄婷
 * @Date: 2021-06-02 13:38:08
 * @LastEditTime: 2021-09-14 09:14:14
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\k-form-design\packages\KFormDesign\module\formProperties.vue
-->
<template>
	<div class="properties-centent kk-checkbox">
		<!-- <div class="head-title">
      表单属性设置
    </div> -->
		<div class="properties-body">
			<a-form labelAlign="left">
				<a-form-item label="">
					<kCheckbox v-model="config.print" label="表单打印" />
				</a-form-item>
				<a-form-item v-if="typeof config.layout !== 'undefined'" label="表单布局" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<a-radio-group buttonStyle="solid" v-model="config.layout">
						<a-radio-button value="horizontal">水平</a-radio-button>
						<a-radio-button value="vertical">垂直</a-radio-button>
						<a-radio-button value="inline">行内</a-radio-button>
					</a-radio-group>
					<!-- <a-radio-group buttonStyle="solid" v-model="config.columns">
            <a-radio-button value="one">一列</a-radio-button>
              <a-radio-button value="two">两列</a-radio-button>
            </a-radio-group> -->
				</a-form-item>
				<!-- <a-form-item label="表格样式" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <kCheckbox v-model="config.tableStyle" label="启用表格样式" />
          <kCheckbox v-model="config.formBorder" label="隐藏组件边框样式" />
        </a-form-item> -->
				<a-form-item v-if="typeof config.layout !== 'undefined'" label="标签对齐" :labelCol="labelCol"
					:wrapperCol="wrapperCol">
					<a-radio-group buttonStyle="solid" v-model="config.labelAlign">
						<a-radio-button value="left">左对齐</a-radio-button>
						<a-radio-button value="right">右对齐</a-radio-button>
					</a-radio-group>
				</a-form-item>
				<a-form-item label="标签布局" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<div class="change-col-box">
						<a-slider id="test" :max="24" :min="0" v-model="config.labelCol.xs" @change="handleChangeCol" />
						<!-- <div>
              <label>xs:</label>
              <a-input-number v-model="config.labelCol.xs" />
            </div>
            <div>
              <label>sm:</label>
              <a-input-number v-model="config.labelCol.sm" />
            </div>
            <div>
              <label>md:</label>
              <a-input-number v-model="config.labelCol.md" />
            </div>
            <div>
              <label>lg:</label>
              <a-input-number v-model="config.labelCol.lg" />
            </div>
            <div>
              <label>xl:</label>
              <a-input-number v-model="config.labelCol.xl" />
            </div>
            <div>
              <label>xxl:</label>
              <a-input-number v-model="config.labelCol.xxl" />
            </div> -->
					</div>
				</a-form-item>
				<!-- <a-form-item label="wrapperCol（水平布局生效）" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <div class="change-col-box">
            <div>
              <label>xs:</label>
              <a-input-number v-model="config.wrapperCol.xs" />
            </div>
            <div>
              <label>sm:</label>
              <a-input-number v-model="config.wrapperCol.sm" />
            </div>
            <div>
              <label>md:</label>
              <a-input-number v-model="config.wrapperCol.md" />
            </div>
            <div>
              <label>lg:</label>
              <a-input-number v-model="config.wrapperCol.lg" />
            </div>
            <div>
              <label>xl:</label>
              <a-input-number v-model="config.wrapperCol.xl" />
            </div>
            <div>
              <label>xxl:</label>
              <a-input-number v-model="config.wrapperCol.xxl" />
            </div>
          </div>
        </a-form-item> -->
				<a-form-item label="预览模态框宽度" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input-number style="width:100%;" v-model="config.width" />
				</a-form-item>
				<a-form-item label="表单CSS" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input v-model="config.customStyle" />
				</a-form-item>
				<!-- 				<a-form-item label="取消按钮文本">
				  <a-input v-model="config.cancelText" />
				</a-form-item>
				<a-form-item label="确定按钮文本">
				  <a-input v-model="config.okText" />
				</a-form-item> -->
				<a-form-item label="表单属性" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<kCheckbox v-if="typeof config.hideRequiredMark !== 'undefined'" v-model="config.hideRequiredMark"
						label="隐藏必选标记" />
				</a-form-item>
				<a-form-item label="提示" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<span>实际预览效果请点击预览查看</span>
				</a-form-item>
			</a-form>
		</div>
	</div>
</template>
<script>
	/*
	 * author 黄婷
	 * date 2019-11-20
	 * description 表单属性设置面板组件
	 */
	import kCheckbox from "../../KCheckbox/index.vue";
	export default {
		name: "formProperties",
		components: {
			kCheckbox,
		},
		props: {
			config: {
				type: Object,
				required: true,
			},
		},
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
						span: 17,
					},
				},
			}
		},
		methods: {
			handleChangeCol(e) {
				this.config.labelCol.xs = this.config.labelCol.sm = this.config.labelCol.md = this.config.labelCol.lg =
					this.config.labelCol.xl = this.config.labelCol.xxl = e;

				this.config.wrapperCol.xs = this.config.wrapperCol.sm = this.config.wrapperCol.md = this.config.wrapperCol
					.lg = this.config.wrapperCol.xl = this.config.wrapperCol.xxl =
					24 - e;
			},
		},
	};
</script>
<style lang="less" scoped>
	.change-col-box {
		>div {
			padding: 5px;
			display: flex;

			>label {
				text-align: right;
				padding-right: 8px;
				display: block;
				font-size: 16px;
				width: 45px;
			}
		}
	}
</style>
