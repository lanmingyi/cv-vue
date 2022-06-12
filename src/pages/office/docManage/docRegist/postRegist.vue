<template>
	<div class="page-common-layout">
		<div class="page-common-content">
				<a-tabs default-active-key="1" @change="changTabs">
					<a-tab-pane key="1" tab="待发文">
						<s-table ref="masterList" size="small" :columns="columns" :data="loadData" bordered
							:rowSelection="rowSelection" rowKey="uuid" showPagination="auto"
							:rowClassName="rowClassName" @rowClick="masterRowClick">
							<span slot="serial" slot-scope="text, record, index">
								{{ index + 1 }}
							</span>
							<span slot="emergStatus" slot-scope="text, record, index">
								{{ text | statusFilter }}
							</span>
							<span slot="operate" slot-scope="text, record">
								<template>
									<a @click="handlePost(record)">编号发文</a>
								</template>
							</span>
						</s-table>
					</a-tab-pane>
					<a-tab-pane key="2" tab="已发文">
						<s-table ref="subList" rowKey="uuid" bordered :columns="subColumns"
							:rowSelection="subRowSelection" @rowClick="subRowClick" :rowClassName="subRowClassName"
							:data="loadDataSub">
							<span slot="serial" slot-scope="text, record, index">
								{{ index + 1 }}
							</span>
							<span slot="action" slot-scope="text, record">
								<template>
									<a @click="handleDatail(record)">查看</a>
								</template>
							</span>
						</s-table>
					</a-tab-pane>
				</a-tabs>
			<edit-form ref="masterModal" :visible="masterVisible" :loading="masterConfirmLoading" :model="masterMdl"
				@cancel="handleCancel('master')" @return="handleReturn()" @sign="handleSign()" />
			<detail-form ref="detailModal" :visibleType="detailVisible" :loading="detailConfirmLoading" :model="masterMdl"
				@cancel="handleDetailCancel('master')" @ok="handleDetailOk()" />
			<post-form ref="postModal" :visibleType="postVisible" :loading="postConfirmLoading" :model="masterMdl"
				@cancel="handlePostCancel('master')" @ok="handlePostOk()" />
		</div>
	</div>
</template>

<script>
	import {
		baseUrl
	} from '@/services/baseUrl.js';
	import {
		pdfStreamHandeler
	} from '@/services/common';
	import {
		STable
	} from '@/components';
	import {
		dataListMixin
	} from '@/mixins/dataListMixin';
	import editForm from '../edit.vue';
	import detailForm from '../postDetail.vue';
	import postForm from '../editDoc.vue';
	const columns = [{
			title: '#',
			width: 50,
			align: 'center',
			scopedSlots: {
				customRender: 'serial',
			},
		},
		{
			title: '公文标题',
			dataIndex: 'docTitle',
		},
		{
			title: '发文流水号',
			dataIndex: 'postCode',
		},
		{
			title: '公文类别',
			dataIndex: 'docType',
		},
		{
			title: '拟文部门',
			dataIndex: 'postUnitName',
		},
		{
			title: '承办人',
			dataIndex: 'promoter',
		},
		{
			title: '提交时间',
			dataIndex: 'postUnitTime',
		},
		{
			title: '紧急程度',
			dataIndex: 'emergStatus',
			scopedSlots: {
				customRender: 'emergStatus',
			},
		},
		{
			title: '操作',
			width: 100,
			dataIndex: 'operate',
			scopedSlots: {
				customRender: 'operate',
			},
		},
	];
	const subColumns = [{
			title: '#',
			width: 50,
			align: 'center',
			scopedSlots: {
				customRender: 'serial',
			},
		},
		{
			title: '发文流水号',
			dataIndex: 'postCode',
		},
		{
			title: '公文标题',
			dataIndex: 'docTitle',
		},
		{
			title: '公文类别',
			dataIndex: 'docType',
		},
		{
			title: '拟文部门',
			dataIndex: 'postUnitName',
		},
		{
			title: '承办人',
			dataIndex: 'promoter',
		},
		{
			title: '发文时间',
			dataIndex: 'postUnitTime',
		},
		{
			title: '签收进度',
			dataIndex: 'nowNode',
		},
		{
			title: '操作',
			width: 100,
			dataIndex: 'action',
			scopedSlots: {
				customRender: 'action',
			},
		},
	];
	export default {
		name: 'TableList',
		mixins: [dataListMixin],
		components: {
			STable,
			editForm,
			detailForm,
			postForm,
		},
		data() {
			this.columns = columns;
			this.subColumns = subColumns;
			return {
				queryParam: {},
				queryParamSub: {},
				queryParamTrainee: {},
				url: {
					getPageSet: '/system/topicBase/getPageSet',
				},
				urlpdf: {
					pdfStreamHandeler: '/system/attachment/pdfStreamHandeler',
				},
				loadData: (parameter) => {
					const requestParameters = Object.assign({}, parameter, this.queryParam);
					return this.$post(this.url.getPageSet, requestParameters).then((res) => {
						var list = {
							pageNo: 1,
							pageSize: 10,
							rows: [{
									nameId: 'code',
									promoter: '管理员',
									postUnitTime: '2018-06-12 10:49:01',
									postUnitName: '国务院',
									emergStatus: 1,
									docType: '通知',
									docTitle: '示例执行器',
									uuid: 'F9BF6730AC374624AAB327B49EBA7807',
									trainContent: '示例执行器123',
									postCode: '黔自然资规〔2020〕5号',
								}
							],
							totalCount: 1,
							totalPage: 1,
						};
						return list;
					});
				},
				loadDataSub: (parameter) => {
					const requestParameters = Object.assign({}, parameter, this.queryParamSub);
					return this.$post(this.url.getPageSet, requestParameters).then((res) => {
						var list = {
							pageNo: 0,
							pageSize: 0,
							rows: [{
								nameId: 'code',
								promoter: '管理员',
								transUnitTime: '2018-06-12 10:49:01',
								postUnitName: '国务院',
								emergStatus: 1,
								docType: '通知',
								docTitle: '7步搞定4㎡卫生间装修，又省钱又上档次',
								uuid: '93c3e68af6654bd5a3290a5b24751bbe',
								trainContent: '7步搞定4㎡卫生间装修，又省钱又上档次123',
								postCode: '黔自然资规〔2020〕5号',
								nowNode: '1/1',
							}, ],
							totalCount: 0,
							totalPage: 0,
						};
						return list;
					});
				},
				key: 1,
				subVisible: false,
				SubLoadingUserPost: false,
				SubConfirmLoading: false,
				mdlUserPost: null,
				masterVisible: false,
				masterMdl: null,
				masterConfirmLoading: false,
				detailVisible: false,
				detailConfirmLoading: false,
				postVisible: false,
				postConfirmLoading: false,
				trainList: [{
					text: '礼仪',
					value: '礼仪',
				}, ],
				masterSelectedRowKeys: [],
				masterRows: '',
				masterUuids: '',
				subSelectedRowKeys: [],
				subRows: '',
				subUUids: '',
				imgVisible: false,
				imgPreview: '',
				meetingState: [],
			};
		},
		filters: {
			statusFilter(status) {
				const statusMap = {
					0: '常规',
					1: '紧急',
					2: '特急',
				};
				return statusMap[status];
			},
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
			handlePost(record) {
				this.postVisible = true;
				this.$refs.postModal.edit()
			},
			handlePostCancel() {
				this.postVisible = false;
			},
			handlePostOk() {
				this.postVisible = false;
			},
			handleDatail() {
				this.detailVisible = true;
				this.$refs.detailModal.edit()
			},
			handleDetailCancel() {
				this.detailVisible = false;
			},
			handleDetailOk() {
				this.detailVisible = false;
			},
			handleReturn(record) {
				var that = this;
				var tips = '';
				if (record) {
					tips = record.docTitle;
				} else {
					tips = '这条公文';
				}
				that.$confirm({
					title: '警告',
					content: `是否退回《` + tips + '》？',
					okText: '确定',
					okType: 'danger',
					cancelText: '取消',
					onOk() {
						that.$message.error('退回数据失败');
					},
					onCancel() {
						console.log('Cancel');
					},
				});
			},
			handleSign(record) {
				var that = this;
				var tips = '';
				if (record) {
					tips = record.docTitle;
				} else {
					tips = '这条公文';
				}
				that.$confirm({
					title: '警告',
					content: `是否签收《` + tips + '》？',
					okText: '确定',
					okType: 'danger',
					cancelText: '取消',
					onOk() {
						that.$message.error('签收数据失败');
					},
					onCancel() {
						console.log('Cancel');
					},
				});
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
				return row.uuid === this.masterUuids ? 'bg-bray' : '';
			},
			subRowClassName(row) {
				return row.uuid === this.subUuids ? 'bg-bray' : ''; // 每条数据的唯一识别值
			},
			masterRowClick(record, index) {
				this.masterRows = record;
				this.masterUuids = record.uuid;
				this.queryParamSub.puuid = record.uuid;
				this.queryParamSub.page = this.queryParamSub.page ? this.queryParamSub.page : '1';
				this.queryParamSub.rows = this.queryParamSub.pageSize ? this.queryParamSub.pageSize : '10';
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
