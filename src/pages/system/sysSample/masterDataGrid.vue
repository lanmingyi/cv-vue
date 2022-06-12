<template>
	<div class="page-common-layout">
		<div class="page-common-left" style="width:50%">
			<tool-bar @search="$refs.masterList.refresh(true)" @reset="
          () => {
            (masterQueryParam = {}), $refs.masterList.refresh(true);
          }
        ">
				<template slot="toolBtn" slot-scope="scope">
					<a-button class="cu-btn-primary" icon="plus" @click="handleAdd('master')"
						v-action:sysSampleMasterDataGridAddDialog>新增</a-button>
					<!-- <a-button
                class="cu-btn-default"
                icon="edit"
                @click="handleEdit($refs.masterList.rows, 'master')"
                v-action:sysSampleMasterDataGridEditDialog
                >编辑</a-button
              > -->
					<a-button class="cu-btn-danger" icon="delete"
						@click="handleSub($refs.masterList.selectedRowKeys, 'master')"
						v-action:sysSampleMasterDataGridDelDialog>删除</a-button>
				</template>
			</tool-bar>
			<dataGrid ref="masterList" type="master" :columns="masterColumns" :url="url" bordered
				:queryParam="masterQueryParam" rowKey="uuid" showPagination="auto" @rowClick="
          (e) => {
            masterRowClick(e, { puuid: 'uuid' });
          }
        ">
				<span slot="sex" slot-scope="{ text }">
					{{ text | sexFilter }}
				</span>
				<span slot="action" slot-scope="{ text, record }">
					<template>
						<a @click="handleEdit(record, 'master')">编辑</a>
						<a-divider type="vertical" />
						<a @click="handleSub(record, 'master')">删除</a>
					</template>
				</span>
			</dataGrid>
			<master-form ref="masterModal" :visible="masterVisible" :loading="masterConfirmLoading" :model="masterMdl"
				@cancel="handleCancel('master')" @ok="handleOk('master')" />
		</div>
		<div class="page-common-content">
			<tool-bar @search="$refs.subList.refresh(true)" @reset="
          () => {
            (subQueryParam = {}), $refs.subList.refresh(true);
          }
        ">
				<template slot="toolBtn" slot-scope="scope">
					<a-button class="cu-btn-primary" icon="plus" @click="handleAdd('sub')">新增</a-button>
					<!-- <a-button
            class="cu-btn-default"
            icon="edit"
            @click="handleEdit($refs.subList.rows, 'sub')"
            >编辑</a-button
          > -->
					<a-button class="cu-btn-danger" icon="delete"
						@click="handleSub($refs.subList.selectedRowKeys, 'sub')">删除</a-button>
				</template>
			</tool-bar>
			<dataGrid ref="subList" type="sub" :url="url" :columns="subColumns" bordered :queryParam="subQueryParam"
				rowKey="uuid" showPagination="auto">
				<span slot="testCombobox" slot-scope="{ text }">
					{{ text | testComboboxFilter }}
				</span>
				<span slot="action" slot-scope="{ text, record }">
					<template>
						<a @click="handleEdit(record, 'sub')">编辑</a>
						<a-divider type="vertical" />
						<a @click="handleSub(record, 'sub')">删除</a>
					</template>
				</span>
			</dataGrid>
			<sub-form ref="subModal" :visible="subVisible" :loading="subConfirmLoading" :model="subMdl"
				@cancel="handleCancel('sub')" @ok="handleOk('sub')" />
		</div>
	</div>
</template>

<script>
	import {
		masterTableMixin
	} from "@/mixins/masterTableMixin";
	import dataGrid from "@/components/table/advance/dataGrid";
	// import { STable, Ellipsis } from '@/components';
	import masterForm from "./modal/masterEdit.vue";
	import subForm from "./modal/subEdit.vue";
	const masterColumns = [{
			title: "姓名",
			dataIndex: "name",
			width: 100,
		},
		{
			title: "年龄",
			dataIndex: "age",
			width: 100,
		},
		{
			title: "性别",
			dataIndex: "sex",
			width: 100,
			scopedSlots: {
				customRender: "sex"
			},
		},
		{
			title: "操作",
			width: 100,
			dataIndex: "action",
			scopedSlots: {
				customRender: "action"
			},
		},
	];
	const subColumns = [{
			title: "生日",
			width: 200,
			dataIndex: "testDate",
		},
		{
			title: "注册时间",
			width: 200,
			dataIndex: "testDatetime",
		},
		{
			title: "排序",
			dataIndex: "testCombobox",
			scopedSlots: {
				customRender: "testCombobox"
			},
		},
		{
			title: "操作",
			width: 100,
			dataIndex: "action",
			scopedSlots: {
				customRender: "action"
			},
		},
	];
	export default {
		name: "TableList",
		mixins: [masterTableMixin],
		components: {
			masterForm,
			subForm,
			dataGrid,
		},
		data() {
			return {
				masterColumns,
				subColumns,
				// create model
				masterVisible: false,
				subVisible: false,
				masterConfirmLoading: false,
				subConfirmLoading: false,
				masterMdl: null,
				subMdl: null,
				// 查询参数
				masterQueryParam: {},
				subQueryParam: {},
				url: {
					masterList: "/system/exampleSingleDatagrid/getPageSet",
					masterDelete: "/system/exampleSingleDatagrid/deleteBatch",
					masterAdd: "/system/exampleSingleDatagrid/save",
					masterUpdate: "/system/exampleSingleDatagrid/update",
					subList: "/system/exampleRightDatagrid/getPageSet",
					subDelete: "/system/exampleRightDatagrid/deleteBatch",
					subAdd: "/system/exampleRightDatagrid/save",
					subUpdate: "/system/exampleRightDatagrid/update",
				},
			};
		},
		filters: {
			sexFilter(sex) {
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
				} else if (val === "false") {
					return "不可排序";
				}
			},
		},
		methods: {},
	};
</script>

<style lang="less"></style>
