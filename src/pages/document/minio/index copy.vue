<template>
	<div class="page-common-layout">
		<div class="page-common-left" style="width: 30%;">
			<tool-bar>
				<template slot="toolBtn" slot-scope="scope">
					<a-button class="cu-btn-primary" icon="upload" @click="handleAddBucket()">新增</a-button>
					<a-button class="cu-btn-danger" icon="delete" @click="handleSubBucket()">删除</a-button>
				</template>
			</tool-bar>
			<s-table ref="table" size="small" :columns="columns" :data="loadData" bordered rowKey="name"
				:showPagination="false" :rowSelection="rowSelection" @rowClick="rowClick" :rowClassName="rowClassName">
			</s-table>
		</div>
		<div class="page-common-content">
			<tool-bar>
				<template slot="toolBtn" slot-scope="scope">
					<a-button class="cu-btn-primary" icon="upload" @click="handleUpLoad()">批量上传</a-button>
					<a-button class="cu-btn-orange" icon="rollback" @click="handleBack()">返回</a-button>
					<a-button class="cu-btn-danger" icon="delete" @click="handleSub('all', 1)">删除</a-button>
				</template>
			</tool-bar>
			<a-spin :spinning="tabelLoading">
				<a-table ref="subList" size="small" :columns="columnsDicItem" :data-source="dataSource" bordered
					:rowSelection="rowSelectionDic" rowKey="uuid" showPagination="auto" :pagination="pagination"
					@change="handleTableChange">
					<span slot="serial" slot-scope="text, record, index">
						{{ index + 1 }}
					</span>
					<span slot="fileName" slot-scope="text, record">
						<template v-if="record.directory">
							<icon-fonts icon="icon-wenjianjia" />
							<a @click="handleLoadData(record)">
								{{ text | objectNameFilter }}</a>
						</template>
						<template v-else>
							<t-ellipsis :value="text">
								<template slot="content">
									<icon-fonts :icon="getIconFonts(record.fileName)" />
									<a @click="
			                () => {
			                  handleDownLoad(record);
			                }
			              ">
										{{ text | objectNameFilter }}</a>
								</template>
							</t-ellipsis>
						</template>
					</span>
					<span slot="action" slot-scope="text, record">
						<template v-if="!record.directory">
							<a v-if="showPreview(record)" @click="
			            () => {
			              handlePreview(record);
			            }
			          ">预览</a>
							<a-divider type="vertical" />
							<a @click="handleView(record)">分享</a>
							<a-divider type="vertical" />
							<a @click="handleDownLoad(record)">下载</a>
						</template>
					</span>
				</a-table>
			</a-spin>
		</div>
		<edit-form ref="createModal" :visible.sync="visible" :model="mdl" @cancel="handleCancel()"
			@ok="handleOkBucket" />
		<editDic-form ref="subModal" :visible="subVisible" :loading="subConfirmLoading" :model="mdlDic"
			@cancel="handleCancel(1)" @ok="handleOkDic()" />
		<web-upload ref="createPostModal" :visible="visibleFile" :data="fileData" :url="url.webUpload"
			@cancel="handleCancel(2)" @ok="handleOkFile" />
		<previewImage :imgSrc="imgPreview" :visible.sync="imgVisible"></previewImage>
	</div>
</template>

<script>
	import {
		STable,
		Ellipsis
	} from "@/components";
	import editForm from "./edit.vue";
	import {
		dataListMixin
	} from "@/mixins/dataListMixin";
	import {
		simpleListMixin
	} from "@/mixins/simpleListMixin";
	import editDicForm from "./editDicItem.vue";
	import webUpload from "@/components/TopVUI/custom/webupload.vue";
	import previewImage from "@/components/TopVUI/custom/previewImage";
	// import util from '@/utils/util'
	import {
		downloadMinio
	} from "@/utils/TopVUI";

	import {
		submitForm,
		GetUrlParam,
		getIconFont,
		getTypeByList,
		fileSuffix,
	} from "@/utils/util";
	import store from "@/store";
	const columns = [{
		title: "存储空间",
		dataIndex: "name",
	}, ];
	const columnsDicItem = [{
			title: "#",
			align: "center",
			width: 50,
			scopedSlots: {
				customRender: "serial",
			},
		},
		{
			title: "文件名（fileName）",
			dataIndex: "fileName",
			scopedSlots: {
				customRender: "fileName",
			},
			customCell: (record, rowIndex) => {
				return {
					style: "color: #1890ff",
				};
			},
		},
		{
			title: "大小",
			width: 80,
			dataIndex: "size",
			ellipsis: true,
		},
		{
			title: "操作",
			dataIndex: "action",
			width: 180,
			scopedSlots: {
				customRender: "action",
			},
		},
	];
	export default {
		name: "TableList",
		mixins: [dataListMixin, simpleListMixin],
		components: {
			STable,
			Ellipsis,
			editForm,
			editDicForm,
			webUpload,
			previewImage,
		},
		data() {
			this.columns = columns;
			this.columnsDicItem = columnsDicItem;
			return {
				// create model
				visible: false,
				visibleView: false,
				subVisible: false,
				visibleFile: false,
				subConfirmLoading: false,
				mdl: null,
				mdlDic: null,
				// 高级搜索 展开/关闭
				advanced: false,
				// 查询参数
				queryParam: {},
				queryParamDicItem: {},
				url: {
					webUpload: "/document/minio/uploadfile",
					getBucketList: "/document/minio/listBuckets",
					getOssBucketList: "/document/minio/listFiles",
					subAdd: "/document/oss/saveCatalog",
					delFile: "/document/minio/deleteFile",
				},
				ifamSrc: "",
				bucketList: [],
				// 加载数据方法 必须为 Promise 对象
				loadData: (parameter) => {
					const requestParameters = Object.assign({}, parameter, this.queryParam);
					return this.$post(this.url.getBucketList, requestParameters).then(
						(res) => {
							const list = {};
							list.pageNo = 1;
							list.pageSize = 20;
							list.rows = [];
							res.data.forEach((e) => {
								list.rows.push({
									name: e
								});
							});
							list.totalCount = res.length;
							list.totalPage = Math.ceil(res.length / 20);
							this.queryParamDicItem.bucket = list.rows[0].name;
							// this.queryParamDicItem.prefix = "home/";
							this.fetch();
							this.bucketList = res;
							return list;
						}
					);
				},
				dataSource: [],
				pagination: {
					pageSize: 20,
					showSizeChanger: true,
					showQuickJumper: true,
					hideOnSinglePage: true,
					onShowSizeChange: (current, pageSize) =>
						this.onShowSizeChange(current, pageSize),
				},
				masterSelectedRowKeys: [],
				masterSelectedRows: [],
				selectedRowKeysDic: [],
				selectedRowsDic: [],
				masterUuids: "",
				dicUuids: "",
				info: "",
				uuidName: "",
				fileData: {},
				delData: {},
				visibleNewFile: false,
				fileMdl: null,
				fileCatalog: null,
				destinationKey: "",
				destinationBucketName: "",
				tabelLoading: false,
				subConfirmLoadingNewFile: false,
				imgVisible: false,
				imgPreview: "",
			};
		},
		filters: {
			objectNameFilter(val) {
				const objectNameMap = val.split("/")[0];
				return val;
			},
		},
		computed: {
			rowSelection() {
				return {
					selectedRowKeys: this.masterSelectedRowKeys,
					onChange: this.onSelectChangeMaster,
				};
			},
			rowSelectionDic() {
				return {
					selectedRowKeys: this.selectedRowKeysDic,
					onChange: this.onSelectChangeDic,
				};
			},
		},
		mounted() {
			// this.fetch();
		},
		methods: {
			handleAddBucket() {
				this.visible = true;
			},
			handleOkBucket() {
				let form = this.$refs.createModal.form;
				let url = "";
				form.validateFields((errors, values) => {
					if (!errors) {
						this.confirmLoading = true;
						this.$post("/document/minio/createBucket", values)
							.then((res) => {
								if (res === 1 || res.statusCode === 200) {
									this.visible = false;
									this.$refs.table.refresh();
									this.$message.success(res.message, 1.5);
								} else {
									this.$message.error(res.message, 1.5);
								}
							})
							.finally(() => {
								this.confirmLoading = false;
							});
					}
				});
			},
			// 删除
			handleSubBucket(record, type) {
				const that = this;
				if (that.masterSelectedRowKeys.length === 0) {
					that.$message.warn("请先勾选需要的删除的数据");
					return true;
				}
				that.$confirm({
					title: "警告",
					content: `确定要执行该操作吗?`,
					okText: "删除",
					okType: "danger",
					cancelText: "取消",
					onOk() {
						// 在这里调用删除接口
						that
							.$post("/document/minio/deleteBucket", {
								bucket: that.masterSelectedRowKeys.toString(),
							})
							.then((res) => {
								if (res.statusCode === 200) {
									that.$message.success(res.message);
									that.$refs.table.refresh();
									that.masterSelectedRowKeys = [];
								} else {
									that.$message.info(res.message);
								}
							});
					},
					onCancel() {
						console.log("Cancel");
					},
				});
			},
			fetch(params) {
				this.$post(this.url.getOssBucketList, this.queryParamDicItem).then(
					(res) => {
						const pager = {
							...this.pagination
						};
						pager.total = res.data.length;
						this.dataSource = res.data;
						// this.cacheData = res.rows
						this.cacheData = JSON.parse(JSON.stringify(res.data));
						// this.destinationKey = res.keyPrefix;
						this.pagination = pager;
					}
				);
			},
			// 返回
			handleBack() {
				delete this.queryParamDicItem["prefix"];
				this.$refs.subList.selectedRowKeys = [];
				this.fetch();
			},
			// 字体图标匹配
			getIconFonts(text) {
				return getIconFont(text);
			},
			rowClassName(row) {
				return row.name === this.info?.name ? "bg-bray" : ""; // 每条数据的唯一识别值
			},
			// 行点击事件
			rowClick(record, index) {
				const that = this;
				that.info = record;
				that.masterSelectedRowKeys = index;
				that.selectedRowKeysDic = [];
				that.queryParamDicItem.bucket = record.name;
				// that.queryParamDicItem.prefix = "home/";
				that.fileData = that.queryParamDicItem;
				that.fetch();
			},
			handleLoadData(record) {
				this.queryParamDicItem.prefix = record.fileName;
				this.fetch();
			},
			// 新增目录
			handleAddDic() {
				if (!this.info) {
					this.$message.info("请先选中左侧表格的数据");
				} else {
					var mdlData = {
						bucketName: this.info.name,
						endpoint: this.info.extranetEndpoint,
						keyPrefix: this.info.keyPrefix,
					};
					if (this.queryParamDicItem.keyPrefix) {
						this.mdlDic = this.queryParamDicItem;
					} else {
						this.mdlDic = mdlData;
					}
					this.subVisible = true;
				}
				const form = this.$refs.subModal.form;
				form.resetFields(); // 清理表单数据（可不做）
			},
			handleOkDic: function() {
				let form = this.$refs.subModal.form;
				let url = "";
				form.validateFields((errors, values) => {
					if (!errors) {
						this.subConfirmLoading = true;
						if (values.uuid) {
							url = this.url.subUpdate;
						} else {
							url = this.url.subAdd;
						}
						this.$post("/document/minio/getPresignedObjectUrl", values)
							.then((res) => {
								if (res.statusCode !== 300) {
									this.subVisible = false;
									// this.subRows = null;
									const h = this.$createElement;
									this.$success({
										title: "分享地址",
										// JSX support
										content: h("div", {}, [h("p", res)]),
									});
								} else {
									this.$message.error(
										res.message ? res.message : "操作失败",
										1.5
									);
								}
							})
							.finally(() => {
								this.subConfirmLoading = false;
							});
					}
				});
			},
			handleUpLoad() {
				if (this.fileData.bucket) {
					this.visibleFile = true;
					this.$refs.createPostModal.add();
				} else {
					this.$message.info("请先选中需要操作的数据");
					return true;
				}
			},
			// 预览
			handleView(e) {
				const form = this.$refs.subModal.form;
				form.resetFields();
				this.mdlDic = {
					bucket: this.queryParamDicItem.bucket,
					objectName: e.fileName,
				};
				this.subVisible = true;
			},
			handleOkFile() {
				this.visibleFile = false;
				this.fetch();
			},
			// 取消
			handleCancel(type) {
				if (type === 0) {
					this.visible = false;
				} else if (type === 1) {
					this.subVisible = false;
				} else {
					this.visibleFile = false;
				}
			},
			// 删除
			handleSub(record, type) {
				const that = this;
				let masterUuids = "";
				if (that.selectedRowKeysDic.length === 0) {
					that.$message.warn("请先勾选需要的删除的数据");
					return true;
				} else {
					masterUuids = that.delData;
				}
				that.$confirm({
					title: "警告",
					content: `确定要执行该操作吗?`,
					okText: "删除",
					okType: "danger",
					cancelText: "取消",
					onOk() {
						// 在这里调用删除接口
						that.$post(that.url.delFile, masterUuids).then((res) => {
							if (res.statusCode === 200) {
								that.$message.success(res.message);
								that.fetch();
								that.masterUuids = "";
								that.selectedRowKeysDic = [];
							} else {
								that.$message.info(res.message);
							}
						});
						return new Promise((resolve, reject) => {
							setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
						}).catch(() => console.log("Oops errors!"));
					},
					onCancel() {
						console.log("Cancel");
					},
				});
			},
			// 下载
			handleDownLoad(e) {
				downloadMinio(this.queryParamDicItem.bucket, e.fileName);
			},
			// 行勾选事件
			onSelectChangeDic(selectedRowKeys, selectedRows) {
				selectedRows.forEach((e, index) => {
					if (index === 0) {
						this.delData.uuids = e.uuid;
						this.delData.bucket = this.queryParamDicItem.bucket;
						this.delData.objectName = e.fileName;
					} else {
						this.delData.uuids = this.delData.uuids + "," + e.uuid;
					}
				});
				this.selectedRowKeysDic = selectedRowKeys;
				this.selectedRowsDic = selectedRows;
			},
			// 图片预览筛选
			showPreview(e) {
				const imgType = [".jpeg", ".gif", ".png", ".jpg", ".pdf"];
				return getTypeByList(imgType, e.fileName);
			},
			handlePreview(e) {
				this.imgPreview = "";
				this.$nextTick(() => {
					let type = e.fileName.indexOf(".pdf");
					this.$post("/document/minio/getPresignedObjectUrl", {
						bucket: this.queryParamDicItem.bucket,
						objectName: e.fileName,
						days: 1,
					}).then((res) => {
						if (res.statusCode !== 300) {
							if (type > 0) {
								window.open(res);
							} else {
								this.imgVisible = true;
								this.imgPreview = res;
							}
						} else {
							this.$message.error(
								res.message ? res.message : "获取资源失败！",
								1.5
							);
						}
					});
				});
			},
		},
	};
</script>

<style lang="less"></style>
