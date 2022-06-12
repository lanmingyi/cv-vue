<template>
  <t-modal
    class="mL"
    title="新增/编辑"
    :width="1000"
    :visible="visible"
    :confirmLoading="loading"
    @ok="ok"
    @cancel="
      () => {
        $refs.previewModal.resetForm(), $emit('cancel');
      }
    "
  >
    <a-spin :spinning="loading">
      <a-form :form="form">
        <previewModal
          ref="previewModal"
          :drawingList="drawingList"
          @getJsonData="getJsonData"
          :isView="type === 'view'"
        />
      </a-form>
    </a-spin>
  </t-modal>
</template>

<script>
import previewModal from "@/components/TopVUI/k-form-design/packages/KFormPreview/preview.vue";

import { PageView, RouteView } from "@/layouts";
import { setTypeList, loadTypeList, getTypeList } from "@/utils/formatter";
export default {
  name: "TreeList",
  components: {
    previewModal,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      drawingList: {},
      model: {},
      type: "",
      tableName: "",
      loading: false,
      fieldList: [],
      form: this.$form.createForm(this),
    };
  },
  methods: {
    // 获取数据
    loadData(e, type, json, info) {
      if (info) this.model = info;
      this.type = type;
      this.tableName = e;
      this.drawingList = JSON.parse(json.fieldJson);
      this.drawingList?.list.forEach((e, index) => {
        if (type === "add") {
          loadTypeList(e);
        } else {
          getTypeList(e, this.model);
        }
      });
      if (this.$refs.previewModal) {
        this.$refs.previewModal.jsonData = this.drawingList;
        this.$refs.previewModal.setData(this.drawingList);
      }
    },
    toHump(name) {
      return name.replace(/\_(\w)/g, function(all, letter) {
        return letter.toUpperCase();
      });
    },
    getJsonData(fieldList, json) {
      // this.fieldList = fieldList
      this.drawingList.list.forEach((e, index) => {
        let obj = setTypeList(e, fieldList);
        e = obj.e;
        fieldList = obj.list;
        return;
      });
      console.log(fieldList);
      this.loading = true;
      let pramer = {
        tableName: this.tableName,
        fieldJson: JSON.stringify(this.drawingList),
        formModel: JSON.stringify(this.drawingList.config),
      };
      // this.$post('/form/formFieldJson/save', pramer).then((res) => {
      // 	console.log('res======', res);
      // });
      let pramar = fieldList;
      pramar.tableName = this.tableName;
      if (this.type === "add") {
        pramar.uuid = "";
        this.$post("/form/formField/commonSave", pramar).then((res) => {
          if (res.statusCode === 200) {
            this.$message.info("新增成功！");
            this.$emit("ok");
            this.$refs.previewModal.resetForm();
          } else {
            this.$message.info(res.message, 1.5);
          }
        });
      } else {
        pramar.uuid = this.model.uuid;
        this.$post("/form/formField/commonUpdate", pramar).then((res) => {
          if (res.statusCode === 200) {
            this.$message.info("修改成功！");
            this.$emit("ok");
            this.$refs.previewModal.resetForm();
          } else {
            this.$message.info(res.message, 1.5);
          }
        });
      }
      this.loading = false;
    },
    ok() {
      this.$refs.previewModal.getJsonData();
    },
  },
};
</script>

<style>
.ant-form {
  height: auto;
  width: 100%;
}

/* .mL .ant-modal-footer {
		border: none !important;
	} */
</style>
