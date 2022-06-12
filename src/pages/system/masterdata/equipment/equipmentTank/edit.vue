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
            <a-form-item label="容器大类" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <TDictSelectTag placeholder="请选择容器大类" dictCode="${column.dictionariesCode}" v-decorator="['containerCategory',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="容器分类" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <TDictSelectTag placeholder="请选择容器分类" dictCode="${column.dictionariesCode}" v-decorator="['containerType',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="设备号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['equipmentNo',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="特种设备类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <TDictSelectTag placeholder="请选择特种设备类型" dictCode="${column.dictionariesCode}" v-decorator="['specialType',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="箱尺寸ft" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <TDictSelectTag placeholder="请选择箱尺寸ft" dictCode="${column.dictionariesCode}" v-decorator="['tankSize',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="内容积m³" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['volume',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="内长" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['insideLength',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="内宽" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['insideWidth',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="内高" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['insideHeigth',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="皮重t" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['tare',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="罐箱类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <TDictSelectTag placeholder="请选择罐箱类型" dictCode="${column.dictionariesCode}" v-decorator="['tankType',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="装卸类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <TDictSelectTag placeholder="请选择装卸类型" dictCode="${column.dictionariesCode}" v-decorator="['dischargeType',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="内胆材质" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <TDictSelectTag placeholder="请选择内胆材质" dictCode="${column.dictionariesCode}" v-decorator="['innerMaterial',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="温控" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <TDictSelectTag placeholder="请选择温控" dictCode="${column.dictionariesCode}" v-decorator="['temperatureControl',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="最大工作压力Mpa" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['maxPressure',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="专用于" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <TDictSelectTag placeholder="请选择专用于" dictCode="${column.dictionariesCode}" v-decorator="['dedicated',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="虹吸管" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <TDictSelectTag placeholder="请选择虹吸管" dictCode="${column.dictionariesCode}" v-decorator="['ifSiphon',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="防波板" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <TDictSelectTag placeholder="请选择防波板" dictCode="${column.dictionariesCode}" v-decorator="['ifWaveBoard',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="IMDG编号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['imdgNo',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="所有权登记主体" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['ownershipSubject',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="实际所有人" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['actualOwner',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="实际管理人" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['actualManager',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>

          <a-col class="gutter-row" :span="12">

            <a-form-item label="报废时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <t-date placeholder="请选择报废时间" v-decorator="['scrapTime',
                                      {
                                                                      rules: [{
                                                                        required: false,
                                        message: '请输入正确参数'
                                      }] }]"
                      style="width: 100%;" :trigger-change="true" dateFormat="YYYY-MM-DD HH:mm:ss"
              />
            </a-form-item>
          </a-col>


          <a-col class="gutter-row" :span="12">
            <a-form-item label="检验证号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['inspectionNo',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>

          <a-col class="gutter-row" :span="12">

            <a-form-item label="检验有效期" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <t-date placeholder="请选择检验有效期" v-decorator="['inspectionTerm',
                                      {
                                                                      rules: [{
                                                                        required: false,
                                        message: '请输入正确参数'
                                      }] }]"
                      style="width: 100%;" :trigger-change="true" dateFormat="YYYY-MM-DD HH:mm:ss"
              />
            </a-form-item>
          </a-col>


          <a-col class="gutter-row" :span="12">

            <a-form-item label="证书上传" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <t-date placeholder="请选择证书上传" v-decorator="['certificateUpload',
                                      {
                                                                      rules: [{
                                                                        required: false,
                                        message: '请输入正确参数'
                                      }] }]"
                      style="width: 100%;" :trigger-change="true" dateFormat="YYYY-MM-DD HH:mm:ss"
              />
            </a-form-item>
          </a-col>


          <a-col class="gutter-row" :span="12">
            <a-form-item label="设备品牌" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['equipmentBrand',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['remark',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <TDictSelectTag placeholder="请选择状态" dictCode="${column.dictionariesCode}" v-decorator="['equipmentStatus',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
            </a-form-item>
          </a-col>

          <a-col class="gutter-row" :span="12">
            <a-form-item label="最近闲置天数" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['notRunningDays',
                                     {
                                                              rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'

                                     }] }]" :min="1"/>
            </a-form-item>
          </a-col>

          <a-col class="gutter-row" :span="12">
            <a-form-item label="循环状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <TDictSelectTag placeholder="请选择循环状态" dictCode="${column.dictionariesCode}" v-decorator="['loopStatus',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="所在区县" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['locationDistrict',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="位置类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <TDictSelectTag placeholder="请选择位置类型" dictCode="${column.dictionariesCode}" v-decorator="['locationType',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"></TDictSelectTag>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="库位" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['storageLocation',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>

          <a-col class="gutter-row" :span="12">

            <a-form-item label="清洗后第一次使用日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <t-date placeholder="请选择清洗后第一次使用日期" v-decorator="['firstDateAfterClean',
                                      {
                                                                      rules: [{
                                                                        required: false,
                                        message: '请输入正确参数'
                                      }] }]"
                      style="width: 100%;" :trigger-change="true" dateFormat="YYYY-MM-DD HH:mm:ss"
              />
            </a-form-item>
          </a-col>


          <a-col class="gutter-row" :span="12">
            <a-form-item label="清洗周期(天)" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['cleanCycle',
                                     {
                                                              rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'

                                     }] }]" :min="1"/>
            </a-form-item>
          </a-col>


          <a-col class="gutter-row" :span="12">
            <a-form-item label="延期天数" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number v-decorator="['delayDays',
                                     {
                                                              rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'

                                     }] }]" :min="1"/>
            </a-form-item>
          </a-col>


          <a-col class="gutter-row" :span="12">

            <a-form-item label="清洗到期日" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <t-date placeholder="请选择清洗到期日" v-decorator="['cleanExpireDate',
                                      {
                                                                      rules: [{
                                                                        required: false,
                                        message: '请输入正确参数'
                                      }] }]"
                      style="width: 100%;" :trigger-change="true" dateFormat="YYYY-MM-DD HH:mm:ss"
              />
            </a-form-item>
          </a-col>


          <a-col class="gutter-row" :span="12">

            <a-form-item label="最后到达客户日期" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <t-date placeholder="请选择最后到达客户日期" v-decorator="['lastArriveTime',
                                      {
                                                                      rules: [{
                                                                        required: false,
                                        message: '请输入正确参数'
                                      }] }]"
                      style="width: 100%;" :trigger-change="true" dateFormat="YYYY-MM-DD HH:mm:ss"
              />
            </a-form-item>
          </a-col>


          <a-col class="gutter-row" :span="12">

            <a-form-item label="7天到期日" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <t-date placeholder="请选择7天到期日" v-decorator="['expirSevenDate',
                                      {
                                                                      rules: [{
                                                                        required: false,
                                        message: '请输入正确参数'
                                      }] }]"
                      style="width: 100%;" :trigger-change="true" dateFormat="YYYY-MM-DD HH:mm:ss"
              />
            </a-form-item>
          </a-col>


          <a-col class="gutter-row" :span="12">
            <a-form-item label="最后发货单号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['lastShipmentNo',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="尾单承载物料大类" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['lastOrderMaterialType',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="尾单承载物料" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['lastOrderMaterial',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="尾单客户名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['lastOrderCustomer',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="尾单车牌号" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['lastOrderPlatenumber',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="尾单驾驶员" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['lastOrderDriver',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="尾单返回基地" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['lastOrderReturnBase',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>

          <a-col class="gutter-row" :span="12">

            <a-form-item label="尾单返回基地时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <t-date placeholder="请选择尾单返回基地时间" v-decorator="['lastOrderReturnTime',
                                      {
                                                                      rules: [{
                                                                        required: false,
                                        message: '请输入正确参数'
                                      }] }]"
                      style="width: 100%;" :trigger-change="true" dateFormat="YYYY-MM-DD HH:mm:ss"
              />
            </a-form-item>
          </a-col>


          <a-col class="gutter-row" :span="12">
            <a-form-item label="所有权" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['ownership',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item label="所有人" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['ownershipPerson',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>

          <a-col class="gutter-row" :span="12">

            <a-form-item label="证书照片" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <t-date placeholder="请选择证书照片" v-decorator="['certificatePhoto',
                                      {
                                                                      rules: [{
                                                                        required: false,
                                        message: '请输入正确参数'
                                      }] }]"
                      style="width: 100%;" :trigger-change="true" dateFormat="YYYY-MM-DD HH:mm:ss"
              />
            </a-form-item>
          </a-col>


          <a-col class="gutter-row" :span="12">

            <a-form-item label="租入开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <t-date placeholder="请选择租入开始时间" v-decorator="['rentInStartTime',
                                      {
                                                                      rules: [{
                                                                        required: false,
                                        message: '请输入正确参数'
                                      }] }]"
                      style="width: 100%;" :trigger-change="true" dateFormat="YYYY-MM-DD HH:mm:ss"
              />
            </a-form-item>
          </a-col>


          <a-col class="gutter-row" :span="12">

            <a-form-item label="租入结束时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <t-date placeholder="请选择租入结束时间" v-decorator="['rentInEndTime',
                                      {
                                                                      rules: [{
                                                                        required: false,
                                        message: '请输入正确参数'
                                      }] }]"
                      style="width: 100%;" :trigger-change="true" dateFormat="YYYY-MM-DD HH:mm:ss"
              />
            </a-form-item>
          </a-col>


          <a-col class="gutter-row" :span="12">
            <a-form-item label="租入承租人" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['rentInLessee',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>

          <a-col class="gutter-row" :span="12">

            <a-form-item label="租出开始时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <t-date placeholder="请选择租出开始时间" v-decorator="['rentOutStartTime',
                                      {
                                                                      rules: [{
                                                                        required: false,
                                        message: '请输入正确参数'
                                      }] }]"
                      style="width: 100%;" :trigger-change="true" dateFormat="YYYY-MM-DD HH:mm:ss"
              />
            </a-form-item>
          </a-col>


          <a-col class="gutter-row" :span="12">

            <a-form-item label="租出结束时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <t-date placeholder="请选择租出结束时间" v-decorator="['rentOutEndTime',
                                      {
                                                                      rules: [{
                                                                        required: false,
                                        message: '请输入正确参数'
                                      }] }]"
                      style="width: 100%;" :trigger-change="true" dateFormat="YYYY-MM-DD HH:mm:ss"
              />
            </a-form-item>
          </a-col>


          <a-col class="gutter-row" :span="12">
            <a-form-item label="租出承租人" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input v-decorator="['rentOutLessee',
                                     {
                                                                    rules: [{
                                                                      required: false,
                                       message: '请输入正确参数'
                                     }] }]"/>
            </a-form-item>
          </a-col>

          <a-col class="gutter-row" :span="12">

            <a-form-item label="首次运行时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <t-date placeholder="请选择首次运行时间" v-decorator="['firstFunctionTime',
                                      {
                                                                      rules: [{
                                                                        required: false,
                                        message: '请输入正确参数'
                                      }] }]"
                      style="width: 100%;" :trigger-change="true" dateFormat="YYYY-MM-DD HH:mm:ss"
              />
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
  'containerCategory',
  'containerType',
  'equipmentNo',
  'specialType',
  'tankSize',
  'volume',
  'insideLength',
  'insideWidth',
  'insideHeigth',
  'tare',
  'tankType',
  'dischargeType',
  'innerMaterial',
  'temperatureControl',
  'maxPressure',
  'dedicated',
  'ifSiphon',
  'ifWaveBoard',
  'imdgNo',
  'ownershipSubject',
  'actualOwner',
  'actualManager',
  'scrapTime',
  'inspectionNo',
  'inspectionTerm',
  'certificateUpload',
  'equipmentBrand',
  'remark',
  'equipmentStatus',
  'notRunningDays',
  'loopStatus',
  'locationDistrict',
  'locationType',
  'storageLocation',
  'firstDateAfterClean',
  'cleanCycle',
  'delayDays',
  'cleanExpireDate',
  'lastArriveTime',
  'expirSevenDate',
  'lastShipmentNo',
  'lastOrderMaterialType',
  'lastOrderMaterial',
  'lastOrderCustomer',
  'lastOrderPlatenumber',
  'lastOrderDriver',
  'lastOrderReturnBase',
  'lastOrderReturnTime',
  'ownership',
  'ownershipPerson',
  'certificatePhoto',
  'rentInStartTime',
  'rentInEndTime',
  'rentInLessee',
  'rentOutStartTime',
  'rentOutEndTime',
  'rentOutLessee',
  'firstFunctionTime',
  'creatorId',
  'creator',
  'createTime',
  'modifierId',
  'modifier',
  'modifyTime',
  'creatorOrgId'
]
import TDictSelectTag from '@/components/TopVUI/dict/TDictSelectTag'
import TMultiSelectTag from '@/components/TopVUI/dict/TMultiSelectTag'

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
