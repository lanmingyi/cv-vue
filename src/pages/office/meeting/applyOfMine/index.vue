<template>
	<div class="page-common-layout">
		<div class="page-common-content">
			<div class="page-common-box-content">
				<tool-bar @search="resetSearchForm" @reset="resetForm
				">
					<template slot="toolBtn" slot-scope="scope">
						<a-button class="cu-btn-primary" icon="plus" @click="handleAdd()">会议申请</a-button>
						<a-button class="cu-btn-default" icon="edit" @click="handleEditApply">编辑</a-button>
						<a-button class="cu-btn-danger" icon="delete" @click="handleSub($refs.table.selectedRowKeys)">删除
						</a-button>
					</template>
					<template slot="toolForm">
						<a-form-item label="">
							<a-input v-model="queryParam.name" placeholder="议会名称" />
						</a-form-item>
						<a-form-item label="">
							<a-input v-model="queryParam.address" placeholder="议会地点" />
						</a-form-item>
					</template>
				</tool-bar>
				<DataGrid ref="table" size="small" :columns="columns" :url="url" bordered :pageSize="10" rowKey="uuid"
					showPagination="auto" @rowClick="masterRowClick" :queryParam="queryParam">
					<span slot="type" slot-scope="{text}">
						{{ text | typeFilter }}
					</span>
					<span slot="action" slot-scope="{text, record}">
						<template>
							<a v-if="record.state === 'gov.mettingRoomApplyStatus02'"
								@click="handleDetail(record)">申请详情</a>
							<span v-if="record.state === 'gov.mettingRoomApplyStatus01'">
								<a @click="handleEdit(record)">编辑</a>
								<a-divider type="vertical" />
								<a @click="handleSub(record)">删除</a>
							</span>
						</template>
					</span>
				</DataGrid>
			</div>
			<div class="page-common-box-content">
				<a-tabs default-active-key="1">
					<a-tab-pane key="1" tab="附件信息">
						<accessory-info ref="accessoryModal" :url="urlFile" tag="fds" label="fds" :model="rows"
							:params="queryParamSub"></accessory-info>
					</a-tab-pane>
				</a-tabs>
			</div>
			<edit-form ref="createModal" :visible="visible" :loading="confirmLoading" :model="mdl" :typeList="typeList"
				:organList="organList" :meetingList="meetingList" :securityList="securityList" @cancel="handleCancel()"
				@ok="handleOk({ isRelease: 'yes' })" @save="handleOk({ isRelease: 'no' })" />
			<detail-form ref="detailModal" :meetingList="typeList" :securityList="securityList"
				@cancel="handleCancelDetail()" :visible="visibleDetail" />
		</div>
	</div>
</template>

<script>
	import {
		dataGridMixin
	} from "@/mixins/dataGridMixin";
	import {
		DataGrid
	} from "@/components";
	import editForm from "./edit.vue";
	import detailForm from "./detail.vue";
	import accessoryInfo from "@/components/TopVUI/accessory/index";
	import moment from "moment";
	const columns = [{
			title: "会议名称",
			dataIndex: "nameOfProposedMeeting",
			ellipsis: true,
		},
		{
			title: "会议类型",
			dataIndex: "typees",
			width: 100,
		},
		{
			title: "开会时间",
			dataIndex: "startTime",
			ellipsis: true,
		},
		{
			title: "结束时间",
			dataIndex: "endTime",
			ellipsis: true,
		},
		{
			title: "会议地点",
			dataIndex: "conferenceRoomName",
			ellipsis: true,
		},
		{
			title: "申请时间",
			dataIndex: "applicatioNtime",
			ellipsis: true,
		},
		{
			title: "状态",
			dataIndex: "stateValue",
			width: 100,
			// scopedSlots: {
			// 	customRender: 'state'
			// }
		},
		{
			title: "操作",
			dataIndex: "action",
			fixed: "right",
			width: 100,
			scopedSlots: {
				customRender: "action",
			},
		},
	];
	export default {
		name: "TableList",
		mixins: [dataGridMixin],
		components: {
			DataGrid,
			editForm,
			detailForm,
			accessoryInfo,
		},
		data() {
			return {
				columns,
				queryParam: {},
				queryParamSub: {},
				url: {
					getPageSet: "/office/oaMeetingApplication/getPageSet",
					save: "/office/oaMeetingApplication/save",
					update: "/office/oaMeetingApplication/update",
					deleteBatch: "/office/oaMeetingApplication/deleteBatch",
					getListByPid: "/mdata/organization/getListByPid?pid=2",
					getMeetingRoom: "/office/officeConferenceRoom/getMettingRoomAddress",
					getDetailByUuid: "/system/topicBase/getPageSet",
					getDicItemByCode: "/system/dicSet/getDicItemByCode",
				},
				urlFile: {
					webUpload: "/document/fdfs/upload",
					getPageSet: "/document/fastdfs/getPageSet",
					deleteBatch: "/document/fdfs/delete",
					update: "/document/fastdfs/update",
					getPageSet: "/document/fastdfs/getPageSet",
				},
				mdlUserPost: null,
				visible: false,
				mdl: null,
				confirmLoading: false,
				selectedRowKeys: [],
				rows: "",
				masterUuids: "",
				meetingState: [],
				securityList: [],
				organList: [],
				meetingList: [],
				typeList: [],
				visibleDetail: false,
			};
		},
		computed: {
			rowSelection() {
				return {
					selectedRowKeys: this.selectedRowKeys,
					onChange: this.onSelectChange,
				};
			},
		},
		filters: {
			statusFilter(status) {
				const statusMap = {
					0: "待申请",
					1: "申请中",
					2: "待登记",
					3: "已登记",
				};
				return statusMap[status];
			},
		},
		mounted() {
			this.getCodeList();
		},
		methods: {
			moment,
			rowClassName(row) {
				return row.uuid === this.masterUuids ? "bg-bray" : "";
			},
			masterRowClick(record, index) {
				this.rows = record;
				this.masterUuids = record.uuid;
				this.queryParamSub.puuid = record.uuid;
				this.$refs.accessoryModal.refreshList(this.queryParamSub);
			},
			handleDetail(record) {
				this.visibleDetail = true;
				this.$refs.detailModal.onLoadData(record);
			},
			handleCancelDetail() {
				this.visibleDetail = false;
			},
			handleEditApply() {
				if (this.rows) {
					if (this.rows && this.rows.state === "已提交申请") {
						//'申请'
						this.$message.info("请选择未提交的数据");
					} else {
						this.handleEdit("all");
					}
				} else {
					this.$message.info("请选择未提交的数据");
				}
			},
			refreshOnload() {
				this.$refs.accessoryModal.refreshList({});
			},
			resetSearchForm() {
				this.$refs.table.refresh();
				this.queryParamSub = {};
				this.$refs.accessoryModal.refreshList(this.queryParamSub);
			},
			resetForm() {
				this.queryParam = {};
				this.resetSearchForm();
			},
			handleOk: function(paramar) {
				const form = this.$refs.createModal.form;
				this.confirmLoading = true;
				let url = "";
				form.validateFields((errors, values) => {
					let fromValue = {
						...values,
						...paramar,
					};
					console.log("fromValue", fromValue);
					if (!errors) {
						if (
							moment(fromValue.startTime).valueOf() < moment(new Date()).valueOf()
						) {
							this.$message.info("开始时间不能选择已过时间", 1.5);
							this.confirmLoading = false;
						} else if (
							moment(fromValue.startTime).valueOf() >
							moment(fromValue.endTime).valueOf()
						) {
							this.$message.info("开始时间不能大于结束时间", 1.5);
							this.confirmLoading = false;
						} else {
							if (values.uuid) {
								// 修改 e.g.
								url = this.url.update;
							} else {
								url = this.url.save;
							}
							this.$post(url, fromValue)
								.then((res) => {
									if (res.statusCode === 200 || res === 1) {
										this.visible = false;
										this.$refs.table.refresh();
										this.$message.success(
											res.message ? res.message : "操作成功",
											1.5
										);
									} else {
										this.$message.error(res.message, 1.5);
									}
								})
								.finally(() => {
									this.confirmLoading = false;
									this.rows = null;
									this.uuid = "";
									this.selectedRowKeys = [];
								});
						}
					} else {
						this.confirmLoading = false;
					}
				});
			},
			getCodeList() {
				// 获取会议类型
				this.$post(this.url.getDicItemByCode, {
					code: "meetingsType",
				}).then((res) => {
					if (res.statusCode !== 300) {
						this.typeList = res;
					}
				});
				// 会议状态
				this.$post(this.url.getDicItemByCode, {
					code: "meetingstate",
				}).then((res) => {
					if (res.statusCode !== 300) {
						this.meetingState = res;
					}
				});
				// 会议保障类型
				this.$post(this.url.getDicItemByCode, {
					code: "security",
				}).then((res) => {
					if (res.statusCode !== 300) {
						this.securityList = res;
					}
				});
				// 获取会议室
				this.$post(this.url.getMeetingRoom).then((res) => {
					if (res.statusCode !== 300) {
						this.meetingList = res;
					}
				});
				this.$post(this.url.getListByPid).then((res) => {
					console.log("res", res);
					this.organList = res;
				});
			},
		},
	};
</script>

<style lang="less"></style>
