<template>
	<div class="page-common-layout">
		<div class="page-common-left" style="width:500px">
			<tree-grid ref="masterList" :columns="columns" rowKey="uuid" :url="url" :parameter="parameter"
				:formatConditions="false" :showSearch="false" @rowClick="
					(e) => {
						masterRowClick(e, { id: 'id' });
					}
				">
			</tree-grid>
		</div>
		<div class="page-common-content">
			<tool-bar @search="$refs.subList.refresh(true)" @reset="
              () => {
                (subQueryParam = {}), $refs.subList.refresh(true);
              }
            ">
				<template slot="toolBtn" slot-scope="scope">
					<a-button class="cu-btn-primary" icon="plus" @click="handleAdd('1', $refs.masterList.data, 'sub')"
						v-action:formGenerationAddDialog>
						新增</a-button>
					<!-- @click="handleAdd('1', $refs.masterList.data, 'sub')" -->
					<!-- <a-button
                class="cu-btn-default"
            icon="edit"
                @click="
                  handleEdit($refs.subList.rows, $refs.masterList.data, 'sub')
                "
								v-action:formGenerationEditDialog
                >编辑</a-button
              > -->
					<a-button class="cu-btn-danger" icon="delete" v-action:formGenerationDelDialog
						@click="handleDelSub($refs.subList.selectedRowKeys)">删除</a-button>
				</template>
			</tool-bar>
			<DataGrid ref="subList" type="sub" :url="url" :columns="subColumns" bordered :queryParam="subQueryParam"
				rowKey="uuid" showPagination="auto">
				<span slot="action" slot-scope="{ text, record }">
					<template>
						<a @click="handleViewDesign(record)">设计</a>
						<a-divider type="vertical" />
						<a @click="handlePreview(record)">预览</a>
						<a-divider type="vertical" />
						<a @click="handlePreviewForm(record)">查看表单</a>
						<a-divider type="vertical" />
						<a @click="previewCode(record)">预览代码</a>
						<a-divider type="vertical" />
						<a @click="downloadCode(record)">下载代码</a>
					</template>
				</span>
			</DataGrid>
			<edit-form ref="subModal" :visible="subVisible" :loading="subConfirmLoading" :model="subMdl"
				@cancel="handleCancel('sub')" @ok="handleOk('sub')" />
		</div>
		<detail-form ref="detailModal" @cancel="handleCancelDetail()" @ok="handleOkDetail()"
			:visibleDetail="visibleDetail" :basicsUuid="basicsUuid" />
		<KFormPreview ref="previewModal"></KFormPreview>
		<preview-code ref="previewCode" :visible.sync="previewCodeVisible"></preview-code>
		<code-form :visible="codeFormVisible" @cancel="handleCancelCodeForm" :basicsUuid="basicsUuid"></code-form>
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
	import KFormPreview from "@/components/TopVUI/k-form-design/packages/KFormPreview/index";
	import detailForm from "./codeGenerationDesign.vue";
	import previewCode from "./previewCode.vue";
	import codeForm from "./codeForm";
	export default {
		mixins: [treeGridMixin],
		components: {
			TreeGrid,
			editForm,
			DataGrid,
			KFormPreview,
			detailForm,
			previewCode,
			codeForm,
		},
		data() {
			return {
				key: "1",
				columns: [{
					title: "分类名称",
					dataIndex: "text",
					ellipsis: true,
				}, ],
				subColumns: [{
						title: "表名",
						align: "center",
						dataIndex: "tableName",
						width: 200,
					},
					{
						title: "表描述",
						align: "center",
						width: 200,
						dataIndex: "tableDesc",
					},
					{
						title: "排序",
						align: "center",
						width: 80,
						dataIndex: "sort",
						sorter: true,
					},
					{
						title: "操作",
						align: "center",
						dataIndex: "action",
						scopedSlots: {
							customRender: "action",
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
					fathersUrl: "/form/formModule/getListByLevelId",
					expandUrl: "/form/formModule/getListByPid",
					subList: "/form/formTable/getPageSetData",
					subSave: "/form/formTable/save",
					subUpdate: "/form/formTable/update",
					subDelete: "/form/formTable/deleteBatch",
				},
				parameter: {
					father: {
						levelId: 1,
					},
					children: {},
				},
				visibleDetail: false,
				basicsUuid: "",
				previewCodeVisible: false,
				codeFormVisible: false,
			};
		},
		activated() {},
		mounted() {},
		methods: {
			//新增
			handleAdd(parame) {
				const flag =
					typeof this.$refs.masterList == "undefined" ?
					!this.masterRows :
					!this.$refs.masterList.rows;
				if (flag) {
					this.$message.warn("请先选择所要操作的数据", 1.5);
					return true;
				} else {
					// this.subVisible = true
					// this.subMdl = this.subQueryParam
					// console.log(this.subMdl)
					// if (this.$refs.subModal.add) this.$refs.subModal.add(this.subMdl, treeData)
					this.visibleDetail = true;
					this.$refs.detailModal.getData(null, this.subMdl);
				}
			},
			// 设计
			handleViewDesign(e) {
				this.basicsUuid = e.uuid;
				this.visibleDetail = true;
				this.$refs.detailModal.getData(e.tableName, e);
			},
			handleOkDetail() {
				this.$refs.subList.refresh();
				this.$refs.subList.selectedRowKeys = [];
				this.$refs.subList.selectedRows = [];
			},
			// 查看表单
			handlePreviewForm(e) {
				let MIS_ACCESS_TOKEN = localStorage.getItem("MIS_ACCESS_TOKEN");
				if (MIS_ACCESS_TOKEN) {
					this.$router.push({
						path: "/form/formDefine/view?tableName=" + e.tableName,
					});
				} else {
					this.$router.push({
						path: "/form/formDefine/index?tableName=" + e.tableName,
					});
				}
			},
			// 预览
			handlePreview(val) {
				if (!val.fieldJson) {
					return this.$message.warn("请先设计表单！", 2);
				}
				this.$refs.previewModal.jsonData = JSON.parse(val.fieldJson);
				// this.$refs.previewModal.previewWidth = this.previewOptions.width;
				this.$refs.previewModal.visible = true;
			},
			handleCancelDetail(e) {
				this.visibleDetail = false;
			},
			handleDelSub: function(record, type) {
				const that = this;
				let tableName = [];
				that.$refs.subList.selectedRows.forEach((res) => {
					tableName.push(res.tableName);
				});
				that.$confirm({
					title: "警告",
					content: `确定要执行该操作吗?`,
					okText: "删除",
					okType: "danger",
					cancelText: "取消",
					onOk() {
						// 在这里调用删除接口
						that
							.$post(that.url.subDelete, {
								uuid: record.toString(),
								tableName: tableName.toString(),
							})
							.then((res) => {
								if (res.statusCode === 200 || res === 1) {
									that.$message.success("删除成功", 1.5);
									that.$refs.subList.refresh();
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
			previewCode(val) {
				this.$post("/system/sysAppDetailed/getDetailBybasicsUuid", {
					basicsUuid: val.uuid,
					// basicsUuid: "E5860058AD6B4F0FA58D2BC30F715E00",
				}).then((res) => {
					if (res.statusCode == 300) {
						return this.$message.info(res.message, 1.5);
					} else {
						this.previewCodeVisible = true;
						this.$refs.previewCode.onOpen(val.uuid);
					}
				});
			},
			downloadCode(val) {
				this.codeFormVisible = true;
				this.basicsUuid = val.uuid;
			},
			handleCancelCodeForm() {
				this.codeFormVisible = false;
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
