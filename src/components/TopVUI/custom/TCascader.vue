<!--
 * @Description: 级联选择器
 * @Author: 黄婷
 * @Date: 2021-08-20 15:48:40
 * @LastEditTime: 2021-08-23 14:41:28
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\custom\Tcascader.vue
-->
<template>
  <div>
    <a-cascader
      v-model="textValue"
      :options="options"
      :load-data="loadData"
      change-on-select
      :placeholder="placeholder"
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
    };
  },
  props: {
    value: {},
    record: {},
    placeholder: {
      type: String,
    },
    url: {
      required: false,
    },
    parameter: {
      required: false,
    },
    textFeild: {
      required: false,
      default: "label",
    },
    valueFeild: {
      required: false,
      default: "value",
    },
    placeholder: { type: String },
  },
  watch: {
    value(val) {
      if (typeof val === "string") {
        this.textValue = val ? JSON.parse(val) : [];
      } else {
        this.textValue = val;
      }
    },
  },
  created() {
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
      console.log(value);
      this.$emit("change", value);
    },
    getData() {
      let parmas = this.parameter.father;
      this.$post(this.url.fathersUrl, parmas).then((res) => {
        if (res.statusCode != 300) {
          let options = res;
          this.options = [];
          options.forEach((res) => {
            res.label = res[this.textFeild];
            res.value = res[this.valueFeild];
            res.isLeaf = false;
            this.options.push(res);
          });
        } else {
          this.options = [];
        }
      });
    },
    loadData(selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1];
      targetOption.loading = true;
      let parmas = this.parameter.children;
      parmas.pid = targetOption.id;
      this.$post(this.url.expandUrl, parmas).then((res) => {
        if (res.statusCode != 300) {
          let options = res;
          console.log("res",res)
          if (res.length > 0) {
            targetOption.children = [];
            options.forEach((res) => {
              res.label = res[this.textFeild];
              res.value = res[this.valueFeild];
              res.isLeaf = false;
              targetOption.children.push(res);
            });
            this.options = [...this.options];
          } else {
            targetOption.loading = false;
          }
        }
        targetOption.loading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
