<template>
	<div class="page-common-layout">
		<div class="page-common-content">
			<div class="page-common-box-content">
				<tool-bar @search="$refs.table.refresh(true)" @reset="
				    () => {
				      (this.queryParam = {}), $refs.table.refresh(true);
				    }
				  ">
					<template slot="toolBtn" slot-scope="scope">
						<a-button class="cu-btn-primary" icon="plus" @click="handleAdd()" v-action:lineAddDialog>新增
						</a-button>
						<!-- <a-button
				      class="cu-btn-default"
				      icon="edit"
				      @click="handleEdit($refs.table.rows)"
				      v-action:sysSampleTabListEditDialog
				      >编辑</a-button
				    > -->
						<a-button class="cu-btn-danger" icon="delete" @click="handleSub($refs.table.selectedRowKeys)"
							v-action:lineDelDialog>删除</a-button>
						<a-button class="cu-btn-primary" icon="export"
							@click="handleExportXls(columns, 'cs_excel_user', 1)" v-action:lineEXPDialog>导出
						</a-button>
					</template>
					<!--  -->
					<template slot="toolForm">
						<a-form-item label="">
							<a-input v-model="queryParam.linename" placeholder="线路名称" />
						</a-form-item>
						<a-form-item label="">
							<t-dict-select-search-tag v-model="queryParam.lineType" :dataList="lineTypeList"
								placeholder="线路类型" @change="" dataType="static" />
						</a-form-item>
						<a-form-item label="">
							<t-dict-select-search-tag v-model="queryParam.carType" :dataList="carTypeList"
								placeholder="车辆类型" @change="" dataType="static" />
						</a-form-item>
						<a-form-item label="">
							<t-dict-select-search-tag v-model="queryParam.departureplaceCode" :dataList="departureplaceCodeList"
								placeholder="出发点编码" @change="" dataType="static" />
						</a-form-item>
						<a-form-item label="">
							<t-dict-select-search-tag v-model="queryParam.destinationCode" :dataList="destinationCodeList"
								placeholder="目的点编码" @change="" dataType="static" />
						</a-form-item>
						<a-form-item label="">
							<a-input v-model="queryParam.departureplaceInformation" placeholder="出发点具体信息" />
						</a-form-item>
						<a-form-item label="">
							<a-input v-model="queryParam.destinationInformation" placeholder="目的点具体信息" />
						</a-form-item>
						<a-form-item label="">
							<a-input v-model="queryParam.departureplaceCustomer" placeholder="出发点客户名称" />
						</a-form-item>
						<a-form-item label="">
							<a-input v-model="queryParam.destinationCustomer" placeholder="目的点客户名称" />
						</a-form-item>
						<a-form-item label="">
							<a-input v-model="queryParam.deliverCustomerGroup" placeholder="发货客户所属集团" />
						</a-form-item>
						<a-form-item label="">
							<a-input v-model="queryParam.receivingCustomerGroup" placeholder="收货客户所属集团" />
						</a-form-item>
						<a-form-item label="">
							<t-dict-select-search-tag v-model="queryParam.pointCode" :dataList="departureplaceCodeList"
								placeholder="位置点" @change="" dataType="static" />
						</a-form-item>
						<a-form-item label="">
							<t-dict-select-search-tag v-model="queryParam.pointGroupName" :dataList="pointGroupNameList"
								placeholder="线路组件" @change="" dataType="static" />
						</a-form-item>
						
						
						
						<!-- <a-form-item label="">
							<a-input v-model="queryParam.locationInformation" placeholder="具体地址信息" />
						</a-form-item> -->
						<!-- <a-form-item label="">
							<a-input v-model="queryParam.customizeName" placeholder="自定义名称" />
						</a-form-item>
						<a-form-item label="">
							<a-input v-model="queryParam.customizeName" placeholder="客户全称" />
						</a-form-item>
						<a-form-item label="">
							<a-input v-model="queryParam.affiliatedGroup" placeholder="隶属集团" />
						</a-form-item>
						<a-form-item label="">
						  <TAreaLinkage type="select" @change=""></TAreaLinkage>
						</a-form-item> -->
					</template>
				</tool-bar>
				<DataGridNew ref="table" size="small" :columns="columns" :url="url" bordered :pageSize="5" rowKey="uuid"
					showPagination="auto" @rowClick="customClick" :queryParam="queryParam">
					<span slot="sex" slot-scope="{ text }">
						{{ text | sexFilter }}
					</span>
					<span slot="testCombobox" slot-scope="{ text }">
						{{ text | testComboboxFilter }}
					</span>
					<span slot="action" slot-scope="{ text, record }">
						<template>
							<a @click="handleEdit(record)">编辑</a>
							<a-divider type="vertical" />
							<a @click="handleSub(record)">删除</a>
							<a-divider type="vertical" />
							<a @click="handleMap(record)">位置查询</a>
						</template>
					</span>
				</DataGridNew>
			</div>
			<edit-form ref="createModal" :visible="visible" :loading="confirmLoading" :model="mdl"
				@cancel="handleCancel()" @ok="handleOk()" @importL="importLocationPoint()" />
			<map-form ref="createMapModal" :mapVisible="mapVisible" :loading="confirmLoading" :model="map"
				@cancel="handleCancelMap()" @ok="handleOk" />
			<div class="page-common-box-content">
				<a-tabs default-active-key="1" @change="changTabs">
					<a-tab-pane key="1" tab="位置点">
						<child-one ref="childOne"></child-one>
					</a-tab-pane>
				</a-tabs>
			</div>

		</div>
	</div>
</template>

<script>
	import {
		dataGridMixin
	} from "@/mixins/dataGridMixin";
	import {
		DataGridNew,
		SearchArea,
		TDictSelectSearchTag
	} from "@/components";

	import editForm from "./modal/liEdit.vue";
	import childOne from "./modal/lineManagementSubOne.vue";
	import mapForm from "./modal/map.vue";
	// import childTwo from "./modal/childTwo.vue";

	export default {
		name: "TableList",
		mixins: [dataGridMixin],
		components: {
			DataGridNew,
			editForm,
			childOne,
			TDictSelectSearchTag,
			mapForm
			// childTwo
		},
		data() {
			return {
				columns: [{
						title: "线路名称",
						dataIndex: "linename",
						align: "center",
						fixed: "left",
						width: 100
					},
					{
						title: "线路类型",
						dataIndex: "lineType",
						fixed: "left",
						align: "center",
						width: 100
					},
					{
						title: "车辆类型",
						dataIndex: "carType",
						align: "center",
						width: 120
					},
					{
						title: "出发点编码",
						dataIndex: "departureplaceCode",
						align: "center",
						width: 100
					},
					{
						title: "目的点编码",
						dataIndex: "destinationCode",
						align: "center",
						width: 100
					},
					{
						title: "出发点具体地址信息",
						dataIndex: "departureplaceInformation",
						align: "center",
						width: 150
					},
					{
						title: "目的点具体地址信息",
						dataIndex: "destinationInformation",
						align: "center",
						width: 150
					},
					{
						title: "出发点省市市际线路解析",
						dataIndex: "departureplaceAnalysis",
						align: "center",
						width: 150
					},
					{
						title: "目的点省市市际线路解析",
						dataIndex: "destinationAnalysis",
						align: "center",
						width: 150
					},
					{
						title: "出发点客户名称",
						dataIndex: "departureplaceCustomer",
						align: "center",
						width: 150
					},
					{
						title: "目的点客户名称",
						dataIndex: "destinationCustomer",
						align: "center",
						width: 150
					},
					{
						title: "发货客户所属集团",
						dataIndex: "deliverCustomerGroup",
						align: "center",
						width: 150
					},
					{
						title: "收货客户所属集团",
						dataIndex: "receivingCustomerGroup",
						align: "center",
						width: 150
					},
					{
						title: "客户结算里程",
						dataIndex: "customerMileage",
						align: "center",
						width: 150
					},
					{
						title: "司机结算里程",
						dataIndex: "driverMileage",
						align: "center",
						width: 150
					},
					{
						title: "分包商结算里程",
						dataIndex: "subcontractorrMileage",
						align: "center",
						width: 150
					},
					{
						title: "线路实际高速里程",
						dataIndex: "actualHighwayMileage",
						align: "center",
						width: 150
					},
					{
						title: "线路实际下道里程",
						dataIndex: "actualUnderwayMileage",
						align: "center",
						width: 150
					},
					{
						title: "备注",
						dataIndex: "remark",
						align: "center",
						width: 80
					},
					{
						title: "添加人",
						dataIndex: "addUser",
						align: "center",
						width: 80
					},
					{
						title: "添加时间",
						dataIndex: "addTime",
						align: "center",
						width: 80
					},
					{
						title: "最后修改人",
						dataIndex: "modifyUser",
						align: "center",
						width: 100
					},
					{
						title: "最后修改时间",
						dataIndex: "modifyTime",
						align: "center",
						width: 100
					},
					{
						title: "操作",
						width: 160,
						dataIndex: "action",
						align: "center",
						scopedSlots: {
							customRender: "action",
						},
						fixed: 'right'
					},
				],
				visible: false,
				confirmLoading: false,
				mdl: null,
				// 查询参数
				queryParam: {
					pageSize: 5
				},
				url: {
					getPageSet: "/bdata/lineLine/getPageSet",
					save: "/bdata/lineLine/save",
					update: "/bdata/lineLine/update",
					deleteBatch: "/bdata/lineLine/deleteBatch",
					importLocationPoint: "/bdata/lineLineDetail/importLineDetail"
				},
				childOneQueryParam: {
					pageSize: 5
				},
				childTwoQueryParam: {},
				tabIndex: 1,
				lineTypeList: [{
						text: "A",
						value: "A"
					},
					{
						text: "B",
						value: "B"
					},
					{
						text: "C",
						value: "C"
					}
				],
				carTypeList: [{
						text: "普货",
						value: "普货"
					},
					{
						text: "危险品",
						value: "危险品"
					},
					{
						text: "通用",
						value: "通用"
					}
				],
				departureplaceCodeList: [],
				destinationCodeList: [],
				mapVisible: false,
				map: null,
				pointGroupNameList: []
			};
		},
		filters: {
			sexFilter(sex) {
				switch (sex) {
					case "male":
						return "男";
					case "female":
						return "女";
					case "unknown":
						return "未知";
				}
			},
			testComboboxFilter(val) {
				if (val === "true") {
					return "可排序";
				} else if (val === "false") {
					return "不可排序";
				}
			},
		},
		methods: {
			customClick(record, index) {
				this.$refs.table.rows = record;
				console.log('输出:', record);
				this.childOneQueryParam.pid = record.uuid;
				this.childTwoQueryParam.pid = record.uuid;
				this.getListFilter(this.tabIndex);
			},
			changTabs(key) {
				this.tabIndex = Number(key);
				this.$nextTick(() => {
					this.getListFilter(this.tabIndex);
				});
			},
			getListFilter(key) {
				if (key === 1) {
					this.$refs.childOne.queryParam = this.childOneQueryParam;
					this.$refs.childOne.refresh(); // 设置刷新子表
				} else if (key === 2 && this.$refs.childTwo) {
					this.$refs.childTwo.queryParam = this.childTwoQueryParam;
					this.$refs.childTwo.refresh(); // 设置刷新子表
				}
			}
		},
	};
</script>

<style lang="less"></style>
