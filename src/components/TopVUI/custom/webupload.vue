<!--
 * @Description: 附件上传
 * @Author: lmy
 * @Date: 2021-01-18 15:17:27
 * @LastEditTime: 2021-09-08 18:30:04
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <t-modal
    title="附件上传"
    :width="800"
    :visible="visible"
    :confirmLoading="loading"
    @ok="ok"
    @cancel="cancel"
  >
    <a-spin :spinning="loading">
      <a-form :form="form">
        <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="['puuid']" type="hidden" />

          <a-upload
            :multiple="true"
            :file-list="fileList"
            :remove="handleRemove"
            :before-upload="beforeUpload"
          >
            <a-button> <a-icon type="upload" /> 上传 </a-button>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-spin>
  </t-modal>
</template>

<script>
import { baseUrl } from "@/services/baseUrl.js";
import { axios } from "@/utils/request";
import pick from "lodash.pick";
import Vue from "vue";
import { ACCESS_TOKEN } from "@/store/mutation-types";
// 表单字段
const fields = ["puuid"];
export default {
  name: "WebUpload",
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    model: {
      type: Object,
      default: () => null,
    },
    data: {
      type: Object,
      default: () => null,
    },
    url: {
      type: String,
      default: "/document/fdfs/upload",
    },
  },
  data() {
    return {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 7,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 13,
        },
      },
      form: this.$form.createForm(this),
      fileList: [],
      action: "",
      headers: {
        token: Vue.ls.get(ACCESS_TOKEN),
      },
      showInfo: true,
      num: 0,
      formData: new FormData(),
      uploadUrl: "",
      loading: false,
    };
  },
  created() {
    this.action = baseUrl + this.url;
    this.headers.token = Vue.ls.get(ACCESS_TOKEN);
    // 防止表单未注册
    fields.forEach((v) => this.form.getFieldDecorator(v));
    // 当 model 发生改变时，为表单设置值
    this.$watch("model", () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields));
    });
  },
  methods: {
    add(e) {
      console.log(e);
      this.fileList = [];
      this.puuid = e ? e.puuid : "";
      this.showInfo = true;
      this.num = 0;
      this.form.setFieldsValue({
        fileList: [],
        puuid: this.puuid,
      });
    },
    remove(file) {
      this.fileList = [];
    },
    handleChange(info) {
      let fileList = [...info.fileList];
      fileList = fileList.map((file) => {
        if (file.response) {
          file.url = file.response.url;
          this.$emit("resTable");
        }
        return file;
      });
      this.fileList = fileList;
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file];
      return false;
    },
    // 上传
    handleUpload() {
      const { fileList } = this;
      fileList.forEach((file) => {
        this.$nextTick(() => {
          this.uploadUrl = this.url;
          const formData = new FormData();
          formData.append("file", file);
          if (this.puuid) formData.append("puuid", this.puuid);
          if (this.data && this.data.keyPrefix) {
            this.uploadUrl =
              this.url +
              `?bucketName=${this.data.bucketName}&endpoint=${
                this.data.endpoint
              }&keyPrefix=${encodeURIComponent(this.data.keyPrefix)}`;
          } else if (this.data && this.data.module) {
            formData.append("module", this.data.module);
            formData.append("category", this.data.category);
          } else if (this.data && this.data.bucketName) {
            formData.append("bucketName", this.data.bucketName);
            formData.append("endpoint", this.data.endpoint);
            formData.append("keyPrefix", this.data.keyPrefix);
          } else if (this.data && this.data.bucket) {
            formData.append("bucket", this.data.bucket);
            if (this.data.prefix) {
              formData.append("objectName", this.data.prefix);
            }
          }
          this.num++;
          this.$nextTick(() => {
            setTimeout(() => {
              this.uploadData(formData);
            }, 200);
          });
        });
      });
    },
    // 上传
    uploadData(e) {
      this.loading = true;
      const that = this;
      axios({
        url: baseUrl + that.uploadUrl,
        method: "post",
        processData: false,
        headers: {
          token: Vue.ls.get(ACCESS_TOKEN),
        },
        data: e,
      })
        .then((res) => {
          if (res.statusCode === 200 || res === 1) {
            if (that.num === that.fileList.length) {
              that.$message.success("上传成功！");
              that.$emit("ok");
              that.fileList = [];
              this.loading = false;
            }
          } else {
            that.$message.error(res.message);
            this.loading = false;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    ok() {
      if (this.fileList.length === 0) {
        this.$message.error("上传数据为空");
      } else {
        this.num = 0;
        this.handleUpload();
      }
    },
    cancel() {
      this.$emit("cancel");
      this.loading = false;
    },
  },
};
</script>
