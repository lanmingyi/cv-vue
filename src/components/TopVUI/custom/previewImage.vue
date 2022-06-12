<!--
 * @Description: 图片预览
 * @Author: 黄婷
 * @Date: 2021-01-18 15:17:26
 * @LastEditTime: 2021-08-03 17:28:03
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\custom\previewImage.vue
-->
<template>
  <t-modal
    title="图片预览"
    :width="640"
    :visible="visible"
    :footer="null"
    @cancel="
      () => {
        $emit('update:visible', false);
      }
    "
  >
    <img
      alt="example"
      style="width: 100%;margin: 20px 0;padding: 0 10px;"
      :src="imgSrc"
    />
  </t-modal>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    imgSrc: String,
  },
  data() {
    return {};
  },
};
</script>

<style></style>
