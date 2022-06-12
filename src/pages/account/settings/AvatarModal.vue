<template>
  <t-modal
    title="修改头像"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :width="800"
    :footer="null"
    @cancel="cancelHandel"
  >
    <a-row>
      <a-col :xs="24" :md="12" :style="{ height: '350px' }">
        <vue-cropper
          ref="cropper"
          :img="options.img"
          :info="true"
          :autoCrop="options.autoCrop"
          :autoCropWidth="options.autoCropWidth"
          :autoCropHeight="options.autoCropHeight"
          :fixedBox="options.fixedBox"
          @realTime="realTime"
        >
        </vue-cropper>
      </a-col>
      <a-col :xs="24" :md="12" :style="{ height: '350px' }">
        <div class="avatar-upload-preview">
          <img :src="previews.url" :style="previews.img" />
        </div>
      </a-col>
    </a-row>
    <br />
    <a-row>
      <a-col :lg="2" :md="2">
        <a-upload
          name="file"
          :beforeUpload="beforeUpload"
          :showUploadList="false"
        >
          <a-button icon="upload">选择图片</a-button>
        </a-upload>
      </a-col>
      <!-- <a-col :lg="{ span: 1, offset: 2 }" :md="2">
				<a-button icon="plus" @click="changeScale(1)" />
			</a-col>
			<a-col :lg="{ span: 1, offset: 1 }" :md="2">
				<a-button icon="minus" @click="changeScale(-1)" />
			</a-col>
			<a-col :lg="{ span: 1, offset: 1 }" :md="2">
				<a-button icon="undo" @click="rotateLeft" />
			</a-col>
			<a-col :lg="{ span: 1, offset: 1 }" :md="2">
				<a-button icon="redo" @click="rotateRight" />
			</a-col> -->
      <a-col :lg="{ span: 2, offset: 6 }" :md="2">
        <a-button type="primary" @click="handleUpload()">保存</a-button>
      </a-col>
    </a-row>
  </t-modal>
</template>
<script>
import { baseUrl } from "@/services/baseUrl";
import { axios } from "@/utils/request";
// import storage from 'store'
import Vue from "vue";
import { ACCESS_TOKEN } from "@/store/mutation-types";
export default {
  data() {
    return {
      visible: false,
      id: null,
      confirmLoading: false,
      fileList: [],
      uploading: false,
      options: {
        // img: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        img: "",
        autoCrop: true,
        autoCropWidth: 200,
        autoCropHeight: 200,
        fixedBox: true,
      },
      previews: {},
      fileName: "",
    };
  },
  methods: {
    edit(id) {
      this.visible = true;
      this.id = id;
      /* 获取原始头像 */
    },
    close() {
      this.id = null;
      this.visible = false;
    },
    cancelHandel() {
      this.close();
    },
    changeScale(num) {
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    beforeUpload(file) {
      this.fileList = [];
      this.fileList = [...this.fileList, file];
      this.fileName = file.name;
      const reader = new FileReader();
      // 把Array Buffer转化为blob 如果是base64不需要
      // 转化为base64
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.options.img = reader.result;
      };
      // 转化为blob
      // reader.readAsArrayBuffer(file)
      return false;
    },
    // beforeUpload (file) {
    //   this.fileList = [...this.fileList, file]
    //   return false
    // },
    handleUpload() {
      const formData = new FormData();
      this.$refs.cropper.getCropBlob((data) => {
        formData.append("file", data, this.fileName);
        formData.append("bucket", "zysd-test02");
        this.uploadData(formData);
      });
    },
    uploadData(e) {
      const that = this;
      axios({
        url: baseUrl + "/document/minio/uploadfile",
        method: "post",
        processData: false,
        headers: {
          token: Vue.ls.get(ACCESS_TOKEN),
        },
        data: e,
      }).then((res) => {
        if (res.statusCode === 200) {
          that.$message.success("上传成功");
          that.$emit("ok", res.object);
          that.visible = false;
        } else {
          that.$message.error(res.message);
        }
      });
    },
    // 上传图片（点击上传按钮）
    finish(type) {
      const _this = this;
      const formData = new FormData();
      // 输出
      if (type === "blob") {
        _this.$refs.cropper.getCropBlob((data) => {
          const img = window.URL.createObjectURL(data);
          _this.model = true;
          _this.modelSrc = img;
          formData.append("file", data, _this.fileName);
          formData.append("bucket", "zysd-test01");
          _this
            .$post("/document/minio/uploadfile", formData, {
              contentType: false,
              processData: false,
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
            })
            .then((response) => {
              _this.$message.success("上传成功");
              _this.$emit("ok", response.object);
              _this.visible = false;
            });
        });
      } else {
        _this.$refs.cropper.getCropData((data) => {
          _this.model = true;
          _this.modelSrc = data;
        });
      }
    },
    okHandel() {
      const vm = this;
      vm.confirmLoading = true;
      setTimeout(() => {
        vm.confirmLoading = false;
        vm.close();
        vm.$message.success("上传头像成功");
      }, 2000);
    },

    realTime(data) {
      this.previews = data;
    },
  },
};
</script>

<style lang="less" scoped>
.avatar-upload-preview {
  position: absolute;
  top: 50%;
  transform: translate(50%, -50%);
  width: 180px;
  height: 180px;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
