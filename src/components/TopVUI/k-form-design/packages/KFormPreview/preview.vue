<!--
 * @Description: 预览，流程办理有用到
 * @Author: 黄婷
 * @Date: 2021-06-02 13:38:08
 * @LastEditTime: 2021-09-16 11:00:29
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\k-form-design\packages\KFormPreview\preview.vue
-->
<template>
  <div>
    <k-form-build :disabled="isView" :value="jsonData" @submit="handleSubmit" ref="KFormBuild" />
    <!-- <a-button @click="handleGetData"></a-button> -->
  </div>
</template>
<script>
export default {
  name: "KFormPreview",
  data() {
    return {
      visible: false,
      previewWidth: 850,
      jsonData: {},
    };
  },
  props: {
    drawingList: {
      type: Object,
    },
		isView: {
			type: Boolean,
			default: false,
		}
  },
  mounted() {
    this.jsonData = this.drawingList;
  },
  methods: {
    setData(e) {
      this.jsonData = e;
    },
    // 获取JSON数据
    getJsonData() {
      this.$refs.KFormBuild.getData()
        .then((res) => {
          this.$emit("getJsonData", res, this.jsonData);
        })
        .catch((err) => {
          console.log(err, "获取数据失败");
          // this.$message.error("表单验证失败，请检查表单！", 1.5);
        });
    },
    // 提交
    handleSubmit(p) {
      p.then((res) => {
        console.log(res, "获取数据成功");
        this.$refs.jsonModel.jsonData = res;
        this.$refs.jsonModel.visible = true;
      }).catch((err) => {
        console.log(err, "获取数据失败");
      });
    },
    resetForm() {
      this.$refs.KFormBuild.reset();
    },
    handleGetData() {
      this.$refs.KFormBuild.getData()
        .then((res) => {
          console.log(res, "获取数据成功");
          // this.$refs.jsonModel.jsonData = res;
          // this.$refs.jsonModel.visible = true;
          this.$emit("getJsonData", res, this.jsonData);
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
