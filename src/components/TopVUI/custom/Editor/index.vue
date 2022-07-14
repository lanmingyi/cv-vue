<!--
 * @Description: 富文本编辑器  wangEditor
 * @Author: lmy
 * @Date: 2021-04-09 13:29:15
 * @LastEditTime: 2021-09-02 17:41:16
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <div class="wangeditor-12566">
    <div ref="editor" :style="{ textAlign: 'left', width: width }"></div>
  </div>
</template>

<script>
import { baseUrl } from "@/services/baseUrl.js";
import { axios } from "@/utils/request";
import Vue from "vue";
import E from "./wangEditor.js";
import { ACCESS_TOKEN } from "@/store/mutation-types";
export default {
  name: "Editor",
  props: {
    value: {
      type: String,
    },
    isClear: {
      type: Boolean,
      default: false,
    },
    record: {
      type: Object,
    },
    disable: {
      type: Boolean,
    },
    height: { type: Number, default: 300 },
    width: { type: String, default: "100%" },
    placeholder: { type: String, default: "请输入正文" },
  },
  data() {
    return {
      editor: null,
      editorContent: "",
    };
  },
  watch: {
    isClear(val) {
      // 触发清除文本域内容
      if (val) {
        this.editor.txt.html("<p><br></p>");
        this.editor.txt.clear();
        this.editorContent = null;
      }
    },
    // value为编辑框输入的内容，这里我监听了一下值，当父组件调用得时候，如果给value赋值了，子组件将会显示父组件赋给的值
    value: function(value) {
      if (value !== this.editor.txt.html()) {
        let val = value ? value : "";
        this.editor.txt.html(val);
      }
    },
  },
  mounted() {
    //加载完成时触发
    this.seteditor();
    this.editor.txt.html(this.value);
    this.editor.$textElem.attr("contenteditable", this.disable ? false : true);
  },
  methods: {
    // 初始化编辑器
    seteditor() {
      let that = this;
      that.editor = new E(that.$refs.editor);
      that.editor.config.focus = false;
      that.editor.config.height = that.height;
      that.editor.config.placeholder = that.placeholder;
      that.editor.customConfig = that.editor.customConfig
        ? that.editor.customConfig
        : that.editor.config;
      that.editor.customConfig.uploadImgShowBase64 = true;
      // const token = storage.get(ACCESS_TOKEN)
      // this.editor.customConfig.uploadImgHeaders = { token: token }
      // this.editor.customConfig.uploadImgServer = baseUrl + '/system/attachment/config?action=uploadimage&encode=utf-8'
      // this.editor.customConfig.uploadFileName = 'file' // formdata中的name属性
      const token = Vue.ls.get(ACCESS_TOKEN);
      //图片上传
      that.editor.customConfig.customUploadImg = function(files, insert) {
        files.forEach((file, index) => {
          var formData = new FormData();
          formData.append("id", "WU_FILE_" + index);
          formData.append("name", file.name);
          formData.append("type", file.type);
          formData.append("lastModifiedDate", file.lastModifiedDate);
          formData.append("size", file.size);
          // formData.append('upfile', file)		//方式1
          formData.append("file", file);
          formData.append("bucket", "misboot-cloud-vue");
          axios({
            // url: baseUrl +"/system/attachment/config?action=uploadimage&encode=utf-8", //方式1
            // url: baseUrl + "/document/fdfs/upload", //默认用oss上传
						url: baseUrl + "/document/minio/uploadfile",
            headers: {
              token: token,
            },
            method: "post",
            data: formData,
            processData: false,
          }).then((res) => {
            if (res.url || res.statusCode == 200) {
              insert(res.url);
            } else {
              that.$message.warning(res.state || res.message);
            }
          });
        });
      };
      that.editor.customConfig.onchange = (html) => {
        that.editorContent = html;

        that.$emit("onchange", that.editorContent);
      };
      that.editor.txt.html(that.editorContent);
      that.editor.create();
    },
  },
  beforeDestroy() {
    // 销毁编辑器
    this.editor.destroy();
    this.editor = null;
  },
};
</script>

<style lang="less">
.w-e-text img {
  max-width: 100%;
}

.wangeditor-12566 {
  .w-e-text-container {
    // 文本框里面的层级调低
    z-index: 1 !important;
  }

  .w-e-toolbar {
    // 给工具栏换行
    flex-wrap: wrap;
    z-index: 3 !important;
  }

  .w-e-menu {
    // 最重要的一句代码
    z-index: auto !important;

    .w-e-droplist {
      // 触发工具栏后的显示框调高
      z-index: 2 !important;
    }
  }
}
</style>
