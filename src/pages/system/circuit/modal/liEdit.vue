<template>
	<t-modal title="新增/编辑" :width="1366" :okText="confirmText" :visible="visible" :switchFullscreen="true"
		:confirmLoading="loading" @ok="
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
						<a-form-item label="线路名称	" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['linename']" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="线路类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<TDictSelectTag placeholder="请选择" dictCode="lineType" v-decorator="['lineType']">
							</TDictSelectTag>
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="车辆类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<TDictSelectTag placeholder="请选择" dictCode="carType" v-decorator="['carType']">
							</TDictSelectTag>
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item style="margin-right: 15px;" label="目的点编码" :labelCol="labelCol"
							:wrapperCol="wrapperCol">
							<TSearchSelectTag v-decorator="['destinationCode']" :dictOptions="destinationCodeOptions">
							</TSearchSelectTag>
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item style="margin-right: 15px;" label="出发点编码" :labelCol="labelCol"
							:wrapperCol="wrapperCol">
							<TSearchSelectTag v-decorator="['departureplaceCode']"
								:dictOptions="departureplaceCodeOptions">
							</TSearchSelectTag>
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="目的点具体地址信息" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['destinationInformation']" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="出发点具体地址信息" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['departureplaceInformation']" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="目的点省市市际线路解析" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['destinationAnalysis']" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="出发点省市市际线路解析" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['departureplaceAnalysis']" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="目的点客户名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['destinationCustomer']" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="出发点客户名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['departureplaceCustomer']" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="收货客户所属集团" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['receivingCustomerGroup']" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="发货客户所属集团	" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['deliverCustomerGroup']" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="司机结算里程" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['driverMileage']" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="客户结算里程" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['customerMileage']" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="线路实际高速里程" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['actualHighwayMileage']" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="线路实际下道里程" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['actualUnderwayMileage']" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="分包商结算里程" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['subcontractorrMileage']" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['remark']" />
						</a-form-item>
					</a-col>

					<!-- <a-col class="gutter-row" :span="12">
						<a-form-item label="导入位置点" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['name']" />
						</a-form-item>
					</a-col> -->

				</a-row>
				<a-row v-if="importShow" style="border-style:solid;border-width:1px;">
					<a-col class="gutter-row" :span="12">
						<a-form-item label="导入位置点" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<t-dict-select-tag v-decorator="['type']" :dataList="dataList" placeholder="请选择"
								@change="changeVal" dataType="static" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item :label="importLableName" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<TSearchSelectTag v-if="selectPointShow" v-decorator="['importPoint']" @change="selectPoint"
								:dictOptions="importLocationPoints">
							</TSearchSelectTag>
						</a-form-item>
					</a-col>
					<a-col style="float: right;" :span="6">
						<!-- <a-button @importL="() => {$emit('importL',importQueryParam);}">导入位置点</a-button> -->
						<a-button @click="importLocationPoint">导入位置点</a-button>
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
		TSearchSelectTag
	} from "@/components";
	// 表单字段
	const fields = [
		"uuid",
		"linename",
		"lineType",
		"carType",
		"departureplaceCode",
		"destinationCode",
		"departureplaceInformation",
		"destinationInformation",
		"departureplaceAnalysis",
		"destinationAnalysis",
		"departureplaceCustomer",
		"destinationCustomer",
		"deliverCustomerGroup",
		"receivingCustomerGroup",
		"customerMileage",
		"driverMileage",
		"subcontractorrMileage",
		"actualHighwayMileage",
		"actualUnderwayMileage",
		"remark",
		"importPoint"
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
		},
		components: {
			TDictSelectTag,
			TSearchSelectTag,
		},
		data() {
			return {
				title: "",
				labelCol: {
					xs: {
						span: 12,
					},
					sm: {
						span: 5,
					},
				},
				wrapperCol: {
					xs: {
						span: 12,
					},
					sm: {
						span: 16,
					},
				},
				form: this.$form.createForm(this),
				destinationCodeOptions: [{
						text: "CD烟台0001-万华烟台工业园",
						value: "1",
					},
					{
						text: "CD青岛0001-青岛澳柯玛新材料",
						value: "2",
					},
					{
						text: "XD烟台0003-福山区疏港西路与S304上海大街路口",
						value: "3",
					},
				],
				departureplaceCodeOptions: [{
						text: "CD烟台0001-万华烟台工业园",
						value: "1",
					},
					{
						text: "CD青岛0001-青岛澳柯玛新材料",
						value: "2",
					},
					{
						text: "XD烟台0003-福山区疏港西路与S304上海大街路口",
						value: "3",
					},
				],
				dataList: [{
						text: "线路组件导入",
						value: "1",
					},
					{
						text: "复制线路位置点",
						value: "2",
					},
				],
				importLocationPoints: [],
				importLableName: '',
				type: '',
				importLocation1: '',
				importShow: false,
				confirmText: '确定',
				importQueryParam: {},
				// typeUrl: '/bdata/lineLine/getImportInfo?type=1'
				typeUrl: '',
				selectPointShow: true
			};
		},
		methods: {
			add(m, data) {
				console.log(m, data);
			},
			edit(m, data) {
				console.log(m, data);
			},
			selectPoint(e) {
				if (this.importQueryParam.type === '1') {
					this.importQueryParam.lineGroupId = e
				} else {
					this.importQueryParam.pid = e
				}
			},
			changeVal(val1) {
				if (val1 === '线路组件导入') {
					this.importQueryParam.type = '1';
					this.importLableName = '选择位置组';
				} else {
					this.importQueryParam.type = '2';
					this.importLableName = '选择线路';
				}
				// this.typeUrl = '/bdata/lineLine/getImportInfo?type=' + val;

				this.$get(`/bdata/lineLine/getImportInfo?type=${this.importQueryParam.type}`).then((res) => {
					this.importLocationPoints = res.data;
					this.refresh();
				});
			},
			refresh() {
				this.selectPointShow = false;
				this.$nextTick(function() {
					this.selectPointShow = true;
				});
			},
			importLocationPoint() {
				console.log('importQueryParam:',this.importQueryParam);
				this.$emit('importL', this.importQueryParam)
			}
		},
		created() {
			// 防止表单未注册
			fields.forEach((v) => this.form.getFieldDecorator(v));
			// 当 model 发生改变时，为表单设置值
			this.$watch("model", () => {
				this.model && this.form.setFieldsValue(pick(this.model, fields));
				this.form.setFieldsValue({
					importPoint: '',
					type: '',
				});
				this.importLocationPoints = [];
				console.log('model:', this.model);
				if (this.model) {
					if (this.model.uuid) {
						this.importShow = true;
						this.confirmText = '确定'
					} else {
						this.importShow = false;
						this.confirmText = '提交并导入位置点'
					}
				}
			});
		},
	};
</script>
