<template>
	<div class="page-common-layout">
		<div class="page-common-left" style="width:30%">
			<tree-grid ref="masterList" :columns="columns" rowKey="uuid" :url="url" :parameter="parameter"
				:formatConditions="false" :showSearch="false" @rowClick="
          (e) => {
            masterRowClick(e, { id: 'id' });
          }
        ">
			</tree-grid>
		</div>
		<div class="page-common-content">
			<div class="page-common-box-content">
				<tool-bar @search="$refs.subList.refresh(true)" @reset="
				    () => {
				      (subQueryParam = {}), $refs.subList.refresh(true);
				    }
				  ">
					<template slot="toolBtn" slot-scope="scope">
						<a-button class="cu-btn-primary" icon="plus"
							@click="handleAdd('1', $refs.masterList.data, 'sub')" v-action:archiveAddDialog>新增
						</a-button>
						<!-- <a-button
				          class="cu-btn-default"
				          icon="edit"
				          @click="
				            handleEdit($refs.subList.rows, $refs.masterList.data, 'sub')
				          "
				          v-action:archiveEditDialog
				          >编辑</a-button
				        > -->
						<a-button class="cu-btn-danger" icon="delete"
							@click="handleSub($refs.subList.selectedRowKeys, 'sub')" v-action:archiveAddDialog>删除
						</a-button>
					</template>
					<template slot="toolForm">
						<a-form-item label="">
							<a-input v-model="subQueryParam.title" placeholder="标题" />
						</a-form-item>
					</template>
				</tool-bar>
				<DataGrid ref="subList" type="sub" :url="url" :columns="subColumns" bordered :queryParam="subQueryParam"
					rowKey="uuid" showPagination="auto" :pageSize="10" @rowClick="subRowClick">
					<span slot="action" slot-scope="{ text, record }">
						<template>
							<a @click="handleEdit(record, $refs.masterList.data, 'sub')">编辑</a>
							<a-divider type="vertical" />
							<a @click="handleSub(record, 'sub')">删除</a>
						</template>
					</span>
				</DataGrid>
			</div>
			<div class="page-common-box-content">
				<a-tabs default-active-key="1">
					<a-tab-pane key="1" tab="附件信息">
						<Accessory ref="accessoryList" :url="fileUrl" fileType="local"></Accessory>
					</a-tab-pane>
				</a-tabs>
			</div>
		</div>
		<edit-form ref="subModal" :visible="subVisible" :loading="subConfirmLoading" :model="subMdl"
			@cancel="handleCancel('sub')" @ok="handleOk('sub')" />
	</div>
</template>
<script>
	import {
		TreeGrid,
		DataGrid
	} from "@/components";
	import {
		treeGridMixin
	} from "@/mixins/treeGridMixin";
	import editForm from "./edit.vue";
	import Accessory from "@/components/TopVUI/accessory/index";

	export default {
		mixins: [treeGridMixin],
		components: {
			TreeGrid,
			editForm,
			DataGrid,
			Accessory,
		},
		data() {
			return {
				key: "1",
				columns: [{
					title: "分类名称",
					align: "left",
					dataIndex: "text",
				}, ],
				subColumns: [{
						title: "资源名称",
						dataIndex: "title",
						ellipsis: true,
					},
					{
						title: "创建时间",
						align: "left",
						dataIndex: "createTime",
						sorter: true,
					},
					{
						title: "创建者",
						align: "left",
						dataIndex: "creator",
					},
					{
						title: "操作",
						width: 150,
						align: "center",
						dataIndex: "action",
						scopedSlots: {
							customRender: "action"
						},
					},
				],
				masterVisible: false,
				subVisible: false,
				masterConfirmLoading: false,
				subConfirmLoading: false,
				masterMdl: null,
				subMdl: null,
				// 高级搜索 展开/关闭
				advanced: false,
				// 查询参数
				queryParam: {},
				subQueryParam: {},
				url: {
					fathersUrl: "/system/channel/getChannelsByPid",
					expandUrl: "/system/channel/getChannelsByPid",
					subList: "/system/archive/getPageSetData",
					subSave: "/system/archive/save",
					subUpdate: "/system/archive/update",
					subDelete: "/system/archive/delete",
					deleteAttachment: "/system/attachment/delete",
					getDetailByUuid: "/system/attachment/getListByPuuid",
				},
				fileUrl: {
					webUpload: "/system/attachment/upload",
					getPageSet: "/system/attachment/getListByPuuid",
					deleteBatch: "/system/attachment/delete",
					update: "/system/attachment/update",
				},
				parameter: {
					father: {
						pid: 2,
					},
					children: {},
				},
				queryParamAccessory: {},
			};
		},
		activated() {},
		mounted() {},
		methods: {
			subRowClick(record) {
				this.$refs.subList.rows = record;
				this.queryParamAccessory.puuid = record.uuid;
				this.$refs.accessoryList.refreshList(this.queryParamAccessory); // 设置刷新子表
			},
		},
	};
</script>

<style scope>
	.table-operator {
		margin-left: 18px;
	}

	.ant-table-tbody>tr>td:last-child {
		padding: 16px 16px;
	}
</style>
