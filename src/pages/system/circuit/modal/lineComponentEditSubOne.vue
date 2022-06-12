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
						<a-form-item label="具体地址信息" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input disabled v-decorator="['locationInformation']" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="所属生产业务" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input disabled v-decorator="['belongEdproduction']" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="点类别" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<!-- <TDictSelectTag placeholder="请选择" dictCode="pointType" v-decorator="['pointType']"
								@change="changePointType"></TDictSelectTag> -->
							<TDictSelectTag disabled placeholder="请选择" dictCode="pointType" v-decorator="['pointType']">
							</TDictSelectTag>
						</a-form-item>
					</a-col>
					<!-- <a-col class="gutter-row" :span="12">
						<a-form-item label="城市" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<TSearchSelectTag v-decorator="['pointCity']" :dictOptions="cityOptions"
								@change="changePointCity">
							</TSearchSelectTag>
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="位置点编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['pointCode']" />
						</a-form-item>
					</a-col> -->
					<a-col class="gutter-row" :span="12">
						<a-form-item label="自定义名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input disabled v-decorator="['customizeName']" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="客户全称" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input disabled v-decorator="['fullname']" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="经度" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input disabled v-decorator="['longitude']" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="纬度" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input disabled v-decorator="['latitude']" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="客户字号简称" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input disabled v-decorator="['abbreviation']" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="隶属集团" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input disabled v-decorator="['affiliatedgroup']" />
						</a-form-item>
					</a-col>
				<!-- </a-row> -->
				<!-- <a-row :gutter="16"> -->
					<a-col class="gutter-row" :span="12">
						<a-form-item label="省市区" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<TAreaLinkage disabled v-decorator="['districtId']" :url="url" @change="pcdChange"></TAreaLinkage>
						</a-form-item>
					</a-col>
				<!-- </a-row>
				<a-row :gutter="16"> -->
					<a-col class="gutter-row" :span="12">
						<a-form-item label="镇" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input disabled v-decorator="['township']" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="路牌号" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input disabled v-decorator="['roadNumber']" />
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
		'locationInformation',
		'belongEdproduction',
		'pointType',
		'customizeName',
		'fullname',
		'longitude',
		'latitude',
		'abbreviation',
		'affiliatedgroup',
		'districtId',
		'township',
		'roadNumber'
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
				this.$get(`/bdata/lineLine/getLocationPointInfo?uuid=${e}`).then((res) => {
					console.log(res)
					if (res.statusCode !== 300) {
						
						const eData = res.data[0];
						console.log('输出:',eData);
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
				console.log('exportpcd:',e);
			}
		},
		created() {
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
