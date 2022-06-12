<template>
	<t-modal title="发布" :width="640" :visible="visible" :confirmLoading="loading" @ok="
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
				<a-form-item label="分类" :labelCol="labelCol" :wrapperCol="wrapperCol">
					<a-select v-decorator="[
              'categoryCode',
              {
                rules: [
                  { required: true, min: 1, message: '请先选择一条数据！' },
                ],
              },
            ]">
						<a-select-option v-for="item in categoryList" :value="item.categoryCode">
							{{ item.categoryName }}
						</a-select-option>
					</a-select>
					<a-input v-decorator="['modelId']" type="hidden" />
					<a-input v-decorator="['procdefId']" type="hidden" />
				</a-form-item>
			</a-form>
		</a-spin>
	</t-modal>
</template>

<script>
	import pick from "lodash.pick";
	// 表单字段
	const fields = ["modelId", "categoryCode", "procdefId"];

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
				id: "",
				categoryList: [],
			};
		},
		created() {
			fields.forEach((v) => this.form.getFieldDecorator(v));
			this.$watch("model", () => {
				this.model && this.form.setFieldsValue(pick(this.model, fields));
			});
		},
		methods: {
			getList() {
				this.$post("/workflow/flowCategory/getAllData").then((res) => {
					this.categoryList = res;
				});
			},
		},
	};
</script>
