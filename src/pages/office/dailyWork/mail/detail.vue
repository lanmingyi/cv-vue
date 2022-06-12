<template>
	<t-modal title="新增/编辑" :width="1000" :visible="visible" :confirmLoading="loading" :closable="false">
		<template slot="footer">
			<!-- <a-button v-if="type===2" class="cu-btn-default"
            icon="edit" @click="forward()">转发</a-button> -->
			<!-- <a-button v-if="type === 2" class="cu-btn-primary" @click="
          () => {
            reply = true;
          }
        ">回复</a-button> -->
			<a-button key="back" @click="
          () => {
            this.$nextTick(() => {
              reply = false;
              $emit('cancel');
            });
          }
        ">关闭</a-button>
		</template>
		<div class="mail">
			<div class="mail_head">
				<div class="mail_head_title">
					<div>发件人： {{mailData.creator}}</div>
					<!-- <div>2020年9月28日 18点26分</div> -->
				</div>
				<div class="mail_head_title">
					<div>收件人： {{mailData.cleanMan}}</div>
					<!-- <div>2020年9月28日 18点26分</div> -->
				</div>
				<div class="mail_head_send">
					主题： {{mailData.zhuti}}
				</div>
			</div>
			<div class="mail_content" v-html="mailData.trainContent"></div>
			<div class="page-common-sub-box">
				<DataGrid ref="table" :url="url" :columns="subColumns" bordered :queryParam="queryParam"
					rowKey="uuid" showPagination="auto">
					<span slot="action" slot-scope="{text, record}">
						<template>
							<a @click="
				          () => {
				            download(record.uuid);
				          }
				        ">下载</a>
						</template>
					</span>
				</DataGrid>
			</div>
		</div>
		<a-spin :spinning="loading">
			<a-form :form="form" v-if="reply">
				<a-row>
					<a-col :span="24">
						<a-form-item label="回复内容" :labelCol="labelColfull" :wrapperCol="wrapperColfull">
							<a-input v-decorator="['trainContent']" type="hidden" />
							<Editor :value="trainContent" :isClear="isClear" style="text-align:left"
								@onchange="changeEditor"></Editor>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="24">
						<a-form-item label="附件列表" :labelCol="labelColfull" :wrapperCol="wrapperColfull">
							<a-upload :multiple="true" :file-list="fileList" :remove="handleRemove"
								:before-upload="beforeUpload">
								<a-button>
									<a-icon type="upload" /> 上传
								</a-button>
							</a-upload>
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item :labelCol="labelColfull" :wrapperCol="wrapperColfull">
							<a-input v-decorator="['uuid', { initialValue: uuid }]" type="hidden" />
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
		</a-spin>
	</t-modal>
</template>

<script>
	import {
		baseUrl
	} from "@/services/baseUrl.js";
	import {
		axios
	} from "@/utils/request";
	import pick from "lodash.pick";
	import Vue from "vue";
	import {
		ACCESS_TOKEN
	} from "@/store/mutation-types";
	import {
		DataGrid
	} from "@/components";
	import Editor from "@/components/TopVUI/custom/Editor/index.vue";
	import {
		dataListMixin
	} from "@/mixins/dataListMixin";
	import {
		pdfStreamHandeler
	} from "@/services/common";
	// 表单字段
	const fields = [
		"uuid",
		"postName",
		"status",
		"trainStartTime",
		"trainEndTime",
		"trainContent",
	];
	const subColumns = [{
			title: "文件名称",
			width: 250,
			dataIndex: "fileName",
			ellipsis: true,
		},
		{
			title: "文件大小",
			width: 90,
			dataIndex: "fileSize",
		},
		{
			title: "上传时间",
			width: 150,
			dataIndex: "createTime",
		},
		// {
		// 	title: '操作',
		// 	dataIndex: 'action',
		// 	width: 100,
		// 	scopedSlots: {
		// 		customRender: 'action'
		// 	}
		// }
	];

	export default {
		components: {
			Editor,
			DataGrid,
		},
		props: {
			visible: {
				type: Boolean,
				required: true,
			},
			type: {
				type: Number,
				default: 0,
			},
			// loading: {
			// 	type: Boolean,
			// 	default: () => false
			// },
			model: {
				type: Object,
				default: () => null,
			},
		},
		mixins: [dataListMixin],
		data() {
			// this.subColumns = subColumns;
			return {
				subColumns,
				labelCol: {
					xs: {
						span: 24,
					},
					sm: {
						span: 8,
					},
				},
				labelColfull: {
					xs: {
						span: 24,
					},
					sm: {
						span: 4,
					},
				},
				wrapperCol: {
					xs: {
						span: 24,
					},
					sm: {
						span: 12,
					},
				},
				wrapperColfull: {
					xs: {
						span: 24,
					},
					sm: {
						span: 18,
					},
				},
				form: this.$form.createForm(this),
				url: {
					getCategorysByTypeAndLevelId: "/system/category/getCategorysByTypeAndLevelId",
					getListByPid: "/system/category/getListByPid",
					getTopicBaseDetailByUuid: "/system/topicBase/getDetailByUuid",
					getDetailByUuidAndUser: "/office/oaMeetingsBase/getDetailByUuidAndUser",
					editcontents: "/office/oaMeetingsBase/editcontents",
					getDetail: "/office/oaMeetingsBase/editcontents",
					getListByUuids: "/mdata/user/getListByUuids",
					getPageSet: "/document/fastdfs/getPageSetUuids",
				},
				loadDataSub: (parameter) => {
					const requestParameters = Object.assign({},
						parameter,
						this.queryParamSub
					);
					return this.$post(this.url.getListByPid, requestParameters).then(
						(res) => {
							var list = {
								pageNo: 0,
								pageSize: 0,
								rows: [{
									fileSize: "8kb",
									createTime: "2018-06-12 08:49:01",
									fileName: "7步搞定4㎡卫生间装修，又省钱又上档次",
									uuid: "93c3e68af6654bd5a3290a5b24751bbe",
								}, ],
								totalCount: 0,
								totalPage: 0,
							};
							return list;
						}
					);
				},
				isClear: true,
				loading: false,
				uuid: "",
				trainContent: "",
				fileList: [],
				action: "",
				headers: {
					token: Vue.ls.get(ACCESS_TOKEN),
				},
				formData: new FormData(),
				uploadUrl: "",
				reply: false,
				subUUids: "",
				content: "阿巴巴巴爸爸爸爸爸爸爸爸",
				queryParam: {uuids: ""},
				mailData: {},
			};
		},
		updated() {
			this.isClear = false;
			this.trainContent = this.form.getFieldValue("trainContent");
			console.log("loading", this.loading);
		},
		methods: {
			add(m) {
				// console.log("add = ", m);
				this.fileList = [];
				this.reply = false;
			},
			edit(m) {
				// console.log("edit = ",m)
				this.fileList = [];
				this.reply = false;
				this.form.setFieldsValue(pick(m, fields));
				this.mailData = m;
				this.$post("office/oaEmailAccessory/getAccessorylByUuid", { oaEmailUuid: m.uuid}).then((res) => {
					if(res){
						this.queryParam.uuids = "";
						for(var i=0; i < res.length; i++){
							if(i == 0){
								this.queryParam.uuids = res[i].accessoryUuid;
							} else{
								this.queryParam.uuids = this.queryParam.uuids + "," + res[i].accessoryUuid;
							}
						}
						this.$refs.table.refresh()
					}
				})
			},
			changeEditor(e) {
				this.trainContent = e;
				this.form.setFieldsValue({
					trainContent: e,
				});
			},
			subRowClassName(row) {
				return row.uuid === this.subUuids ? "bg-bray" : ""; // 每条数据的唯一识别值
			},
			subRowClick(record, index) {
				this.subRows = record;
				this.subUuids = record.uuid;
			},
			handleChange(info) {
				console.log("this.data", this.data);
				let fileList = [...info.fileList];
				fileList = fileList.map((file) => {
					if (file.response) {
						file.url = file.response.url;
						this.$emit("resTable");
					}
					return file;
				});
				this.fileList = fileList;
			},
			forward() {
				this.$message.error("转发失败");
			},
			handleRemove(file) {
				const index = this.fileList.indexOf(file);
				const newFileList = this.fileList.slice();
				newFileList.splice(index, 1);
				this.fileList = newFileList;
			},
			beforeUpload(file) {
				this.fileList = [...this.fileList, file];
				console.log("this.fileList--------", this.fileList);
				return false;
			},
			handleUpload() {
				const {
					fileList
				} = this;
				fileList.forEach((file) => {
					this.$nextTick(() => {
						this.uploadUrl = this.url;
						const formData = new FormData();
						formData.append("file", file);
						if (this.puuid) formData.append("puuid", this.puuid);
						if (this.data && this.data.keyPrefix) {
							this.uploadUrl =
								this.url +
								`?bucketName=${this.data.bucketName}&endpoint=${
                this.data.endpoint
              }&keyPrefix=${encodeURIComponent(this.data.keyPrefix)}`;
						} else if (this.data) {
							formData.append("bucketName", this.data.bucketName);
							formData.append("endpoint", this.data.endpoint);
							formData.append("keyPrefix", this.data.keyPrefix);
						}
						this.num++;
						this.$nextTick(() => {
							setTimeout(() => {
								this.uploadData(formData);
							}, 200);
						});
					});
				});
			},
			uploadData(e) {
				this.loading = true;
				const that = this;
				axios({
					url: baseUrl + that.uploadUrl,
					method: "post",
					processData: false,
					headers: {
						token: Vue.ls.get(ACCESS_TOKEN),
					},
					data: e,
				}).then((res) => {
					if (res.statusCode === 200 || res === 1) {
						console.log(
							"this.num === this.fileList.length",
							that.num,
							that.fileList.length
						);
						if (that.num === that.fileList.length) {
							that.$message.success("上传成功！");
							that.$emit("ok");
							that.fileList = [];
							this.loading = false;
						}
					} else {
						that.$message.error(res.message);
						this.loading = false;
					}
				});
			},
		},
		created() {
			this.action = baseUrl + this.url;
			this.headers.token = Vue.ls.get(ACCESS_TOKEN);
			// 防止表单未注册
			fields.forEach((v) => this.form.getFieldDecorator(v));
			// 当 model 发生改变时，为表单设置值
			this.$watch("model", () => {
				this.model && this.form.setFieldsValue(pick(this.model, fields));
			});
		},
	};
</script>

<style lang="less" scoped>
	.mail {
		width: 90%;
		margin: 0 auto;

		.mail_head {
			padding-bottom: 30px;
			border-bottom: 2px solid #303030;

			.mail_head_title {
				display: flex;
				align-items: center;
				justify-content: space-between;

				div:first-child {
					font-size: 22px;
					font-weight: bold;
					line-height: 50px;
				}

				div:last-child {
					font-size: 14px;
					color: #333;
					line-height: 50px;
				}
			}

			.mail_head_send {
				font-size: 14px;
				color: #333;
				line-height: 50px;
			}
		}

		.mail_content {
			font-size: 16px;
			color: #333;
			line-height: 30px;
			padding: 30px 0;
			border-bottom: 2px solid #303030;
			margin-bottom: 30px;
		}
	}

	.tab_table {
		width: 100%;
		min-height: 100px;
		background: #ffffff;
		border-radius: 8px;
		border: 1px solid #e7e7e7;
		margin-right: 10px;
		padding: 5px 5px 0 5px;
		max-height: 300px;
		overflow: auto;

		& span {
			padding: 3px 8px;
			margin-bottom: 5px;
		}
	}

	.item-box {
		display: flex;
		align-items: flex-start;
	}
</style>
