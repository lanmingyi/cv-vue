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
              v-action:materialsAddDialog
          >新增
          </a-button
          >
          <!--        <a-button class="cu-btn-primary" icon="edit" @click="handleEdit($refs.table.rows)" v-action:equipmentCarEditDialog  >编辑 </a-button  >  -->
          <a-button
              class="cu-btn-danger"
              icon="delete"
              @click="handleSub($refs.table.selectedRowKeys)"
              v-action:materialsDelDialog>删除
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
          title: '物资安全分类1',
          width: 100,
          dataIndex: 'material',
          fixed: 'left',
          children:[
            {
              title: '化学品/危货',
              dataIndex: 'materialSecurityTypeOne',
              key: 'materialSecurityTypeOne',
              width: 130
            }
          ]
        }
        ,
        {
          title: '物料俗称',
          width: 100,
          dataIndex: 'materialCommonly',
          fixed: 'left'
        }
        ,
        {
          title: 'SDS全称',
          width: 100,
          dataIndex: 'sdsFullName',
          fixed: 'left'
        }
        ,
        {
          title: '代表性物料',
          width: 100,
          dataIndex: 'typicalMaterialFullName',
          fixed: 'left'
        }
        ,
        {
          title: '所属生产方集团',
          dataIndex: 'belongingProductionGroup',
          fixed: 'left'
        }
        ,
        {
          title: '调度分类',
          width: 100,
          dataIndex: 'dispatch',
          children: [
            {
              title: '客户产品品名',
              dataIndex: 'dispatchCustomerProductName',
              key: 'dispatchCustomerProductName',
              width: 100
            },
            {
              title: '客户产品牌号',
              dataIndex: 'dispatchCustomerProductBrand',
              key: 'dispatchCustomerProductBrand',
              width: 100
            },
            {
              title: '我司产品分类1',
              dataIndex: 'dispatchOurProductTypeOne',
              key: 'dispatchOurProductTypeOne',
              width: 100
            },
            {
              title: '我司产品分类2',
              dataIndex: 'dispatchOurProductTypeTwo',
              key: 'dispatchOurProductTypeTwo',
              width: 100
            },
          ]
        }
        ,
        {
          title: '结算分类',
          width: 100,
          dataIndex: 'settlement',
          children: [
            {
              title: '分类1级',
              dataIndex: 'settlementTypeOne',
              key: 'settlementTypeOne',
              width: 100
            },
            {
              title: '分类2级',
              dataIndex: 'settlementTypeTwo',
              key: 'settlementTypeTwo',
              width: 100
            },
            {
              title: '所属结算客户',
              dataIndex: 'settlementBelongingCustomer',
              key: 'settlementBelongingCustomer',
              width: 100
            },
            {
              title: '所属结算集团',
              dataIndex: 'settlementBelongingCustomerGroup',
              key: 'settlementBelongingCustomerGroup',
              width: 100
            },
          ]
        }
        ,
        {
          title: '温度分类',
          width: 100,
          dataIndex: 'temperatureType'
        }
        ,
        {
          title: '危普分类',
          width: 100,
          dataIndex: 'dangerousOrdinaryType'
        }
        ,
        {
          title: '危化品分类',
          width: 100,
          dataIndex: 'chemicalType'
        }
        ,
        {
          title: '储运形态',
          width: 100,
          dataIndex: 'storageTransportForm'
        }
        ,
        {
          title: '危害特性',
          width: 100,
          dataIndex: 'harm',
          children: [
            {
              title: '物理危害',
              dataIndex: 'harmPhysics',
              key: 'harmPhysics',
              width: 100
            },
            {
              title: '健康危害',
              dataIndex: 'harmHealth',
              key: 'harmHealth',
              width: 100
            },
            {
              title: '环境危害',
              dataIndex: 'harmEnvironment',
              key: 'harmEnvironment',
              width: 100
            },
            {
              title: '货品损害',
              dataIndex: 'harmGoods',
              key: 'harmGoods',
              width: 100
            },
            {
              title: '其他危害',
              dataIndex: 'harmOther',
              key: 'harmOther',
              width: 100
            },
          ]
        }
        ,
        {
          title: '其他特性',
          width: 100,
          dataIndex: 'other',
          children:[
            {
              title:'储运特性',
              dataIndex: 'otherStorageTransport',
              key: 'otherStorageTransport',
              width: 100,
            }
          ]
        }
        ,
        {
          title: '保质天数',
          width: 100,
          dataIndex: 'qualityDays'
        }
        ,
        {
          title: '保质温度',
          width: 100,
          dataIndex: 'qualityTemperature'
        }
        ,
        {
          title: '密度',
          width: 100,
          dataIndex: 'density'
        }
        ,
        {
          title: '闪点℃',
          width: 100,
          dataIndex: 'flashPoint'
        }
        ,
        {
          title: '自燃点℃',
          width: 100,
          dataIndex: 'ignitionPoint'
        }
        ,
        {
          title: '储运压力Mpa',
          width: 100,
          dataIndex: 'storageTransportPressure'
        }
        ,
        {
          title: '储运温度℃',
          width: 100,
          dataIndex: 'storageTransportTemperature'
        }
        ,
        {
          title: '粉尘爆炸浓度(mg/m³)',
          width: 100,
          dataIndex: 'dustBlastConcentration'
        }
        ,
        {
          title: '危害特性',
          width: 100,
          dataIndex: 'harm',
          children: [
            {
              title: '危险动作',
              dataIndex: 'securityDangerAction',
              key: 'securityDangerAction',
              width: 100
            },
            {
              title: '容器方案',
              dataIndex: 'securityContainer',
              key: 'namsecurityContainere',
              width: 100
            },
            {
              title: '消防措施',
              dataIndex: 'securityFireFighting',
              key: 'securityFireFighting',
              width: 100
            },
            {
              title: '急救措施',
              dataIndex: 'securityFirstAid',
              key: 'securityFirstAid',
              width: 100
            },
            {
              title: '泄露应急措施',
              dataIndex: 'securityLeakageEmergency',
              key: 'securityLeakageEmergency',
              width: 100
            },
            {
              title: '接触控制和个人防护',
              dataIndex: 'securityContactProtect',
              key: 'securityContactProtect',
              width: 100
            },
            {
              title: '运输信息',
              dataIndex: 'securityTransportInformation',
              key: 'securityTransportInformation',
              width: 100
            },
          ]
        }
        ,
        {
          title: '质量',
          width: 100,
          dataIndex: 'quality'
        },
        {
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
        getPageSet: '/bdata/materialMaterial/getPageSet',
        save: '/bdata/materialMaterial/save',
        update: '/bdata/materialMaterial/update',
        deleteBatch: '/bdata/materialMaterial/deleteBatch'
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

