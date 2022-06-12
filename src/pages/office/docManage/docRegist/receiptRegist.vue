<template>
	<div class="page-common-layout">
		<div class="page-common-content">
			<div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
				<div class="table-operator" v-show="key === 1">
					<a-button class="cu-btn-primary" icon="plus" @click="handlePut()">手工收文</a-button>
				</div>
				<div class="table-page-search-wrapper" v-show="key === 2">
					<a-form layout="inline">
						<div class="flex justify-between flex-wrap">
							<a-form-item label="">
								<a-input v-model="queryParam.trainName" placeholder="文号" />
							</a-form-item>
							<a-form-item label="">
								<a-input v-model="queryParam.trainName" placeholder="公文标题" />
							</a-form-item>
							<a-form-item label="">
								<a-input v-model="queryParam.trainName" placeholder="来文单位" />
							</a-form-item>
							<a-form-item label="">
								<a-input v-model="queryParam.trainName" placeholder="公文类别" />
							</a-form-item>
							<div class="table-page-search-submitButtons flex align-center">
								<a-button class="cu-btn-primary" @click="resetForm()">查询</a-button>
								<a-button class="cu-btn-filter" @click="resetSearchForm()">重置</a-button>
							</div>
						</div>
					</a-form>
				</div>
			</div>
			<a-tabs default-active-key="1" @change="changTabs">
				<a-tab-pane key="1" tab="待收公文">
					<s-table ref="masterList" size="small" :columns="columns" :data="loadData" bordered
						:rowSelection="rowSelection" rowKey="uuid" showPagination="auto"
						:rowClassName="rowClassName" @rowClick="masterRowClick">
						<span slot="serial" slot-scope="text, record, index">
							{{ index + 1 }}
						</span>
						<span slot="operate" slot-scope="text, record">
							<template>
								<!-- <a @click="handleReturn(record)">退回</a> -->
								<a @click="handlePut(record)">查看</a>
								<a-divider type="vertical" />
								<a @click="handleSign(record)">签收</a>
							</template>
						</span>
					</s-table>
				</a-tab-pane>
				<a-tab-pane key="2" tab="已收公文">
					<s-table ref="subList" rowKey="uuid" :columns="subColumns" bordered
						:rowSelection="subRowSelection" @rowClick="subRowClick" :rowClassName="subRowClassName"
						:data="loadDataSub">
						<span slot="serial" slot-scope="text, record, index">
							{{ index + 1 }}
						</span>
						<span slot="action" slot-scope="text, record">
							<template>
								<a @click="handlePut(record)">查看</a>
							</template>
						</span>
					</s-table>
				</a-tab-pane>
			</a-tabs>
			<edit-form ref="masterModal" :visibleType="masterVisible" :loading="masterConfirmLoading" :model="masterMdl"
				@cancel="handleCancel('master')" @return="handleReturn()" @sign="handleSign()" />
			<submit-form ref="submitModal" :visible="submitVisible" :loading="submitConfirmLoading" :model="masterMdl"
				@cancel="handleSubmitCancel()" @ok="handleSubmitOk()" />
		</div>
	</div>
</template>

<script>
	import {
		baseUrl
	} from "@/services/baseUrl.js";
	import {
		pdfStreamHandeler
	} from "@/services/common";
	import {
		STable
	} from "@/components";
	import {
		dataListMixin
	} from "@/mixins/dataListMixin";
	import editForm from "../editPut.vue";
	import submitForm from "../editSubmit.vue";
	const columns = [{
			title: "#",
			width: 50,
			align: "center",
			scopedSlots: {
				customRender: "serial",
			},
		},
		{
			title: "公文标题",
			dataIndex: "docTitle",
			ellipsis: true,
		},
		{
			title: "来文单位",
			dataIndex: "transUnitName",
		},
		{
			title: "文号",
			dataIndex: "postCode",
		},
		{
			title: "来文时间",
			dataIndex: "transUnitTime",
		},
		{
			title: "操作",
			width: 100,
			dataIndex: "operate",
			align: "center",
			scopedSlots: {
				customRender: "operate",
			},
		},
	];
	const subColumns = [{
			title: "#",
			width: 50,
			align: "center",
			scopedSlots: {
				customRender: "serial",
			},
		},
		{
			title: "公文标题",
			dataIndex: "docTitle",
			ellipsis: true,
		},
		{
			title: "来文单位",
			dataIndex: "transUnitName",
		},
		{
			title: "文号",
			dataIndex: "postCode",
		},
		{
			title: "来文时间",
			dataIndex: "transUnitTime",
		},
		{
			title: "当前节点",
			dataIndex: "nowNode",
		},
		{
			title: "操作",
			width: 50,
			dataIndex: "action",
			scopedSlots: {
				customRender: "action",
			},
		},
	];
	export default {
		name: "TableList",
		mixins: [dataListMixin],
		components: {
			STable,
			editForm,
			submitForm,
		},
		data() {
			this.columns = columns;
			this.subColumns = subColumns;
			return {
				queryParam: {},
				queryParamSub: {},
				queryParamTrainee: {},
				url: {
					getPageSet: "/system/topicBase/getPageSet",
				},
				urlpdf: {
					pdfStreamHandeler: "/system/attachment/pdfStreamHandeler",
				},
				loadData: (parameter) => {
					const requestParameters = Object.assign({}, parameter, this.queryParam);
					return this.$post(this.url.getPageSet, requestParameters).then(
						(res) => {
							var list = {
								pageNo: 1,
								pageSize: 10,
								rows: [{
										nameId: "code",
										name: "管理员",
										transUnitTime: "2018-06-12 10:49:01",
										transUnitName: "国务院",
										status: 1,
										docTitle: "示例执行器",
										uuid: "F9BF6730AC374624AAB327B49EBA7807",
										trainContent: "示例执行器123",
										postCode: "黔自然资规〔2020〕5号",
									},
									{
										nameId: "code",
										name: "管理员",
										transUnitTime: "2018-06-12 10:49:01",
										transUnitName: "国务院",
										status: 1,
										docTitle: "赵丽颖黑超遮面气场全开，高铁商务舱中狂凹造型",
										uuid: "97c3c7800c254e38955603206ba1285d",
										trainContent: "赵丽颖黑超遮面气场全开，高铁商务舱中狂凹造型123",
										postCode: "黔自然资规〔2020〕5号",
									},
									{
										nameId: "code",
										name: "管理员",
										transUnitTime: "2018-06-12 10:49:01",
										transUnitName: "国务院",
										status: 1,
										docTitle: "杨幂女儿太厉害，才4岁就看纯英文动画片",
										uuid: "bd85830e4a2c4ffaaa229ad76791adae",
										trainContent: "杨幂女儿太厉害，才4岁就看纯英文动画片123",
										postCode: "黔自然资规〔2020〕5号",
									},
									{
										nameId: "code",
										name: "管理员",
										transUnitTime: "2018-06-12 10:49:01",
										transUnitName: "国务院",
										status: 1,
										docTitle: "7步搞定4㎡卫生间装修，又省钱又上档次",
										uuid: "93c3e68af6654bd5a3290a5b24751bbe",
										trainContent: "7步搞定4㎡卫生间装修，又省钱又上档次123",
										postCode: "黔自然资规〔2020〕5号",
									},
								],
								totalCount: 1,
								totalPage: 1,
							};
							return list;
						}
					);
				},
				loadDataSub: (parameter) => {
					const requestParameters = Object.assign({},
						parameter,
						this.queryParamSub
					);
					return this.$post(this.url.getPageSet, requestParameters).then(
						(res) => {
							var list = {
								pageNo: 0,
								pageSize: 0,
								rows: [{
									nameId: "code",
									name: "管理员",
									transUnitTime: "2018-06-12 10:49:01",
									transUnitName: "国务院",
									status: 1,
									docTitle: "7步搞定4㎡卫生间装修，又省钱又上档次",
									uuid: "93c3e68af6654bd5a3290a5b24751bbe",
									trainContent: "7步搞定4㎡卫生间装修，又省钱又上档次123",
									postCode: "黔自然资规〔2020〕5号",
									nowNode: "1/1",
								}, ],
								totalCount: 0,
								totalPage: 0,
							};
							return list;
						}
					);
				},
				key: 1,
				subVisible: false,
				SubLoadingUserPost: false,
				SubConfirmLoading: false,
				mdlUserPost: null,
				masterVisible: false,
				masterMdl: null,
				masterConfirmLoading: false,
				detailConfirmLoading: false,
				trainList: [{
					text: "礼仪",
					value: "礼仪",
				}, ],
				masterSelectedRowKeys: [],
				masterRows: "",
				masterUuids: "",
				subSelectedRowKeys: [],
				subRows: "",
				subUUids: "",
				imgVisible: false,
				imgPreview: "",
				meetingState: [],
				visibleDetail: false,
				submitVisible: false,
				submitConfirmLoading: false,
			};
		},
		computed: {
			rowSelection() {
				return {
					selectedRowKeys: this.masterSelectedRowKeys,
					onChange: this.onSelectChangeMaster,
				};
			},
			subRowSelection() {
				return {
					selectedRowKeys: this.subSelectedRowKeys,
					onChange: this.onSelectChangeSub,
				};
			},
		},
		mounted() {},
		methods: {
			handleSubmitCancel() {
				this.submitVisible = false;
			},
			handleSubmitOk() {
				this.submitVisible = false;
			},
			handlePut(record) {
				this.masterVisible = true;
				if (record) {
					this.$refs.masterModal.edit("disabled");
				} else {
					this.$refs.masterModal.add();
				}
			},
			handleReturn(record) {
				var that = this;
				var tips = "";
				if (record) {
					tips = record.docTitle;
				} else {
					tips = "这条公文";
				}
				that.$confirm({
					title: "警告",
					content: `是否退回《` + tips + "》？",
					okText: "确定",
					okType: "danger",
					cancelText: "取消",
					onOk() {
						that.$message.error("退回数据失败");
					},
					onCancel() {
						console.log("Cancel");
					},
				});
			},
			handleSign(record) {
				this.submitVisible = true;
				// var that = this
				// var tips = ''
				// if(record){
				// 	tips = record.docTitle
				// }else{
				// 	tips = '这条公文'
				// }
				// that.$confirm({
				// 	title: '警告',
				// 	content: `是否签收《` + tips + '》？',
				// 	okText: '确定',
				// 	okType: 'danger',
				// 	cancelText: '取消',
				// 	onOk() {
				// 		that.$message.error('签收数据失败')
				// 	},
				// 	onCancel() {
				// 		console.log('Cancel')
				// 	}
				// })
			},
			handlePreview(record) {
				this.masterVisible = true;
			},
			changTabs(key) {
				var that = this;
				that.key = Number(key);
				that.$nextTick(() => {
					setTimeout(() => {
						if (that.key === 1 && that.$refs.masterList) {
							that.$refs.masterList.refresh(); // 设置刷新子表
						} else if (that.key === 2 && that.$refs.subList) {
							that.$refs.subList.refresh(); // 设置刷新子表
						}
					}, 10);
				});
			},
			rowClassName(row) {
				return row.uuid === this.masterUuids ? "bg-bray" : "";
			},
			subRowClassName(row) {
				return row.uuid === this.subUuids ? "bg-bray" : ""; // 每条数据的唯一识别值
			},
			masterRowClick(record, index) {
				this.masterRows = record;
				this.masterUuids = record.uuid;
				this.queryParamSub.puuid = record.uuid;
				this.queryParamSub.page = this.queryParamSub.page ?
					this.queryParamSub.page :
					"1";
				this.queryParamSub.rows = this.queryParamSub.pageSize ?
					this.queryParamSub.pageSize :
					"10";
				if (this.key === 1 && this.$refs.subList) {
					this.$refs.subList.refresh();
				} else if (this.key === 2 && this.$refs.traineeList) {
					this.$refs.traineeList.refreshList(this.queryParamSub);
				}
			},
			subRowClick(record, index) {
				this.subRows = record;
				this.subUuids = record.uuid;
			},
			handleDetailCancel() {
				this.visibleDetail = false;
			},
			handleDetailOk() {
				this.visibleDetail = false;
			},
			handleBrowse(record) {
				this.visibleDetail = true;
				let form = {};
				form = this.$refs.detailModal.form;
				form.resetFields();
			},
			resetForm() {
				this.$refs.masterList.refresh();
			},
			resetSearchForm() {
				this.queryParam = {};
				this.$refs.masterList.refresh();
			},
		},
	};
</script>

<style lang="less">
	.rowColorRed {
		background-color: #ffd2d2;
	}

	.ant-tag-blue {
		color: white;
		background: #009688;
		border-color: #009688;
	}

	.ant-tag-red {
		color: white;
		background: #ff5722;
		border-color: #ff5722;
	}
</style>
