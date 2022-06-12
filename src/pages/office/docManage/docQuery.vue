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
						<a-input v-model="queryParam.trainName" placeholder="文号" />
					</a-form-item>
					<a-form-item label="">
						<a-input v-model="queryParam.trainName" placeholder="公文标题" />
					</a-form-item>
				</template>
			</tool-bar>
			<DataGrid ref="table" :columns="columns" :url="url" :queryParam="queryParam" rowKey="uuid">
				<template slot="action" slot-scope="text, record">
					<a @click="handlePreview(record)">查看</a>
				</template>
			</DataGrid>
			<edit-form ref="createModal" :visibleType="visible" :loading="confirmLoading" :model="mdl" @cancel="handleCancel()"
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
	import editForm from "./editDoc.vue";
	export default {
		name: "TableList",
		mixins: [dataGridMixin],
		components: {
			DataGrid,
			editForm,
		},
		data() {
			return {
				columns: [{
						title: "公文标题",
						dataIndex: "title",
					},{
						title: "操作",
						width: 150,
						dataIndex: "action",
						align: "center",
						scopedSlots: {
							customRender: "action",
						},
					}],
				visible: false,
				confirmLoading: false,
				mdl: null,
				queryParam: {},
				url: {
					getPageSet: "/system/topicBase/getPageSet",
				},
			};
		},
		computed: {
			rowSelection() {
				return {
					selectedRowKeys: this.masterSelectedRowKeys,
					onChange: this.onSelectChangeMaster,
				};
			},
		},
		mounted() {},
		methods: {
			handleReturn(record) {
				var that = this;
				var tips = "";
				if (record) {
					tips = record.docTitle;
				} else {
					tips = "这条公文";
				}
				that.$confirm({
					title: "警告",
					content: `是否退回《` + tips + "》？",
					okText: "确定",
					okType: "danger",
					cancelText: "取消",
					onOk() {
						that.$message.error("退回数据失败");
					},
					onCancel() {
						console.log("Cancel");
					},
				});
			},
			handleSign(record) {
				var that = this;
				var tips = "";
				if (record) {
					tips = record.docTitle;
				} else {
					tips = "这条公文";
				}
				that.$confirm({
					title: "警告",
					content: `是否签收《` + tips + "》？",
					okText: "确定",
					okType: "danger",
					cancelText: "取消",
					onOk() {
						that.$message.error("签收数据失败");
					},
					onCancel() {
						console.log("Cancel");
					},
				});
			},
			handlePreview(record) {
				this.visible = true;
			},
		},
	};
</script>

<style lang="less">
</style>
