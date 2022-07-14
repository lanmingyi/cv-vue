<!--
 * @Description: 忘记密码
 * @Author: lmy
 * @Date: 2021-06-09 18:21:19
 * @LastEditTime: 2021-09-18 11:47:25
 * @LastEditors: lmy
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\user\ForgetPwd.vue
-->
<template>
  <!-- <div class="right-title">找回密码</div> -->
  <div class="login-mian-content">
    <a-form
      id="formPwd"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
      <a-alert
        v-if="isLoginError"
        type="error"
        showIcon
        style="margin-bottom: 24px;"
        :message="errMessage"
      /><a-form-item>
        <a-input
          size="large"
          type="text"
          placeholder="请输入帐号"
          v-decorator="[
            'userNameId',
            {
              rules: [{ required: true, message: '请输入帐号' }],
              validateTrigger: 'blur',
            },
          ]"
        >
          <a-icon
            slot="prefix"
            type="user"
            :style="{ color: 'rgba(0,0,0,.25)' }"
          />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          size="large"
          type="text"
          placeholder="邮箱"
          v-decorator="[
            'email',
            {
              rules: [
                {
                  required: true,
                  type: 'email',
                  message: '请输入邮箱地址',
                },
              ],
              validateTrigger: ['change', 'blur'],
            },
          ]"
        >
          <a-icon
            slot="prefix"
            type="mail"
            :style="{ color: 'rgba(0,0,0,.25)' }"
          />
        </a-input>
      </a-form-item>
      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          block
          htmlType="submit"
          class="login-button"
          :loading="loginBtn"
          :disabled="loginBtn"
          >确定</a-button
        >
      </a-form-item>
    </a-form>

    <div class="user-login-register margin-top-sm">
      <!-- <p class="register" v-show="isSaaSEnabled" style="float:left">
          没有账号? <router-link :to="{ name: 'register' }"> 注册</router-link>
        </p> -->
      <p class="forget" style="float:right">
        <router-link :to="{ name: 'login' }"> 账号密码登录</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ForgetPwd",
  data() {
    return {
      form: this.$form.createForm(this),
      loginBtn: false,
      isLoginError: false,
      errMessage: "",
      isSaaSEnabled: false,
    };
  },
  created() {
    this.getSaaSEnabled();
  },
  methods: {
    // 是否开始多租户
    getSaaSEnabled() {
      this.$post("/system/config/isSaaSEnabled.api").then((res) => {
        if (res.statusCode === 300) {
          return true;
        }
        this.isSaaSEnabled = res;
      });
    },
    // 提交
    handleSubmit(e) {
      e.preventDefault();
      const {
        form: { validateFields },
        customActiveKey,
        Login,
      } = this;

      this.loginBtn = true;

      const validateFieldsKey = ["userNameId", "email"];

      validateFields(
        validateFieldsKey,
        {
          force: true,
        },
        (err, values) => {
          if (!err) {
            const loginParams = { ...values };
            this.$post("/mdata/user/resetPassword.api", loginParams)
              .then((res) => {
                if (res.statusCode === 200) {
                  this.$message.success(res.message, 1.5);
                } else {
                  this.$message.error(res.message, 1.5);
                }
              })
              .finally(() => {
                this.loginBtn = false;
              });
          } else {
            setTimeout(() => {
              this.loginBtn = false;
            }, 600);
          }
        }
      );
    },
    loginSuccess(res) {
      location.reload();
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: "欢迎",
          description: `${timeFix()}，欢迎回来`,
        });
      }, 1000);
      this.isLoginError = false;
    },
    requestFailed(err) {
      this.isLoginError = true;
      this.errMessage = err.message;
      setTimeout(() => {
        this.isLoginError = false;
      }, 3000);
    },
    navTo(val) {
      this.$router.push({ name: val });
    },
  },
};
</script>
<style lang="less" scoped>
.login_content.mobile .login-right .login-mian-content {
  padding-top: 30px !important;
}
</style>
