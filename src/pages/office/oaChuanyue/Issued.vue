<template>
	<div class="page-common-layout">
		<div class="page-common-content">
			<div class="page-common-box-content">
				<toolBar @search="$refs.table.refresh(true)" @reset="
						() => {
							(this.queryParam = {}), $refs.table.refresh(true);
						}
					">
					<template slot="toolBtn">
						<a-button class="cu-btn-primary" @click="handleAdd" icon="plus">新增</a-button>
						<a-button class="cu-btn-default" @click="handleEdit" icon="edit">编辑</a-button>
						<a-button class="cu-btn-danger" icon="delete" @click="handleSub($refs.table.selectedRowKeys)">删除</a-button>
					</template>
					<template slot="toolForm">
						<a-form-item label="">
							<a-input v-model="queryParam.title" placeholder="标题" />
						</a-form-item>
					</template>
				</toolBar>
				<DataGrid ref="table" :columns="columns" :url="url" :queryParam="queryParam" rowKey="uuid" @rowClick="rowClick"
					:format-conditions="true">
					<span slot="rankText" slot-scope="{text}">
						<a-tag color="pink" v-if="text == '一级'">
							{{ text }}
						</a-tag>
						<a-tag color="orange" v-if="text == '二级'">
							{{ text }}
						</a-tag>
						<a-tag color="green" v-if="text == '三级'">
							{{ text }}
						</a-tag>
					</span>
					<span slot="action" slot-scope="{text, record}">
						<template>
							<a @click="openDrawer(record)">{{ text }}</a>
						</template>
					</span>
				</DataGrid>
			</div>
			<div class="page-common-box-content">
				<a-tabs default-active-key="1" @change="changeTabs">
					<a-tab-pane key="1" tab="传阅附件">
						<pass-files ref="accessoryModal" :params="queryParamMaster" :type="2" />
					</a-tab-pane>
					<a-tab-pane key="2" tab="传阅人员">
						<pass-peoper ref="peoperModal" :params="queryParamSub" :model="rows" :type="2" />
					</a-tab-pane>
				</a-tabs>
			</div>
			<edit-form ref="createModal" :visible="visible" :loading="confirmLoading" :type="cyType" :model="mdl"
				@cancel="handleCancel()" @ok="handleOk()" />
		</div>
	</div>
</template>

<script>
	import {
		dataGridMixin
	} from "@/mixins/dataGridMixin";
	import {
		DataGrid
	} from "@/components";

	import editForm from "./edit.vue";
	import passFiles from "./passFiles.vue";
	import passPeoper from "./passPeoper.vue";

	const columns = [
		{
			title: "标题",
			dataIndex: "title",
			scopedSlots: {
				customRender: "action",
			},
		},
		{
			title: "紧急程度",
			width: 90,
			dataIndex: "rankText",
			scopedSlots: {
				customRender: "rankText",
			},
		},
		{
			title: "完成时间",
			width: 200,
			dataIndex: "completeDate",
		},
		{
			title: "创建人",
			width: 150,
			dataIndex: "creator",
		},
		{
			title: "创建时间",
			dataIndex: "createTime",
		},
	];
	export default {
		name: "TableList",
		mixins: [dataGridMixin],
		components: {
			DataGrid,
			editForm,
			passFiles,
			passPeoper
		},
		data() {
			return {
				columns,
				visible: false,
				confirmLoading: false,
				mdl: null,
				// 高级搜索 展开/关闭
				advanced: false,
				// 查询参数
				queryParam: {},
				cyType: {
					value: 2,
					actType: 1,
				},
				keys: 1,
				selectedRowKeys: [],
				selectedRows: [],
				queryParamMaster: {
					puuid: "1"
				},
				queryParamSub: {
					puuid: "1"
				},
				rows: "", //选中行数据
				url: {
					getPageSet: "/office/oaChuanyue/getLssuedPageSet",
					save: "/office/oaChuanyue/save",
					update: "/office/oaChuanyue/update",
					deleteBatch: "/office/oaChuanyue/deleteBatch",
				}
			};
		},
		computed: {
		},
		methods: {
			openDrawer(record) {
				this.$refs.createModal.title = record.title;
				this.cyType.add = false;
				this.cyType.edit = true;
				this.rows = record;
				this.$refs.createModal.request(record);
				this.visible = true;
			},
			rowClick(record, index) {
				this.rows = record;
				this.uuid = record.uuid;
				// console.log("record.uuid", record.uuid,this.keys);
				this.queryParamMaster.puuid = record.uuid;
				this.queryParamSub = record;
				this.queryParamSub.chuanyueUuid = record.uuid;
				if (this.keys == 1) {
					this.$refs.accessoryModal.refresh(this.queryParamMaster);
				} else {
					this.$refs.peoperModal.refresh(this.queryParamSub);
				}
			},
			changeTabs(e) {
				this.$nextTick(() => {
					this.keys = e;
					if (this.keys == 1) {
						this.$refs.accessoryModal.refresh(this.queryParamMaster);
					} else {
						this.$refs.peoperModal.refresh(this.queryParamSub);
					}
				});
			},
			handleAdd() {
				this.mdl = null;
				this.$refs.createModal.title = "新增传阅";
				this.cyType.edit = false;
				this.cyType.add = true;
				this.visible = true;
				this.$refs.createModal.request();
			},
			handleEdit() {
				this.$refs.createModal.title = "编辑传阅";
				if (this.rows) {
					this.cyType.add = false;
					this.cyType.edit = true;
					this.$refs.createModal.request(this.rows);
					this.visible = true;
				} else {
					this.$message.warn("请选择需要操作的数据");
				}
			},
		},
	};
</script>

<style lang="less"></style>
