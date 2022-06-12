<template>
	<div class="page-common-layout">
		<div class="page-common-content">
			<tool-bar @search="$refs.table.refresh(true)" @reset="
			    () => {
			      (this.queryParam = {}), $refs.table.refresh(true);
			    }
			  ">
				<template slot="toolBtn" slot-scope="scope">
					<a-button class="cu-btn-primary" icon="plus" @click="handleAdd()">新增</a-button>
					<a-button class="cu-btn-default" icon="edit" @click="handleEdit($refs.table.rows)">编辑</a-button>
					<a-button class="cu-btn-danger" icon="delete" @click="handleSub($refs.table.selectedRowKeys)">删除
					</a-button>
				</template>
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
					<template>
						<a @click="handleEdit(record)">修改</a>
						<a-divider type="vertical" />
						<a @click="handleSub(record)">删除</a>
					</template>
				</span>
			</DataGrid>
			<edit-form ref="createModal" :visible="visible" :loading="confirmLoading" :organList="organList"
				:meetingList="meetingList" :model="mdl" @cancel="handleCancel()" @ok="handleOk()" />
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
	import editForm from "./edit.vue";
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
		},
		{
			title: "所属单位",
			dataIndex: "departmentName",
			ellipsis: true,
		},
		{
			title: "管理者",
			dataIndex: "managementName",
		},
		{
			title: "设备",
			dataIndex: "equipment",
			ellipsis: true,
		},
		{
			title: "保障单位",
			dataIndex: "securityDepartmentName",
			ellipsis: true,
		},
		{
			title: "会议室状态",
			dataIndex: "stateText",
			ellipsis: true,
			scopedSlots: {
				customRender: "stateText",
			},
		},
		{
			title: "操作",
			dataIndex: "operate",
			fixed: "right",
			width: 100,
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
					getPageSet: "/office/officeConferenceRoom/getPageSet",
					save: "/office/officeConferenceRoom/save",
					update: "/office/officeConferenceRoom/update",
					deleteBatch: "/office/officeConferenceRoom/deleteBatch",
					getListByPid: "/mdata/organization/getListByPid?pid=2",
					getDicItemByCode: "/system/dicSet/getDicItemByCode",
				},
				visible: false,
				mdl: null,
				confirmLoading: false,
				selectedRowKeys: [],
				rows: "",
				masterUuids: "",
				organList: [],
				meetingList: [],
			};
		},
		filters: {
			statusFilter(status) {
				const statusMap = {
					0: "空闲",
					1: "使用中",
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
			getCodeData() {
				this.$post(this.url.getListByPid).then((res) => {
					this.organList = res;
				});
				this.$post(this.url.getDicItemByCode, {
					code: "meetingRoomstate",
				}).then((res) => {
					if (res.statusCode !== 300) {
						this.meetingList = res;
					}
				});
			},
		},
	};
</script>

<style lang="less"></style>
