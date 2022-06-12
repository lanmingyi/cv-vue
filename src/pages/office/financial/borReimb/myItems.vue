<template>
	<div class="page-common-layout">
		<div class="page-common-content">
			<tool-bar @search="$refs.table.refresh(true)" @reset="
			    () => {
			      (this.queryParam = {}), $refs.table.refresh(true);
			    }
			  ">
				<template slot="toolBtn" slot-scope="scope">
					<a-button class="cu-btn-primary" icon="plus" @click="handleBorrow({ isView: false })">新建借款
					</a-button>
					<a-button class="cu-btn-primary" icon="plus" @click="handleReimburse({ isView: false })">新建报销
					</a-button>
					<a-button class="cu-btn-primary" icon="plus" @click="handlePayment({ isView: false })">新建付款
					</a-button>
				</template>
				<template slot="toolForm">
					<a-form-item label="">
						<a-input v-model="queryParam.userName" placeholder="用户名" />
					</a-form-item>
					<a-form-item label="">
						<a-select v-model="queryParam.projectType" placeholder="事物类型" style="width: 200px;">
							<a-select-option v-for="(item, index) in typeList" :key="index" :value="item.value">
								{{ item.text }}
							</a-select-option>
						</a-select>
					</a-form-item>
				</template>
			</tool-bar>
			<DataGrid ref="table" :columns="columns" :url="url" :queryParam="queryParam" rowKey="uuid"
				:format-conditions="true">
				<span slot="projectTypeName" slot-scope="{text}">
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
				</span>
				<span slot="operate" slot-scope="{text, record}">
					<template>
						<span v-if="record.stateName === '未提交'">
							<a @click="handleChange(record)">修改</a>
						</span>
						<span v-if="record.stateName != '未提交'">
							<a @click="handleDetail(record)">详情</a>
						</span>
						<span v-if="
				        record.projectTypeName === '借款申请' &&
				          record.stateName != '未提交'
				      ">
							<a-divider type="vertical" />
							<a @click="handleProcess(record)">流程图</a>
						</span>
						<span v-if="
				        record.stateName === '已批准' &&
				          (record.projectTypeName === '借款申请' ||
				            record.projectTypeName === '延迟还款')
				      ">
							<a-divider type="vertical" />
							<a-dropdown>
								<a class="ant-dropdown-link">
									更多
									<a-icon type="down" />
								</a>
								<a-menu slot="overlay">
									<a-menu-item>
										<a @click="handleChangeReturn(record, 'yes')">还款</a>
									</a-menu-item>
									<a-menu-item>
										<a @click="handleChangeReturn(record, 'no')">延迟还款</a>
									</a-menu-item>
									<a-menu-item>
										<a @click="handleSub(record, 'master')">删除</a>
									</a-menu-item>
								</a-menu>
							</a-dropdown>
						</span>
						<span v-else>
							<a-divider type="vertical" />
							<a @click="handleSub(record, 'master')">删除</a>
						</span>
					</template>
				</span>
			</DataGrid>
			<!-- /* 延迟还款 */ -->
			<edit-form ref="masterModal" :visible="masterVisible" :loading="masterConfirmLoading" :model="masterMdl"
				@cancel="handleCancel('master')" @ok="handleFinaOk" />
			<!-- /* 查看详情 */ -->
			<detail-form ref="detailModal" :visible="detailVisible" :loading="detailConfirmLoading" :model="masterMdl"
				@cancel="handleDetailCancel('master')" />
			<!-- /* 借款申请 */ -->
			<borrow-form ref="borrowModal" :visible="borrowVisible" :loading="borrowConfirmLoading" :typeNum="1"
				:model="masterMdl" @cancel="handleBorrowCancel('master')" @ok="handleFaOk('borrow', 'yes')"
				@save="handleFaOk('borrow', 'no')" :organList="organList" />
			<!-- /* 付款申请 */ -->
			<payment-form ref="paymentModal" :visible="paymentVisible" :loading="paymentConfirmLoading"
				:model="masterMdl" @cancel="handlePaymentCancel('master')" @ok="handleFaOk('payment', 'yes')"
				@save="handleFaOk('payment', 'no')" :organList="organList" />
			<!-- /* 支出报销 */ -->
			<reimburse-form ref="reimburseModal" :visible="reimburseVisible" :loading="reimburseConfirmLoading"
				:model="masterMdl" @cancel="handleReimburseCancel('master')" @reply="reply" :organList="organList"
				:typeNum="1" />
			<!-- 流程图 -->
			<flowChat ref="flowChatForm"></flowChat>
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
	import detailForm from "./detail.vue";
	import borrowForm from "./editBorrow.vue";
	import paymentForm from "./editPayment.vue";
	import reimburseForm from "./editReimburse.vue";
	import flowChat from "../../../workflow/apiFlowableTask/myMission/flowChat.vue";
	const columns = [
		{
			title: "业务编号",
			dataIndex: "serialNumber",
			ellipsis: true,
		},
		{
			title: "事项名称",
			dataIndex: "projectTypeName",
			width: 100,
			scopedSlots: {
				customRender: "projectTypeName",
			},
			ellipsis: true,
		},
		{
			title: "申请人",
			dataIndex: "loanUser",
			width: 100,
		},
		{
			title: "申请部门",
			dataIndex: "loanDepartmentName",
			ellipsis: true,
		},
		{
			title: "申请时间",
			dataIndex: "createTime",
			ellipsis: true,
		},
		{
			title: "状态",
			dataIndex: "stateName",
			width: 100,
		},
		{
			title: "操作",
			dataIndex: "operate",
			width: 180,
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
			detailForm,
			borrowForm,
			paymentForm,
			reimburseForm,
			flowChat,
		},
		data() {
			return {
				columns,
				queryParam: {isOwn:'yes'},
				queryParamSub: {},
				url: {
					getPageSet: "/office/officeFinance/getPageSet",
					saveLoan: "/office/officeFinance/saveLoan",
					savePayment: "/office/officeFinance/savePayment",
					saveReimbursement: "/office/officeFinance/saveReimbursement",
					update: "/office/officeFinance/update",
					deleteBatch: "/office/officeFinance/deleteBatch",
					// update: '/office/officeFinance/update', //修改详情
					getDicItemByCode: "/system/dicSet/getDicItemByCode",
					getListByPid: "/mdata/organization/getListByPid?pid=2",
				},
				mdlUserPost: null,
				masterVisible: false,
				masterMdl: null,
				masterConfirmLoading: false,
				masterSelectedRowKeys: [],
				masterRows: "",
				masterUuids: "",
				borrowVisible: false,
				borrowConfirmLoading: false,
				paymentVisible: false,
				paymentConfirmLoading: false,
				reimburseVisible: false,
				reimburseConfirmLoading: false,
				detailVisible: false,
				detailConfirmLoading: false,
				returnVisible: false,
				returnConfirmLoading: false,
				organList: [],
				typeList: [],
				showLoad: false,
				timer: null,
			};
		},
		computed: {
		},
		mounted() {
			this.getCodelist();
		},
		methods: {
			moment,
			handleBorrow(m) {
				this.borrowVisible = true;
				this.showLoad = false;
				let form = {};
				form = this.$refs.borrowModal.form;
				form.resetFields(); // 清理表单数据（可不做）
				this.$refs.borrowModal.add(m);
			},
			handleBorrowCancel() {
				this.borrowVisible = false;
			},
			handlePayment(m) {
				this.paymentVisible = true;
				this.showLoad = false;
				let form = {};
				form = this.$refs.paymentModal.form;
				form.resetFields(); // 清理表单数据（可不做）
				this.$refs.paymentModal.add(m);
			},
			handlePaymentCancel() {
				this.paymentVisible = false;
			},
			handleReimburse(m) {
				this.reimburseVisible = true;
				this.showLoad = false;
				let form = {};
				form = this.$refs.reimburseModal.form;
				form.resetFields(); // 清理表单数据（可不做）
				this.$refs.reimburseModal.add(m);
			},
			handleReimburseCancel() {
				this.reimburseVisible = false;
			},
			reply() {
				this.reimburseVisible = false;
				this.$refs.masterList.refresh();
			},
			handleChange(record) {
				if (record.projectTypeName === "借款申请") {
					this.borrowVisible = true;
					this.$refs.borrowModal.edit(record);
				} else if (record.projectTypeName === "支出报销") {
					this.reimburseVisible = true;
					this.$refs.reimburseModal.edit(record);
				} else if (record.projectTypeName === "付款申请") {
					this.paymentVisible = true;
					this.$refs.paymentModal.edit(record);
				}
			},
			//延迟还款申请
			handleFinaOk() {
				let form = {};
				let url = this.url.masterUpdate;
				form = this.$refs.masterModal.form;
				form.validateFields((errors, values) => {
					values.projectType = "officeFinanceProjectType04";
					values.state = "officeFinanceLoanState02";
					console.log(values);
					if (!errors) {
						this.$post(url, values).then((res) => {
							if (res === 1 || res.statusCode === 200) {
								this.masterVisible = false;
								this.$refs.masterList.refresh();
								this.$message.success(res.message ? res.message : "操作成功");
							} else {
								this.$message.error(res.message);
							}
						});
					}
				});
			},
			handleChangeReturn(record, type) {
				var that = this;
				if (type === "yes") {
					that.$confirm({
						title: "警告",
						content: `是否操作此条数据`,
						okText: "确定",
						okType: "danger",
						cancelText: "取消",
						onOk() {
							that
								.$post(that.url.masterUpdate, {
									uuid: record.uuid,
									state: "officeFinanceLoanState02",
									projectType: "officeFinanceProjectType05",
								})
								.then((res) => {
									if (res === 1 || res.statusCode === 200) {
										that.$refs.masterList.refresh();
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
				} else {
					this.masterVisible = true;
					this.$refs.masterModal.edit(record);
				}
			},
			handleDetail(record) {
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
			rowClassName(row) {
				return row.uuid === this.masterUuids ? "bg-bray" : "";
			},
			masterRowClick(record, index) {
				this.masterRows = record;
				this.masterUuids = record.uuid;
				this.queryParamSub.puuid = record.uuid;
			},
			resetForm() {
				this.$refs.masterList.refresh();
			},
			resetSearchForm() {
				this.queryParam = {};
				this.$refs.masterList.refresh();
			},
			getCodelist() {
				this.$post(this.url.getListByPid).then((res) => {
					this.organList = res;
				});
				this.$post(this.url.getDicItemByCode, {
					code: "gaFinanceProjectType",
				}).then((res) => {
					if (res.statusCode !== 300) {
						this.typeList = res;
					}
				});
			},
			handleProcess(record) {
				this.$post("/workflow/oaLeave/clickFlowChart", {
					uuid: record.uuid,
				}).then((res) => {
					if (res.statusCode != 300) {
						const jsonData = res;
						this.$refs.flowChatForm.loadData(
							jsonData,
							jsonData.lists.actDeModelId,
							jsonData.lists.actDeModelKey,
							jsonData.lists.actDeModelName,
							jsonData.lists.flowDesign,
							record
						);
					} else {
						this.$message.error(res.message);
					}
				});
			},
			handleFaOk(e, type) {
				if (this.timer) {
					clearTimeout(this.timer);
				}
				this.timer = setTimeout(() => {
					let form = {};
					let url = "";
					if (e === "borrow") {
						form = this.$refs.borrowModal.form;
					} else if (e === "payment") {
						form = this.$refs.paymentModal.form;
					} else if (e === "reimburse") {
						form = this.$refs.reimburseModal.form;
					}
					form.validateFields((errors, values) => {
						values.isRelease = type;
						values.loanRepaymentDateStr = moment(
							values.loanRepaymentDateStr
						).format("YYYY-MM-DD HH:mm:ss");
						console.log(values, e, type);
						if (!errors) {
							if (e === "borrow") {
								url = this.url.saveLoan;
								this.borrowConfirmLoading = true;
							} else if (e === "payment") {
								url = this.url.savePayment;
								this.paymentConfirmLoading = true;
							} else if (e === "reimburse") {
								url = this.url.saveReimbursement;
								this.reimburseConfirmLoading = true;
							}
							if (this.showLoad) {
								url = this.url.update;
							}
							this.$post(url, values)
								.then((res) => {
									if (res === 1 || res.statusCode === 200) {
										// 重置表单数据
										// form.resetFields()
										if (e === "borrow") {
											this.borrowVisible = false;
										} else if (e === "payment") {
											this.paymentVisible = false;
										} else if (e === "reimburse") {
											this.reimburseModal = false;
										}
										// 刷新表格
										this.$refs.masterList.refresh();
										this.$message.success(res.message ? res.message : "操作成功");
									} else {
										this.$message.error(res.message);
									}
								})
								.finally(() => {
									this.borrowConfirmLoading = false;
									this.paymentConfirmLoading = false;
									this.reimburseConfirmLoading = false;
								});
						}
					});
				}, 500);
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
