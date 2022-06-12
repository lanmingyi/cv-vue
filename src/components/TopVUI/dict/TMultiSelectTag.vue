<!--
 * @Description: 数据字典多选组件
 * @Author: 黄婷
 * @Date: 2021-06-02 13:38:08
 * @LastEditTime: 2021-09-17 09:25:08
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\dict\TMultiSelectTag.vue
-->
<template>
  <!-- 复选框 -->
  <a-checkbox-group
    v-if="tagType == 'checkbox'"
    @change="onChange"
    :value="arrayValue"
    :disabled="disabled"
  >
    <a-checkbox
      v-for="(item, key) in dictOptions"
      :key="key"
      :value="valueFeild ? item[valueFeild] : item.value"
    >
      {{ textFeild ? item[textFeild] : item.label || item.text }}</a-checkbox
    >
  </a-checkbox-group>
  <!-- 下拉多选 -->
  <a-select
    style="width: 100%;"
    v-else-if="tagType == 'select'"
    :value="arrayValue"
    @change="onChange"
    :disabled="disabled"
    mode="multiple"
    :placeholder="placeholder"
    :getPopupContainer="(node) => node.parentNode"
    :allowClear="allowClear"
  >
    <a-select-option
      v-for="(item, index) in dictOptions"
      :key="index"
      :value="valueFeild ? item[valueFeild] : item.value"
    >
      <span
        style="display: inline-block;width: 100%"
        :title="item.text || item.label"
      >
        {{ textFeild ? item[textFeild] : item.label || item.text }}
      </span>
    </a-select-option>
  </a-select>
</template>

<script>
import { getObjectByString } from "@/utils/util";
export default {
  name: "TMultiSelectTag",
  props: {
    dictCode: String,
    placeholder: String,
    disabled: Boolean,
    value: String,
    type: String,
    options: Array,
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
    allowClear: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      dictOptions: [],
      tagType: "",
      arrayValue: !this.value ? [] : this.value.split(","),
    };
  },
  created() {
    if (!this.type || this.type === "list_multi") {
      this.tagType = "select";
    } else {
      this.tagType = this.type;
    }
    //获取字典数据
    //this.initDictData();
  },
  watch: {
    options: function(val) {
      this.setCurrentDictOptions(val);
    },
    // 请求方式
    dataType: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        console.log(newVal, oldVal);
        if (newVal === "static") {
          this.dictOptions = this.dataList;
        } else if (newVal === "dynamic") {
          this.getDataList();
        } else {
          this.initDictData();
        }
      },
    },
    // 监听值的变化
    value(val) {
      if (!val) {
        this.arrayValue = [];
      } else {
        this.arrayValue = this.value.split(",");
      }
      console.log(this.arrayValue);
    },
  },
  methods: {
    // 获取动态数据
    getDataList() {
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
        "/system/dicSet/getDicItemByCode",
        {
          code: this.dictCode,
        },
        null
      ).then((res) => {
        if (res) {
          this.dictOptions = res;
        }
      });
    },
    onChange(selectedValue) {
      this.$emit("change", selectedValue.join(","));
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
