<!--
 * @Description: 树形选择器
 * @Author: 黄婷
 * @Date: 2021-01-18 15:17:27
 * @LastEditTime: 2021-08-24 13:52:10
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\k-form-design\packages\components\FormTreeSelect.vue
-->
<template>
	<!-- tree-default-expand-all -->
	<a-tree-select :allowClear="allowClear" :getPopupContainer="(node) => node.parentNode" style="width: 100%"
		:disabled="disabled" :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }" :placeholder="placeholder"
		:value="value" :treeData="treeData" :multiple="multiple" @select="select"
		@change="onChange" @search="onSearch" :show-search="showSearch" :treeCheckable="treeCheckable"
		:loadData="asyncLoadTreeData" :replaceFields="replaceFields">
	</a-tree-select>
</template>
<script>
	import {
		getObjectByString
	} from "@/utils/util";
	export default {
		name: "formTreeSelect",
		props: {
			value: {
				required: false,
			},
			placeholder: {
				type: String,
				default: "请选择",
				required: false,
			},
			data: {
				type: Array,
			},
			url: {
				required: true
			},
			parameter: {},
			method: {
				required: true,
			},
			disabled: {
				type: Boolean,
				default: false,
				required: false,
			},
			hasChildField: {
				type: String,
				default: "",
				required: false,
			},
			condition: {
				type: String,
				default: "",
				required: false,
			},
			// 是否支持多选
			multiple: {
				type: Boolean,
				default: false,
			},
			loadTriggleChange: {
				type: Boolean,
				default: false,
				required: false,
			},
			idfield: {
				type: String,
				default: 'id',
			},
			textfield: {
				type: String,
				default: 'text',
			},
			treeValueText: {
				type: String,
				default: undefined,
			},
			treeValueId: {
				type: String,
				default: undefined,
			},
			allowClear: {
				type: Boolean,
				default: true,
			},
			treeCheckable: {
				default: false
			},
			showSearch: {
				default: false
			},
			parentKey: {
				type: Array,
			},
			expandUrl: {
				type: String,
			},
			childParams: {
				type: Object,
				default: () => {}
			},
			codeParams: {
				type: Object,
				default: () => {}
			},
			dataType: {
				type: String,
			}
		},
		data() {
			return {
				treeValue: null,
				treeData: [],
				replaceFields: {
					children: "children",
					title: this.textfield ? this.textfield : "text",
					key: "id",
					value: "id",
				},
				treeNodeData: []
			};
		},
		watch: {
			value(newVal) {
				console.log("newVal", newVal, !this.multiple, this.method, );
				if (!this.multiple) {
					this.loadItemByCode();
				} else {
					this.loadItemByCode(newVal);
				}
				let fathersParma = getObjectByString(this.parameter, ",", ":");
				this.$axios(this.method, this.url, fathersParma).then((res) => {
					if (res.statusCode !== 300 && res.length) {
						this.$emit("update:parentKey", Object.keys(res[0]))
					}
				})
			},
		},
		created() {
			this.validateProp().then(() => {
				this.loadRoot();
				this.$nextTick(() => {
					setTimeout(() => {
						this.loadItemByCode();
					}, 300)
				})
			});
			this.$watch("treeValueText", (val) => {
				this.treeValue = val ? val : null;
			});
			this.$watch("treeValueId", (val) => {
				this.loadItemByCode(val);
			});
		},
		mounted() {
			console.log(1)
			if (!this.multiple) {
				// if(this.value) this.treeValue = this.value
				this.loadItemByCode();
			} else {
				this.loadItemByCode(this.value);
			}
		},
		methods: {
			loadItemByCode(val) {
				let value = val ? val : this.value;
				let treeData = this.data ? this.data : this.treeData;
				if (!value || !treeData || (treeData && treeData.length === 0)) {
					this.treeValue = null;
				} else {
					this.filterListById(value, treeData);
				}
			},
			filterListById(id, data) {
				const that = this;
				data.forEach((e) => {
					if (id === e[that.idfield]) {
						that.treeValue = that.textfield ? e[that.textfield] : e.text;
						console.log(that.treeValue);
					} else {
						if (e.children) {
							that.filterListById(id, e.children);
						}
					}
				});
			},
			onLoadTriggleChange(text) {
				console.log("text", text);
				//只有单选才会触发
				if (!this.multiple && this.loadTriggleChange) {
					this.$emit("change", this.value, text);
				}
			},
			asyncLoadTreeData(treeNode) {
				console.log(treeNode)
				return new Promise((resolve) => {
					if (treeNode.dataRef.children && treeNode.dataRef.children.length > 0) {
						resolve();
						return;
					}
					let param = {};
					let pid = treeNode.dataRef.id;
					if (this.childParams.parentNode && this.dataType == 'dynamic') {
						param[this.childParams.key] = treeNode.dataRef[this.childParams.parentNode]
					} else {
						param.pid = pid;
					}
					this.$axios(this.method, this.expandUrl, param).then((res) => {
							const treeData = res;
							treeNode.dataRef.children = treeData;
							this.treeData = [...this.treeData];
							resolve();
						})
						.catch((err) => {
							console.log(err);
						});
				});
			},
			loadRoot() {
				let fathersParma = getObjectByString(this.parameter, ",", ":");
				// axiosRequest(this.method, this.url, fathersParma).then((res) => {
				// 	if (res.statuCode !== 300) {
				// 		this.treeData = res;
				// 		console.log("this.treeData",this.treeData)
				// 	} else {
				// 		console.log("数根节点查询结果-else", res);
				// 	}
				// });
				if (this.dataType == 'dynamic') {
					this.$axios(this.method, this.url, fathersParma).then((res) => {
						if (res.statusCode !== 300 && res.length) {
							this.treeData = res;
							// this.$emit("update:parentKey",Object.keys(res[0]))
						}
					})
				} else {
					this.$post("/system/codeItem/getListByCodeSetIdAndLevelId", this.codeParams).then((res) => {
						if (res.statusCode !== 300 && res.length) {
							this.treeData = res;
							this.loadChildrenNode();
						}
					})
				}
			},
			loadChildrenNode() {
				this.$post("/form/formField/getFatherIds", {
					id: this.value,
					tableName: "sys_code_item",
					rootNodeId: this.treeData[0].id
				}).then((res) => {
					if(res.statusCode === 200){
						this.treeData.forEach(item => {
							if(item.id === this.treeData[0].id){
								item.children = this.toTreeData(res.data, this.treeData[0].id)
							}
						})
					}
				}).catch((err) => {
					console.log(err);
				});
			},
			toTreeData(data, pid) {
				function tree(id) {
					let arr = []
					data.filter(item => {
						return item.pid === id;
					}).forEach(item => {
						arr.push({
							...item,
							children: tree(item.id)
						})
					})
					return arr
			 }
			 return tree(pid)
			},
			onChange(value, node) {
				console.log("value", value, node)
				if (!value) {
					this.$emit("change", "");
					this.treeValue = null;
				} else if (value instanceof Array && this.multiple) {
					this.treeValue = value;
					this.$emit("change", value.map((item) => item.value).join(","), node);
				} else {
					this.treeValue = node.toString();
					this.$emit("change", value, node);
				}
			},
			select(value, node, extra) {
				// let val = this.textfield?node.dataRef[this.idfield]:node.dataRef.id
				//    this.treeValue = node.dataRef.text
				// this.$emit('change', val)
			},
			onSearch(value) {
				console.log(value);
			},
			getCurrTreeData() {
				return this.treeData;
			},
			validateProp() {
				let mycondition = this.condition;
				return new Promise((resolve, reject) => {
					if (!mycondition) {
						resolve();
					} else {
						try {
							let test = JSON.parse(mycondition);
							if (typeof test == "object" && test) {
								resolve();
							} else {
								this.$message.error(
									"组件TreeSelect-condition传值有误，需要一个json字符串!"
								);
								reject();
							}
						} catch (e) {
							this.$message.error(
								"组件TreeSelect-condition传值有误，需要一个json字符串!"
							);
							reject();
						}
					}
				});
			},
		},
		//2.2新增 在组件内定义 指定父组件调用时候的传值属性和事件类型 这个牛逼
		model: {
			prop: "value",
			event: "change",
		},
	};
</script>
