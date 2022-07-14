<!--
 * @Description: 省市区级联选择
 * @Author: lmy
 * @Date: 2021-01-18 15:17:26
 * @LastEditTime: 2021-08-06 17:14:18
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
	<div class="j-area-linkage">
		<div v-if="reloading">
			<span> Reloading... </span>
		</div>
		<area-cascader v-else-if="_type === enums.type[0]" :value="innerValue" :data="pcaa" :level="1"
			:style="{ width }" v-bind="$attrs" v-on="_listeners" @change="handleChange" />
		<area-select v-else-if="_type === enums.type[1]" :value="innerValue" :data="pcaa" :level="2" v-bind="$attrs"
			v-on="_listeners" @change="handleChange" />
		<div v-else>
			<span style="color:red;"> Bad type value: {{ _type }}</span>
		</div>
	</div>
</template>

<script>
	import pcaa from "@/components/_utils/pcaa";
	import Area from "@/components/_utils/Area";

	export default {
		name: "JAreaLinkage",
		props: {
			value: {
				type: String,
				required: false,
			},
			// 组件的类型，可选值：
			// select 下拉样式
			// cascader 级联样式（默认）
			type: {
				type: String,
				default: "cascader",
			},
			width: {
				type: String,
				default: "100%",
			},
			record: {
				type: Object,
			},
			url: Object
		},
		data() {
			return {
				pcaa,
				innerValue: [],
				usedListeners: ["change"],
				enums: {
					type: ["cascader", "select"],
				},
				reloading: false,
				areaData: "",
				loadData: (parameter) => {
					// 
					const url = this.url.locationDistrict;
					parameter.id = '7BBE422553E74F76969AB41A8AB81814';

					const requestParameters = Object.assign({},
						parameter
					);
					// console.log('param:',requestParameters);
					return this.$post(url, requestParameters).then((res) => {
						console.log('exportRes:', res);
						console.log('exportPara:', requestParameters);
						return;
						console.log('dataNew:', res.data.rows);
						this.dataSource = res.data.rows;
						return res.data;
					});
				},
				pcaatemp: () => {
					console.log('url:');
					return this.pointCodeOptions1;
					const url = this.url.locationPoint;
					// console.log('param:',requestParameters);
					return this.$post(url).then((res) => {
						console.log('exportRes111:', res);
						this.dataSource = res.data.rows;
						return res.data;
					});
				},
			};
		},
		computed: {
			_listeners() {
				let listeners = {
					...this.$listeners
				};
				// 去掉已使用的事件，防止冲突
				this.usedListeners.forEach((key) => {
					delete listeners[key];
				});
				return listeners;
			},
			_type() {
				if (this.enums.type.includes(this.type)) {
					return this.type;
				} else {
					console.error(
						`JAreaLinkage的type属性只能接收指定的值（${this.enums.type.join(
            "|"
          )}）`
					);
					return this.enums.type[0];
				}
			},
		},
		watch: {
			value: {
				immediate: true,
				handler() {
					this.loadDataByValue(this.value);
				},
			},
			record(val) {
				if (val) {
					this.loadDataByValue(val.options.defaultValue);
				}
			},
		},
		created() {
			this.initAreaData();
		},
		methods: {
			/** 重新加载组件 */
			reload() {
				this.reloading = true;
				this.$nextTick(() => (this.reloading = false));
			},

			/** 通过 value 反推 options */
			loadDataByValue(value) {
				if (!value || value.length === 0) {
					this.innerValue = [];
				} else {
					this.initAreaData();
					let arr = this.areaData.getRealCode(value);
					this.innerValue = arr;
				}
				this.reload();
			},
			/** 通过地区code获取子级 */
			loadDataByCode(value) {
				let options = [];
				let data = pcaa[value];
				if (data) {
					for (let key in data) {
						if (data.hasOwnProperty(key)) {
							options.push({
								value: key,
								label: data[key]
							});
						}
					}
					return options;
				} else {
					return [];
				}
			},
			/** 判断是否有子节点 */
			hasChildren(options) {
				options.forEach((option) => {
					let data = this.loadDataByCode(option.value);
					option.isLeaf = data.length === 0;
				});
			},
			handleChange(values) {
				console.log('输出:', values);
				let value = values[values.length - 1];
				this.$emit("change", value, this.getText(value));
				// this.$emit("change", values);
			},
			initAreaData() {
				if (!this.areaData) {
					this.areaData = new Area();
				}
			},
			getText(code) {
				if (!code || code.length == 0) {
					return "";
				}
				let arr = [];
				this.getAreaBycode(code, arr);
				return arr;
			},
			getAreaBycode(code, arr) {
				for (let item of new Area().all) {
					if (item.id === code) {
						arr.unshift(item.text);
						this.getAreaBycode(item.pid, arr);
					}
				}
			},
		},
		model: {
			prop: "value",
			event: "change"
		},
	};
</script>

<style lang="less" scoped>
	.j-area-linkage {
		height: auto;

		/deep/ .area-cascader-wrap .area-select {
			width: 100%;
		}

		/deep/ .area-select .area-selected-trigger {
			line-height: 1.15;
		}
	}

	/deep/.area-selectable-list-wrap::-webkit-scrollbar,
	.cascader-menu-list::-webkit-scrollbar {
		width: 3px !important;
	}
</style>
