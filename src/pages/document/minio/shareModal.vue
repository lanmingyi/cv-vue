<!--
 * @Description: 
 * @Author: 黄婷
 * @Date: 2021-08-18 15:42:31
 * @LastEditTime: 2021-08-18 17:42:01
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\document\minio\shareModal.vue
-->
<template>
  <t-modal
    title="分享"
    :width="640"
    :visible="visible"
    @cancel="
      () => {
        $emit('update:visible', false);
      }
    "
  >
    <!-- <codemirror style="height:100%;" ref="myEditor" :value="value"></codemirror> -->
    <a-row :gutter="10" class="margin-sm">
      <a-col :span="20">
        <a-alert message="" type="info" style="padding:8px;">
          <p
            slot="description"
            style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;margin:0"
          >
            {{ value }}
          </p>
        </a-alert></a-col
      >
      <a-col :span="4" style="line-height: 42px;"
        ><a-button
          @click="handleCopy"
          type="primary"
          class="copy-btn"
          data-clipboard-action="copy"
          :data-clipboard-text="value"
          >复制</a-button
        ></a-col
      >
    </a-row>

    <template slot="footer">
      <a-button
        key="submit"
        type="primary"
        @click="$emit('update:visible', false)"
      >
        关闭
      </a-button>
    </template>
  </t-modal>
</template>

<script>
// 剪切板组件
import Clipboard from "clipboard";
import { codemirror } from "vue-codemirror-lite";
export default {
  name: "shareModal",
  components: { codemirror },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      value: "",
    };
  },
  methods: {
    handleCopy() {
      // 复制数据
      let clipboard = new Clipboard(".copy-btn");
      clipboard.on("success", () => {
        this.$message.success("复制成功");
      });
      clipboard.on("error", () => {
        this.$message.error("复制失败");
      });
      setTimeout(() => {
        // 销毁实例
        clipboard.destroy();
      }, 122);
    },
  },
};
</script>

<style lang="scss" scoped></style>
