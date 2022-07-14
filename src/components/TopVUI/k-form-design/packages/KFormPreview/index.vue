<!--
 * @Description: 表单预览
 * @Author: lmy
 * @Date: 2021-01-18 15:17:27
 * @LastEditTime: 2021-09-14 13:35:06
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <t-modal
    title="预览"
    :visible="visible"
    @ok="handleGetData"
    @cancel="handleCancel"
    okText="获取数据"
    cancelText="关闭"
    style="top:20px;"
    :destroyOnClose="true"
    :width="`${width}px`"
  >
    <div
      class="text-right"
      v-if="jsonData.config ? jsonData.config.print : false"
      v-print="printObj"
    >
      <a-icon type="printer" />
    </div>
    <k-form-build
      :value="jsonData"
      @submit="handleSubmit"
      ref="KFormBuild"
      id="printKFormBuild"
    />
    <jsonModel ref="jsonModel" />
  </t-modal>
</template>
<script>
/*
 * author lmy
 * date 2019-11-20
 */
import jsonModel from "../KFormDesign/module/jsonModal";
export default {
  name: "KFormPreview",
  data() {
    return {
      visible: false,
      previewWidth: 850,
      jsonData: {},
      printObj: {
        id: "printKFormBuild", //打印标签的id
        popTitle: "表单", //文件标题
        // extraCss: "https://www.google.com,https://www.google.com",
        extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>',
      },
    };
  },
  components: {
    jsonModel,
  },
  computed: {
    width(val) {
      return this.previewWidth ? this.previewWidth : 850;
    },
  },
  methods: {
    handleSubmit(p) {
      p.then((res) => {
        console.log(res, "获取数据成功");
        this.$refs.jsonModel.jsonData = res;
        this.$refs.jsonModel.visible = true;
      }).catch((err) => {
        this.$message.error("获取数据失败12333", 1.5);
      });
    },
    handleGetData() {
      console.log(this.jsonData);
      this.$refs.KFormBuild.getData()
        .then((res) => {
          console.log(res, "获取数据成功");
          this.$refs.jsonModel.jsonData = res;
          this.$refs.jsonModel.visible = true;
        })
        .catch((err) => {
          console.log(err, "获取数据失败11");
        });
    },
    handleCancel() {
      this.visible = false;
    },
  },
};
</script>
