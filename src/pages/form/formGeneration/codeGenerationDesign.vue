<template>
	<t-drawer class="t-dr" :visible="visibleDetail" :closable="false" :fullscreen="fullscreen"
		:switchFullscreen="fullscreen" @close="
      () => {
        $emit('cancel');
      }
    ">
		<a-spin :spinning="loading" :delay="delayTime">
			<div class="flex design-header">
				<div class="left-step">
					<a-steps v-model="currentIndex" @change="setDataSource" size="default">
						<a-step :title="item.name" v-for="(item, index) in stepList" :key="index" />
					</a-steps>
				</div>
				<div class="right-btn">
					<a-button :class="[currentIndex == 0 ? 'buttonGray' : 'cu-btn-primary']" icon="left"
						@click="changeCurrentIndex('left')" :disabled="currentIndex == 0">上一步</a-button>
					<a-button :class="[
              currentIndex == stepList.length - 1
                ? 'buttonGray'
                : 'cu-btn-primary',
            ]" icon="right" @click="changeCurrentIndex('right')" :disabled="currentIndex == stepList.length - 1">下一步
					</a-button>
					<a-button :class="[
              currentIndex != stepList.length - 1
                ? 'buttonGray'
                : 'cu-btn-success',
            ]" :disabled="currentIndex != stepList.length - 1" icon="check" @click="handleSubmitData"
						:loading="loading">确定</a-button>
					<a-button class="cu-btn-primary" icon="close" @click="
              () => {
                $emit('cancel');
                activeKey = '3';
                $refs.formView.data.list = [];
                $refs.listPage.data = [];
                $refs.listPage.selectedRowKeys = [];
                $refs.formView.selectItem = { key: '' };
                $refs.formView.options = {};
              }
            ">取消</a-button>
				</div>
			</div>
			<basicSet ref="basicSet" v-show="currentIndex === 0" :basicData="basicSetting" :record="record"
				@change="changeBasicSet"></basicSet>
			<form-view style="height: calc(100vh - 56px);" ref="formView" v-show="currentIndex === 1"
				:basicData="basicSetting" :basicsUuid="basicsUuid" :tName="tName" @close="
          () => {
            $emit('cancel');
          }
        " @save="
          () => {
            $emit('ok');
          }
        "></form-view>
			<list-page v-show="currentIndex === 2" ref="listPage" :activeKey="activeKey" :dataSource="dataSource"
				:dataField="dataField" :dataSearch="dataSearch" @activeKeyChange="(e) => (activeKey = e)"
				@dataChange="configDataChange"></list-page>
		</a-spin>
	</t-drawer>
</template>

<script>
	import basicSet from "./basicSet";
	import listPage from "./listPage";
	import formView from "@/components/TopVUI/k-form-design/packages/KFormDesign/formOnline.vue";
	export default {
		components: {
			basicSet,
			listPage,
			formView,
		},
		props: {
			visibleDetail: {
				type: Boolean,
			},
			model: {
				type: Object,
				default: () => null,
			},
			basicsUuid: {
				type: String,
				default: () => "",
			},
		},
		data() {
			return {
				fullscreen: true,
				currentIndex: 0,
				stepList: [{
						name: "基础配置",
						key: 1,
					},
					{
						name: "表单设计",
						key: 1,
					},
					{
						name: "列表设计",
						key: 1,
					},
				],
				basicSetting: {
					basicLayout: "default",
				},
				dataSource: [{
					//插入行内操作按钮
					filed: "action",
					filedName: "操作",
					align: "left",
					width: null,
				}, ],
				dataField: [],
				dataSearch: [],
				activeKey: "3", //列表属性
				loading: false,
				delayTime: 500,
				tName: "",
				record: {},
			};
		},
		mounted() {
			//清除
			this.$nextTick(() => {
				console.log("123");
			});
		},
		methods: {
			getData(e, record) {
				this.tName = e;
				this.record = record;
				this.currentIndex = 0;
				if (this.$refs.basicSet) {
					(this.basicSetting = {
						basicLayout: "default",
					}),
					this.$refs.basicSet.init(this.basicSetting);
				}
				if (this.$refs.formView) this.$refs.formView.loadFormData(e);
				if (this.$refs.listPage) this.$refs.listPage.init();
				this.dataField = [];
				this.dataSearch = [];
			},
			handleSubmitData() {
				this.$refs.listPage.getListData();
				let data = {
					...this.$refs.listPage.getListData(),
				};
				if (data.listData.length < 1) {
					return this.$message.info("请选择列表字段", 1.5);
				}
				data.formData = JSON.parse(this.$refs.formView.getListData());
				let appDetailUuid = this.$refs.formView.getAppDetailUuid();
				let basic = this.$refs.basicSet.getBasicData();
				console.log("basic", basic);
				console.log("listData", data.listData);
				console.log("listProData", data.listProData);
				console.log("formData", data.formData);
				console.log("searchData", data.searchData);

				localStorage.setItem("basicData", JSON.stringify(basic));
				localStorage.setItem("listData", JSON.stringify(data.listData));
				localStorage.setItem("listProData", JSON.stringify(data.listProData));
				localStorage.setItem("formData", JSON.stringify(data.formData));
				localStorage.setItem("searchData", JSON.stringify(data.searchData));

				let url = "";
				let param = {
					listData: JSON.stringify(data.listData),
					formData: JSON.stringify(data.formData),
					searchData: JSON.stringify(data.searchData),
					basicsUuid: this.basicsUuid,
				};
				if (appDetailUuid) {
					url = "/system/sysAppDetailed/update";
					param.uuid = appDetailUuid;
				} else {
					url = "/system/sysAppDetailed/save";
				}
				// this.loading = true;
				// this.$post(url, param).then((res) => {
				// 	if (res.statusCode !== 300) {
				// 		this.$message.success(res.message ? res.message : '操作成功！', 1.5);
				// 		this.$emit('cancel');
				// 		this.activeKey = '1'
				// 		this.$refs.formView.list = []
				// 		this.$refs.listPage.data = []
				// 		this.$refs.listPage.selectedRowKeys = []
				// 		this.$refs.formView.selectItem = {key : ''}
				// 		this.$refs.formView.options = {}
				// 	} else {
				// 		this.$message.error(res.message ? res.message : '操作失败', 1.5)
				// 	}
				// 	this.loading = false;
				// });
			},
			// 步骤切换验证
			changeCurrentIndex(type) {
				if (type == "right" && this.currentIndex == 0) {
					let key = this.$refs.basicSet.validateData();
					if (key == null) return this.$message.info("请将信息填写完整", 1.5);
				}
				if (type == "right" && this.currentIndex == 1) {
					let form = this.$refs.formView.validateData();
					if (form && form == "isNull") {
						return this.$message.info("请先设计表单！", 1.5);
					} else if (form && form.type != "text") {
						return this.$message.info(`${form.label}数据字段不能为空`, 1.5);
					}
				}
				if (type == "left") {
					this.currentIndex -= 1;
				} else {
					this.currentIndex += 1;
				}
				this.setDataSource(this.currentIndex);
			},
			setDataSource(e) {
				let basic = this.$refs.basicSet.getBasicData();
				this.basicSetting = basic;
				if (e === 2) {
					this.dataSource = [];
					// this.dataField = []
					// this.dataSearch= []
					let data = JSON.parse(this.$refs.formView.getListData());
					let configData = this.$refs.formView.getConfigurationData();
					// console.log("dataField",this.dataField)
					// console.log("dataSearch",this.dataSearch)
					// console.log("basic",basic)
					// console.log("configData",configData)
					this.getSourceDataByLayout(data); //根据布局获取source
					if (JSON.stringify(configData) !== "{}") {
						JSON.parse(configData.listData).forEach((item) => {
							this.dataField.push({
								filed: item.filed,
								filedName: item.filedName,
								align: "left",
								fixed: "",
								width: null,
							});
						});
						JSON.parse(configData.searchData).forEach((item) => {
							this.dataSearch.push({
								filed: item.filed,
								filedName: item.filedName,
								align: "left",
								fixed: "",
								width: null,
							});
						});
					}
					let hashField = {};
					this.dataField = this.dataField.reduce(function(item, next) {
						hashField[next.filed] ?
							"" :
							(hashField[next.filed] = true && item.push(next));
						return item;
					}, []);
					let hashSearch = {};
					this.dataSearch = this.dataSearch.reduce(function(item, next) {
						hashSearch[next.filed] ?
							"" :
							(hashSearch[next.filed] = true && item.push(next));
						return item;
					}, []);
					this.dataSource.push({
						//插入行内操作按钮
						filed: "action",
						filedName: "操作",
						align: "left",
						fixed: "",
						width: 120,
					});
				}
			},
			//根据布局获取source
			getSourceDataByLayout(data) {
				data.forEach((val) => {
					if (
						!~[
							"table",
							"grid",
							"tabs",
							"card",
							"batch",
							"divider",
							"text",
						].indexOf(val.type)
					) {
						this.getSourceDataList(val); //数据push
					} else if (~["grid", "tabs"].indexOf(val.type)) {
						//栅格、选项卡布局
						val.columns.forEach((el) => {
							this.getSourceDataByLayout(el.list);
						});
					} else if (val.type == "card") {
						//卡片布局
						this.getSourceDataByLayout(val.list);
					} else if (val.type == "table") {
						//表格布局
						val.trs.forEach((tr) => {
							tr.tds.forEach((td) => {
								this.getSourceDataByLayout(td.list);
							});
						});
					}
				});
			},
			//获取数据
			getSourceDataList(val) {
				this.dataSource.push({
					filed: val.model,
					filedName: val.label,
					align: "left",
					fixed: "",
					width: null,
				});
			},
			configDataChange(data, text) {
				if (text === "list") {
					this.dataField = data;
				}
				if (text === "search") {
					this.dataSearch = data;
				}
			},
			changeBasicSet(e, key) {
				// this.basicSet[key] = e
				console.log("this.basicSet", this.basicSet);
			},
		},
	};
</script>

<style lang="less" scoped>
	@basehight: 56px;

	.buttonGray {
		color: #d9d9d9;
		margin-right: 10px;
	}

	.t-dr {
		.design-header {
			width: 100%;
			height: @basehight;
			line-height: @basehight;
			border-bottom: 1px solid #e8e8e8;

			.left-step {
				width: 70%;
				padding: 0 20%;

				.ant-steps {
					padding-top: 10px;
				}
			}
		}
	}

	/deep/ .ant-drawer-header,
	/deep/ .ant-drawer-body {
		padding: 0 !important;
	}

	.right-btn {
		width: 30%;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding-right: 20px;
	}
</style>
