<template>
  <a-card>
    <a-form :form="form">
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="登录appId">
            <a-input
              placeholder="请输入登录appId"
              v-decorator="[
                'loginAppId',
                { rules: [{ required: true, message: '必填' }] },
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="登录授权key">
            <a-input
              placeholder="请输入登录授权key"
              v-decorator="[
                'loginAccessKey',
                { rules: [{ required: true, message: '必填' }] },
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="内部应用授权key">
            <a-input
              placeholder="请输入内部应用授权key"
              v-decorator="[
                'accessKey',
                { rules: [{ required: true, message: '必填' }] },
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :span="12">
          <a-form-item label="内部应用授权秘钥">
            <a-input
              placeholder="请输入内部应用授权秘钥"
              v-decorator="[
                'accessSecret',
                { rules: [{ required: true, message: '必填' }] },
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <!-- <a-col :span="12">
					<a-form-item label="重定向地址">
						<a-input
								placeholder="请输入重定向地址"
								v-decorator="['redirectUri', { rules: [{ required: true, message: '必填' }] }]"
						/>
					</a-form-item>

				</a-col> -->
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
      uuid: "2",
    }).then((res) => {
      this.form.resetFields();
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            res,
            ",uuid",
            "type",
            "accessKey",
            "accessSecret",
            "loginAppId",
            "loginAccessKey"
          )
        );
      });
    });
  },
  methods: {
    check() {
      this.form.validateFields((err, values) => {
        if (!err) {
          values.uuid = "2";
          values.type = "dingding";
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
