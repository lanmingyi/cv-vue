import { watch } from 'vue';
<!--
 * @Description: 预览
 * @Author: 黄婷
 * @Date: 2021-08-18 15:42:31
 * @LastEditTime: 2021-08-27 17:40:55
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\document\minio\previewModal.vue
-->
<template>
  <j-modal
    title="预览"
    width="100%"
    :visible="visible"
    @cancel="
      () => {
        $emit('update:visible', false);
      }
    "
  >
    <a-spin :spinning="loading" class="spanLoding">
      <iframe
        v-if="type === 'file'"
        :src="fileUrl"
        frameborder="0"
        id="preFileIframe"
        width="100%"
        :style="{ height: '99.5%', overflow: 'auto' }"
      ></iframe>

      <video
        width="100%"
        height="100%"
        controls
        v-else-if="type === 'video' && reFresh"
      >
        <source :src="fileUrl" type="video/mp4" />
        您的浏览器不支持Video标签。
      </video>
    </a-spin>
    <template slot="footer">
      <a-button
        key="submit"
        type="primary"
        @click="$emit('update:visible', false)"
      >
        关闭
      </a-button>
    </template>
  </j-modal>
</template>

<script>
export default {
  name: "previewModal",
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      fileUrl: "",
      type: "file",
      reFresh: true,
    };
  },
  watch: {
    fileUrl(val) {
      console.log(val);
      this.reFresh = false;
      this.$nextTick(() => {
        this.reFresh = true;
      });
    },
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="scss">
.spanLoding .ant-spin-container {
  height: calc(100vh - 54px - 65px) !important;
}
</style>
