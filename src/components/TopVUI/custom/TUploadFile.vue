<!--
 * @Description: 对上传文件组件进行封装
 * @Author: huangting
 * @Date: 2020-11-17 12:53:50
 * @LastEditors: 黄婷
 * @LastEditTime: 2021-08-09 09:27:12
 -->
<template>
  <div :style="{ width: width }">
    <a-upload
      v-if="drag"
      :disabled="disabled"
      :name="name"
      :headers="headersConfig"
      :data="uploadFileData"
      :action="uploadAction"
      :multiple="multiple"
      :fileList="fileList"
      @preview="handlePreview"
      @change="handleChange"
      :remove="remove"
      :beforeUpload="beforeUpload"
      :accept="accept"
    >
      <a-button v-if="fileList.length < limit" :disabled="disabled">
        <a-icon type="upload" /> {{ placeholder }}
      </a-button>
    </a-upload>
    <a-upload-dragger
      v-else
      :disabled="disabled"
      :name="name"
      :headers="headersConfig"
      :data="uploadFileData"
      :action="uploadAction"
      :multiple="multiple"
      :fileList="fileList"
      @preview="handlePreview"
      @change="handleChange"
      :remove="remove"
      :beforeUpload="beforeUpload"
    >
      <p class="ant-upload-drag-icon">
        <a-icon type="cloud-upload" />
      </p>
      <p class="ant-upload-text">单击或拖动文件到此区域</p>
    </a-upload-dragger>
  </div>
</template>
<script>
/*
 * author 黄婷
 * date 2019-12-31
 * description 上传文件组件
 */
import { baseUrl } from "@/services/baseUrl";
import Vue from "vue";
import { ACCESS_TOKEN } from "@/store/mutation-types";

export default {
  name: "KUploadFile",
  // eslint-disable-next-line vue/require-prop-types
  // props: ["disabled", "value", "dynamicData","uploadFileData","multiple","width","placeholder","limit","action","downloadWay","dynamicFun","name","drag"],
  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    value: {
      type: [String, Array],
      required: false,
    },
    uploadFileData: {
      type: Object,
      required: false,
    },
    multiple: {
      type: Boolean,
      required: false,
      default: false,
    },
    width: {},
    placeholder: {
      type: String,
      required: false,
      default: "",
    },
    limit: {
      type: Number,
      required: false,
      default: 1,
    },
    action: {
      type: String,
      required: false,
      default: "",
    },
    downloadWay: {
      type: String,
      required: false,
      default: "",
    },
    dynamicFun: {
      type: Function,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    drag: {
      //是否拖拽
      type: Boolean,
      required: false,
    },
    accept: {
      //文件类型
      type: String,
      required: false,
    },
  },
  data() {
    return {
      fileList: [],
      uploadAction: baseUrl + this.action,
      headersConfig: {},
    };
  },

  created() {
    const token = Vue.ls.get(ACCESS_TOKEN);
    this.headersConfig.token = token;
    let value = this.value;
    this.setFileList(value);
    console.log(this.uploadAction);
  },
  computed: {
    optionsData() {
      try {
        return JSON.parse(this.uploadFileData);
      } catch {
        return {};
      }
    },
  },
  methods: {
    setFileList(val) {
      // 当传入value改变时，fileList也要改变
      // 如果传入的值为字符串，则转成json
      if (typeof val === "string") {
        console.log(val);
        this.fileList = val ? JSON.parse(val) : [];
        // 将转好的json覆盖组件默认值的字符串
        this.handleSelectChange();
      } else {
        this.fileList = val;
      }
    },
    handleSelectChange() {
      setTimeout(() => {
        const arr = this.fileList.map((item) => {
          if (typeof item.response !== "undefined") {
            const res = item.response;
            return {
              type: "file",
              name: item.name,
              status: item.status,
              uid: res.fileId || Date.now(),
              url: res.filePath || "",
            };
          } else {
            return {
              type: "file",
              name: item.name,
              status: item.status,
              uid: item.uid,
              url: item.filePath || "",
            };
          }
        });

        this.$emit("change", arr);
        this.$emit("input", arr);
      }, 10);
    },
    handlePreview(file) {
      // 下载文件
      let downloadWay = this.downloadWay;
      let dynamicFun = this.dynamicFun;
      if (downloadWay === "a") {
        // 使用a标签下载
        let a = document.createElement("a");
        a.href = file.url || file.thumbUrl;
        a.download = file.name;
        a.click();
      } else if (downloadWay === "ajax") {
        // 使用ajax获取文件blob，并保持到本地
        this.getBlob(file.url || file.thumbUrl).then((blob) => {
          this.saveAs(blob, file.name);
        });
      } else if (downloadWay === "dynamic") {
        // 触发动态函数
        this.dynamicData[dynamicFun](file);
      }
    },
    /**
     * 获取 blob
     * url 目标文件地址
     */
    getBlob(url) {
      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();

        xhr.open("GET", url, true);
        xhr.responseType = "blob";
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(xhr.response);
          }
        };

        xhr.send();
      });
    },
    /**
     * 保存 blob
     * filename 想要保存的文件名称
     */
    saveAs(blob, filename) {
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
      } else {
        const link = document.createElement("a");
        const body = document.querySelector("body");
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;

        // fix Firefox
        link.style.display = "none";
        body.appendChild(link);

        link.click();
        body.removeChild(link);

        window.URL.revokeObjectURL(link.href);
      }
    },
    remove() {
      this.handleSelectChange();
    },
    // 上传前
    beforeUpload(e, files) {
      if (files.length + this.fileList.length > this.limit) {
        this.$message.warning(`最大上传数量为${this.limit}`);
        files.splice(this.limit - this.fileList.length);
      }
    },
    // 上传
    handleChange(info) {
      this.fileList = info.fileList;
      if (info.file.status === "done") {
        const res = info.file.response;
        if (res.statusCode === 200) {
          this.handleSelectChange();
        } else {
          this.fileList.pop();
          this.$message.error(res.message);
        }
      } else if (info.file.status === "error") {
        this.$message.error(`文件上传失败`);
      }
    },
  },
};
</script>
