<template>
	<div class="page-common-layout">
		<a-layout>
			<a-layout-sider width="40%" style="background: #FFFFFF;">
				<div class="page-common-content">
					<tool-bar @search="$refs.table.refresh(true)" @reset="
					    () => {
					      (this.queryParam = {}), $refs.table.refresh(true);
					    }
					  ">
						<template slot="toolForm">
							<a-form-item label="">
								<a-input v-model="queryParam.logTitle" placeholder="标题" />
							</a-form-item>
						</template>
					</tool-bar>
					<DataGrid ref="table" :columns="columns" :url="url" :queryParam="queryParam" @rowClick="masterRowClick" rowKey="uuid"></DataGrid>
				</div>
			</a-layout-sider>

			<a-layout-content style="background: #FFFFFF;padding-left: 40px;" width="60%">
				<div class="page-common-content">
					<detail-form ref="createModal" :model="masterRows ? masterRows : {}" />
				</div>
			</a-layout-content>
		</a-layout>
		<edit-form ref="masterModal" :visible="masterVisible" :loading="masterConfirmLoading" :model="masterRows"
			@cancel="handleCancel('master')" @ok="handleOk('master')" />
		<edit-report-form ref="subModal" :visible="subVisible" :loading="SubConfirmLoading" :model="masterRows"
			@cancel="handleCancel('sub')" @ok="handleOk('sub')" />
	</div>
</template>

<script>
	import {
		DataGrid
	} from "@/components";
	import {
		dataGridMixin
	} from "@/mixins/dataGridMixin";
	import detailForm from "./logDetail.vue";
	import editForm from "./edit.vue";
	import editReportForm from "./editReport.vue";

	export default {
		name: "TableList",
		mixins: [dataGridMixin],
		components: {
			DataGrid,
			editForm,
			detailForm,
			editReportForm,
		},
		data() {
			return {
				columns: [
					{
						title: "日志名称",
						dataIndex: "logTitle",
						ellipsis: true,
					},
					{
						title: "日志类型",
						dataIndex: "logStatus",
						ellipsis: true,
					},
					{
						title: "创建人",
						dataIndex: "creator",
						ellipsis: true,
					},
				],
				queryParam: {},
				url: {
					getPageSet: "/office/oaWorkLog/getPageSetByReceive",
					masterAdd: "/office/oaWorkLog/save",
					masterUpdate: "/office/oaWorkLog/update",
					masterDelete: "/office/oaWorkLog/deleteBatch",
				},
				subVisible: false,
				SubLoadingUserPost: false,
				mdlUserPost: null,
				masterVisible: false,
				masterMdl: null,
				masterConfirmLoading: false,
				SubConfirmLoading: false,
				masterSelectedRowKeys: [],
				masterRows: {},
				masterUuids: "",
				subSelectedRowKeys: [],
				subRows: "",
				subUUids: "",
				meetingState: [],
				leftWidth: "100%",
				rightShow: true,
			};
		},
		created() {
			this.columns = [...this.columns];
		},
		computed: {
		},
		mounted() {
			setTimeout(()=>{
				let data = this.$refs.table.dataSource
				let uuid = data[0] ? data[0].uuid : "";
				let logStatus = data[0] ? data[0].logStatus : "";
				this.$refs.createModal.onLoad(logStatus, uuid);
			},500)
		},
		filters: {},
		methods: {
			closeRight() {
				let that = this;
				that.columns = [...that.columns];
				that.leftWidth = "100%";
				that.rightShow = false;
			},
			rowClassName(row) {
				return row.uuid === this.masterUuids ? "bg-bray" : "";
			},
			masterRowClick(record, index) {
				this.masterRows = record;
				this.masterUuids = record.uuid;
				this.$refs.createModal.onLoad(record.logStatus, record.uuid);
			},
			resetForm() {
				this.$refs.masterList.refresh();
			},
			resetSearchForm() {
				this.queryParam = {};
				this.$refs.masterList.refresh();
			},
			handleAddLog(e) {
				console.log("日志----", e);
				this.handleAdd("master");
				this.$refs.masterModal.onLoad(e);
				// if (e == 1) {
				// } else {
				// 	this.subVisible = true
				// 	this.$refs.subModal.onLoad(e)
				// }
			},
		},
	};
</script>

<style></style>
