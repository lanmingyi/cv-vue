<template>
  <a-card>
    <a-form :form="form">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="appId">
            <a-input
              placeholder="请输入appId"
              v-decorator="[
                'appId',
                { rules: [{ required: true, message: '必填' }] },
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="app秘钥">
            <a-input
              placeholder="app秘钥"
              v-decorator="[
                'appSecret',
                { rules: [{ required: true, message: '必填' }] },
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="商户Id">
            <a-input
              placeholder="请输入商户Id"
              v-decorator="[
                'mchId',
                { rules: [{ required: true, message: '必填' }] },
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="商户key">
            <a-input
              placeholder="商户key"
              v-decorator="[
                'mchKey',
                { rules: [{ required: true, message: '必填' }] },
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="统一下单地址">
            <a-input
              placeholder="请输入统一下单地址"
              v-decorator="[
                'unifiedorderUrl',
                { rules: [{ required: true, message: '必填' }] },
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="apiKey">
            <a-input
              v-decorator="[
                'apiKey',
                { rules: [{ required: true, message: '必填' }] },
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="应用Id">
            <a-input
              placeholder="请输入应用Id"
              v-decorator="[
                'agentId',
                { rules: [{ required: true, message: '必填' }] },
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="企业Id">
            <a-input
              placeholder="请输入企业Id"
              v-decorator="[
                'corpid',
                { rules: [{ required: true, message: '必填' }] },
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="应用秘钥">
            <a-input
              placeholder="请输入应用秘钥"
              v-decorator="[
                'secret',
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
      uuid: "1",
    }).then((res) => {
      this.form.resetFields();
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            res,
            ",uuid",
            "type",
            "appId",
            "appSecret",
            "mchId",
            "mchKey",
            "unifiedorderUrl",
            "apiKey",
            "agentId",
            "corpid",
            "secret"
          )
        );
      });
    });
  },
  methods: {
    check() {
      this.form.validateFields((err, values) => {
        if (!err) {
          values.uuid = "1";
          values.type = "weixin";
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
