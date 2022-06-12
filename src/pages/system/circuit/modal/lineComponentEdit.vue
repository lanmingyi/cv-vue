<template>
	<t-modal title="新增/编辑" :width="640" :visible="visible" :switchFullscreen="true" :confirmLoading="loading" @ok="
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
					<a-form-item class="hiddenItem">
						<!-- uuid隐藏 -->
						<a-input v-decorator="['puuid']" disabled type="hidden" />
					</a-form-item>
					<a-col class="gutter-row" :span="24">
						<a-form-item label="线路组件" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['pointGroupName']" />
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
		</a-spin>
	</t-modal>
</template>

<script>
	import pick from "lodash.pick";
	// 表单字段
	const fields = [
		"uuid",
		"pointGroupName"
	];
	import TDictSelectTag from "@/components/TopVUI/dict/TDictSelectTag";
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
		},
		data() {
			return {
				title: "",
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
			};
		},
		methods: {
			add(m, data) {
				console.log(m, data);
			},
			edit(m, data) {
				console.log(m, data);
			},
		},
		created() {
			// 防止表单未注册
			fields.forEach((v) => this.form.getFieldDecorator(v));
			// 当 model 发生改变时，为表单设置值
			this.$watch("model", () => {
				this.model && this.form.setFieldsValue(pick(this.model, fields));
			});
		},
	};
</script>
