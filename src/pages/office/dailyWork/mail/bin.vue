<template>
	<div class="page-common-layout">
		<div class="page-common-content">
			<div class="page-common-box-content">
				<tool-bar @search="$refs.masterList.refresh(true)" @reset="
				    () => {
				      (this.masterQueryParam = {}), $refs.masterList.refresh(true);
				    }
				  ">
					<template slot="toolBtn" slot-scope="scope">
						<a-button class="cu-btn-danger" icon="delete" @click="handleSub($refs.masterList.selectedRowKeys, 'master')">彻底删除</a-button>
					</template>
					<template slot="toolForm">
						<a-form-item label="">
							<a-input v-model="masterQueryParam.trainName" placeholder="发件人" />
						</a-form-item>
					</template>
				</tool-bar>
				<dataGrid ref="masterList" type="master" :columns="masterColumns" :url="url" bordered
					:queryParam="masterQueryParam" rowKey="uuid" showPagination="auto" @rowClick="
				    (e) => { masterRowClick(e, { puuid: 'uuid' });} ">
					<span slot="action" slot-scope="{ text, record }">
						<template>
							<a @click="handleBrowse(record)">浏览</a>
						</template>
					</span>
				</dataGrid>
			</div>
			<div class="page-common-box-content">
				<a-tabs default-active-key="1">
					<a-tab-pane key="1" tab="附件信息">
						<dataGrid ref="subList" type="sub" :url="url" :columns="subColumns" bordered :queryParam="subQueryParam"
							rowKey="uuid" showPagination="auto">
							<span slot="action" slot-scope="text, record">
								<template>
									<a @click=" () => { download(record.uuid);}">下载</a>
									<a-divider type="vertical" />
									<a v-if="showPreview(record)" @click="handlePreview(record)">预览</a>
									<a-divider v-if="showPreview(record)" type="vertical" />
									<a @click="handleSub(record, 'sub')">删除</a>
								</template>
							</span>
						</dataGrid>
					</a-tab-pane>
				</a-tabs>
			</div>
			<edit-form ref="masterModal" :visible="masterVisible" :loading="masterConfirmLoading" :model="masterMdl"
				@cancel="handleCancel('master')" @ok="handleJsonOk('master')" />
			<detail-form ref="detailModal" :visible="visibleDetail" :loading="masterConfirmLoading" :model="masterMdl"
				@cancel="handleDetailCancel" :type="2" @ok="handleDetailOk" />
			<web-upload ref="createPostModal" :visible="subVisible" :loading="webConfirmLoading" :data="mdlUserPost"
				@cancel="handleCancel(1)" @ok="handleOkUserPost" />
			<preview-image :imgSrc="imgPreview" :visible="imgVisible" @cancel="() => (imgVisible = false)" />
		</div>
	</div>
</template>

<script>
	import {
		baseUrl
	} from "@/services/baseUrl.js";
	import {
		pdfStreamHandeler
	} from "@/services/common";
	import {
		masterTableMixin
	} from "@/mixins/masterTableMixin";
	import dataGrid from "@/components/table/advance/dataGrid";
	import webUpload from "@/components/TopVUI/custom/webupload.vue";
	import previewImage from "@/components/TopVUI/custom/previewImage.vue";
	import editForm from "./edit.vue";
	import detailForm from "./detail.vue";
	const masterColumns = [{
			title: "主题",
			dataIndex: "title",
			ellipsis: true,
		},{
			title: "操作",
			width: 100,
			dataIndex: "action",
			scopedSlots: {
				customRender: "action"
			},
		}];
	const subColumns = [
		{
			title: "文件名称",
			dataIndex: "fileName",
			ellipsis: true,
		},
		{
			title: "文件大小",
			dataIndex: "fileSize",
		},
		{
			title: "上传人",
			dataIndex: "creator",
		},
		{
			title: "上传时间",
			dataIndex: "createTime",
		}
	];
	export default {
		name: "TableList",
		mixins: [masterTableMixin],
		components: {
			dataGrid,
			editForm,
			webUpload,
			previewImage,
			detailForm,
		},
		data() {
			return {
				masterColumns,
				subColumns,
				masterVisible: false,
				subVisible: false,
				masterConfirmLoading: false,
				subConfirmLoading: false,
				webConfirmLoading:false,
				masterMdl: null,
				subMdl: null,
				// 查询参数
				masterQueryParam: {},
				subQueryParam: {puuid: 1},
				mdlUserPost: {},
				url: {
					masterList: "/system/topicBase/getPageSet",
					masterDelete: "/system/testDemo/deleteBatch",
					masterAdd: "/system/testDemo/save",
					masterUpdate: "/system/testDemo/update",
					subList: "/document/fastdfs/getPageSet",
					subDelete: "/document/fdfs/deleteBatch",
					subAdd: "/document/fdfs/upload",
					subUpdate: "/document/fastdfs/update"
				},
				urlpdf: {
					pdfStreamHandeler: "/system/attachment/pdfStreamHandeler",
				},
				key: 1,
				detailConfirmLoading: false,
				trainList: [{
					text: "礼仪",
					value: "礼仪",
				}, ],
				imgVisible: false,
				imgPreview: "",
				meetingState: [],
				visibleDetail: false,
			};
		},
		computed: {
		},
		mounted() {},
		methods: {
			handleDetailCancel() {
				this.visibleDetail = false;
			},
			handleDetailOk() {
				this.visibleDetail = false;
			},
			handleBrowse(record) {
				this.visibleDetail = true;
				let form = {};
				form = this.$refs.detailModal.form;
				form.resetFields();
			},
			handleaddArchivePost() {
				if (!this.masterQueryParam.puuid) {
					this.$message.info("请先选择用户数据");
				} else {
					this.mdlUserPost = {
						puuid: this.masterQueryParam.puuid,
					};
					this.subVisible = true;
				}
				const form = this.$refs.createPostModal.form;
				form.resetFields(); // 清理表单数据（可不做）
				this.$refs.createPostModal.add(this.mdlUserPost);
			},
			handleOkUserPost() {
				this.subLoadingUserPost = true;
				this.subVisible = false;
				const formUserPost = this.$refs.createPostModal.form;
				formUserPost.resetFields();
				this.$refs.subList.refresh();
			},
			showPreview(e) {
				const imgType = ["jpg", "jpeg", "gif", "png", "pdf"];
				return imgType.find((val) => e.fileType === val);
			},
			// 预览
			handlePreview(e) {
				console.log("e----------------预览", e);
				this.imgPreview = "";
				const imgType = ["jpg", "jpeg", "gif", "png"];
				const type = imgType.find((val) => e.fileType === val);
				if (!type) {
					pdfStreamHandeler(this.urlpdf.pdfStreamHandeler, {
						uuid: e.uuid,
						filePath: e.filePath,
					}).then((res) => {
						var binaryData = [];
						binaryData.push(res);
						const blob = new Blob(binaryData, {
							type: "application/pdf;charset-UTF-8",
						});
						const objectUrl = window.URL.createObjectURL(blob);
						window.open("./statics/pdf/web/viewer.html?file=" + objectUrl);
					});
				} else {
					this.imgVisible = true;
					this.imgPreview =
						baseUrl + "/system/attachment/showPic?path=" + e.filePath;
				}
			},
		},
	};
</script>

<style lang="less">
</style>
