<template>
	<a-card :bordered="false" :bodyStyle="{ padding: 0 }">
		<tool-bar @search="$refs.table.refresh(true)" @reset="
        () => {
          ((queryParam.name = ''), delete queryParam.name),
            $refs.table.refresh();
        }
      ">
			<template slot="toolBtn" slot-scope="scope">
				<a-button class="cu-btn-primary" icon="plus" @click="handleAdd(queryParam)">新增</a-button>
				<a-button class="cu-btn-default" icon="edit" @click="handleInsert(queryParam)">插入</a-button>
				<!-- <a-button
          class="cu-btn-default"
          icon="edit"
          @click="handleEdit($refs.table.rows)"
          >编辑</a-button
        > -->
				<a-button class="cu-btn-danger" icon="delete" @click="handleSub($refs.table.selectedRowKeys)">删除
				</a-button>
			</template>
			<!-- <template slot="toolForm">
				<a-form-item label="">
					<a-input v-model="queryParam.name" placeholder="姓名" />
				</a-form-item>
			</template> -->
		</tool-bar>
		<DataGridNew ref="table" :columns="columns" :url="url" bordered :pageSize="5" rowKey="uuid"
			showPagination="auto" @rowClick="customClick" :queryParam="queryParam">
			<span slot="sex" slot-scope="{ text }">
				{{ text | sexFilter }}
			</span>
			<span slot="testCombobox" slot-scope="{ text }">
				{{ text | testComboboxFilter }}
			</span>
			<span slot="action" slot-scope="{ text, record }">
				<template>
					<a @click="handleEdit(record)">编辑</a>
					<a-divider type="vertical" />
					<a @click="handleSub(record)">删除</a>
				</template>
			</span>
		</DataGridNew>
		<edit-form ref="createModal" :visible="visible" :loading="confirmLoading" :model="mdl" :url="url"
			@cancel="handleCancel()" @ok="handleOk()" />
	</a-card>
</template>

<script>
	import {
		dataGridMixin
	} from "@/mixins/dataGridMixin";
	import {
		DataGridNew,
		SearchArea
	} from "@/components";
	import editForm from "./lineComponentEditSubOne.vue";
	export default {
		name: "TableList",
		mixins: [dataGridMixin],
		components: {
			DataGridNew,
			editForm
		},
		data() {
			return {
				columns: [{
						title: "序号",
						dataIndex: "orderNo",
						width: 100,
						fixed: 'left',
						align: 'center'
					},
					{
						title: "位置点编码",
						dataIndex: "pointCode",
						fixed: 'left',
						align: 'center'
					},
					{
						title: "所属生产业务",
						width: 180,
						dataIndex: "belongedProduction",
						align: 'center'
					},
					{
						title: "点类别",
						width: 150,
						dataIndex: "pointType",
						align: 'center'
					},
					{
						title: "具体地址信息",
						dataIndex: "locationInformation",
						width: 150,
						align: 'center'
					},
					{
						title: "自定义名称",
						dataIndex: "customizeName",
						width: 150,
						align: 'center'
					},
					{
						title: "应用设定",
						dataIndex: "departurePlaceInformation",
						width: 150,
						align: 'center'
					},
					{
						title: "经度",
						dataIndex: "longitude",
						width: 150,
						align: 'center'
					},
					{
						title: "纬度",
						dataIndex: "latitude",
						width: 150,
						align: 'center'
					},
					{
						title: "距上个位置点里程",
						dataIndex: "departureplaceMileage",
						width: 150,
						align: 'center'
					},
					{
						title: "客户全称",
						dataIndex: "fullname",
						width: 150,
						align: 'center'
					},
					{
						title: "客户字号简称",
						dataIndex: "abbreviation",
						width: 150,
						align: 'center'
					},
					{
						title: "隶属集团",
						dataIndex: "affiliatedGroup",
						width: 150,
						align: 'center'
					},
					{
						title: "省",
						dataIndex: "province",
						width: 150,
						align: 'center'
					},
					{
						title: "市",
						dataIndex: "city",
						width: 150,
						align: 'center'
					},
					{
						title: "区县",
						dataIndex: "district",
						width: 150,
						align: 'center'
					},
					{
						title: "镇",
						dataIndex: "township",
						width: 150,
						align: 'center'
					},
					{
						title: "路牌号",
						dataIndex: "roadNumber",
						width: 150,
						align: 'center'
					},
					{
						title: "添加人",
						dataIndex: "creator",
						width: 150,
						align: 'center'
					},
					{
						title: "添加时间",
						dataIndex: "createTime",
						width: 150,
						align: 'center'
					},
					{
						title: "最后修改人",
						dataIndex: "modifier",
						width: 150,
						align: 'center'
					},
					{
						title: "最后修改时间",
						dataIndex: "modifyTime",
						width: 150,
						align: 'center'
					},
					{
						title: "操作",
						dataIndex: "action",
						fixed: 'right',
						align: 'center',
						width: 140,
						scopedSlots: {
							customRender: "action"
						},
					}
				],
				visible: false,
				confirmLoading: false,
				mdl: null,
				// 查询参数
				queryParam: {},
				url: {
					getPageSet: "/bdata/lineLocationpointGroupDetail/getPageSet",
					save: "/bdata/lineLocationpointGroupDetail/save",
					update: "/bdata/lineLocationpointGroupDetail/update",
					deleteBatch: "/bdata/lineLocationpointGroupDetail/deleteBatch",
					locationPoint: "/bdata/lineLine/getLocationPointInfo",
					locationDistrict: "/system/codeItem/getListByLevelIdAndCodeSetId",
				},
			};
		},
		filters: {
			sexFilter(sex) {
				console.log('exportSex:', sex);
				switch (sex) {
					case "male":
						return "男";
					case "female":
						return "女";
					case "unknown":
						return "未知";
				}
			},
			testComboboxFilter(val) {
				if (val === "true") {
					return "可排序";
				} else {
					return "不可排序";
				}
			},
		},
		methods: {
			customClick(record, index) {
				console.log('exportRecord:', record.orderNo + 1);
				this.$refs.table.rows = record;
				this.queryParam.orderNo = record.orderNo + 1;
			},
			refresh() {
				this.$refs.table.refresh();
			},
		},
	};
</script>

<style lang="less"></style>
