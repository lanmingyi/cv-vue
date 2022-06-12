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
						<template slot="toolBtn" slot-scope="scope">
							<a-dropdown>
								<a-menu slot="overlay" @click="
							      (e) => {
							        handleAddLog(e.key);
							      }
							    ">
									<a-menu-item key="1">
										<a-icon type="plus" /> 写日志
									</a-menu-item>
									<a-menu-item key="2">
										<a-icon type="plus" /> 写日报
									</a-menu-item>
									<a-menu-item key="3">
										<a-icon type="plus" /> 写周报
									</a-menu-item>
									<a-menu-item key="4">
										<a-icon type="plus" /> 写月报
									</a-menu-item>
								</a-menu>
								<a-button class="cu-btn-default" icon="edit">
									写日志
									<a-icon type="down" />
								</a-button>
							</a-dropdown>
							<a-button class="cu-btn-danger" icon="delete" @click="handleSub($refs.table.selectedRowKeys)">删除</a-button>
						</template>
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
		dataListMixin
	} from "@/mixins/dataListMixin";
	import detailForm from "./logDetail.vue";
	import editForm from "./edit.vue";
	import editReportForm from "./editReport.vue";
	export default {
		name: "TableList",
		mixins: [dataListMixin],
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
					getPageSet: "/office/oaWorkLog/getPageSet",
					save: "/office/oaWorkLog/save",
					update: "/office/oaWorkLog/update",
					deleteBatch: "/office/oaWorkLog/deleteBatch",
					masterAdd: "/office/oaWorkLog/save",
					masterUpdate: "/office/oaWorkLog/update",
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
				// that.columns = [...that.columns, ...that.columnsList]
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
				// this.queryParamSub.puuid = 1
				// this.$refs.subList.refresh()
			},
			resetSearchForm() {
				this.queryParam = {};
				this.$refs.masterList.refresh();
				// this.queryParamSub.puuid = 1
				// this.$refs.subList.refresh()
			},
			handleAddLog(e) {
				this.masterVisible = true;
				console.log("日志----", e);
				this.handleAdd("master");
				this.$refs.masterModal.onLoad(e);
			},
			handleSub(record, paramar) {
				// console.log("record", record);
			    const that = this
			    let uuids = ''
			    if (!record || record.length === 0) {
			        this.$message.warn('请勾选需要删除的数据', 1.5)
			        return
			    } else if (record && record[0]) {
			        uuids = record.toString()
			    } else {
			        uuids = record.uuid
			    }
					console.log("uuids", uuids);
			    let value = {
			        uuid: uuids,
			        ...paramar
			    }
			    that.$confirm({
			        title: '警告',
			        content: `确定要执行该操作吗?`,
			        okText: '删除',
			        okType: 'danger',
			        cancelText: '取消',
			        onOk() {
			            // 在这里调用删除接口
			            that.$post(that.url.deleteBatch, value).then((res) => {
			                if (res.statusCode === 200 || res === 1) {
			                    that.$message.success(res.message, 1.5)
			                    if (that.fetch) {
			                        that.fetch(that.queryParam)
			                    } else {
			                        that.$refs.table.refresh()
			                    }
			                } else {
			                    that.$message.error(res.message, 1.5)
			                }
			            })
			        },
			        onCancel() {}
			    })
			},
		},
	};
</script>

<style></style>
