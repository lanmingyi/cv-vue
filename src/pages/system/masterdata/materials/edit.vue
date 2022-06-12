<template>
  <t-modal title="新增/编辑" :width="1366" :visible="visible" :switchFullscreen="true" :confirmLoading="loading"
           @ok="() => { $emit('ok') }"
           @cancel="() => { $emit('cancel') }">
    <a-spin :spinning="loading">
      <a-form :form="form">
        <a-row :gutter="16">
          <a-form-item class="hiddenItem">
            <a-input v-decorator="['uuid']" disabled type="hidden"/>
          </a-form-item>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="物料安全分类1-化学品/危货" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <TDictSelectTag placeholder="" dictCode="${column.dictionariesCode}" v-decorator="['materialSecurityTypeOne',
                                     {rules: [{required: false,message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="物料俗称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['materialCommonly']" />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="SDS全称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['sdsFullName']" />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="代表性物料" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['typicalMaterialFullName']" />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="所属生产方集团" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['belongingProductionGroup']" />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="调度分类-客户产品品名" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['dispatchCustomerProductName']" />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="调度分类-客户产品牌号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['dispatchCustomerProductBrand',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>

          <a-col class="gutter-row" :span="12">
            <a-form-item label="调度分类-我司产品分类1" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <TDictSelectTag placeholder="请选择代表调度分类-我司产品分类1" dictCode="${column.dictionariesCode}" v-decorator="['dispatchOurProductTypeOne',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="调度分类-我司产品分类2" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <TDictSelectTag placeholder="请选择调度分类-我司产品分类2" dictCode="${column.dictionariesCode}" v-decorator="['dispatchOurProductTypeTwo',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="结算分类-分类1级" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <TDictSelectTag placeholder="请选择结算分类-分类1级" dictCode="${column.dictionariesCode}" v-decorator="['settlementTypeOne',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="结算分类-分类2级" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <TDictSelectTag placeholder="请选择结算分类-分类2级" dictCode="${column.dictionariesCode}" v-decorator="['settlementTypeTwo',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="结算分类-所属结算客户" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['settlementBelongingCustomer']" />
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="结算分类-所属客户集团" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['settlementBelongingCustomerGroup']" />
            </a-form-item>
          </a-col>


          <a-col class="gutter-row" :span="12">
            <a-form-item label="温度分类" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <TDictSelectTag placeholder="请选择温度分类" dictCode="${column.dictionariesCode}" v-decorator="['temperatureType',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="危普分类" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <TDictSelectTag placeholder="请选择危普分类" dictCode="${column.dictionariesCode}" v-decorator="['dangerousOrdinaryType',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="危化品分类" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <TDictSelectTag placeholder="请选择危化品分类" dictCode="${column.dictionariesCode}" v-decorator="['chemicalType',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
            </a-form-item>
          </a-col>

          <a-col class="gutter-row" :span="12">
            <a-form-item label="储运形态" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <TDictSelectTag placeholder="请选择储运形态" dictCode="${column.dictionariesCode}" v-decorator="['storageTransportForm',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="危害特性-物理危害" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <TDictSelectTag placeholder="请选择危害特性-物理危害" dictCode="${column.dictionariesCode}" v-decorator="['harmPhysics',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="危害特性-健康危害" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <TDictSelectTag placeholder="请选择危害特性-健康危害" dictCode="${column.dictionariesCode}" v-decorator="['harmHealth',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="危害特性-环境危害" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <TDictSelectTag placeholder="请选择危害特性-环境危害" dictCode="${column.dictionariesCode}" v-decorator="['harmEnvironment',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="危害特性-货品损害" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <TDictSelectTag placeholder="请选择危害特性-货品损害" dictCode="${column.dictionariesCode}" v-decorator="['harmGoods',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="危害特性-其他危害" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <TDictSelectTag placeholder="请选择危害特性-其他危害" dictCode="${column.dictionariesCode}" v-decorator="['harmOther',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="其他特性-储运特性" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <TDictSelectTag placeholder="请选其他特性-储运特性" dictCode="${column.dictionariesCode}" v-decorator="['otherStorageTransport',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
            </a-form-item>
          </a-col>

          <a-col class="gutter-row" :span="12">
            <a-form-item label="保质天数" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['qualityDays',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>

          <a-col class="gutter-row" :span="12">
            <a-form-item label="保质温度" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['qualityTemperature',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="密度" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['density',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="闪点℃" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['flashPoint',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="自燃点℃" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['ignitionPoint',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>

          <a-col class="gutter-row" :span="12">
            <a-form-item label="储运压力Mpa" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['storageTransportPressure',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="储运温度℃" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['storageTransportTemperature',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="粉尘爆炸浓度(mg/m³)" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['dustBlastConcentration',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="安全-危险动作" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <TDictSelectTag placeholder="请选择安全-危险动作" dictCode="${column.dictionariesCode}" v-decorator="['securityDangerAction',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="安全-容器方案" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['securityContainer',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="安全-消防措施" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <TDictSelectTag placeholder="请选择安全-消防措施" dictCode="${column.dictionariesCode}" v-decorator="['securityFireFighting',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
            </a-form-item>
          </a-col>

          <a-col class="gutter-row" :span="12">
            <a-form-item label="安全-急救措施" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <TDictSelectTag placeholder="请选择安全-急救措施" dictCode="${column.dictionariesCode}" v-decorator="['securityFirstAid',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
            </a-form-item>
          </a-col>

          <a-col class="gutter-row" :span="12">
            <a-form-item label="安全-泄露应急措施" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['securityLeakageEmergency',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="安全-接触控制和个人防护" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['securityContactProtect',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="安全-运输信息" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <TDictSelectTag placeholder="请选择安全-运输信息" dictCode="${column.dictionariesCode}" v-decorator="['securityTransportInformation',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="质量" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['quality',
                                     {rules: [{required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
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
  'materialSecurityTypeOne',
  'materialCommonly',
  'sdsFullName',
  'typicalMaterialFullName',
  'belongingProductionGroup',
  'dispatchCustomerProductName',
  'dispatchCustomerProductBrand',
  'dispatchOurProductType1',
  'dispatchOurProductType2',
  'settlementType1',
  'settlementType2',
  'settlementBelongingCustomer',
  'settlementBelongingCustomerGroup',
  'temperatureType',
  'dangerousOrdinaryType',
  'chemicalType',
  'storageTransportForm',
  'harmPhysics',
  'harmHealth',
  'harmEnvironment',
  'harmGoods',
  'harmOther',
  'otherStorageTransport',
  'qualityDays',
  'qualityTemperature',
  'density',
  'flashPoint',
  'ignitionPoint',
  'storageTransportPressure',
  'storageTransportTemperature',
  'dustBlastConcentration',
  'securityDangerAction',
  'securityContainer',
  'securityFireFighting',
  'securityFirstAid',
  'securityLeakageEmergency',
  'securityContactProtect',
  'securityTransportInformation',
  'quality'
]
import TDictSelectTag from '@comp/TopVUI/dict/TDictSelectTag'
import TMultiSelectTag from '@comp/TopVUI/dict/TMultiSelectTag'

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
    TDictSelectTag, TMultiSelectTag
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
      form: this.$form.createForm(this)
    }
  },
  methods: {
    add(m, data) {
      console.log(m, data)
    },
    edit(m, data) {
      console.log(m, data)
    }
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
