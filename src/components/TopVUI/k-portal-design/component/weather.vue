<!--
 * @Description: 天气组件
 * @Author: 黄婷
 * @Date: 2021-05-20 18:13:04
 * @LastEditTime: 2021-09-16 11:13:23
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\k-portal-design\component\weather.vue
-->
<template>
  <weather
    v-if="options != null"
    :height="options.height"
    :layout="options.layout"
  ></weather>
</template>

<script>
import weather from "@/components/TopVUI/custom/weather";
export default {
  name: "articleCard",
  data() {
    return {
      options: null,
    };
  },
  components: { weather },
  props: { record: { type: Object } },
  watch: {
    record: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
				console.log(newVal.options)
        this.options = null;
        this.$nextTick(() => {
					this.options = newVal.options || null;
				})
      },
    },
  },
};
</script>

<style></style>
