<template>
  <a-card>
    <a-form :form="form">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="邮件服务器地址">
            <a-input
              placeholder="请输入邮件服务器地址"
              v-decorator="[
                'mailSmtp',
                { rules: [{ required: true, message: '必填' }] },
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="邮件服务器端口">
            <a-input-number
              placeholder="请输入邮件服务器端口"
              :min="0"
              v-decorator="[
                'mailPort',
                { rules: [{ required: true, message: '必填' }] },
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="发送邮箱账号">
            <a-input
              placeholder="请输入发送邮箱账号"
              v-decorator="[
                'mailUserName',
                { rules: [{ required: true, message: '必填' }] },
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="授权码">
            <a-input
              placeholder="请输入授权码"
              v-decorator="[
                'mailPassword',
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
      uuid: "3",
    }).then((res) => {
      this.form.resetFields();
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            res,
            ",uuid",
            "type",
            "mailSmtp",
            "mailPort",
            "mailUserName",
            "mailPassword"
          )
        );
      });
    });
  },
  methods: {
    check() {
      this.form.validateFields((err, values) => {
        if (!err) {
          values.uuid = "3";
          values.type = "mail";
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
