<!--
 * @Description: 提及
 * @Author: 黄婷
 * @Date: 2021-08-23 14:56:26
 * @LastEditTime: 2021-08-23 16:18:24
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\custom\TMentions.vue
-->
<template>
  <div>
    <a-mentions
      rows="1"
      @change="onChange"
      @select="onSelect"
      :disabled="disabled"
    >
      <a-mentions-option
        v-for="(item, index) in mentionsData"
        :key="index"
        :value="item[valueFeild]"
      >
        {{ item[textFeild] }}
      </a-mentions-option>
    </a-mentions>
    <a-input placeholder="" type="hidden" v-model="textValue" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      textValue: "",
      mentionsData: [],
    };
  },
  props: {
    data: {
      type: Array,
    },
    textFeild: {
      type: String,
      required: false,
      default: "userName",
    },
    valueFeild: {
      type: String,
      required: false,
      default: "userName",
    },
    dataType: {
      type: String,
      required: false,
      default: "dynamic",
    },
    url: {
      type: String,
    },
    parameter: {
      type: Object,
    },
    disabled: { default: false },
  },
  watch: {
    dataType: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        if (val === "static") {
          this.mentionsData = this.data;
        } else if (val === "dynamic") {
          this.getDataList();
        }
      },
    },
  },
  mounted() {
    if (this.dataType === "dynamic") this.getDataList();
  },
  methods: {
    getDataList() {
      this.mentionsData = [];
      this.$post(this.url, this.parameter).then((res) => {
        if (res.statusCode != 300) {
          this.mentionsData = res;
          console.log(this.mentionsData);
        }
      });
    },
    onChange(value) {
      console.log("Change:", value);
    },
    onSelect(option) {
      console.log("select", option);
    },
  },
};
</script>

<style lang="scss" scoped></style>
