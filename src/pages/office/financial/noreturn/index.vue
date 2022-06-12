<template>
	<div class="page-common-layout">
		<div class="page-common-content">
			<div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
				<div class="table-operator"></div>
				<div class="table-page-search-wrapper">
					<a-form layout="inline">
						<div class="flex justify-between flex-wrap">
							<a-form-item label="">
								<a-input v-model="queryParam.loanUser" placeholder="借款人" />
							</a-form-item>
							<div class="table-page-search-submitButtons flex align-center">
								<a-button class="cu-btn-primary" @click="resetForm()">查询</a-button>
								<a-button class="cu-btn-filter" @click="resetSearchForm()">重置</a-button>
							</div>
						</div>
					</a-form>
				</div>
			</div>
			<DataGrid ref="table" :columns="columns" :url="url" :queryParam="queryParam" rowKey="uuid"
				:format-conditions="true">
				<template slot="loanRepaymentDateStr" slot-scope="{text}">
					{{ moment(text).format("YYYY-MM-DD HH:mm:ss") }}
				</template>
				<template slot="delayTime" slot-scope="{text}">
					{{ moment(text).format("YYYY-MM-DD HH:mm:ss") }}
				</template>
			</DataGrid>
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
	const columns = [
		{
			title: "借款单号",
			dataIndex: "serialNumber",
			ellipsis: true,
		},
		{
			title: "事项名称",
			dataIndex: "projectTypeName",
		},
		{
			title: "借款人",
			dataIndex: "loanUser",
		},
		{
			title: "部门名称",
			dataIndex: "loanDepartmentName",
			ellipsis: true,
		},
		{
			title: "归还日期",
			dataIndex: "loanRepaymentDateStr",
			scopedSlots: {
				customRender: "loanRepaymentDateStr",
			},
			ellipsis: true,
		},
		{
			title: "延迟原因",
			dataIndex: "delayReason",
			ellipsis: true,
		},
		{
			title: "延迟至日期",
			dataIndex: "delayTime",
			scopedSlots: {
				customRender: "delayTime",
			},
			ellipsis: true,
		},
	];
	export default {
		name: "TableList",
		mixins: [dataGridMixin],
		components: {
			DataGrid,
		},
		data() {
			return {
				columns,
				queryParam: {},
				queryParamSub: {},
				url: {
					getPageSet: "/office/officeFinance/getPageSetOutstanding",
				},
				visible: false,
				confirmLoading: false,
				mdl: null,
				statusList: [],
				titleList: [],
			};
		},
		computed: {
		},
		mounted() {},
		methods: {
			moment,
		},
	};
</script>

<style lang="less"></style>
