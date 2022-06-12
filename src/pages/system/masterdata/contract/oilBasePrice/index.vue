<template>
	<div class="page-common-layout">
		<div class="page-common-content">
			<tool-bar @search="$refs.table.refresh(true)"
				@reset="() => {(this.queryParam = {}), $refs.table.refresh(true);}">

				<!--toolBar-->
				<template slot="toolBtn" slot-scope="scope">
					<a-button class="cu-btn-primary" icon="plus" @click="handleAdd()" v-action:oilBasePriceAddDialog>
						新增
					</a-button>
					<a-button class="cu-btn-primary" icon="edit" @click="handleEdit($refs.table.rows)"
						v-action:oilBasePriceEditDialog>
						编辑
					</a-button>

					<!-- <a-upload
					  name="file"
					  :showUploadList="false"
					  :multiple="false"
					  v-action:oilBasePriceExcelImportDialog
					  @change="(e) => handleImportExcel(e, 'table')"
					>
					  <a-button class="cu-btn-primary" icon="import">导入</a-button>
					</a-upload> -->
					<a-button class="cu-btn-primary" icon="export"
						@click="handleExportXlsTest(columns, 'oil_base_price', 1, $refs.table.selectedRowKeys)" v-action:oilBasePriceExcelExportDialog>
						导出
					</a-button>
					<a-button class="cu-btn-danger" icon="delete" @click="handleSub($refs.table.selectedRowKeys)"
						v-action:oilBasePriceDelDialog>删除
					</a-button>
				</template>

				<!--search -->
				<template slot="toolForm">
					<a-form-item label="">
						<a-input v-model="queryParam.creator" placeholder="创建人" />
					</a-form-item>
				</template>
			</tool-bar>

			<!--	table	 -->
			<DataGridNew ref="table" :columns="columns" :url="url" :queryParam="queryParam" rowKey="uuid"
				:format-conditions="true">
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
		DataGridNew
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
			TMultiSelectTag
		},
		mixins: [dataGridMixin],
		filters: {},
		data() {
			return {
				columns: [{
						title: '起始时间',
						width: 100,
						dataIndex: 'startTime',
            sorter: true,
					},
					{
						title: '截至时间',
						width: 100,
						dataIndex: 'endTime',
            sorter: true,
					},
					{
						title: '基准油价',
						width: 100,
						dataIndex: 'oilBasePrice',
            sorter: true,
					},
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
					getPageSet: '/bdata/oilBasePrice/getPageSet',
					save: '/bdata/oilBasePrice/save',
					update: '/bdata/oilBasePrice/update',
					deleteBatch: '/bdata/oilBasePrice/deleteBatch',
					exportExcelUrl: "/bdata/oilBasePrice/exportExcel",
					importExcelUrl: "/bdata/oilBasePrice/exportleadingIn",
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
