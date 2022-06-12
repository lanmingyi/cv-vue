<!--
 * @Description:
 * @Author: 黄婷
 * @Date: 2021-06-07 17:56:33
 * @LastEditTime: 2021-08-06 11:38:16
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\system\configuration\tab\loginTab.vue
-->
<template>
  <a-card>
    <a-form :form="form">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item class="hiddenItem">
            <a-input v-decorator="['uuid']" disabled type="hidden" />
          </a-form-item>
          <a-form-item class="hiddenItem">
            <a-input v-decorator="['type']" disabled type="hidden" />
          </a-form-item>
          <a-form-item
            label="Token失效配置(单位为秒,Token将在当前登录时间加上所配置的秒数后失效。为空时默认7200秒)"
          >
            <a-input-number
              :min="0"
              placeholder="请输入秒数"
              v-decorator="[
                'accessToken',
                { rules: [{ required: true, message: '必填' }] },
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24" class="margin-top-sm">
        <a-col :span="12">
          <a-button type="primary" @click="check" block>
            保存
          </a-button>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>
<script>
import pick from "lodash.pick";
export default {
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
    };
  },
  mounted() {
    this.$post("/system/sysConfiguration/getDetailByUuid", {
      uuid: "6",
    }).then((res) => {
      console.log(res);
      this.form.resetFields();
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(res, ",uuid", "type", "accessToken"));
      });
    });
  },
  methods: {
    check() {
      this.form.validateFields((err, values) => {
        if (!err) {
          values.uuid = "6";
          values.type = "login";
          values.jsonData = JSON.stringify(values);
          this.$post("/system/sysConfiguration/save", values).then((res) => {
            if (res.statusCode === 200 || res === 1) {
              this.$message.success(
                res.message ? res.message : "操作成功",
                1.5
              );
            } else {
              this.$message.error(res.message, 1.5);
            }
          });
        }
      });
    },
  },
};
</script>
<style scoped>
/deep/ .ant-form-item-control {
  line-height: 1.2 !important;
}
</style>
