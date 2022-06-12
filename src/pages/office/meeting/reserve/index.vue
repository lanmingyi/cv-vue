<template>
	<div class="page-common-layout">
		<div class="page-common-content">
			<tool-bar @search="$refs.table.refresh(true)" @reset="
			    () => {
			      (this.queryParam = {}), $refs.table.refresh(true);
			    }
			  ">
				<template slot="toolBtn" slot-scope="scope">
					<a-button class="cu-btn-danger" icon="delete" @click="handleSub($refs.table.selectedRowKeys)">删除</a-button>
				</template>
			</tool-bar>
			<DataGrid ref="table" :columns="columns" :url="url" :queryParam="queryParam" rowKey="uuid"
				:format-conditions="true">
				<span slot="reserveStartDate" slot-scope="{text, record, index}">
					{{ moment(record.reserveStartDate).format("yyyy-MM-DD HH:mm") }}
					-
					{{ moment(record.reserveEndDate).format("yyyy-MM-DD HH:mm") }}
				</span>
				<span slot="status" slot-scope="{text, record, index}">
					{{ text | statusFilter }}
				</span>
				<span slot="operate" slot-scope="{operate, record}">
					<template>
						<span v-if="record.state === '申请中'">
							<a @click="handleEdit(record)">更改</a>
							<a-divider type="vertical" />
						</span>
						<span v-if="record.state != '申请中' && record.state != '被驳回'">
							<a @click="handleReapply(record, 'switchPosition')">调换</a>
							<a-divider type="vertical" />
						</span>
						<span v-if="record.state == '被驳回'">
							<a @click="handleReapply(record, 'reApply')">重新申请</a>
							<a-divider type="vertical" />
						</span>
						<a @click="handleSub(record)">取消预定</a>
					</template>
				</span>
			</DataGrid>
			<edit-form ref="createModal" :meetingList="meetingList" :typeNum="1" :visible="visible"
				:loading="confirmLoading" :model="mdl" @cancel="handleCancel()" @ok="handleOk()"
				@reply="handleOk({ type: 'reApply' })" @switchPosition="handleOk({ type: 'switchPosition' })" />
		</div>
	</div>
</template>

<script>
	import moment from "moment";

	import {
		DataGrid
	} from "@/components";
	import {
		dataGridMixin
	} from "@/mixins/dataGridMixin";
	import editForm from "./edit.vue";
	const columns = [
		{
			title: "议题",
			dataIndex: "topics",
		},
		{
			title: "会议室名称",
			dataIndex: "conferenceRoomName",
		},
		{
			title: "会议室地点",
			dataIndex: "address",
		},
		{
			title: "参会人数",
			dataIndex: "attendNumberOfPeople",
			width: 100,
		},
		{
			title: "使用时间",
			dataIndex: "reserveStartDate",
			width: 250,
			ellipsis: true,
			scopedSlots: {
				customRender: "reserveStartDate",
			},
		},
		{
			title: "操作",
			dataIndex: "operate",
			width: 150,
			fixed: "right",
			scopedSlots: {
				customRender: "operate",
			},
		},
	];
	export default {
		name: "TableList",
		mixins: [dataGridMixin],
		components: {
			DataGrid,
			editForm,
		},
		data() {
			return {
				columns,
				queryParam: {},
				queryParamSub: {},
				url: {
					getPageSet: "/office/oaConferenceRoomReserve/getPageSet",
					save: "/office/oaConferenceRoomReserve/save",
					update: "/office/oaConferenceRoomReserve/update",
					deleteBatch: "/office/oaConferenceRoomReserve/deleteBatch",
					getDicItemByCode: "/system/dicSet/getDicItemByCode",
					getListByPid: "/mdata/organization/getListByPid?pid=2",
					getMeetingRoom: "/office/officeConferenceRoom/getMettingRoomAddress",
					getUpdataData: "/office/oaConferenceRoomReserve/reserverOperation",
				},
				mdlUserPost: null,
				visible: false,
				mdl: null,
				confirmLoading: false,
				selectedRowKeys: [],
				rows: "",
				masterUuids: "",
				meetingList: [],
			};
		},
		filters: {
			statusFilter(status) {
				const statusMap = {
					0: "申请中",
					1: "同意",
					2: "调换中",
					3: "同意调换",
				};
				return statusMap[status];
			},
		},
		computed: {
			rowSelection() {
				return {
					selectedRowKeys: this.selectedRowKeys,
					onChange: this.onSelectChange,
				};
			},
		},
		mounted() {
			this.getCodeList();
		},
		methods: {
			moment,
			changeTime(data, datastr) {
				this.queryParam.startTime = datastr[0];
				this.queryParam.endTime = datastr[1];
			},
			handleReapply(record, type) {
				this.visible = true;
				const form = this.$refs.createModal.form;
				form.resetFields();
				this.$refs.createModal.edit(record, type);
			},
			rowClassName(row) {
				return row.uuid === this.masterUuids ? "bg-bray" : "";
			},
			masterRowClick(record, index) {
				this.rows = record;
				this.masterUuids = record.uuid;
			},
			getCodeList() {
				// 获取会议室
				this.$post(this.url.getMeetingRoom).then((res) => {
					if (res.statusCode !== 300) {
						this.meetingList = res;
					}
				});
			}
		},
	};
</script>

<style lang="less"></style>
