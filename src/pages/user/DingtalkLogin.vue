<!--
 * @Description: 钉钉登录
 * @Author: lmy
 * @Date: 2021-06-09 18:17:16
 * @LastEditTime: 2021-09-18 11:46:58
 * @LastEditors: lmy
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\user\DingtalkLogin.vue
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
      <div id="dingding_box" class="text-center"></div>
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
import { domainUrl, dingtalkAppId } from "@/services/baseUrl";
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
    this.getDingdingCode();
    this.getSaaSEnabled();
  },
  mounted() {
    if (this.$route.query.code) {
      const code = this.$route.query.code;
      this.EnterpriseDingtalkLogin({ code: code, type: "login" })
        .then((res) => this.loginSuccess(res))
        .catch((err) => this.requestFailed(err))
        .finally(() => {});
    }
  },
  methods: {
    ...mapActions(["EnterpriseDingtalkLogin"]),
    // 企业微信登录初始化
    getDingdingCode() {
      this.$nextTick(() => {
        //http://6ldb0adzqc.cdhttp.cn/#/user/dingTalkBack
        const url = encodeURIComponent(domainUrl + "/#/user/ddLoginBack");
        const goto = encodeURIComponent(
          `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${dingtalkAppId}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=` +
            url
        );
        let obj = DDLogin({
          id: "dingding_box", //这里需要你在自己的页面定义一个HTML标签并设置id，例如<div id="login_container"></div>或<span id="login_container"></span>
          goto: goto, //请参考注释里的方式
          style: "border:none;background-color:#FFFFFF;",
          width: "365",
          height: "320",
        });
        let handleMessage = (event) => {
          let origin = event.origin;
          if (origin == "https://login.dingtalk.com") {
            //判断是否来自ddLogin扫码事件。
            let loginTmpCode = event.data;
            //获取到loginTmpCode后就可以在这里构造跳转链接进行跳转了
            console.log("loginTmpCode", loginTmpCode);
            //此步拿到临时loginTmpCode换取正式code
            window.location.href = `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${dingtalkAppId}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${url}&loginTmpCode=${loginTmpCode}`;
          }
        };
        if (typeof window.addEventListener != "undefined") {
          window.addEventListener("message", handleMessage, false);
        } else if (typeof window.attachEvent != "undefined") {
          window.attachEvent("onmessage", handleMessage);
        }
      });
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
  #dingding_box {
    text-align: center;
  }
}
</style>
