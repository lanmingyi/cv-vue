<!--
 * @Description: 企业微信登录
 * @Author: 黄婷
 * @Date: 2021-06-09 18:17:16
 * @LastEditTime: 2021-07-30 14:13:33
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\user\QywxLogin.vue
-->

<template>
  <div class="login-mian-content">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
    >
      <a-alert
        v-if="isLoginError"
        type="error"
        showIcon
        style="margin-bottom: 24px;"
        :message="errMessage"
      />
      <div id="weChat"></div>
    </a-form>
    <div class="user-login-register">
      <span class="forget" style="float:right"
        ><router-link :to="{ name: 'login' }"> 账号密码登录</router-link></span
      >
      <!-- <span class="register" v-if="isSaaSEnabled"
          >没有账号?
          <router-link :to="{ name: 'register' }"> 注册</router-link></span
        > -->
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { domainUrl, qywxAppId, qywxAgentId } from "@/services/baseUrl";
export default {
  data() {
    return {
      requestCodeSuccess: false,
      identifyCode: "",
      form: this.$form.createForm(this),
      loginBtn: false,
      isLoginError: false,
      errMessage: "",
      isSaaSEnabled: false,
    };
  },
  created() {
    this.getWwChatCode();
    this.getSaaSEnabled();
  },
  mounted() {
    if (this.$route.query.code) {
      const code = this.$route.query.code;
      this.EnterpriseWeChatLogin({ code: code })
        .then((res) => this.loginSuccess(res))
        .catch((err) => this.requestFailed(err))
        .finally(() => {});
    }
  },
  methods: {
    ...mapActions(["EnterpriseWeChatLogin"]),
    // 企业微信登录初始化
    getWwChatCode() {
      // 动态引入企业微信js文件
      const s = document.createElement("script");
      s.type = "text/javascript";
      s.src =
        "https://rescdn.qqmail.com/node/ww/wwopenmng/js/sso/wwLogin-1.0.0.js";
      const wxElement = document.body.appendChild(s);
      // 调用企业微信二维码方法
      wxElement.onload = function() {
        window.WwLogin({
          id: "weChat", // 需要显示的容器id
          appid: qywxAppId, // 企业id
          agentid: qywxAgentId, // 应用ID
          scope: "snsapi_login", // 网页默认即可
          redirect_uri: encodeURIComponent(domainUrl + "/#/user/qywxLoginBack"), // 授权成功后回调的url，需要在企业微信配置，我的方法是回调到自己的weChatBack页面
          state: Math.ceil(Math.random() * 1000), // 可设置为简单的随机数加session用来校验
          style: "black", // 提供"black"、"white"可选。二维码的样式
        });
      };
    },
    // 是否开始多租户
    getSaaSEnabled() {
      this.$post("/system/config/isSaaSEnabled.api").then((res) => {
        if (res.statusCode === 300) {
          return true;
        }
        this.isSaaSEnabled = res;
      });
    },
    loginSuccess(res) {
      this.$router.push({ path: "/system/portal/index" }).catch(() => {
        console.log("登录跳转首页出错,这个错误从哪里来的");
      });
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
<style lang="less">
.login-right {
  #weChat {
    text-align: center;
  }
}
</style>
