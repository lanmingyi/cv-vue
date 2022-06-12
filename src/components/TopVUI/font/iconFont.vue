<!--
 * @Description: 阿里图标  https加载方式
 * @Author: 黄婷
 * @Date: 2021-04-16 19:01:34
 * @LastEditTime: 2021-09-18 15:52:04
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\font\iconFont.vue
-->
<template>
  <icon-font
    @click="
      () => {
        $emit('change');
      }
    "
    :type="icon"
    :class="[type]"
  ></icon-font>
</template>

<script>
import { Icon } from "ant-design-vue";
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_2013865_qydujoxz5ys.js",
});
export default {
  name: "IconFonts",
  props: {
    icon: {
      type: String,
    },
    type: {
      style: String,
      default: "middle",
    },
  },
  data() {
    return {};
  },
  components: { IconFont },
};
</script>

<style scoped="scoped">
.small {
  font-size: 14px;
}
.middle {
  font-size: 18px;
}
.big {
  font-size: 20px;
}
</style>
