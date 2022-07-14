<template>
	<div class="properties-centent kk-checkbox">
		<!-- 		<div class="head-title">
			表单属性设置
		</div> -->
		<div class="properties-body">
			<a-form labelAlign="left">
				<a-form-item label="">
					<kCheckbox v-model="config.print" label="表单打印" />
				</a-form-item>
				<a-form-item v-if="typeof config.layout !== 'undefined'" label="表单布局" :labelCol="labelCol" :wrapperCol="wrapperCol">
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
				<!-- <a-form-item label="表格样式">
          <kCheckbox v-model="config.tableStyle" label="启用表格样式" />
          <kCheckbox v-model="config.formBorder" label="隐藏组件边框样式" />
        </a-form-item> -->
				<a-form-item v-if="typeof config.layout !== 'undefined'" label="标签对齐" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-radio-group buttonStyle="solid" v-model="config.labelAlign">
						<a-radio-button value="left">左对齐</a-radio-button>
						<a-radio-button value="right">右对齐</a-radio-button>
					</a-radio-group>
				</a-form-item>
				<a-form-item label="labelCol（水平布局生效）">
					<div class="change-col-box">
						<a-slider id="test" :max="24" :min="0" v-model="config.labelCol.xs" @change="handleChangeCol" />
						<a-col :span="12">
							<a-form-item label="xs" class="flex" :labelCol="layLabelCol" :wrapperCol="layWrapperCol">
								<a-input-number v-model="config.labelCol.xs" placeholder="<576px" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="sm" class="flex" :labelCol="layLabelCol" :wrapperCol="layWrapperCol">
								<a-input-number v-model="config.labelCol.sm" placeholder="≥576px" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="md" class="flex" :labelCol="layLabelCol" :wrapperCol="layWrapperCol">
								<a-input-number v-model="config.labelCol.md" placeholder="≥768px" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="lg" class="flex" :labelCol="layLabelCol" :wrapperCol="layWrapperCol">
								<a-input-number v-model="config.labelCol.lg" placeholder="≥992px" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="xl" class="flex" :labelCol="layLabelCol" :wrapperCol="layWrapperCol">
								<a-input-number v-model="config.labelCol.xl" placeholder="≥1200px" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="xxl" class="flex" :labelCol="layLabelCol" :wrapperCol="layWrapperCol">
								<a-input-number v-model="config.labelCol.xxl" placeholder="≥1600px" />
							</a-form-item>
						</a-col>
					</div>
				</a-form-item>
				<a-form-item label="wrapperCol（水平布局生效）">
					<div class="change-col-box">
						<a-col :span="12">
							<a-form-item label="xs" class="flex" :labelCol="layLabelCol" :wrapperCol="layWrapperCol">
								<a-input-number v-model="config.wrapperCol.xs" placeholder="<576px" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="sm" class="flex" :labelCol="layLabelCol" :wrapperCol="layWrapperCol">
								<a-input-number v-model="config.wrapperCol.sm" placeholder="≥576px" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="md" class="flex" :labelCol="layLabelCol" :wrapperCol="layWrapperCol">
								<a-input-number v-model="config.wrapperCol.md" placeholder="≥768px" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="lg" class="flex" :labelCol="layLabelCol" :wrapperCol="layWrapperCol">
								<a-input-number v-model="config.wrapperCol.lg" placeholder="≥992px" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="xl" class="flex" :labelCol="layLabelCol" :wrapperCol="layWrapperCol">
								<a-input-number v-model="config.wrapperCol.xl" placeholder="≥1200px" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="xxl" class="flex" :labelCol="layLabelCol" :wrapperCol="layWrapperCol">
								<a-input-number v-model="config.wrapperCol.xxl" placeholder="≥1600px" />
							</a-form-item>
						</a-col>
					</div>
				</a-form-item>
				<a-form-item label="预览模态框宽度" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input-number style="width:100%;" v-model="config.width" />
				</a-form-item>
				<a-form-item label="表单CSS" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input v-model="config.customStyle" />
				</a-form-item>
				<a-form-item label="取消按钮文本" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input v-model="config.cancelText" />
				</a-form-item>
				<a-form-item label="确定按钮文本" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-input v-model="config.okText" />
				</a-form-item>
				<a-form-item label="表单属性" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<kCheckbox v-if="typeof config.hideRequiredMark !== 'undefined'" v-model="config.hideRequiredMark"
						label="隐藏必选标记" />
				</a-form-item>
				<a-form-item label="提示" :labelCol="labelCol" :wrapperCol="wrapperCol">
					实际预览效果请点击预览查看
				</a-form-item>
			</a-form>
		</div>
	</div>
</template>
<script>
	/*
	 * author lmy
	 * date 2019-11-20
	 * description 表单属性设置面板组件
	 */
	import kCheckbox from "../../KCheckbox/index.vue";
	export default {
		name: "formProperties",
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
				layLabelCol: {
					xs: {
						span: 24,
					},
					sm: {
						span: 5,
					},
				},
				layWrapperCol: {
					xs: {
						span: 24,
					},
					sm: {
						span: 19,
					},
				},
			}
		},
		components: {
			kCheckbox,
		},
		props: {
			config: {
				type: Object,
				required: true,
			},
		},
		methods: {
			handleChangeCol(e) {
				this.config.labelCol.xs = this.config.labelCol.sm = this.config.labelCol.md = this.config.labelCol.lg =
					this.config.labelCol.xl = this.config.labelCol.xxl = e;

				this.config.wrapperCol.xs = this.config.wrapperCol.sm = this.config.wrapperCol.md = this.config.wrapperCol
					.lg = this.config.wrapperCol.xl = this.config.wrapperCol.xxl =
					24 - e;
			},
			changeAlign(e){
				this.config.labelAlign = e.target.value
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
