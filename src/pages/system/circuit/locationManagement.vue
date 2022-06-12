<template>
	<div class="page-common-layout">
		<div class="page-common-content">
			<tool-bar @search="$refs.table.refresh(true)" @reset="
          () => {
            (this.queryParam = {}), $refs.table.refresh(true);
          }
        ">
				<template slot="toolBtn" slot-scope="scope">
					<a-button class="cu-btn-primary" icon="plus" @click="handleAdd()" v-action:circuitAddDialog>新增
					</a-button>

					<a-button class="cu-btn-danger" icon="delete" @click="handleSub($refs.table.selectedRowKeys)"
						v-action:circuitDelDialog>删除</a-button>
					<a-button class="cu-btn-primary" icon="export" @click="handleExportXls(columns, 'cs_excel_user', 1)"
						v-action:circuitExportDialog>导出</a-button>
				</template>
				<template slot="toolForm">
					<a-form-item label="">
						<a-input v-model="queryParam.pointCode" placeholder="编码" />

					</a-form-item>
					<a-form-item label="">
						
					</a-form-item>
					<a-form-item label="">
						<t-dict-select-search-tag v-model="queryParam.pointType" :dataList="pointTypeList" placeholder="点类别"
							@change="changePointType" dataType="static" />
					</a-form-item>
					<a-form-item label="">
						<a-input v-model="queryParam.locationInformation" placeholder="具体地址信息" />
					</a-form-item>
					<a-form-item label="">
						<a-input v-model="queryParam.customizeName" placeholder="自定义名称" />
					</a-form-item>
					<a-form-item label="">
						<a-input v-model="queryParam.customizeName" placeholder="客户全称" />
					</a-form-item>
					<a-form-item label="">
						<a-input v-model="queryParam.affiliatedGroup" placeholder="隶属集团" />
					</a-form-item>
					<a-form-item label="">
					  <TAreaLinkage type="select" @change="selDistrict"></TAreaLinkage>
					</a-form-item>
				</template>
			</tool-bar>
			<DataGridNew ref="table" :columns="columns" :url="url" :queryParam="queryParam" rowKey="uuid"
				:format-conditions="true">
				<template slot="testCombobox" slot-scope="{ text }">
					<filterDictTextByCode code="sortFields" :value="text"></filterDictTextByCode>
				</template>
				<!-- <template slot="sex" slot-scope="{ text }">
					{{ text | sexStr }}
				</template> -->
				<template slot="action" slot-scope="{ text, record }">
					<a style="margin-right: 5px" @click="() => handleEdit(record)">编辑</a>
					<a style="margin-right: 5px" @click="() => handleSub(record)">删除</a>
					<a style="margin-right: 5px" @click="() => handleMap(record)">位置查询</a>
				</template>
			</DataGridNew>
			<!--	新增编辑	 -->
			<edit-form ref="createModal" :visible="visible" :loading="confirmLoading" :url="url" :model="mdl"
				@cancel="handleCancel()" @ok="handleOk()" />
			<map-form ref="createMapModal" :mapVisible="mapVisible" :loading="confirmLoading" :model="map"
				@cancel="handleCancelMap()" @ok="handleOk()" />
		</div>
	</div>
</template>

<script>
	import {
		DataGridNew,
		TDictSelectSearchTag,
		TAreaLinkage
	} from "@/components";
	import {
		dataGridMixin
	} from "@/mixins/dataGridMixin";
	import editForm from "./modal/lcmEdit.vue";
	import mapForm from "./modal/map.vue";
	import TDictSelectTag from '@/components/TopVUI/dict/TDictSelectTag';
	import SearchArea from '@/components/table/advance/SearchArea'
	// 表格列字典数据处理
	import filterDictTextByCode from "@/components/TopVUI/dict/filterDictTextByCode";
	export default {
		name: "Table",
		components: {
			DataGridNew,
			editForm,
			filterDictTextByCode,
			mapForm,
			TDictSelectTag,
			TDictSelectSearchTag,
			TAreaLinkage
		},
		mixins: [dataGridMixin],
		filters: {
			sexStr(val) {
				switch (val) {
					case "male":
						return "男";
					case "female":
						return "女";
					case "unknown":
						return "未知";
				}
			},
		},
		data() {
			return {
				columns: [{
						title: "所属生产业务",
						width: 100,
						dataIndex: "belongEdproduction",
						fixed: 'left',
						align: "center"
					},
					{
						title: "点类别",
						dataIndex: "pointType",
						key: "pointType",
						fixed: 'left',
						align: "center"
					},
					{
						title: "位置点编码",
						dataIndex: "pointCode",
						key: "pointCode",
						width: 150,
						align: "center"
					},
					{
						title: "具体地址信息",
						dataIndex: "locationInformation",
						key: "locationInformation",
						width: 350,
						align: "center"
					},
					{
						title: "自定义名称",
						dataIndex: "customizeName",
						key: "customizeName",
						width: 150,
						align: "center"
					},
					{
						title: "经度",
						dataIndex: "longitude",
						key: "longitude",
						width: 150,
						align: "center"
					},
					{
						title: "纬度",
						dataIndex: "latitude",
						key: "latitude",
						width: 150,
						align: "center"
					},
					{
						title: "客户全称",
						dataIndex: "fullname",
						key: "fullname",
						width: 250,
						align: "center"
					},
					{
						title: "客户字号简称",
						dataIndex: "abbreviation",
						key: "abbreviation",
						width: 150,
						align: "center"
					},
					{
						title: "隶属集团",
						dataIndex: "affiliatedgroup",
						key: "affiliatedgroup",
						width: 150,
						align: "center"
					},
					{
						title: "省",
						dataIndex: "province",
						key: "province",
						width: 150,
						align: "center"
					},
					{
						title: "市",
						dataIndex: "city",
						key: "city",
						width: 150,
						align: "center"
					},
					{
						title: "区县",
						dataIndex: "district",
						key: "district",
						width: 150,
						align: "center"
					},
					{
						title: "镇",
						dataIndex: "township",
						key: "township",
						width: 150,
						align: "center"
					},
					{
						title: "路牌号",
						dataIndex: "roadNumber",
						width: 150,
						align: "center"
					},
					{
						title: "添加人",
						dataIndex: "creator",
						key: "creator",
						width: 150,
						align: "center"
					},
					{
						title: "添加时间",
						dataIndex: "createTime",
						key: "createTime",
						width: 150,
						align: "center"
					},
					{
						title: "最后修改人",
						dataIndex: "modifier",
						key: "modifier",
						width: 150,
						align: "center"
					},
					{
						title: "最后修改时间",
						dataIndex: "modifyTime",
						key: "modifyTime",
						width: 150,
						align: "center"
					},
					{
						title: "操作",
						dataIndex: "action",
						fixed: 'right',
						width: 140,
						align: "center",
						scopedSlots: {
							customRender: "action"
						},
					}
				],
				visible: false,
				confirmLoading: false,
				mdl: null,
				mapVisible: false,
				map: null,
				// 查询参数
				queryParam: {},
				url: {
					getPageSet: "/bdata/lineLocationPoint/getPageSet",
					save: "/bdata/lineLocationPoint/save",
					update: "/bdata/lineLocationPoint/update",
					deleteBatch: "/bdata/lineLocationPoint/deleteBatch",
					getDicItemByCode: "/system/dicSet/getDicItemByCode",
					getPointCode: "/bdata/lineLocationPoint/getPointCode"
				},
				pointTypeList: [{
						text: "出发/到达点",
						value: "出发/到达点"
					},
					{
						text: "高速点",
						value: "高速点"
					},
					{
						text: "下道点",
						value: "下道点"
					}
				],
			};
		},
		methods: {
			changePointType(e) {
				this.queryParam.pointType = e;
			},
			selDistrict(e) {
				this.queryParam.district = e;
			}
		},
	};
</script>

<style scoped lang="less">
	.table {
		background-color: @base-bg-color;
		padding: 24px;
	}
	.ant-select {
		width: 120px;
	}
</style>
