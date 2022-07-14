<!--
 * @Description: 预览代码
 * @Author: lmy
 * @Date: 2021-06-02 13:38:08
 * @LastEditTime: 2021-09-14 13:35:21
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <div>
    <div class="json-box-9136076486841527" :style="{ height: height }">
      <codemirror
        style="height:100%;"
        ref="myEditor"
        :value="editorJson ? editorJson : editorJsons"
      ></codemirror>
    </div>
    <div class="copy-btn-box-9136076486841527" v-if="showFootBtn">
      <a-button
        @click="handleCopyJson"
        type="primary"
        class="copy-btn"
        data-clipboard-action="copy"
        :data-clipboard-text="editorJson ? editorJson : editorJsons"
      >
        复制数据
      </a-button>
      <a-button @click="handleExportJson" type="primary">
        导出代码
      </a-button>
    </div>
  </div>
</template>
<script>
// 剪切板组件
import Clipboard from "clipboard";
import { codemirror } from "vue-codemirror-lite";
export default {
  name: "PreviewCode",
  props: {
    fileFormat: {
      type: String,
      default: "json",
    },
    editorJson: {
      type: String,
      default: "",
    },
    showFootBtn: {
      type: Boolean,
      default: true,
    },
    height: { type: String, default: "570px" },
  },
  data() {
    return {
      visible: false,
      editorJsons: "",
    };
  },

  components: {
    codemirror,
  },
  methods: {
    exportData(data, fileName = `demo.${this.fileFormat}`) {
      let content = "data:text/csv;charset=utf-8,";
      content += data;
      var encodedUri = encodeURI(content);
      var actions = document.createElement("a");
      actions.setAttribute("href", encodedUri);
      actions.setAttribute("download", fileName);
      actions.click();
    },
    handleExportJson() {
      // 导出JSON
      this.exportData(this.editorJson);
    },
    handleCopyJson() {
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
