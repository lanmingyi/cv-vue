<template>
	<div class="page-common-layout">
		<div class="page-common-content">
			<tool-bar @search="$refs.table.refresh(true)" @reset="
			    () => {
			      (this.queryParam = {}), $refs.table.refresh(true);
			    }
			  ">
				<template slot="toolForm">
					<a-form-item label="">
						<a-input v-model="queryParam.name" placeholder="会议室名称" />
					</a-form-item>
				</template>
			</tool-bar>
			<DataGrid ref="table" :columns="columns" :url="url" :queryParam="queryParam" rowKey="uuid"
				:format-conditions="true">
				<span slot="stateText" slot-scope="{text, record, index}">
					<div v-if="record.state == 'meetingRoom.foundation.roomStatus04'" style="color: red;">
						{{ text }}
					</div>
					<div v-else>{{ text }}</div>
				</span>
				<span slot="operate" slot-scope="{operate, record}">
					<template v-if="record.state === 'meetingRoom.foundation.roomStatus01'">
						<a @click="handleDetail(record)">预定详情</a>
					</template>
				</span>
			</DataGrid>
			<!-- 			<detail-form ref="createModal" :visible="visible" :typeNum="2" :loading="confirmLoading" :meetingList="meetingList" :model="mdl" @cancel="handleCancel()"
			 @ok="handleOk()" /> -->
			<detail-form ref="detailModal" :visible="detailVisible" :loading="detailConfirmLoading"
				:meetingList="meetingList" :model="mdl" @cancel="
          () => {
            detailVisible = false;
          }
        " />
		</div>
	</div>
</template>

<script>
	import {
		DataGrid
	} from "@/components";
	import {
		dataGridMixin
	} from "@/mixins/dataGridMixin";
	import detailForm from "./reserveScheduler.vue";
	const columns = [
		{
			title: "会议室名称",
			dataIndex: "name",
			ellipsis: true,
		},
		{
			title: "地点",
			dataIndex: "address",
			ellipsis: true,
		},
		{
			title: "容纳人数",
			dataIndex: "numberOfPeople",
			ellipsis: true,
		},
		{
			title: "所属单位",
			dataIndex: "departmentName",
			ellipsis: true,
		},
		{
			title: "管理者",
			dataIndex: "managementName",
			ellipsis: true,
		},
		{
			title: "设备",
			dataIndex: "equipment",
			ellipsis: true,
		},
		{
			title: "状态",
			dataIndex: "stateText",
			width: 80,
			scopedSlots: {
				customRender: "stateText",
			},
			ellipsis: true,
		},
		{
			title: "操作",
			dataIndex: "operate",
			width: 100,
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
			detailForm,
		},
		data() {
			return {
				columns,
				queryParam: {},
				queryParamSub: {},
				url: {
					getPageSet: "/office/officeConferenceRoom/getPageSet",
					save: "/office/oaConferenceRoomReserve/save",
					update: "/office/oaConferenceRoomReserve/save",
					deleteBatch: "/office/officeConferenceRoom/deleteBatch",
					getListByPid: "/mdata/organization/getListByPid?pid=2",
					getMeetingRoom: "/office/officeConferenceRoom/getMettingRoomAddress",
				},
				mdlUserPost: null,
				visible: false,
				mdl: null,
				confirmLoading: false,
				detailConfirmLoading: false,
				detailVisible: false,
				selectedRowKeys: [],
				rows: "",
				masterUuids: "",
				statusList: [],
				meetingList: [],
			};
		},
		filters: {
			statusFilter(status) {
				const statusMap = {
					"meetingRoom.foundation.roomStatus01": "可使用",
					"meetingRoom.foundation.roomStatus02": "正在使用",
					"meetingRoom.foundation.roomStatus03": "移除",
					"meetingRoom.foundation.roomStatus04": "停用",
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
			this.getCodeData();
		},
		methods: {
			rowClassName(row) {
				return row.uuid === this.masterUuids ? "bg-bray" : "";
			},
			masterRowClick(record, index) {
				this.rows = record;
				this.masterUuids = record.uuid;
			},
			resetForm() {
				this.$refs.table.refresh();
			},
			resetSearchForm() {
				this.queryParam = {};
				this.$refs.table.refresh();
			},
			handleDetail(item) {
				this.detailVisible = true;
				this.$refs.detailModal.onLoad(item);
			},
			getCodeData() {
				// 获取会议室
				this.$post(this.url.getMeetingRoom).then((res) => {
					if (res.statusCode !== 300) {
						this.meetingList = res;
					}
				});
			},
		},
	};
</script>

<style lang="less"></style>
