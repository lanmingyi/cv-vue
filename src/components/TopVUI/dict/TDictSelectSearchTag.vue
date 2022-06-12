<!--
 * @Description: 数据字典单选组件
 * @Author: 黄婷
 * @Date: 2021-06-02 13:38:08
 * @LastEditTime: 2021-09-16 10:42:31
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\dict\TDictSelectTag.vue
-->
<template>
	<!-- 单选 -->
	<a-radio-group v-if="tagType == 'radio'" @change="handleInput" :value="getValueSting" :disabled="disabled">
		<a-radio v-for="(item, key) in dictOptions" :key="key" :value="valueFeild ? item[valueFeild] : item.value">
			{{ textFeild ? item[textFeild] : item.label || item.text }}</a-radio>
	</a-radio-group>
	<!-- 单选按钮 -->
	<a-radio-group v-else-if="tagType == 'radioButton'" buttonStyle="solid" @change="handleInput" :value="getValueSting"
		:disabled="disabled">
		<a-radio-button v-for="(item, key) in dictOptions" :key="key"
			:value="valueFeild ? item[valueFeild] : item.value">{{
        textFeild ? item[textFeild] : item.label || item.text
      }}</a-radio-button>
	</a-radio-group>
	<!-- 下拉单选 -->
	<a-select :showSearch="showSearch" style="width: 120px;" v-else-if="tagType == 'select'"
		:getPopupContainer="getPopupContainer" :placeholder="placeholder" :disabled="disabled" :value="getValueSting"
		@change="handleInput" :allowClear="allowClear">
		<a-select-option v-for="(item, key) in dictOptions" :key="key"
			:value="valueFeild ? item[valueFeild] : item.value" :label="valueFeild ? item[valueFeild] : item.value">
			<span style="display: inline-block;width: 100%" :title="item.text || item.label">
				{{ textFeild ? item[textFeild] : item.label || item.text }}
			</span>
		</a-select-option>
	</a-select>
</template>

<script>
	import {
		getObjectByString
	} from "@/utils/util";
	export default {
		name: "TDictSelectTag",
		props: {
			dictCode: String,
			placeholder: {
				type: String,
				default: "请选择",
			},
			triggerChange: Boolean,
			disabled: Boolean,
			value: [String, Number],
			type: String,
			getPopupContainer: {
				type: Function,
				default: (node) => node.parentNode,
			},
			dataList: Array,
			valueFeild: String,
			textFeild: String,
			url: "",
			dataType: {
				type: String,
				default: "code",
			},
			params: {
				type: String,
			},
			method: {
				type: String,
				default: "post",
			},
			showSearch: {
				type: Boolean,
				default: false,
			},
			allowClear: {
				type: Boolean,
				default: true,
			},
		},
		data() {
			return {
				dictOptions: [],
				tagType: "",
			};
		},
		watch: {
			// 请求方式
			dataType: {
				deep: true,
				immediate: true,
				handler(newVal, oldVal) {
					if (newVal === "static") {
						this.dictOptions = this.dataList;
					} else if (newVal === "dynamic") {
						this.getDataList();
					} else {
						this.initDictData();
					}
				},
			},
			// 静态数据
			// dataList: {
			//   deep: true,
			//   immediate: true,
			//   handler(newVal, oldVal) {
			// console.log(2)
			//     this.dictOptions = newVal;
			//   },
			// },
		},
		created() {
			if (!this.type || this.type === "list") {
				this.tagType = "select";
			} else {
				this.tagType = this.type;
			}
		},
		computed: {
			getValueSting() {
				console.log(this.value)
				console.log(this.dictOptions)
				// update-begin author:wangshuai date:20200601 for: 不显示placeholder的文字 ------
				// 当有null或“” placeholder不显示
				return this.value != null ? this.value : undefined;
				// update-end author:wangshuai date:20200601 for: 不显示placeholder的文字 ------
			},
		},
		methods: {
			// 获取动态数组
			getDataList() {
				// let params = {};
				// let arr = this.params.split(",");
				// arr.forEach((e) => {
				//   let key = e.split(":")[0];
				//   params[key] = e.split(":")[1];
				// });
				let params = getObjectByString(this.params, ",", ":");
				this.$axios(this.method, this.url, params).then((res) => {
					if (res.statusCode !== 300) {
						this.dictOptions = res;
					}
				});
			},
			// 获取字典数据
			initDictData() {
				this.$post(
					"/system/dicSet/getDicItemByCode", {
						code: this.dictCode
					},
					null
				).then((res) => {
					if (res) {
						this.dictOptions = res;
					}
				});
			},
			// 输入框输入
			handleInput(e) {
				let val;
				if (this.tagType == "radio") {
					val = e.target.value;
				} else {
					val = e;
				}
				if (this.dataType == "static") {
					this.dictOptions.forEach(item => {
						if (item.value == e) {
							val = item.text;
						}
					})
				}
				this.$emit("change", val);
			},
			setCurrentDictOptions(dictOptions) {
				this.dictOptions = dictOptions;
			},
			getCurrentDictOptions() {
				return this.dictOptions;
			},
		},
		model: {
			prop: "value",
			event: "change",
		},
	};
</script>

<style scoped></style>
