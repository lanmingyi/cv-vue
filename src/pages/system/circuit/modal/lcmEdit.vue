<template>
	<t-modal title="新增/编辑" :width="1366" :visible="visible" :switchFullscreen="true" :confirmLoading="loading" @ok="
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
					<a-col class="gutter-row" :span="12">
						<a-form-item label="所属生产业务" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input
								v-decorator="['belongEdproduction',{rules: [{required:true,message:'请输入所属生产业务'},],},]" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="点类别" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<TDictSelectTag placeholder="请选择" dictCode="pointType"
								v-decorator="['pointType',{rules: [{required:true,message:'请选择点类别'},],},]"
								@change="changePointType"></TDictSelectTag>
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="城市" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<t-dict-select-search-tag :url="url1" :params="params" :async="true"
								v-decorator="['pointCity']" @change="changePointCity" dataType="dynamic">
							</t-dict-select-search-tag>
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="位置点编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input disabled
								v-decorator="['pointCode',{rules: [{required:true,message:'请选择点类别和城市生成位置点编码'},],},]" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="具体地址信息" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input
								v-decorator="['locationInformation',{rules: [{required:true,message:'请填写具体地址信息'},],},]" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="自定义名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['customizeName',{rules: [{required:true,message:'请填写自定义名称'},],},]" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="客户全称" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['fullname',{rules: [{required:true,message:'请填写客户全称'},],},]" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="经度" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input
								v-decorator="['longitude',{rules: [{required:true,pattern: new RegExp(/^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/),message:'请填写正确的数字1'},],},]" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="纬度" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input
								v-decorator="['latitude',{rules: [{required:true,pattern: new RegExp(/^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/),message:'请填写正确的数字'},],},]" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="客户字号简称" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['abbreviation',{rules: [{required:true,message:'请填写客户字号简称'},],},]" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="隶属集团" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input
								v-decorator="['affiliatedgroup',{rules: [{required:true,message:'请填写隶属集团'},],},]" />
						</a-form-item>
					</a-col>
					<!-- </a-row> -->
					<!-- <a-row :gutter="16"> -->
					<a-col class="gutter-row" :span="12">
						<a-form-item label="省市区" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<TAreaLinkage @change='selectArea' :value="districtI"
								v-decorator="['districtId',{rules: [{required:true,message:'请填写省市区'},],},]">
							</TAreaLinkage>
						</a-form-item>
					</a-col>
					<!-- </a-row> -->
					<!-- <a-row :gutter="16"> -->
					<a-col class="gutter-row" :span="12">
						<a-form-item label="镇" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['township']" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="路牌号" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['roadNumber']" />
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
		</a-spin>
	</t-modal>
</template>

<script>
	import pick from "lodash.pick";
	import {
		TDictSelectTag,
		TDictSelectSearchTag,
		TAreaLinkage
	} from "@/components";
	// 表单字段
	const fields = [
		"uuid",
		"belongEdproduction",
		"pointType",
		"pointCode",
		"locationInformation",
		"customizeName",
		"longitude",
		"latitude",
		"fullname",
		"abbreviation",
		"affiliatedgroup",
		"province",
		"provinceId",
		"city",
		"cityId",
		"district",
		"districtId",
		"township",
		"roadNumber",
		"pointCity",
	];
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
			url: Object
		},
		components: {
			TDictSelectTag,
			TDictSelectSearchTag,
			TAreaLinkage
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
				cityOptions: [{
						text: "烟台",
						value: "1",
					},
					{
						text: "宁波",
						value: "2",
					},
					{
						text: "北京",
						value: "3",
					},
				],
				form: this.$form.createForm(this),
				url1: this.url.getDicItemByCode,
				post: 'post',
				params: 'code:line_city',
				pointCity: '',
				pointType: '',
				districtI: '',
			};
		},
		methods: {
			add(m, data) {
				console.log(m, data);
			},
			edit(m, data) {
				console.log(m, data);
			},
			changePointType(e) {
				console.log('exportPointType1:', e);
				this.pointType = e;
				if (this.pointCity) {
					this.getPointCode(this.pointType, this.pointCity);
				}
			},
			getPointCode(val1, val2) {
				const url = this.url.getPointCode;
				console.log('val:', val1, val2);
				this.$get(`/bdata/lineLocationPoint/getPointCode?pointType=${val1}&pointCity=${val2}`).then((res) => {
					console.log('exportPointCode:', res);
					this.form.setFieldsValue({
						pointCode: res.data
					})
					// this.pointCodeOptions = res.data;
				});
			},
			changePointCity(e) {
				console.log('exportPointCity:', e);
				this.pointCity = e;
				if (this.pointType) {
					this.getPointCode(this.pointType, this.pointCity);
				}
			},
			selectArea(e) {
				console.log('exArea:', e);
				this.form.setFieldsValue({
					provinceId: e[0],
					cityId: e[1],
					districtId: e[2]
				})
			}
		},
		created() {
			const url = this.url.locationPoint;
			// // console.log('param:',requestParameters);
			// this.$get(url,{level_id}).then((res) => {
			// 	this.pointCodeOptions = res.data;
			// });
			// 防止表单未注册
			fields.forEach((v) => this.form.getFieldDecorator(v));
			// 当 model 发生改变时，为表单设置值
			this.$watch("model", () => {
				console.log('model:',this.model);
				this.districtI = this.model.districtId;
				this.model && this.form.setFieldsValue(pick(this.model, fields));
			});
		},
	};
</script>
