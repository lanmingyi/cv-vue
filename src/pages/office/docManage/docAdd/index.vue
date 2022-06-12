<template>
	<div class="page-common-layout">
		<div class="page-common-content">
		<tool-bar @search="$refs.table.refresh(true)" @reset="
        () => {
          (this.queryParam = {}), $refs.table.refresh(true);
        }
      ">
			<template slot="toolBtn" slot-scope="scope">
				<a-button class="cu-btn-primary" icon="plus" @click="handleAdd()">新增发文</a-button>
				<!-- <a-button class="cu-btn-default" icon="edit" @click="handleEdit('all')">编辑</a-button> -->
				<a-button class="cu-btn-danger" icon="delete" @click="handleSub($refs.table.selectedRowKeys)">删除</a-button>
			</template>
			<template slot="toolForm"> </template>
		</tool-bar>
		<!-- <s-table ref="table" size="small" :columns="columns" :data="loadData" bordered :pageSize="10"
			:rowSelection="rowSelection" rowKey="uuid" showPagination="auto" :rowClassName="rowClassName"
			:customRow="rowClick"> -->
		<DataGrid ref="table" :columns="columns" :url="url" :queryParam="queryParam" rowKey="uuid">
			<span slot="action" slot-scope="{text, record}">
				<template>
					<!-- <a @click="handleEdit(record)">编辑</a>
					<a-divider type="vertical" /> -->
					<a @click="handleSub(record)">删除</a>
				</template>
			</span>
		</DataGrid>
		<edit-form ref="createModal" :visible="visible" :loading="confirmLoading" :model="mdl" @cancel="handleCancel()"
			@ok="handleOk()" />
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
	export default {
		name: "TableList",
		mixins: [dataGridMixin],
		components: {
			DataGrid,
			editForm,
		},
		data() {
			return {
				columns :[
					{
						title: "公文标题",
						dataIndex: "title",
					},
					{
						title: "操作",
						width: 150,
						dataIndex: "action",
						align: "center",
						scopedSlots: {
							customRender: "action",
						},
					},
				],
				visible: false,
				confirmLoading: false,
				mdl: null,
				// 查询参数
				queryParam: {},
				url: {
					getPageSet: "/system/topicBase/getPageSet",
					save: "/system/topicBase/save",
					update: "/system/topicBase/update",
					deleteBatch: "/system/topicBase/deleteBatch",
				},
			};
		},
		computed: {
		},
		methods: {},
	};
</script>

<style lang="less"></style>
