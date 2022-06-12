<template>
	<t-modal title="新增/编辑" :width="1366" :visible="visible" :confirmLoading="loading" @ok="() => { $emit('ok') }"
		@cancel="() => { $emit('cancel') }">
		<a-spin :spinning="loading">
			<a-form :form="form">
				<a-row :gutter="16">
					<a-form-item class="hiddenItem">
						<!-- uuid隐藏 -->
						<a-input v-decorator="['uuid']" type="hidden" />
					</a-form-item>
					<a-form-item class="hiddenItem">
						<!-- uuid隐藏 -->
						<a-input v-decorator="['puuid']" type="hidden" />
					</a-form-item>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="序号" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input disabled v-decorator="['orderNo']" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item style="margin-right: 15px;" label="位置点编码" :labelCol="labelCol"
							:wrapperCol="wrapperCol">
							<TSearchSelectTag v-decorator="['pointCode']" :dictOptions="pointCodeOptions" :syn="true"
								@change="getPointInfo">
							</TSearchSelectTag>
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="应用设定(多选)" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<t-multi-select-tag v-decorator="['departurePlaceInformation']"
								dictCode="applicationSettings" placeholder="请选择">
							</t-multi-select-tag>
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="驾驶员操作说明" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['destinationInformation']" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="距上个位置点里程" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['departureplaceMileage']" />
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
		</a-spin>
	</t-modal>
</template>

<script>
	import pick from 'lodash.pick'
	// 表单字段
	const fields = [
		'uuid',
		'orderNo',
		'pointCode',
		'departurePlaceInformation',
		'departureplaceMileage',
		'destinationInformation'
	];
	import TDictSelectTag from '@/components/TopVUI/dict/TDictSelectTag';
	import TSearchSelectTag from "@/components/TopVUI/dict/TSearchSelectTag";
	import TAreaLinkage from "@/components/TopVUI/custom/TAreaLinkage";
	import TMultiSelectTag from "@/components/TopVUI/dict/TMultiSelectTag";
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
			},
			url: Object,
		},
		components: {
			TDictSelectTag,
			TSearchSelectTag,
			TAreaLinkage,
			TMultiSelectTag
		},
		data() {
			return {
				title: '',
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
						span: 16
					}
				},
				pointCodeOptions: [],
				// pointCodeOptions: () => {
				// 	console.log('url:');
				// 	return this.pointCodeOptions1;
				// 	const url = this.url.locationPoint;
				// 	// console.log('param:',requestParameters);
				// 	return this.$post(url).then((res) => {
				// 		console.log('exportRes111:', res);
				// 		this.dataSource = res.data.rows;
				// 		return res.data;
				// 	});
				// },
				form: this.$form.createForm(this)
			}
		},
		methods: {
			add(m, data) {
				this.form.setFieldsValue(pick(m, fields)) //新增赋值主表的参数
			},
			edit(m, data) {
				console.log(m, data)
			},
			getPointInfo(e) {
				console.log('exportPointInfo666:', e);
				this.$get(`/line/lineLine/getLocationPointInfo?uuid=${e}`).then((res) => {
					console.log(res)
					if (res.statusCode !== 300) {

						const eData = res.data[0];
						console.log('输出:', eData);
						this.form.setFieldsValue({
							departurePlaceInformation: '',
							locationInformation: eData.locationInformation,
							belongEdproduction: eData.belongEdproduction,
							pointType: eData.pointType,
							customizeName: eData.customizeName,
							fullname: eData.fullname,
							longitude: eData.longitude,
							latitude: eData.latitude,
							abbreviation: eData.abbreviation,
							affiliatedgroup: eData.affiliatedgroup,
							districtId: '370611',
							township: eData.township,
							roadNumber: eData.roadNumber
						})
						// this.selectedValue = res.data.text;
					} else {
						this.$message.warning(res.message);
					}
				});
			},
			pcdChange(e) {
				console.log('exportpcd:', e);
			}
		},
		created() {
			console.log('sss:',this.url);
			const url = this.url.locationPoint;
			// // console.log('param:',requestParameters);
			this.$get(url).then((res) => {
				this.pointCodeOptions = res.data;
			});
			// 防止表单未注册
			fields.forEach(v => this.form.getFieldDecorator(v))
			// 当 model 发生改变时，为表单设置值
			this.$watch('model', () => {
				this.model && this.form.setFieldsValue(pick(this.model, fields))
			})
		}
	}
</script>
