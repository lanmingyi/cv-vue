<template>
	<div class="page-common-layout">
		<div class="page-common-content">
			<tool-bar @search="$refs.table.refresh(true)" @reset="
			    () => {
			      (this.queryParam = {}), $refs.table.refresh(true);
			    }
			  ">
				<template slot="toolBtn" slot-scope="scope">
				</template>
				<template slot="toolForm">
					<a-form-item label="">
						<a-select v-model="queryParam.projectType" placeholder="事物类型" style="width: 200px;">
							<a-select-option v-for="(item, index) in typeList" :key="index" :value="item.value">
								{{ item.text }}
							</a-select-option>
						</a-select>
					</a-form-item>
				</template>
			</tool-bar>
			<DataGrid ref="table" :columns="columns" :url="url" :queryParam="queryParam" rowKey="uuid">
				<template slot="projectTypeName" slot-scope="{text}">
					<a-tag color="pink" v-if="
				      text == '借款申请' || text == '延迟还款' || text == '还款申请'
				    ">
						{{ text }}
					</a-tag>
					<a-tag color="cyan" v-if="text == '支出报销'">
						{{ text }}
					</a-tag>
					<a-tag color="orange" v-if="text == '付款申请'">
						{{ text }}
					</a-tag>
				</template>
				<template slot="operate" slot-scope="{operate, record}">
					<a @click="handleDetail(record)">查看</a>
					<span v-if="record.stateName === '审批中'">
						<a-divider type="vertical" />
						<a-dropdown>
							<a class="ant-dropdown-link">
								更多
								<a-icon type="down" />
							</a>
							<a-menu slot="overlay">
								<a-menu-item>
									<a @click="handleChange(record, 'yes')">同意</a>
								</a-menu-item>
								<a-menu-item>
									<a @click="handleChange(record, 'no')">驳回</a>
								</a-menu-item>
							</a-menu>
						</a-dropdown>
					</span>
				</template>
			</DataGrid>
			<detail-form ref="detailModal" :visible="detailVisible" :loading="detailConfirmLoading" :model="mdl"
				@cancel="handleDetailCancel('master')" />
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
	import detailForm from "../borReimb/detail.vue";
	const columns = [{
			title: "业务编号",
			dataIndex: "serialNumber",
			ellipsis: true,
		},
		{
			title: "申请事项",
			dataIndex: "projectTypeName",
			scopedSlots: {
				customRender: "projectTypeName",
			},
			ellipsis: true,
		},
		{
			title: "经办人/借款人",
			dataIndex: "loanUser",
		},
		{
			title: "填报单位",
			dataIndex: "loanDepartmentName",
			ellipsis: true,
		},
		{
			title: "接收时间",
			dataIndex: "fillingDate",
			ellipsis: true,
		},
		{
			title: "办理阶段",
			dataIndex: "stateName",
		},
		{
			title: "操作",
			dataIndex: "operate",
			width: 120,
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
				visible: false,
				confirmLoading: false,
				mdl: null,
				queryParam: {},
				url: {
					getPageSet: "/office/officeFinance/getPageSet",
					update: "/office/officeFinance/update", //修改详情
					getDicItemByCode: "/system/dicSet/getDicItemByCode",
				},
				loadData: (parameter) => {
					this.queryParam.type = "loanApproval";
					const requestParameters = Object.assign({}, parameter, this.queryParam);
					return this.$post(this.url.getPageSet, requestParameters).then(
						(res) => {
							return res;
						}
					);
				},
				mdlUserPost: null,
				rows: "",
				masterUuids: "",
				detailVisible: false,
				detailConfirmLoading: false,
				typeList: [],
			};
		},
		computed: {},
		mounted() {
			this.getCodeList();
		},
		methods: {
			getCodeList() {
				this.$post(this.url.getDicItemByCode, {
					code: "gaFinanceProjectType",
				}).then((res) => {
					if (res.statusCode !== 300) {
						this.typeList = res;
					}
				});
			},
			handleDetail(record) {
				console.log("record", record);
				this.detailVisible = true;
				var type = "";
				if (record.projectTypeName === "支出报销") {
					type = "remiburse";
				} else if (record.projectTypeName === "付款申请") {
					type = "payment";
				} else {
					type = "borrow";
				}
				this.$refs.detailModal.edit(record, type);
			},
			handleDetailCancel() {
				this.detailVisible = false;
			},
			handleChange(record, type) {
				var that = this;
				var tips = type === "yes" ? "同意" : "驳回";
				var state =
					type === "yes" ?
					"officeFinanceLoanState03" :
					"officeFinanceLoanState05";
				that.$confirm({
					title: "警告",
					content: `是否` + tips + `此条数据`,
					okText: "确定",
					okType: "danger",
					cancelText: "取消",
					onOk() {
						that
							.$post(that.url.update, {
								uuid: record.uuid,
								state: state,
							})
							.then((res) => {
								if (res === 1 || res.statusCode === 200) {
									that.$refs.table.refresh();
									that.$message.success(res.message ? res.message : "操作成功");
								} else {
									that.$message.error(res.message);
								}
							});
					},
					onCancel() {
						console.log("Cancel");
					},
				});
			},
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
