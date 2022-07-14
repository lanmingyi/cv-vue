<!--
 * @Description: 图片预览
 * @Author: lmy
 * @Date: 2021-01-18 15:17:26
 * @LastEditTime: 2021-08-03 17:28:03
 * @LastEditors: lmy
 * @FilePath:
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
