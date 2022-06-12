<template>
	<a-card :bordered="false">
		<toolBar @search="$refs.table.refresh(true)" @reset="
					() => {
						(this.queryParam = {}), $refs.table.refresh(true);
					}
				">
			<template slot="toolBtn" slot-scope="scope">
				<div class="table-operator" v-if="type && type === 2">
					<a-button class="cu-btn-primary" @click="handleaddArchivePost" icon="upload">上传附件</a-button>
				</div>
			</template>
		</toolBar>
		<DataGrid ref="table" :columns="columns" :url="url" :queryParam="queryParam" rowKey="uuid"
			:format-conditions="true" :pageSize="10">
			<span slot="fileName" slot-scope="{text, record}">
				<t-ellipsis :value="text">
					<template slot="content">
						<icon-fonts :icon="getIconFontByFile(text)" style="margin-right: 5px;" />
						<a @click="handleDownLoad(record)">{{ text }}</a>
					</template>
				</t-ellipsis>
			</span>
			<span slot="action" slot-scope="{text, record}">
				<template>
					<a @click="
				        () => {
				          handleDownLoad(record);
				        }
				      ">下载</a>
					<a-divider v-if="showPreview(record)" type="vertical" />
					<a v-if="showPreview(record)" @click="handlePreview(record)">预览</a>
					<span v-if="type && type === 2">
						<a-divider type="vertical" />
						<a @click="handleSub(record)">删除</a>
					</span>
					<template v-if="showTypePreview(record)">
						<a-divider type="vertical" />
						<a @click="getViewUrlWebPath(record)">在线编辑</a>
					</template>
				</template>
			</span>
		</DataGrid>
		<t-modal title="图片预览" :width="800" :visible="imgVisible" @ok="() => (imgVisible = false)"
			@cancel="() => (imgVisible = false)">
			<div style="width: 100%;">
				<img style="width: 100%;object-fit: center;" :src="imgPreview" />
			</div>
		</t-modal>
		<web-upload ref="createPostModal" :visible="visibleUserPost" url="/document/oss/multiUpload" :data="mdlUserPost"
			@cancel="handleCancelPost" @ok="handleOkUserPost" />
	</a-card>
</template>

<script>
	import {
		baseUrl
	} from "@/services/baseUrl";
	import Vue from "vue";
	import {
		ACCESS_TOKEN
	} from "@/store/mutation-types";
	import {
		pdfStreamHandeler
	} from "@/services/common";
	import {
		DataGrid
	} from "@/components";
	import {
		dataGridMixin
	} from "@/mixins/dataGridMixin";
	import webUpload from "@/components/TopVUI/custom/webupload.vue";
	import {
		getIconFont,
		getTypeByList,
		fileSuffix
	} from "@/utils/util";
	import {
		Ellipsis
	} from "@/components";
	import {
		downloadOss
	} from "@/utils/TopVUI";
	import store from "@/store";
	const columns = [{
			title: "文件名称",
			dataIndex: "fileName",
			scopedSlots: {
				customRender: "fileName",
			},
		},
		{
			title: "上传人",
			dataIndex: "creator",
			ellipsis: true,
			width: 120,
		},
		{
			title: "上传时间",
			dataIndex: "createTime",
			ellipsis: true,
			width: 150,
		},
		{
			title: "操作",
			dataIndex: "option",
			width: 200,
			scopedSlots: {
				customRender: "action",
			},
		},
	];
	export default {
		name: "TableList",
		mixins: [dataGridMixin],
		components: {
			DataGrid,
			webUpload,
			Ellipsis
		},
		props: {
			params: {
				type: Object,
				default: {},
			},
			type: {
				type: Number,
				default: 1,
			},
		},
		data() {
			return {
				columns,
				visible: false,
				confirmLoading: false,
				// 查询参数
				queryParam: {},
				loadData: [],
				mdlUserPost: null,
				visibleUserPost: false,
				url: {
					getPageSet: "/document/ossFile/getPageSet",
					deleteBatch: "/system/attachment/delete",
					pdfStreamHandeler: "/system/attachment/pdfStreamHandeler",
					deleteBatchOss: "/document/ossFile/deleteBatch",
				},
				imgVisible: false,
				imgPreview: "",
			};
		},
		methods: {
			fetch(qurey){
				this.queryParam = qurey
				this.$refs.table.refresh()
			},
			getIconFontByFile(val) {
				return getIconFont(val);
			},
			showTypePreview(e) {
				// const typeList = ['.doc', '.ppt', '.xls','.pdf']
				return getTypeByList(fileSuffix, e.fileName);
			},
			handleaddArchivePost() {
				console.log("this.model", this.queryParam);
				if (!this.queryParam) {
					this.$message.info("请先选择用户数据");
				} else {
					this.mdlUserPost = {
						module: "exceptionHeader",
						category: "default",
						puuid: this.queryParam.puuid,
						bucketName: "zysd-test3",
						endpoint: "oss-cn-beijing.aliyuncs.com",
						keyPrefix: "协同办公附件/传阅管理/",
					};
					this.visibleUserPost = true;
				}
				this.$refs.createPostModal.add(this.mdlUserPost);
			},
			handleOkUserPost() {
				this.fetch(this.queryParam);
				this.visibleUserPost = false;
			},
			handleCancelPost() {
				this.visibleUserPost = false;
				this.mdlUserPost = null;
			},
			showPreview(e) {
				const imgType = ["jpg", "jpeg", "gif", "png", "pdf"];
				return imgType.find((val) => e.fileType === val);
			},
			// 下载
			handleDownLoad(e) {
				downloadOss(e.bucketName, e.endpoint, e.keyUrl);
			},
			// 预览
			handlePreview(e) {
				console.log("e----------------预览", e);
				this.imgPreview = "";
				this.$nextTick(() => {
					const imgType = ["jpg", "jpeg", "gif", "png"];
					const type = imgType.find((val) => e.fileType === val);
					console.log(type);
					if (!type) {
						pdfStreamHandeler(this.url.pdfStreamHandeler, {
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
				});
			},
			// 在线编辑
			getViewUrlWebPath(record) {
				let url =
					"https://" +
					record.bucketName +
					"." +
					record.endpoint +
					"/" +
					record.keyUrl;
				console.log(url);
				let reg = /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/;
				if (!reg.test(url)) {
					this.$message.info("请输入正确的file url！");
					return;
				}
				const fileName = url;
				const fileStrArr = fileName.split(".");
				console.log(fileStrArr);
				const suffix = fileStrArr[fileStrArr.length - 1];

				let result = fileSuffix.some((item) => {
					return item === suffix;
				});

				if (!result) {
					this.$message.info("不支持该文件类型");
					return;
				}
				this.loading = true;
				const params = {
					fileUrl: url,
					uuid: record.size,
					uploadType: "oss",
				};
				this.$post("/office/wps/getViewUrlWebPath", params, null)
					.then((res) => {
						// window.open(res.Token.wpsUrl, '_blank');
						// // this.$router.push({path: '/document/oss/view'})
						// // util.$emit('getUrl',res.Token.wpsUrl)
						// let data = GetUrlParam(res.Token.wpsUrl)

						// let urls = res.Token.wpsUrl.split("?")[0];
						// console.log(data,urls)
						// new submitForm(urls,data).get();
						// this.visibleView = true
						// this.ifamSrc = res.Token.wpsUrl
						// console.log(this.ifamSrc)
						store.commit("SET_WPSURL", res.Token.wpsUrl);
						localStorage.setItem("wpsUrl", res.Token.wpsUrl);
						const jump = this.$router.resolve({
							name: "viewFile"
						});
						window.open(jump.href, "_blank");
						// util.$emit('getUrl',res.Token.wpsUrl)
					})
					.catch(() => {
						this.$message.info("请求错误！");
						this.loading = false;
					});
			},
			// 删除
			handleSub(record, paramar) {
				const that = this;
				let uuids = "";
				if (record === "all") {
					if (that.selectedRowKeys.length === 0) {
						this.$message.warn("请勾选需要删除的数据", 1.5);
						return;
					} else {
						uuids = that.selectedRowKeys.toString();
					}
				} else {
					uuids = record.uuid;
				}
				let value = {
					uuid: uuids,
					...paramar,
				};
				console.log("value", value);
				that.$confirm({
					title: "警告",
					content: `确定要执行该操作吗?`,
					okText: "删除",
					okType: "danger",
					cancelText: "取消",
					onOk() {
						that.$post(that.url.deleteBatchOss, value).then((res) => {
							if (res.statusCode === 200 || res === 1) {
								// 在这里调用删除接口
								that.$post(that.url.deleteBatch, value).then((res) => {
									if (res.statusCode === 200 || res === 1) {
										that.$message.success(res.message, 1.5);
										if (that.fetch) {
											that.fetch(that.queryParam);
										} else {
											that.$refs.table.refresh();
										}
										if (that.refreshOnload) that.refreshOnload(); //删除成功的回调
										that.rows = "";
										that.selectedRowKeys = [];
									} else {
										that.$message.error(res.message, 1.5);
									}
								});
							} else {
								that.$message.error(res.message, 1.5);
							}
						});

						return new Promise((resolve, reject) => {
							setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
						}).catch(() => console.log("Oops errors!"));
					},
					onCancel() {},
				});
			},
			refresh(row) {
				this.queryParam = row
				this.$refs.table.refresh();
			},
		},
	};
</script>

<style lang="less"></style>
