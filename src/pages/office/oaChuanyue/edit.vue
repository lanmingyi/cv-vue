<template>
	<j-modal :title="type.value === 1 ? '详情' : '新增/编辑'" placement="right" width="60%" :visible="visible"
		:fullscreen="false" :switchFullscreen="true" :confirmLoading="loading" @cancel="
      () => {
        $emit('cancel');
      }
    ">
		<a-spin :spinning="loading">
			<a-form :form="form">
				<a-row>
					<template v-if="type.value != 2">
						<a-col :span="24">
							<h2 class="text-center">
								{{ modelInfo.title }}
								<span class="head-title">
									<icon-fonts icon="icon-fire" class="card-title-icon" type="big"
										style="position: relative;"></icon-fonts><span
										class="num">{{ modelInfo.rank }}</span>
								</span>
							</h2>
						</a-col>
						<!-- <a-col :span="12">
							<p class="text-center"><icon-fonts icon="icon-renzhengzuozhechu" type="small" class="card-title-icon" /> {{modelInfo.creator}}</p></a-col> -->
						<a-col :span="24" class="text-center">
							<span class="text-center">
								<icon-fonts icon="icon-yonghu" type="small" class="card-title-icon" />
								{{ modelInfo.creator }}
							</span>
							<span class="text-center margin-left">
								<icon-fonts icon="icon-shijian-copy" type="small" class="card-title-icon" />
								{{ modelInfo.createTime }}
							</span>
						</a-col>
						<a-col :span="24">
							<div v-html="modelInfo.content" class="margin-top padding-left-sm padding-right-sm"></div>
						</a-col>
					</template>
					<template v-else>
						<a-col :span="24">
							<a-form-item label="标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-input v-decorator="[
                    'title',
                    { rules: [{ required: true, message: '必填' }] },
                  ]" :disabled="type.value == 2 ? false : true" />
							</a-form-item>
						</a-col>
						<a-col :span="24">
							<a-form-item label="紧急程度" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<a-select v-decorator="['rank']" @change="urgencyChange"
									:disabled="type.value == 2 ? false : true">
									<a-select-option v-for="(item, index) in urgencyArr" :key="index"
										:value="item.value">
										{{ item.text }}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col :span="24">
							<a-form-item label="完成时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
								<t-date style="width: 100%;" v-decorator="['completeDate']" :trigger-change="true"
									dateFormat="YYYY-MM-DD" :disabled="type.value == 2 ? false : true" />
							</a-form-item>
						</a-col>
						<a-col :span="24" v-show="type.value == 2">
							<a-form-item label="传阅详情" :labelCol="labelCol" :wrapperCol="wrapperCol"
								style="min-height: 120px">
								<a-input v-decorator="['content']" type="hidden" />
								<Editor :value="content" :isClear="isClear" style="text-align:left;"
									@onchange="changeEditor" :disabled="type.value == 2 ? false : true"></Editor>
							</a-form-item>
						</a-col>
					</template>
					<a-col :span="24" v-show="type.actType != 1">
						<a-card :bordered="false" class="margin-top">
							<pass-files ref="accessoryModal" :params="queryParam" :type="type.value" />
						</a-card>
					</a-col>
					<a-col :span="24" v-show="type.actType != 1">
						<a-card :bordered="false" class="margin-top">
							<pass-peoper class="margin-top-sm" ref="peoperModal" :params="queryParamDicItem"
								:model="model" :type="type.value" />
						</a-card>
					</a-col>
					<a-col class="margin-top-xl" :span="24" v-show="type.value == 1">
						<a-form-item label="传阅意见" style="min-height: 120px">
							<a-textarea v-model="opinion" style="min-height: 115px; resize: none;" />
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item class="hiddenItem">
							<a-input v-decorator="['rankText']" type="hidden" />
						</a-form-item>
					</a-col>
					<a-col :span="24">
						<a-form-item class="hiddenItem">
							<a-input v-decorator="['uuid']" type="hidden" />
						</a-form-item>
					</a-col>
				</a-row>
			</a-form>
		</a-spin>
		<div :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 3,
      }">
			<template v-if="type.value == 1 || type.value == 3">
				<a-button class="cu-btn-primary" @click="makeSure" icon="check">确认</a-button>
			</template>
			<template v-if="type.value == 2">
				<a-button class="cu-btn-primary" v-if="type.add" @click="
            () => {
              $emit('ok');
            }
          " icon="save">保存</a-button>
				<a-button class="cu-btn-primary" v-if="type.edit" @click="
            () => {
              $emit('ok');
            }
          " icon="reload">更新</a-button>
			</template>
			<!-- <template v-if="type.value==3">
				<a-button class="cu-btn-primary" @click="() => { $emit('cancel') }" icon="close">关闭</a-button>
			</template> -->
		</div>
	</j-modal>
</template>

<script>
	import pick from "lodash.pick";
	import Editor from "@/components/TopVUI/custom/Editor/index.vue";
	import passFiles from "./passFiles.vue";
	import passPeoper from "./passPeoper.vue";

	// 表单字段
	const fields = ["uuid", "title", "rank", "rankText", "completeDate", "content"];
	export default {
		components: {
			Editor,
			passFiles,
			passPeoper,
		},
		props: {
			visible: {
				type: Boolean,
				required: true,
			},
			model: {
				type: Object,
			},
			type: {
				type: Object,
			},
		},
		data() {
			return {
				labelCol: {
					xs: {
						span: 24
					},
					sm: {
						span: 3
					},
				},
				wrapperCol: {
					xs: {
						span: 24
					},
					sm: {
						span: 20
					},
				},
				title: "详情",
				loading: false,
				visibleUserPost: false,
				content: "",
				isClear: true,
				form: this.$form.createForm(this),
				urgencyArr: [],
				selectedRowKeys: [],
				queryParam: {},
				queryParamDicItem: {},
				masterList: [],
				attachedList: [],
				contentList: [],
				mdlUserPost: null,
				uuid: "",
				opinion: "已阅",
				url: {
					getDicItemByCode: "/system/dicSet/getDicItemByCode",
					getDetailByUuid: "/office/oaChuanyue/getDetailByUuid",
				},
				modelInfo: {},
			};
		},
		computed: {
			rowSelection() {
				return {
					selectedRowKeys: this.selectedRowKeys,
					onChange: this.onSelectChange,
				};
			},
		},
		updated() {
			this.isClear = false;
			this.content = this.form.getFieldValue("content");
		},
		mounted() {
			this.$post(this.url.getDicItemByCode + "?code=urgency").then((res) => {
				this.urgencyArr = res;
			});
		},
		methods: {
			request(row) {
				// console.log(row);
				this.contentList = [];
				this.content = "";
				if (row && row.uuid) {
					this.uuid = row.uuid;
					this.queryParam.puuid = row.uuid;
					this.queryParamDicItem.chuanyueUuid = row.uuid;
					this.form.setFieldsValue(pick(row, fields));
					this.loadData();
					this.modelInfo = row;
				} else {
					this.form.resetFields() 
					// console.log('add',this.model)
					// this.form.setFieldsValue(pick({}, fields))
				}
			},
			loadData() {
				this.$post(this.url.getDetailByUuid, {
					uuid: this.uuid,
				}).then((res) => {
					this.contentList = res;
					this.content = res.content;
					this.opinion = res.opinion;
					this.$nextTick(() => {
						this.form.setFieldsValue({
							content: res.content,
						});
					});
					this.modelInfo.content = res.content
					this.$nextTick(()=>{
						if(this.$refs.accessoryModal)this.$refs.accessoryModal.fetch({
							puuid :this.uuid
						});
						if(this.$refs.peoperModal)this.$refs.peoperModal.fetch({
							chuanyueUuid :this.uuid
						});
					})
				});
			},
			changeEditor(e) {
				this.content = e;
				this.form.setFieldsValue({
					content: e,
				});
			},
			makeSure() {
				let values = {
					chuanyueUuid: this.uuid,
					opinion: this.opinion,
				};
				this.loading = true;
				this.$post("/office/oaChuanyue/read", values).then((res) => {
					if (res === 1 || res.statusCode === 200) {
						this.$message.success(res.message);
						this.content = "";
						this.$refs.peoperModal.fetch(this.queryParamDicItem);
					} else {
						this.$message.error(res.message);
					}
					this.loading = false;
				});
			},
			urgencyChange(e) {
				this.form.setFieldsValue({
					rankText: this.urgencyArr[e - 1].text,
				});
			},
		},
		created() {
			// 防止表单未注册
			fields.forEach((v) => this.form.getFieldDecorator(v));
			// // 当 model 发生改变时，为表单设置值
			this.$watch("model", () => {
				this.model && this.form.setFieldsValue(pick(this.model, fields));
			});
		},
	};
</script>

<style scoped="scoped" lang="less">
	.ant-drawer-title {
		padding-right: 30px;
	}

	.form-box-table {
		width: 93%;
		margin: 0 auto 10px;
	}

	/deep/.account-center-avatarHolder {
		img {
			max-width: 100% !important;
		}

		td {
			border: 1px solid #000;
		}
	}

	.card-title-icon {
		margin-right: 5px;
	}

	.head-title {
		position: relative;

		.num {
			position: absolute;
			left: 30%;
			font-size: 5px;
			top: 10px;
			color: #fff;
		}
	}
</style>
