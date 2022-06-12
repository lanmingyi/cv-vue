<!--
 * @Description: 复选框勾选
 * @Author: 黄婷
 * @Date: 2021-06-02 13:38:08
 * @LastEditTime: 2021-09-16 10:47:26
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\k-form-design\packages\KCheckbox\index.vue
-->
<template>
  <a-checkbox :val="_val" @change="handleChange" :checked="chackboxVal">
    {{ label }}
  </a-checkbox>
</template>
<script>
/*
 * author huangting
 * date 2020-11-20
 * description 多选框组件,改成v-model Boolean值
 */

export default {
  name: "kCheckbox",
  data() {
    return {
      chackboxVal: false,
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "",
    },
  },
  computed: {
    _val() {
      this.handleSetChackboxVal(this.value);
      return this.value;
    },
  },
  methods: {
    handleChange(e) {
      this.$emit("input", e.target.checked);
    },
    handleSetChackboxVal(val) {
      this.chackboxVal = val;
    },
  },
};
</script>
