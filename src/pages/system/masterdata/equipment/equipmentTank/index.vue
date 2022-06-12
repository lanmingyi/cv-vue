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
              v-action:equipmentTankAddDialog
          >新增
          </a-button
          >
          <!--        <a-button class="cu-btn-primary" icon="edit" @click="handleEdit($refs.table.rows)" v-action:equipmentTankEditDialog  >编辑 </a-button  >  -->
          <a-button
              class="cu-btn-danger"
              icon="delete"
              @click="handleSub($refs.table.selectedRowKeys)"
              v-action:equipmentTankDelDialog>删除
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
import {DataGridNew, DataGrid} from "@/components";
//方法封装
import {dataGridMixin} from "@/mixins/dataGridMixin";
//新增编辑界面
import editForm from './edit.vue'
//字典
import TDictSelectTag from '@/components/TopVUI/dict/TDictSelectTag'
import TMultiSelectTag from '@/components/TopVUI/dict/TMultiSelectTag'

export default {
  name: "Table",
  components: {DataGridNew, DataGrid, editForm, TDictSelectTag, TMultiSelectTag},
  mixins: [dataGridMixin],
  filters: {},
  data() {
    return {
      columns: [
        {
          title: '容器大类',
          width: 100,
          dataIndex: 'containerCategory',
          fixed: 'left'
        }
        ,
        {
          title: '容器分类',
          width: 100,
          dataIndex: 'containerType',
          fixed: 'left'
        }
        ,
        {
          title: '设备号',
          dataIndex: 'equipmentNo',
          fixed: 'left'
        }
        ,
        {
          title: '特种设备类型',
          width: 100,
          dataIndex: 'specialType'
        }
        ,
        {
          title: '箱尺寸ft',
          width: 100,
          dataIndex: 'tankSize'
        }
        ,
        {
          title: '内容积m³',
          width: 100,
          dataIndex: 'volume'
        }
        ,
        {
          title: '内长',
          width: 100,
          dataIndex: 'insideLength'
        }
        ,
        {
          title: '内宽',
          width: 100,
          dataIndex: 'insideWidth'
        }
        ,
        {
          title: '内高',
          width: 100,
          dataIndex: 'insideHeigth'
        }
        ,
        {
          title: '皮重t',
          width: 100,
          dataIndex: 'tare'
        }
        ,
        {
          title: '罐箱类型',
          width: 100,
          dataIndex: 'tankType'
        }
        ,
        {
          title: '装卸类型',
          width: 100,
          dataIndex: 'dischargeType'
        }
        ,
        {
          title: '内胆材质',
          width: 100,
          dataIndex: 'innerMaterial'
        }
        ,
        {
          title: '温控',
          width: 100,
          dataIndex: 'temperatureControl'
        }
        ,
        {
          title: '最大工作压力Mpa',
          width: 100,
          dataIndex: 'maxPressure'
        }
        ,
        {
          title: '专用于',
          width: 100,
          dataIndex: 'dedicated'
        }
        ,
        {
          title: '虹吸管',
          width: 100,
          dataIndex: 'ifSiphon'
        }
        ,
        {
          title: '防波板',
          width: 100,
          dataIndex: 'ifWaveBoard'
        }
        ,
        {
          title: 'IMDG编号',
          width: 100,
          dataIndex: 'imdgNo'
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
          title: '报废时间',
          width: 100,
          dataIndex: 'scrapTime'
        }
        ,
        {
          title: '检验证号',
          width: 100,
          dataIndex: 'inspectionNo'
        }
        ,
        {
          title: '检验有效期',
          width: 100,
          dataIndex: 'inspectionTerm'
        }
        ,
        {
          title: '证书上传',
          width: 100,
          dataIndex: 'certificateUpload'
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
          dataIndex: 'equipmentStatus'
        }
        ,
        {
          title: '最近闲置天数',
          width: 100,
          dataIndex: 'notRunningDays'
        }
        ,
        {
          title: '循环状态',
          width: 100,
          dataIndex: 'loopStatus'
        }
        ,
        {
          title: '所在区县',
          width: 100,
          dataIndex: 'locationDistrict'
        }
        ,
        {
          title: '位置类型',
          width: 100,
          dataIndex: 'locationType'
        }
        ,
        {
          title: '库位',
          width: 100,
          dataIndex: 'storageLocation'
        }
        ,
        {
          title: '清洗后第一次使用日期',
          width: 100,
          dataIndex: 'firstDateAfterClean'
        }
        ,
        {
          title: '清洗周期(天)',
          width: 100,
          dataIndex: 'cleanCycle'
        }
        ,
        {
          title: '延期天数',
          width: 100,
          dataIndex: 'delayDays'
        }
        ,
        {
          title: '清洗到期日',
          width: 100,
          dataIndex: 'cleanExpireDate'
        }
        ,
        {
          title: '最后到达客户日期',
          width: 100,
          dataIndex: 'lastArriveTime'
        }
        ,
        {
          title: '7天到期日',
          width: 100,
          dataIndex: 'expirSevenDate'
        }
        ,
        {
          title: '最后发货单号',
          width: 100,
          dataIndex: 'lastShipmentNo'
        }
        ,
        {
          title: '尾单承载物料大类',
          width: 100,
          dataIndex: 'lastOrderMaterialType'
        }
        ,
        {
          title: '尾单承载物料',
          width: 100,
          dataIndex: 'lastOrderMaterial'
        }
        ,
        {
          title: '尾单客户名称',
          width: 100,
          dataIndex: 'lastOrderCustomer'
        }
        ,
        {
          title: '尾单车牌号',
          width: 100,
          dataIndex: 'lastOrderPlatenumber'
        }
        ,
        {
          title: '尾单驾驶员',
          width: 100,
          dataIndex: 'lastOrderDriver'
        }
        ,
        {
          title: '尾单返回基地',
          width: 100,
          dataIndex: 'lastOrderReturnBase'
        }
        ,
        {
          title: '尾单返回基地时间',
          width: 100,
          dataIndex: 'lastOrderReturnTime'
        }
        ,
        {
          title: '所有权',
          width: 100,
          dataIndex: 'ownership'
        }
        ,
        {
          title: '所有人',
          width: 100,
          dataIndex: 'ownershipPerson'
        }
        ,
        {
          title: '证书照片',
          width: 100,
          dataIndex: 'certificatePhoto'
        }
        ,
        {
          title: '租入开始时间',
          width: 100,
          dataIndex: 'rentInStartTime'
        }
        ,
        {
          title: '租入结束时间',
          width: 100,
          dataIndex: 'rentInEndTime'
        }
        ,
        {
          title: '租入承租人',
          width: 100,
          dataIndex: 'rentInLessee'
        }
        ,
        {
          title: '租出开始时间',
          width: 100,
          dataIndex: 'rentOutStartTime'
        }
        ,
        {
          title: '租出结束时间',
          width: 100,
          dataIndex: 'rentOutEndTime'
        }
        ,
        {
          title: '租出承租人',
          width: 100,
          dataIndex: 'rentOutLessee'
        }
        ,
        {
          title: '首次运行时间',
          width: 100,
          dataIndex: 'firstFunctionTime'
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
          title: '组织机构ID	',
          width: 100,
          dataIndex: 'creatorOrgId'
        }
        , {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          width:100,
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
        getPageSet: '/bdata/equipmentTank/getPageSet',
        save: '/bdata/equipmentTank/save',
        update: '/bdata/equipmentTank/update',
        deleteBatch: '/bdata/equipmentTank/deleteBatch'
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

