<!--
 * @Description: 流程表单
 * @Author: lmy
 * @Date: 2021-06-02 13:38:08
 * @LastEditTime: 2021-08-27 15:27:55
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <div class="padding">
    <k-form-build :value="jsonData" @submit="handleSubmit" ref="KFormBuild" />
  </div>
</template>
<script>
import { loadTypeList, getAnalysisByList } from "@/utils/formatter";
export default {
  name: "KFormPreview",
  data() {
    return {
      visible: false,
      previewWidth: 850,
      jsonData: {},
      formTableName: "",
    };
  },
  props: {
    drawingList: {
      type: Object,
    },
  },
  mounted() {
    this.jsonData = this.drawingList;
  },
  methods: {
    loadData(e) {
      this.formTableName = e;
      this.$post("/form/formFieldJson/getDetailByTableName", {
        tableName: this.formTableName,
      }).then((res) => {
        let data = {
          list: [],
          config: {
            layout: "horizontal",
            labelCol: { xs: 4, sm: 4, md: 4, lg: 4, xl: 4, xxl: 4 },
            wrapperCol: { xs: 18, sm: 18, md: 18, lg: 18, xl: 18, xxl: 18 },
            hideRequiredMark: false,
            customStyle: "",
          },
        };
        this.jsonData = res.fieldJson ? JSON.parse(res.fieldJson) : data;
        if (this.jsonData.list.length != 0) {
          // this.data.list.forEach((m) => {
          //   loadTypeList(m);
          // });
          this.sendFormData();
        }
      });
    },
    // 编辑
    getFormJson(fieldJson, formModel, formTableName) {
      this.formTableName = formTableName;
      this.jsonData = JSON.parse(fieldJson);
      if (this.jsonData.list.length != 0) {
        this.jsonData.list.forEach((m) => {
          loadTypeList(m);
        });
        this.sendFormData();
      }
    },
    handleSave(type) {
      let pramer = {
        tableName: this.formTableName,
        fieldJson: JSON.stringify(this.jsonData),
        formModel: JSON.stringify(this.jsonData.config),
      };
      this.$emit("formSave", pramer);
    },
    sendFormData() {
      let drawingist = [];
      this.jsonData.list.forEach((m) => {
        getAnalysisByList(m, drawingist);
      });
      this.$emit("sendFormData", drawingist);
      this.$emit("updateList", []);
    },
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
