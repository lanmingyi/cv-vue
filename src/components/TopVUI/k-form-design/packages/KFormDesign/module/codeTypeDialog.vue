<!--
 * @Description: 生成文件类型选择
 * @Author: lmy
 * @Date: 2021-06-02 13:38:08
 * @LastEditTime: 2021-09-14 09:16:43
 * @LastEditors: lmy
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\k-form-design\packages\KFormDesign\module\codeTypeDialog.vue
-->
<template>
  <div>
    <a-modal
      :visible="visible"
      v-bind="$attrs"
      width="500px"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      v-on="$listeners"
      @ok="handelConfirm"
      @cancel="onClose"
    >
      <a-row :gutter="15">
        <a-form-model :form="form" :model="formData" :rules="rules">
          <a-col :span="24">
            <a-form-model-item
              label="生成类型"
              prop="type"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >
              <a-radio-group
                default-value="file"
                button-style="solid"
                v-model="formData.type"
              >
                <a-radio-button value="file">
                  页面
                </a-radio-button>
                <a-radio-button value="dialog">
                  弹窗
                </a-radio-button>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item
              v-if="showFileName"
              label="文件名"
              prop="fileName"
            >
              <a-input
                v-model="formData.fileName"
                placeholder="请输入文件名"
                allow-clear
              />
            </a-form-model-item>
          </a-col>
        </a-form-model>
      </a-row>
    </a-modal>
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  props: ["showFileName", "visible"],
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 },
      },
      formData: {
        fileName: undefined,
        type: "file",
      },
      rules: {
        fileName: [
          {
            required: true,
            message: "请输入文件名",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "生成类型不能为空",
            trigger: "change",
          },
        ],
      },
      typeOptions: [
        {
          label: "页面",
          value: "file",
        },
        {
          label: "弹窗",
          value: "dialog",
        },
      ],
      form: this.$form.createForm(this),
    };
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    onOpen() {
      if (this.showFileName) {
        this.formData.fileName = `${+new Date()}.vue`;
      }
    },
    onClose() {
      this.$emit("update:visible", false);
    },
    close(e) {},
    handelConfirm() {
      console.log(this.$form);
      // this.form.validateFields(valid => {
      //   console.log(valid)
      //   if (!valid) return

      // })
      this.form.validateFields((err, values) => {
        console.log(this.formData);
        if (!err) {
          this.$emit("confirm", { ...this.formData });
          this.onClose();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
