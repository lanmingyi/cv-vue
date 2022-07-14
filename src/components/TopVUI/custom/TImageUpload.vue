<!--
 * @Description: 图片上传
 * @Author: lmy
 * @Date: 2021-01-18 15:17:26
 * @LastEditTime: 2021-08-18 16:59:03
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <a-upload
    name="file"
    :listType="listType"
    :multiple="isMultiple"
    :action="uploadAction"
    :headers="headersConfig"
    :data="data"
    :fileList="fileList"
    :beforeUpload="beforeUpload"
    :disabled="disabled"
    :showUploadList="isMultiple"
    accept="image/*"
    :limit="limit"
    @change="handleChange"
    @preview="handlePreview"
  >
    <img
      v-if="!isMultiple && picUrl"
      :src="getAvatarView()"
      style="height:104px;max-width:300px"
    />
    <div v-else>
      <a-icon :type="uploadLoading ? 'loading' : 'plus'" />
      <div class="ant-upload-text">{{ text }}</div>
    </div>
    <t-modal :visible="previewVisible" :footer="null" @cancel="handleCancel()">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </t-modal>
  </a-upload>
</template>

<script>
import Vue from "vue";
import { ACCESS_TOKEN } from "@/store/mutation-types";
import { getFileAccessHttpUrl } from "@/services/common";
import { baseUrl } from "@/services/baseUrl.js";
const uidGenerator = () => {
  return "-" + parseInt(Math.random() * 10000 + 1, 10);
};
const getFileName = (path) => {
  if (path.lastIndexOf("\\") >= 0) {
    let reg = new RegExp("\\\\", "g");
    path = path.replace(reg, "/");
  }
  return path.substring(path.lastIndexOf("/") + 1);
};
export default {
  name: "JImageUpload",
  data() {
    return {
      uploadAction: baseUrl + this.url,
      uploadLoading: false,
      picUrl: false,
      fileList: [],
      previewImage: "",
      previewVisible: false,
      headersConfig: {},
    };
  },
  props: {
    text: {
      type: String,
      required: false,
      default: "上传",
    },
    /*这个属性用于控制文件上传的业务路径*/
    bizPath: {
      type: String,
      required: false,
      default: "temp",
    },
    value: {
      type: [String, Array],
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    isMultiple: {
      type: Boolean,
      required: false,
      default: false,
    },
    url: {
      type: String,
      required: false,
      default: "/document/fdfs/upload",
    },
    width: {},
    limit: {
      type: Number,
      required: false,
      default: 1,
    },
    listType: {
      type: String,
      required: false,
      default: "picture-card",
    },
    headers: {
      type: Object,
      required: false,
    },
    data: {
      type: Object,
      required: false,
    },
  },
  watch: {
    value(val) {
      console.log(val);
      if (val instanceof Array) {
        this.initFileList(val.join(","));
      } else {
        this.initFileList(val);
      }
      if (!val || val.length == 0) {
        this.picUrl = false;
      }
    },
  },
  created() {
    this.headersConfig.token = Vue.ls.get(ACCESS_TOKEN);
  },
  methods: {
    initFileList(paths) {
      if (!paths || paths.length == 0) {
        this.fileList = [];
        return;
      }
      this.picUrl = true;
      let fileList = [];
      let arr = paths.split(",");
      for (var a = 0; a < arr.length; a++) {
        let url = getFileAccessHttpUrl(arr[a]);
        fileList.push({
          uid: uidGenerator(),
          name: getFileName(arr[a]),
          status: "done",
          url: url,
          response: {
            status: "history",
            filePath: arr[a],
          },
        });
      }
      this.fileList = fileList;
      console.log(this.fileList);
    },
    beforeUpload: function(file) {
      var fileType = file.type;
      if (fileType.indexOf("image") < 0) {
        this.$message.warning("请上传图片");
        return false;
      }
    },
    handleChange(info) {
      console.log(info);
      this.picUrl = false;
      let fileList = info.fileList;
      if (info.file.status === "done") {
        if (info.file.response.statusCode === 200) {
          this.picUrl = true;
          fileList = fileList.map((file) => {
            if (file.response) {
              file.url = file.response.filePath;
            }
            return file;
          });
        }
        //this.$message.success(`${info.file.name} 上传成功!`);
      } else if (info.file.statusCode === 300) {
        this.$message.error(`${info.file.name} 上传失败.`);
      } else if (info.file.status === "removed") {
        this.handleDelete(info.file);
      }
      this.fileList = fileList;
      if (info.file.status === "done" || info.file.status === "removed") {
        this.handlePathChange();
      }
    },
    // 预览
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl;
      this.previewVisible = true;
      this.$emit("preview", this.previewImage);
    },
    getAvatarView() {
      if (this.fileList.length > 0) {
        let url = this.fileList[0].url;
        return getFileAccessHttpUrl(url);
      }
    },
    handlePathChange() {
      let uploadFiles = this.fileList;
      let path = "";
      if (!uploadFiles || uploadFiles.length == 0) {
        path = "";
      }
      let arr = [];
      if (!this.isMultiple) {
        arr.push(uploadFiles[uploadFiles.length - 1].response.filePath);
      } else {
        for (var a = 0; a < uploadFiles.length; a++) {
          arr.push(uploadFiles[a].response.filePath);
        }
      }
      if (arr.length === 1) {
        path = arr.join(",");
      } else {
        path = arr;
      }
      this.$emit("change", path);
    },
    handleDelete(file) {
      //如有需要新增 删除逻辑
      console.log(file);
    },
    handleCancel() {
      this.close();
      this.previewVisible = false;
    },
    close() {},
  },
  model: {
    prop: "value",
    event: "change",
  },
};
</script>

<style scoped></style>
