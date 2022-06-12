<template>
  <div class="page-common-layout">
    <div class="page-common-content">
      <tool-bar
          @search="$refs.table.refresh(true)"
          @reset="
            () => {
            (this.queryParam = {}), $refs.table.refresh(true);
            }
            "
      >

        <!--toolBar-->
        <template slot="toolBtn" slot-scope="scope">
          <a-button
              class="cu-btn-primary" icon="plus"
              @click="handleAdd()"
              v-action:equipmentVehicleAddDialog
          >新增
          </a-button
          >
          <!--        <a-button class="cu-btn-primary" icon="edit" @click="handleEdit($refs.table.rows)" v-action:equipmentCarEditDialog  >编辑 </a-button  >  -->
          <a-button
              class="cu-btn-danger"
              icon="delete"
              @click="handleSub($refs.table.selectedRowKeys)"
              v-action:equipmentVehicleDelDialog>删除
          </a-button>
        </template>

        <!--search -->
        <template slot="toolForm">
        </template>
      </tool-bar>

      <!--	table	 -->
      <DataGridNew
          ref="table"
          :columns="columns"
          :url="url"
          :queryParam="queryParam"
          rowKey="uuid"
          :format-conditions="true"
      >
        <template slot="action" slot-scope="{ text, record }">
          <a style="margin-right: 5px" @click="() => handleEdit(record)">编辑</a>
          <a style="margin-right: 5px" @click="() => handleSub(record)">删除</a>
        </template>
      </DataGridNew>

      <!-- dialog	 -->
      <edit-form
          ref="createModal"
          :visible="visible"
          :loading="confirmLoading"
          :model="mdl"
          @cancel="handleCancel()"
          @ok="handleOk()"
      />
    </div>
  </div>
</template>


<!--script-->
<script>
//数据表格组件
import {DataGridNew, DataGrid} from "@comp";
//方法封装
import {dataGridMixin} from "@/mixins/dataGridMixin";
//新增编辑界面
import editForm from './edit.vue'
//字典
import TDictSelectTag from '@comp/TopVUI/dict/TDictSelectTag'
import TMultiSelectTag from '@comp/TopVUI/dict/TMultiSelectTag'

export default {
  name: "Table",
  components: {DataGridNew, DataGrid, editForm, TDictSelectTag, TMultiSelectTag},
  mixins: [dataGridMixin],
  filters: {},
  data() {
    return {
      columns: [
        {
          title: '设备号',
          width: 100,
          dataIndex: 'platenumber',
          fixed: 'left'
        }
        ,
        {
          title: '首选业务类别',
          width: 100,
          dataIndex: 'firstBusinessType',
          fixed: 'left'
        }
        ,
        {
          title: '业务类别2',
          width: 100,
          dataIndex: 'secondBusinessType',
          fixed: 'left'
        }
        ,
        {
          title: '车辆大类',
          width: 100,
          dataIndex: 'carType',
          fixed: 'left'
        }
        ,
        {
          title: '车辆分类1',
          width: 100,
          dataIndex: 'carTypeOne',
          fixed: 'left'
        }
        ,
        {
          title: '车辆分类2',
          dataIndex: 'carTypeTwo',
          fixed: 'left',
          align: 'center'
        }
        ,
        {
          title: '轴车型',
          width: 100,
          dataIndex: 'axisType',
          align:'center'
        }
        ,
        {
          title: '箱车型',
          width: 100,
          dataIndex: 'tankType'
        }
        ,
        {
          title: '特种设备类型',
          width: 100,
          dataIndex: 'specialType'
        }
        ,
        {
          title: '设备安全分类',
          width: 100,
          dataIndex: 'fitMediumType'
        }
        ,
        {
          title: '适装品类',
          width: 100,
          dataIndex: 'power'
        }
        ,
        {
          title: '适装介质',
          width: 100,
          dataIndex: 'economicSpeedType'
        }
        ,
        {
          title: '动力',
          width: 100,
          dataIndex: 'securityType'
        }
        ,
        {
          title: '经济时速类型',
          width: 100,
          dataIndex: 'fitProductType'
        }
        ,
        {
          title: '排放',
          width: 100,
          dataIndex: 'discharge'
        }
        ,
        {
          title: '营运性',
          width: 100,
          dataIndex: 'operationType'
        }
        ,
        {
          title: '平板/高低板',
          width: 100,
          dataIndex: 'boardType'
        }
        ,
        {
          title: '准入时间',
          width: 100,
          dataIndex: 'accessTimes'
        }
        ,
        {
          title: '准入天数',
          width: 100,
          dataIndex: 'accessDays'
        }
        ,
        {
          title: '所有权',
          width: 100,
          dataIndex: 'ownership'
        }
        ,
        {
          title: '行驶证号',
          width: 100,
          dataIndex: 'drivingLicenseNumber'
        }
        ,
        {
          title: '行驶证有效期',
          width: 100,
          dataIndex: 'drivingLicenseTerm'
        }
        ,
        {
          title: '行驶证上传',
          width: 100,
          dataIndex: 'drivingLicenseUpload'
        }
        ,
        {
          title: '营运证号',
          width: 100,
          dataIndex: 'taxiLicenseNumber'
        }
        ,
        {
          title: '营运证有效期',
          width: 100,
          dataIndex: 'taxiLicenseTerm'
        }
        ,
        {
          title: '营运证上传',
          width: 100,
          dataIndex: 'taxiUpload'
        }
        ,
        {
          title: '营运范围',
          width: 100,
          dataIndex: 'taxiRange'
        }
        ,
        {
          title: '所有权登记主体',
          width: 100,
          dataIndex: 'ownershipSubject'
        }
        ,
        {
          title: '实际所有人',
          width: 100,
          dataIndex: 'actualOwner'
        }
        ,
        {
          title: '实际管理人',
          width: 100,
          dataIndex: 'actualManager'
        }
        ,
        {
          title: '具体长度',
          width: 100,
          dataIndex: 'specificLength'
        }
        ,
        {
          title: '皮重(吨)',
          width: 100,
          dataIndex: 'tare'
        }
        ,
        {
          title: '额定载重量(吨)',
          width: 100,
          dataIndex: 'ratedLoadCapacity'
        }
        ,
        {
          title: '牵引座高度',
          width: 100,
          dataIndex: 'tractionSeatHeight'
        }
        ,
        {
          title: '牵引销型号',
          width: 100,
          dataIndex: 'tractionPinModel'
        }
        ,
        {
          title: '是否有接料槽',
          width: 100,
          dataIndex: 'ifReceivingChute'
        }
        ,
        {
          title: '首次运行时间',
          width: 100,
          dataIndex: 'firstRunTime'
        }
        ,
        {
          title: '报废时间',
          width: 100,
          dataIndex: 'scrapTime'
        }
        ,
        {
          title: '车架号',
          width: 100,
          dataIndex: 'frameNumber'
        }
        ,
        {
          title: '设备品牌',
          width: 100,
          dataIndex: 'equipmentBrand'
        }
        ,
        {
          title: '备注',
          width: 100,
          dataIndex: 'remark'
        }
        ,
        {
          title: '状态',
          width: 100,
          dataIndex: 'status'
        }
        ,
        {
          title: '最近未运行天数',
          width: 100,
          dataIndex: 'notRunningDays'
        }
        ,
        {
          title: '创建人ID',
          width: 100,
          dataIndex: 'creatorId'
        }
        ,
        {
          title: '创建人',
          width: 100,
          dataIndex: 'creator'
        }
        ,
        {
          title: '创建时间',
          width: 100,
          dataIndex: 'createTime'
        }
        ,
        {
          title: '修改人ID',
          width: 100,
          dataIndex: 'modifierId'
        }
        ,
        {
          title: '修改人',
          width: 100,
          dataIndex: 'modifier'
        }
        ,
        {
          title: '修改时间',
          width: 100,
          dataIndex: 'modifyTime'
        }
        ,
        {
          title: '组织机构ID',
          width: 100,
          dataIndex: 'creatorOrgId'
        }
        , {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          scopedSlots: {
            customRender: 'action'
          }
        }
      ],
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 查询参数
      queryParam: {},
      url: {
        getPageSet: '/bdata/equipmentCar/getPageSet',
        save: '/bdata/equipmentCar/save',
        update: '/bdata/equipmentCar/update',
        deleteBatch: '/bdata/equipmentCar/deleteBatch'
      },
    };
  },
  methods: {},
};
</script>

<!--style-->
<style scoped lang="less">
.table {
  background-color: @base-bg-color;
  padding: 24px;
}
</style>

