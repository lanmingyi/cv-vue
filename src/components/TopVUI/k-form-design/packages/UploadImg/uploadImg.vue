<!--
 * @Description: 对上传图片组件进行封装
 * @Author: lmy
 * @Date: 2020-11-17 12:53:50
 * @LastEditors: lmy
 * @LastEditTime: 2021-09-16 11:01:59
 -->
<template>
  <div
    v-if="record"
    :style="{ width: record.options.width }"
    class="upload-img-box-9136076486841527"
  >
    <a-upload
      :name="config.uploadImageName || record.options.fileName"
      :headers="headers"
      :data="optionsData"
      :action="uploadAction"
      :multiple="record.options.multiple"
      :listType="record.options.listType"
      :disabled="record.options.disabled || parentDisabled"
      :fileList="fileList"
      accept="image/gif, image/jpeg, image/png"
      @change="handleChange"
      @preview="handlePreview"
      :remove="remove"
      :beforeUpload="beforeUpload"
    >
      <a-button
        v-if="
          record.options.listType !== 'picture-card' &&
            fileList.length < record.options.limit
        "
        :disabled="record.options.disabled || parentDisabled"
      >
        <a-icon type="upload" /> {{ record.options.placeholder }}
      </a-button>
      <div
        v-if="
          record.options.listType === 'picture-card' &&
            fileList.length < record.options.limit
        "
        :disabled="record.options.disabled || parentDisabled"
      >
        <a-icon type="plus" />
        <div class="ant-upload-text">{{ record.options.placeholder }}</div>
      </div>
    </a-upload>
    <a-modal
      title="图片预览"
      :visible="previewVisible"
      :footer="null"
      @cancel="handleCancel"
    >
      <img alt="example" style="width: 100%" :src="previewImageUrl" />
    </a-modal>
  </div>
</template>
<script>
/*
 * author lmy
 * date 2019-12-31
 * description 上传图片组件
 */
import { baseUrl } from "@/services/baseUrl";
import Vue from "vue";
import { ACCESS_TOKEN } from "@/store/mutation-types";
import { getToken } from "@/utils/TopVUI";
export default {
  name: "KUploadImg",
  // eslint-disable-next-line vue/require-prop-types
  //   props: ["record", "value", "config", "parentDisabled"],
  props: {
    record: Object,
    value: String | Array,
    config: Object,
    parentDisabled: Boolean,
  },
  data() {
    return {
      fileList: [],
      previewVisible: false,
      previewImageUrl: "",
      headers: {},
      uploadAction: baseUrl + this.record.options.action,
      flag: true,
    };
  },
  watch: {
    value: {
      // value 需要深度监听及默认先执行handler函数
      handler(val) {
        if (val) {
          this.setFileList(val);
        } else {
          return [];
        }
      },
      immediate: true,
      deep: true,
    }
  },
  computed: {
    // 接口携带参数处理
    optionsData() {
      if (JSON.stringify(this.record.options.data) === "{}") {
        return {};
      }
      let str3 = {};
      let str = this.record.options.data.substring(
        1,
        this.record.options.data.length - 1
      );
      let str2 = String(str.split(";"));
      let str4 = String(str2.split(":"));
      let str5 = str4.split(",");
      for (var i = 0; i < str5.length; i++) {
        var key = str5[i];
        str3[key] = str5[i + 1];
        i++;
      }
			str3.bucket = "misboot-cloud-vue"
      return str3;
    },
  },
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN);
    this.headers = this.record.options.headers;
    this.headers.token = token;
  },
  methods: {
    setFlag() {
      this.flag = true;
    },
    setFileList() {
      console.log(this.fileList);
      // 当传入value改变时，fileList也要改变
      // 如果传入的值为字符串，则转成json
      if (typeof this.value === "string") {
        this.fileList = JSON.parse(this.value);
        // 将转好的json覆盖组件默认值的字符串
        this.handleSelectChange();
      } else {
        this.fileList = this.value;
      }
    },
    handleSelectChange(type) {

			const arr = this.fileList.map((item) => {
				const res = item.response;
				if (typeof item.response !== "undefined") {
					return {
						type: "img",
						name: item.name,
						status: item.status,
						uid: item.uid,
						url: this.setImgUrl(item),
					};
				} else {
					return {
						type: "img",
						name: item.name,
						status: item.status,
						uid: item.uid,
						url: this.setImgUrl(item),
					};
				}
			});
			console.log(arr)
			this.$emit("change", arr);
			this.$emit("input", arr);
    },
    setImgUrl(val) {
      if (val && val.response) {
        if (this.record.options.uploadWay === "archive") {
          return (
            baseUrl + "/system/attachment/showPic?path=" + val.response.filePath
          );
        } else if (this.record.options.uploadWay === "fastdfs") {
          return val.response.url;
        } else if (this.record.options.uploadWay === "oss") {
          return val.response.url;
        } else if (this.record.options.uploadWay === "minio") {
          // return baseUrl + "/" + val.response.bucket + "/" + val.response.object;
          return (
            baseUrl +
            "/document/minio/showPic?fileuUrl=" +
            val.response.bucket +
            "/" +
            val.response.object
          );
        } else if (this.record.options.uploadWay === "custom") {
          return val.response.filePath;
        }
      } else {
        return val.url;
      }
    },
    handlePreview(file) {
      // 预览图片
      this.previewImageUrl = file.url || file.thumbUrl;
      this.previewVisible = true;
    },
    handleCancel() {
      // 取消操作
      this.previewVisible = false;
    },
    remove() {
      this.handleSelectChange();
    },
    beforeUpload(e, files) {
      if (files.length + this.fileList.length > this.record.options.limit) {
        this.$message.warning(`最大上传数量为${this.record.options.limit}`);
        files.splice(this.record.options.limit - this.fileList.length);
      }
    },
    handleChange(info) {
      // 上传数据改变时
      this.fileList = info.fileList;
      if (info.file.status === "done") {
        const res = info.file.response;
        if (res.statusCode === 200) {
          this.handleSelectChange(true);
        } else {
          this.fileList.pop();
          this.$message.error(`图片上传失败`);
        }
      } else if (info.file.status === "error") {
        this.$message.error(`图片上传失败`);
      }else if(info.file.status === "removed"){
		  this.handleSelectChange();
	  }
    },
  },
  // updated(){
  //  if(this.flag){
  //  this.flag = false
  //  let value = this.record.options.defaultValue
  //  console.log(value)
  //  if (typeof value === "string") {
  //    this.fileList = JSON.parse(value);
  //    // 将转好的json覆盖组件默认值的字符串
  //    this.handleSelectChange();
  //  } else {
  //    this.fileList = value;
  //  }
  //  }
  // },
  // 销毁监听事件
  destroyed() {
    console.log(123);
    this.flag = true;
  },
};
</script>
<style lang="less">
.upload-img-box-9136076486841527 {
  /* you can make up upload button and sample style by using stylesheets */
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
}
</style>
