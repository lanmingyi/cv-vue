<template>
	<div class="page-common-layout">
		<div class="page-common-content">
			<tool-bar @search="$refs.table.refresh(true)"
				@reset="() => {(this.queryParam = {}), $refs.table.refresh(true);}">

				<!--toolBar-->
				<template slot="toolBtn" slot-scope="scope">
					<a-button class="cu-btn-primary" icon="plus" @click="handleAdd()" v-action:contractPriceAddDialog>
						新增
					</a-button>
					<a-button class="cu-btn-primary" icon="edit" @click="handleEdit($refs.table.rows)"
						v-action:contractPriceEditDialog>编辑 </a-button>

					<!-- <a-upload
					  name="file"
					  :showUploadList="false"
					  :multiple="false"
					  v-action:contractPriceExcelImportDialog
					  @change="(e) => handleImportExcel(e, 'table')"
					>
					  <a-button class="cu-btn-primary" icon="import">导入</a-button>
					</a-upload> -->
					<a-button class="cu-btn-primary" icon="export"
						@click="handleExportXlsTest(columns, 'contract_price', 1, $refs.table.selectedRowKeys)" v-action:contractPriceExcelExportDialog>
						导出
					</a-button>
					<a-button class="cu-btn-danger" icon="delete" @click="handleSub($refs.table.selectedRowKeys)"
						v-action:contractPriceDelDialog>删除
					</a-button>
				</template>

				<!--search -->
				<template slot="toolForm">
<!--					<a-form-item label="">-->
<!--						<a-input v-model="queryParam.creator" placeholder="创建人" />-->
<!--					</a-form-item>-->
          <a-form-item label="">
            <t-dict-select-search-tag
                v-model="queryParam.year"
                :dataList="yearList"
                placeholder="年度"
                @change="changeYear"
                dataType="static"
            />
          </a-form-item>
          <a-form-item label="">
            <t-dict-select-search-tag
                v-model="queryParam.month"
                :dataList="monthList"
                placeholder="月份"
                @change="changeMonth"
                dataType="static"
            />
          </a-form-item>
<!--          <a-form-item label="">-->
<!--            <t-dict-select-tag-->
<!--                v-model="queryParam.month"-->
<!--                :dataList="monthList"-->
<!--                placeholder="月份"-->
<!--                @change="changeMonth"-->
<!--                dataType="static"-->
<!--            />-->
<!--          </a-form-item>-->
				</template>
			</tool-bar>

			<!--	table	 -->
			<DataGridNew ref="table" :columns="columns" :url="url" :queryParam="queryParam" rowKey="uuid"
				:format-conditions="true">
        <template slot="classify" slot-scope="{ text }">
          {{ text | classifyFilter }}
        </template>
				<template slot="action" slot-scope="{ text, record }">
					<a style="margin-right: 5px" @click="() => handleEdit(record)">编辑</a>
					<a style="margin-right: 5px" @click="() => handleSub(record)">删除</a>
				</template>
			</DataGridNew>

			<!-- dialog	 -->
			<edit-form ref="createModal" :visible="visible" :loading="confirmLoading" :model="mdl"
				@cancel="handleCancel()" @ok="handleOk()" />
		</div>
	</div>
</template>


<!--script-->
<script>
	//数据表格组件
  import {
    DataGridNew, TDictSelectSearchTag
  } from "@comp";
	//方法封装
	import {
		dataGridMixin
	} from "@/mixins/dataGridMixin";
	//新增编辑界面
	import editForm from './edit.vue'
	//字典
	import TDictSelectTag from '@comp/TopVUI/dict/TDictSelectTag'
	import TMultiSelectTag from '@comp/TopVUI/dict/TMultiSelectTag'

	export default {
		name: "Table",
		components: {
			DataGridNew,
			editForm,
			TDictSelectTag,
			TMultiSelectTag,
      TDictSelectSearchTag
		},
		mixins: [dataGridMixin],
    filters: {
      classifyFilter(val) {
        // console.log('export:',val);
        switch (val) {
          case "MDI":
            return "MDI";
          case "PM":
            return "PM";
          case "TDI":
            return "TDI";
          case "聚醚":
            return "聚醚";
          case "其他普货":
            return "其他普货";
          case "其他危险品":
            return "其他危险品";
          case "容威":
            return "容威";
        }
      },
    },
		data() {
			return {
				columns: [{
						title: '起始时间',
						width: 100,
						dataIndex: 'startTime',
            sorter: true,
						// fixed: 'left'
					},
					{
						title: '截至时间',
						width: 100,
						dataIndex: 'endTime',
            sorter: true,
						// fixed: 'left'
					},
					{
						title: '产品分类',
						width: 100,
						dataIndex: 'classify',
            sorter: true,
            scopedSlots: {
              customRender: "classify"
            },
						// fixed: 'left'
					},
					{
						title: '里程区间开始',
						width: 100,
						dataIndex: 'startMileage'
					},
					{
						title: '里程区间结束',
						width: 100,
						dataIndex: 'endMileage'
					},
					{
						title: '未含税价格',
						width: 100,
						dataIndex: 'noTaxPrice'
					},
					{
						title: '含税价格',
						width: 100,
						dataIndex: 'taxPrice'
					},
					{
						title: '最低结算里程',
						width: 100,
						dataIndex: 'minimumSettlementMileage'
					},
					{
						title: '最低结算吨位',
						width: 100,
						dataIndex: 'minimumSettlementTonnage'
					},
					// {
					// 	title: '基准油价',
					// 	width: 100,
					// 	dataIndex: 'oilBasePrice'
					// },
					{
						title: '备注',
						width: 100,
						dataIndex: 'notes'
					},
					{
						title: '创建人ID',
						width: 100,
						dataIndex: 'creatorId'
					},
					{
						title: '创建人',
						width: 100,
						dataIndex: 'creator'
					},
					{
						title: '创建时间',
						width: 100,
						dataIndex: 'createTime'
					},
					{
						title: '修改人ID',
						width: 100,
						dataIndex: 'modifierId'
					},
					{
						title: '修改人',
						width: 100,
						dataIndex: 'modifier'
					},
					{
						title: '修改时间',
						width: 100,
						dataIndex: 'modifyTime'
					},
					{
						title: '组织机构ID',
						width: 100,
						dataIndex: 'creatorOrgId'
					}, {
						title: '操作',
						dataIndex: 'action',
						align: 'center',
						width: 100,
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
					getPageSet: '/bdata/contractPrice/getPageSet',
					save: '/bdata/contractPrice/save',
					update: '/bdata/contractPrice/update',
					deleteBatch: '/bdata/contractPrice/deleteBatch',
					exportExcelUrl: "/bdata/contractPrice/exportExcel",
					importExcelUrl: "/bdata/oilListingPrice/exportleadingIn",
				},

        yearList: [
          {text: "2022", value: "2022"},
          {text: "2023", value: "2023"},
          {text: "2024", value: "2024"},
          {text: "2025", value: "2025"},
        ],


        monthList: [
          {text: "1", value: "1"},
          {text: "2", value: "2"},
          {text: "3", value: "3"},
          {text: "4", value: "4"},
          {text: "5", value: "5"},
          {text: "6", value: "6"},
          {text: "7", value: "7"},
          {text: "8", value: "8"},
          {text: "9", value: "9"},
          {text: "10", value: "10"},
          {text: "11", value: "11"},
          {text: "12", value: "12"},
        ],
			};
		},
		methods: {
      changeYear(e) {
        // console.log(e);
        this.queryParam.year = e;
      },
      changeMonth(e) {
        this.queryParam.month = e;
      },
    },
	};
</script>

<!--style-->
<style scoped lang="less">
	.table {
		background-color: @base-bg-color;
		padding: 24px;
	}
</style>
