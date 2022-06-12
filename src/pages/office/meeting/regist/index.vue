<template>
	<div class="page-common-layout">
		<div class="page-common-content">
			<div class="page-common-box-content">
				<tool-bar @search="resetSearchForm" @reset="resetForm
				">
					<template slot="toolBtn" slot-scope="scope">
						<a-button class="cu-btn-danger" icon="delete" @click="handleSub($refs.table.selectedRowKeys)">删除
						</a-button>
					</template>
					<template slot="toolForm">
						<a-form-item label="">
							<a-input v-model="queryParam.mettingName" placeholder="议会名称" />
						</a-form-item>
						<a-form-item label="">
							<a-input v-model="queryParam.mettingAddress" placeholder="议会地点" />
						</a-form-item>
					</template>
				</tool-bar>
				<DataGrid ref="table" size="small" :columns="columns" :url="url" bordered :pageSize="10" rowKey="uuid"
					showPagination="auto" @rowClick="masterRowClick" :queryParam="queryParam">
					<span slot="status" slot-scope="{text}">
						{{ text | statusFilter }}
					</span>
					<span slot="action" slot-scope="{text, record}">
						<template>
							<a v-if="record.state === '待登记'" @click="handleDetail(record)">登记</a>
							<a-divider type="vertical" v-if="record.state === '待登记'" />
							<a v-if="record.state === '已登记'" @click="handleDetail(record, '1')">修改</a>
							<a-divider type="vertical" v-if="record.state === '已登记'" />
							<a @click="handleSub(record)">取消</a>
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
				:meetingList="meetingList" :organList="organList" :securityList="securityList" @cancel="handleCancel()"
				@ok="handleOk()" />
			<detail-form ref="detailModal" :typeList="typeList" :noticeList="noticeList" :meetingList="meetingList"
				:organList="organList" :securityList="securityList" :visible="detailVisible"
				:loading="detailConfirmLoading" :model="mdl" @cancel="handleDetailCancel()" @ok="handleFaOk('yes')"
				@save="handleFaOk('no')" @update="handleFaUpdate('no')" />
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
	const columns = [
		{
			title: "会议名称",
			dataIndex: "mettingName",
			ellipsis: true,
		},
		{
			title: "会议地点",
			dataIndex: "mettingAddress",
			ellipsis: true,
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
			title: "会议类型",
			dataIndex: "mettingType",
			width: 100,
		},
		{
			title: "参会人数",
			dataIndex: "numberParticipants",
		},
		{
			title: "申请单位",
			dataIndex: "applicationDepartmentName",
			ellipsis: true,
		},
		{
			title: "状态",
			dataIndex: "state",
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
					getPageSet: "/office/officeMeetingRegister/getPageSet",
					save: "/office/officeMeetingRegister/save",
					update: "/office/officeMeetingRegister/update",
					deleteBatch: "/office/officeMeetingRegister/deleteBatch",
					getDetailByUuid: "/system/attachment/getListByPuuid",
					getDetailBystae: "/office/oaMeetingroomBase/getDetailBystae",
					jsonUpdate: "/office/officeMeetingRegister/update",
					jsonSave: "/office/officeMeetingRegister/save",
					getDicItemByCode: "/system/dicSet/getDicItemByCode",
					deleteAttachment: "/system/attachment/delete",
					getListByPid: "/mdata/organization/getListByPid?pid=2",
					getMeetingRoom: "/office/officeConferenceRoom/getMettingRoomAddress",
				},
				urlFile: {
					webUpload: "/document/fdfs/upload",
					getPageSet: "/document/fastdfs/getPageSet",
					deleteBatch: "/document/fdfs/delete",
					update: "/document/fastdfs/update",
					getPageSet: "/document/fastdfs/getPageSet",
				},
				loadData: (parameter) => {
					const requestParameters = Object.assign({}, parameter, this.queryParam);
					return this.$post(this.url.getPageSet, requestParameters).then(
						(res) => {
							return res;
						}
					);
				},
				mdlUserPost: null,
				visible: false,
				mdl: null,
				confirmLoading: false,
				detailVisible: false,
				detailConfirmLoading: false,
				selectedRowKeys: [],
				rows: "",
				masterUuids: "",
				meetingState: [],
				securityList: [],
				organList: [],
				noticeList: [],
				meetingList: [],
				typeList: [],
				strongId: "",
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
					1: "待登记",
					2: "已登记",
				};
				return statusMap[status];
			},
		},
		mounted() {
			this.getCodeList();
		},
		methods: {
			rowClassName(row) {
				return row.uuid === this.masterUuids ? "bg-bray" : "";
			},
			masterRowClick(record, index) {
				this.rows = record;
				this.masterUuids = record.uuid;
				this.queryParamSub.puuid = record.uuid;
				this.$refs.accessoryModal.refreshList(this.queryParamSub);
			},
			handleDetail(record, type) {
				const form = this.$refs.detailModal.form;
				form.resetFields(); // 清理表单数据（可不做）
				this.detailVisible = true;
				this.$refs.detailModal.add(record, type);
			},
			handleDetailCancel() {
				this.detailVisible = false;
			},
			handleDetailOk() {
				this.detailVisible = false;
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
			getCodeList() {
				// 获取会议类型
				this.$post(this.url.getDicItemByCode, {
					code: "meetingsType",
				}).then((res) => {
					if (res.statusCode !== 300) {
						this.typeList = res;
						console.log("this.typeList", this.typeList);
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
				// 会议通知方式
				this.$post(this.url.getDicItemByCode, {
					code: "meetingNotice",
				}).then((res) => {
					if (res.statusCode !== 300) {
						this.noticeList = res;
					}
				});
				// 获取会议室
				this.$post(this.url.getMeetingRoom).then((res) => {
					if (res.statusCode !== 300) {
						console.log("res", res);
						this.meetingList = res;
					}
				});
				this.$post(this.url.getListByPid).then((res) => {
					this.organList = res;
				});
			},
			handleFaOk(type) {
				let form = {};
				let url = "";
				form = this.$refs.detailModal.form;
				form.validateFields((errors, values) => {
					values.isRelease = type;
					console.log(values, type);
					if (!errors) {
						this.detailConfirmLoading = true;
						if (values.uuid) {
							url = this.url.update;
						} else {
							url = this.url.save;
						}
						this.$post(url, values)
							.then((res) => {
								if (res === 1 || res.statusCode === 200) {
									// 重置表单数据
									// form.resetFields()
									this.detailVisible = false;
									// 刷新表格
									this.$refs.table.refresh();
									this.$message.success(res.message ? res.message : "操作成功");
								} else {
									this.$message.error(res.message);
								}
							})
							.finally(() => {
								this.detailConfirmLoading = false;
							});
					}
				});
			},
			handleFaUpdate(type) {
				let form = {};
				form = this.$refs.detailModal.form;
				form.validateFields((errors, values) => {
					values.isRelease = type;
					if (!errors) {
						this.detailConfirmLoading = true;
						values.type = "meetingRegisterUpdate";
						console.log(values, this.url.update);
						this.$post(this.url.update, values)
							.then((res) => {
								if (res === 1 || res.statusCode === 200) {
									this.detailVisible = false;
									this.$refs.table.refresh();
									this.$message.success(res.message ? res.message : "操作成功");
								} else {
									this.$message.error(res.message);
								}
							})
							.finally(() => {
								this.detailConfirmLoading = false;
							});
					}
				});
			},
		},
	};
</script>

<style lang="less"></style>
