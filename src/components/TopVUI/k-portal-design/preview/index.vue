<!--
 * @Description: 预览界面
 * @Author: lmy
 * @Date: 2021-05-20 18:13:04
 * @LastEditTime: 2021-08-10 15:34:50
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <j-modal
    title="预览"
    :visible="visible"
    @ok="handleCancel"
    @cancel="handleCancel"
    cancelText="关闭"
    :destroyOnClose="true"
    :width="`${previewWidth}px`"
    :fullscreen="true"
    class="pre-modal"
  >
    <build-modal
      :value="jsonData"
      @submit="handleSubmit"
      ref="KFormBuild"
      id="printKFormBuild"
    />
  </j-modal>
</template>
<script>
import buildModal from "../build/index.vue";
export default {
  name: "KFormPreview",
  data() {
    return {
      visible: false,
      previewWidth: 850,
      jsonData: {},
    };
  },
  props: { data: { type: Object } },
  components: { buildModal },
  methods: {
    handleSubmit(p) {
      p.then((res) => {
        console.log(res, "获取数据成功");
        this.$refs.jsonModel.jsonData = res;
        this.$refs.jsonModel.visible = true;
      }).catch((err) => {
        this.$message.error("获取数据失败", 1.5);
      });
    },
    handleGetData() {
      this.$refs.KFormBuild.getData()
        .then((res) => {
          console.log(res, "获取数据成功");
          this.$refs.jsonModel.jsonData = res;
          this.$refs.jsonModel.visible = true;
        })
        .catch((err) => {
          console.log(err, "获取数据失败");
        });
    },
    handleCancel() {
      this.visible = false;
    },
  },
};
</script>
<style lang="less">
.pre-modal {
  .ant-modal-body {
    background: #f0f2f5 !important;
    // .ant-col-24,
    // .ant-col-12:nth-child(3n),
    // .ant-col-12:nth-child(4n),
    // .ant-col-6:last-child:nth-child(4n),
    // .ant-col-4:last-child:nth-child(6n),
    // .ant-col-2:last-child:nth-child(12n),
    // .ant-col-8:last-child:nth-child(3n) {
    // 	margin-top: 20px;
    // }
    .grid-col {
      // margin-bottom: 24px;
    }
  }
}
</style>
