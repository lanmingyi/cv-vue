<!--
 * @Description: 级联选择器
 * @Author: lmy
 * @Date: 2021-08-20 15:48:40
 * @LastEditTime: 2021-08-24 13:52:59
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <div>
    <a-cascader
      :options="options"
			:load-data="loadData"
      change-on-select
      :placeholder="placeholder"
			:value="value"
			:field-names="{ label: 'text', value: 'id', children: 'children' }"
      @change="onChange"
    />
  </div>
</template>

<script>
import { getObjectByString } from "@/utils/util";
export default {
  data() {
    return {
      options: [],
      textValue: [],
			count: 0
    };
  },
  props: {
    value: {
			default: () => []
		},
    record: {},
    placeholder: {
      type: String,
    },
    url: { required: true },
    parameter: {},
    method: {
      required: true,
    },
    placeholder: { type: String },
		childParams: {
			type: Object,
			default: () => {}
		},
		expandUrl: {
			type: String,
		},
		codeParams: {
			type: Object,
			default: () => {}
		},
  },
  watch: {
    value(val) {
      console.log(val);
      if (typeof val === "string") {
        this.textValue = val ? JSON.parse(val) : [];
      } else {
        this.textValue = val;
      }
    },
  },
  created() {
		console.log(this.value)
    this.getData();
    let value = this.record.options.defaultValue;
    console.log(value);
    this.setTextValue(value);
  },
  methods: {
    setTextValue(val) {
      // 当传入value改变时，fileList也要改变
      // 如果传入的值为字符串，则转成json
      if (typeof val === "string") {
        this.textValue = val ? JSON.parse(val) : [];
      } else {
        this.textValue = val;
      }
    },
    onChange(value) {
      this.$emit("change", value);
    },
    getData() {
      let parmas = getObjectByString(this.parameter, ",", ":");
			if(this.dataType == 'dynamic'){
				this.$axios(this.method, this.url, parmas).then((res) => {
				  if (res.statusCode !== 300 && res.length) {
						res.forEach(item => {
							item.isLeaf = false
						})
				    this.options = res;
				  } else {
				    this.options = [];
				  }
				});
			}else{
				this.$post("/system/codeItem/getListByCodeSetIdAndLevelId", this.codeParams).then((res1) => {
					// if (res1.statusCode !== 300 && res1.length) {
					// 	res1.forEach(item => {
					// 		item.isLeaf = false
					// 	})
					//   this.options = res1;
					// } else {
					//   this.options = [];
					// }
					if (res1.statusCode !== 300 && res1.length) {
						this.$post("/system/codeItem/getListByPid", {pid: res1[0].id}).then((res2) => {
							if (res2.statusCode !== 300 && res2.length) {
								res2.forEach(item => {
									if(item.state == "closed"){
										item.isLeaf = false
									}
									delete item.children
									if(this.value.length && item.id === this.value[this.count]){
										this.count += 1
										this.getChildren(item)
									}
								})
							  this.options = res2;
							} else {
							  this.options = [];
							}
						})
					} else {
					  this.options = [];
					}
				})
			}
    },
		getChildren(treeNode){
			return new Promise((resolve) => {
			  if (treeNode.isLeaf) {
			    resolve();
			    return;
			  }
				let param = {};
				let pid = treeNode.id;
				if (this.childParams.parentNode && this.dataType == 'dynamic'){
					param[this.childParams.key] = pid
				}else{
					param.pid = pid;
				}
				
			  this.$axios(this.method, this.expandUrl, param).then((res) => {
						if(res.length){
							res.forEach(item => {
								item.isLeaf = item.state=="closed"?false:true;
							})
							const treeData = res;
							treeNode.children = treeData;
							this.options = [...this.options];
							
							if(this.value.length > 0){
								let findVal = res.find(item => {
									return item.id === this.value[this.count];
								});
								if(findVal.state != "open"){
									this.getChildren(findVal)
									this.count += 1
								}
							}
						}
						resolve();
			    })
			    .catch((err) => {
			      console.log(err);
			    });
			});
		},
    loadData(selectedOptions) {
			console.log(selectedOptions)
      const targetOption = selectedOptions[selectedOptions.length - 1];
      targetOption.loading = true;
      // let parmas = getObjectByString(this.childParma, ",", ":");
      // parmas.pid = targetOption.id;
			let param = {};
			let pid = targetOption.id;
			if (this.childParams.parentNode && this.dataType == 'dynamic'){
				param[this.childParams.key] = targetOption[this.childParams.parentNode]
			}else{
				param.pid = pid;
			}
			this.$axios(this.method, this.expandUrl, param).then((res) => {
				let options = res;
				if (res.length > 0) {
					targetOption.children = [];
					options.forEach((item) => {
						item.label = item[this.textFeild];
						item.value = item[this.valueFeild];
						item.isLeaf = item.state=="closed"?false:true;
						targetOption.children.push(item);
					});
					this.options = [...this.options];
				}
        targetOption.loading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
