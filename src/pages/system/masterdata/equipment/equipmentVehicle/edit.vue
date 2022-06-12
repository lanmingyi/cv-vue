<template>
	<t-modal title="新增/编辑" :width="1366" :visible="visible" :switchFullscreen="true" :confirmLoading="loading"
		@ok="() => { $emit('ok') }" @cancel="() => { $emit('cancel') }">
		<a-spin :spinning="loading">
			<a-form :form="form">
				<a-row :gutter="16">
					<a-form-item class="hiddenItem">
						<a-input v-decorator="['uuid']" disabled type="hidden" />
					</a-form-item>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="设备号" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['platenumber',{rules: [{required: false,message: '请输入正确参数'}] }]" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="首选业务类别" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<!--              <TDictSelectTag placeholder="请选择首选业务类别" dictCode="${column.dictionariesCode}" v-decorator="['firstBusinessType',
                                     {rules: [{required: false,message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>-->
							<tree-dict-select-tag v-decorator="['firstBusinessType',
                                     {rules: [{required: false,message: '请输入正确参数'
                                     }] }]" type="select" codeSetId="sxywlb" levelId="4" placeholder="请选择"
								@change="changeTreeCode" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="业务类别2" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['secondBusinessType',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="车辆大类" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<!--              <TDictSelectTag placeholder="请选择车辆大类" dictCode="${column.dictionariesCode}" v-decorator="['carType',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>-->
							<tree-dict-select-tag v-decorator="['carType',
                                     {rules: [{required: false,message: '请输入正确参数'
                                     }] }]" type="select" codeSetId="cldl" levelId="4" placeholder="请选择"
								@change="changeTreeCode" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="车辆分类1" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<tree-dict-select-tag v-if="classShow" v-decorator="['carTypeOne',
				                       {rules: [{required: false,message: '请输入正确参数'
				                       }] }]" type="select" :codeSetId="codeSetIDCar1" levelId="4" placeholder="请选择" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="车辆分类2" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<tree-dict-select-tag v-if="classShow" v-decorator="['carTypeTwo',
							           {rules: [{required: false,message: '请输入正确参数'
							           }] }]" type="select" :codeSetId="codeSetIDCar2" levelId="4" placeholder="请选择" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="轴车型" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<tree-dict-select-tag v-if="classShow" v-decorator="['axisType',
							           {rules: [{required: false,message: '请输入正确参数'
							           }] }]" type="select" :codeSetId="codeSetIDAxis" levelId="4" placeholder="请选择" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="箱车型" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<tree-dict-select-tag v-if="classShow" v-decorator="['tankType',
							           {rules: [{required: false,message: '请输入正确参数'
							           }] }]" type="select" :codeSetId="codeSetIDTank" levelId="4" placeholder="请选择" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="特种设备类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<tree-dict-select-tag v-if="classShow" v-decorator="['specialType',
							           {rules: [{required: false,message: '请输入正确参数'
							           }] }]" type="select" :codeSetId="codeSetIDSpecial" levelId="4" placeholder="请选择" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="设备安全分类" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['fitMediumType',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="适装品类" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<TDictSelectTag placeholder="请选择适装品类" dictCode="${column.dictionariesCode}" v-decorator="['power',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="适装介质" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<TDictSelectTag placeholder="请选择适装介质" dictCode="${column.dictionariesCode}" v-decorator="['economicSpeedType',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="动力" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<TDictSelectTag placeholder="请选择动力" dictCode="${column.dictionariesCode}" v-decorator="['securityType',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="经济时速类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<TDictSelectTag placeholder="请选择经济时速类型" dictCode="${column.dictionariesCode}" v-decorator="['fitProductType',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="排放" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<TDictSelectTag placeholder="请选择排放" dictCode="${column.dictionariesCode}" v-decorator="['discharge',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="营运性" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<TDictSelectTag placeholder="请选择营运性" dictCode="${column.dictionariesCode}" v-decorator="['operationType',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="平板/高低板" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<TDictSelectTag placeholder="请选择平板/高低板" dictCode="${column.dictionariesCode}" v-decorator="['boardType',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
						</a-form-item>
					</a-col>

					<a-col class="gutter-row" :span="12">
						<a-form-item label="准入时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<t-date placeholder="请选择准入时间" v-decorator="['accessTimes',
                                      {rules: [{required: false,
                                        message: '请输入正确参数'
                                      }] }]" style="width: 100%;" :trigger-change="true"
								dateFormat="YYYY-MM-DD HH:mm:ss" />
						</a-form-item>
					</a-col>

					<a-col class="gutter-row" :span="12">
						<a-form-item label="准入天数" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['accessDays',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="所有权" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<TDictSelectTag placeholder="请选择所有权" dictCode="${column.dictionariesCode}" v-decorator="['ownership',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="行驶证号" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['drivingLicenseNumber',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="行驶证有效期" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<t-date placeholder="请选择准入时间" v-decorator="['drivingLicenseTerm',
                                      {rules: [{required: false,
                                        message: '请输入正确参数'
                                      }] }]" style="width: 100%;" :trigger-change="true"
								dateFormat="YYYY-MM-DD HH:mm:ss" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="行驶证上传" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['drivingLicenseUpload',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="营运证号" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['taxiLicenseNumber',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="营运证有效期" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<t-date placeholder="请选择准入时间" v-decorator="['taxiLicenseTerm',
                                      {rules: [{required: false,
                                        message: '请输入正确参数'
                                      }] }]" style="width: 100%;" :trigger-change="true"
								dateFormat="YYYY-MM-DD HH:mm:ss" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="营运证上传" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['taxiUpload',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="营运范围" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['taxiRange',
                                     {rules: [{ required: false,
                                       message: '请输入正确参数'
                                     }] }]" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="所有权登记主体" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['ownershipSubject',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="实际所有人" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['actualOwner',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="实际管理人" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['actualManager',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="具体长度" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['specificLength',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="皮重(吨)" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['tare',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="额定载重量(吨)" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['ratedLoadCapacity',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="牵引座高度" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['tractionSeatHeight',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="牵引销型号" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<TDictSelectTag placeholder="请选择牵引销型号" dictCode="${column.dictionariesCode}" v-decorator="['tractionPinModel',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="是否有接料槽" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<TDictSelectTag placeholder="请选择是否有接料槽" dictCode="${column.dictionariesCode}" v-decorator="['ifReceivingChute',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
						</a-form-item>
					</a-col>

					<a-col class="gutter-row" :span="12">
						<a-form-item label="首次运行时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<t-date placeholder="请选择首次运行时间" v-decorator="['firstRunTime',
                                      {rules: [{required: false,
                                        message: '请输入正确参数'
                                      }] }]" style="width: 100%;" :trigger-change="true"
								dateFormat="YYYY-MM-DD HH:mm:ss" />
						</a-form-item>
					</a-col>

					<a-col class="gutter-row" :span="12">
						<a-form-item label="报废时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<t-date placeholder="请选择报废时间" v-decorator="['scrapTime',
                                      {rules: [{required: false,
                                        message: '请输入正确参数'
                                      }] }]" style="width: 100%;" :trigger-change="true"
								dateFormat="YYYY-MM-DD HH:mm:ss" />
						</a-form-item>
					</a-col>

					<a-col class="gutter-row" :span="12">
						<a-form-item label="车架号" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['frameNumber',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="设备品牌" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['equipmentBrand',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['remark',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]" />
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<TDictSelectTag placeholder="请选择状态" dictCode="${column.dictionariesCode}" v-decorator="['status',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
						</a-form-item>
					</a-col>
					<a-col class="gutter-row" :span="12">
						<a-form-item label="最近未运行天数" :labelCol="labelCol" :wrapperCol="wrapperCol">
							<a-input v-decorator="['notRunningDays',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]" />
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
		'platenumber',
		'firstBusinessType',
		'secondBusinessType',
		'carType',
		'carTypeOne',
		'carTypeTwo',
		'axisType',
		'tankType',
		'specialType',
		'fitMediumType',
		'power',
		'economicSpeedType',
		'securityType',
		'fitProductType',
		'discharge',
		'operationType',
		'boardType',
		'accessTimes',
		'accessDays',
		'ownership',
		'drivingLicenseNumber',
		'drivingLicenseTerm',
		'drivingLicenseUpload',
		'taxiLicenseNumber',
		'taxiLicenseTerm',
		'taxiUpload',
		'taxiRange',
		'ownershipSubject',
		'actualOwner',
		'actualManager',
		'specificLength',
		'tare',
		'ratedLoadCapacity',
		'tractionSeatHeight',
		'tractionPinModel',
		'ifReceivingChute',
		'firstRunTime',
		'scrapTime',
		'frameNumber',
		'equipmentBrand',
		'remark',
		'status',
		'notRunningDays',
		'creatorId',
		'creator',
		'createTime',
		'modifierId',
		'modifier',
		'modifyTime',
		'creatorOrgId'
	]
	import TDictSelectTag from '@comp/TopVUI/dict/TDictSelectTag'
	import TMultiSelectTag from '@comp/TopVUI/dict/TMultiSelectTag'
	import {
		TreeDictSelectTag,
	} from "@/components";

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
			}
		},
		components: {
			TDictSelectTag,
			TMultiSelectTag,
			TreeDictSelectTag
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
				codeSetIDCar1: '',
				codeSetIDCar2: '',
				codeSetIDAxis: '',
				codeSetIDTank: '',
				codeSetIDSpecial: '',
				classShow: true,
				form: this.$form.createForm(this)
			}
		},
		methods: {
			add(m, data) {
				console.log(m, data)
			},
			edit(m, data) {
				console.log(m, data)
			},
			changeTreeCode(e) {
				console.log(e);
				if (e == '87A3A1E5A0AB40A98B2F7A8B74D8469E') {
					this.codeSetIDCar1 = 'clfl1';
					this.codeSetIDCar2 = 'clfl2';
					this.codeSetIDAxis = 'zcx';
					this.codeSetIDTank = 'xcx';
					this.codeSetIDSpecial = 'tzsblx';
					this.refresh();
				}else {
					this.codeSetIDCar1 = '';
					this.codeSetIDCar2 = '';
					this.codeSetIDAxis = '';
					this.codeSetIDTank = '';
					this.codeSetIDSpecial = '';
					this.refresh();
				}
			},
			refresh() {
				this.classShow = false;
				this.$nextTick(function() {
					this.classShow = true;
				});
			},
		},
		created() {
			// 防止表单未注册
			fields.forEach(v => this.form.getFieldDecorator(v))
			// 当 model 发生改变时，为表单设置值
			this.$watch('model', () => {
				this.model && this.form.setFieldsValue(pick(this.model, fields))
			})
		}
	}
</script>
