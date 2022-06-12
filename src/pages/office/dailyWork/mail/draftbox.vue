<template>
	<div class="page-common-layout">
		<div class="page-common-content">
			<div class="page-common-box-content">
				<tool-bar @search="$refs.masterList.refresh(true)" @reset="
				    () => {
				      (this.masterQueryParam = {emailSendState:'草稿'}), $refs.masterList.refresh(true);
				    }
				  ">
					<template slot="toolBtn" slot-scope="scope">
						<a-button class="cu-btn-danger" icon="delete" @click="handleSub($refs.masterList.selectedRowKeys, 'master')">删除</a-button>
					</template>
					<template slot="toolForm">
						<a-form-item label="">
							<a-input v-model="masterQueryParam.cleanMan" placeholder="收件人" />
						</a-form-item>
					</template>
				</tool-bar>
				<dataGrid ref="masterList" type="master" :columns="masterColumns" :url="url" bordered
					:queryParam="masterQueryParam" rowKey="uuid" showPagination="auto" @rowClick="
				    (e) => { masterRowClick(e, { puuid: 'uuid' });} ">
					<span slot="action" slot-scope="{ text, record }">
						<template>
							<a @click="handleEdit(record, 'master')">编辑</a>
							<a-divider type="vertical" />
							<a @click="handleSub(record, 'master')">删除</a>
						</template>
					</span>
				</dataGrid>
			</div>
			<div class="page-common-box-content">
				<a-tabs default-active-key="1">
					<a-tab-pane key="1" tab="附件信息">
						<dataGrid ref="subList" type="sub" :url="url" :columns="subColumns" bordered :queryParam="subQueryParam"
							rowKey="uuid" showPagination="auto">
							<span slot="action" slot-scope="{text, record}">
								<template>
									<a @click=" () => { downloadSub(record);}">下载</a>
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
				@cancel="handleCancel('master')" @ok="handleJsonOk" />
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
	
	import { downloadMinio } from "@/utils/TopVUI";
	
	const masterColumns = [{
			title: "主题",
			dataIndex: "zhuti",
			ellipsis: true,
		},{
			title: "收件人",
			dataIndex: "cleanMan",
			ellipsis: true,
		},{
			title: "操作",
			width: 100,
			dataIndex: "action",
			scopedSlots: {
				customRender: "action"
			},
		},
	];
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
		},{
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
				masterQueryParam: {emailSendState:'草稿'},
				subQueryParam: {puuid: 1,uuids: ""},
				mdlUserPost: {},
				url: {
					masterList: "/office/oaEmail/getPageSet",
					masterDelete: "/office/oaEmail/deleteBatch",
					masterAdd: "/office/oaEmail/save",
					masterUpdate: "/office/oaEmail/update",
					masterUpdateEmail: "/office/oaEmail/updateEmail",
					subList: "/document/fastdfs/getPageSetUuids",
					subDelete: "/document/fastdfs/deleteBatch",
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
				masterUrl: "",
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
			handleJsonOk(e){
				let form = {};
				form = this.$refs.masterModal.form.getFieldsValue();
				
				let fileList = this.$refs.masterModal.fileList;
				console.log("fileList =" , fileList)
				let uploadUuidList = "";
				for(var i = 0 ; i < fileList.length ; i++){
					if(i==0) {
						uploadUuidList = fileList[i].response.dfsFileUuid;
					} else{
						uploadUuidList = uploadUuidList + "," + fileList[i].response.dfsFileUuid;
					}
				}
				let fromValue = {...form};
				fromValue.uploadUuidList = uploadUuidList;
				if(e == "save"){
					fromValue.emailSendState = "草稿";
					this.masterUrl = this.url.masterUpdate;
				} else {
					fromValue.emailSendState = "发送";
					this.masterUrl = this.url.masterUpdateEmail;
				}
				console.log("fromValue", fromValue);
				this.$post(this.masterUrl, fromValue).then((res) => {
				    if (res === 1 || res.statusCode === 200) {
							if (this.$refs.masterList.refresh) {
									this.$refs.masterList.refresh()
							}
							this.$message.success(res.message ? res.message : '操作成功', 1.5)
				    } else {
							this.$message.error(res.message ? res.message : '操作失败', 1.5)
				    }
				}).finally(() => {
					  this.masterMdl
				    this.masterVisible = false
				    this.masterConfirmLoading = false
				})
			},
			// 表格行事件
			masterRowClick(record, param) {  //oa_email_uuid
				// console.log(record, param)
				let oaEmailUuid = "";
				for (var i in param) {
					oaEmailUuid = record[param[i]]
				}
				// console.log(oaEmailUuid)
				this.$post("office/oaEmailAccessory/getAccessorylByUuid", { oaEmailUuid: oaEmailUuid}).then((res) => {
					// console.log(res)
					if(res){
						// console.log("----------------------------")
						this.subQueryParam.uuids = "";
						for(var i=0; i < res.length; i++){
							// console.log(res[i].accessoryUuid);
							if(i == 0){
								this.subQueryParam.uuids = res[i].accessoryUuid;
							} else{
								this.subQueryParam.uuids = this.subQueryParam.uuids + "," + res[i].accessoryUuid;
							}
						}
						this.$refs.subList.refresh()
					}
				})
				// if (this.$refs.subList) {
				// 	for (var i in param) {
				// 			this.subQueryParam[i] = record[param[i]]
				// 	}
				// 	this.$refs.subList.rows = null
				// 	this.$refs.subList.refresh()
				// }
			},
			
			downloadSub(e){
				console.log(e)
				downloadMinio('vue-office', e.fileName);
			}
		},
	};
</script>

<style lang="less">
</style>