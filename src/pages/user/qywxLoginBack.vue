<!--
 * @Description: 企业微信登录回调页面
 * @Author: lmy
 * @Date: 2021-06-09 18:17:16
 * @LastEditTime: 2021-09-18 11:47:45
 * @LastEditors: lmy
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\user\qywxLoginBack.vue
-->

<template>
  <div id="loading-mask">
    <div class="loading-wrapper">
      <span class="loading-dot loading-dot-spin"
        ><i></i><i></i><i></i><i></i
      ></span>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {};
  },
  mounted() {
    if (this.$route.query.code) {
      this.EnterpriseWeChatLogin({ code: this.$route.query.code })
        .then((res) => this.loginSuccess(res))
        .catch((err) => this.requestFailed(err))
        .finally(() => {});
    }
  },
  methods: {
    ...mapActions(["EnterpriseWeChatLogin"]),
    loginSuccess(res) {
      this.$router.push({ path: "/system/portal/index" }).catch(() => {
        console.log("登录跳转首页出错,这个错误从哪里来的");
      });
    },
    requestFailed(err) {
      this.$router.push({ path: "/user/login" }).catch(() => {
        console.log("登录跳转首页出错,这个错误从哪里来的");
      });
    },
  },
};
</script>
<style lang="less">
#loading-mask {
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background: #fff;
  user-select: none;
  z-index: 9999;
  overflow: hidden;
}

.loading-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -100%);
}

.loading-dot {
  animation: antRotate 1.2s infinite linear;
  transform: rotate(45deg);
  position: relative;
  display: inline-block;
  font-size: 64px;
  width: 64px;
  height: 64px;
  box-sizing: border-box;
}

.loading-dot i {
  width: 22px;
  height: 22px;
  position: absolute;
  display: block;
  background-color: #1890ff;
  border-radius: 100%;
  transform: scale(0.75);
  transform-origin: 50% 50%;
  opacity: 0.3;
  animation: antSpinMove 1s infinite linear alternate;
}

.loading-dot i:nth-child(1) {
  top: 0;
  left: 0;
}

.loading-dot i:nth-child(2) {
  top: 0;
  right: 0;
  -webkit-animation-delay: 0.4s;
  animation-delay: 0.4s;
}

.loading-dot i:nth-child(3) {
  right: 0;
  bottom: 0;
  -webkit-animation-delay: 0.8s;
  animation-delay: 0.8s;
}

.loading-dot i:nth-child(4) {
  bottom: 0;
  left: 0;
  -webkit-animation-delay: 1.2s;
  animation-delay: 1.2s;
}

@keyframes antRotate {
  to {
    -webkit-transform: rotate(405deg);
    transform: rotate(405deg);
  }
}

@-webkit-keyframes antRotate {
  to {
    -webkit-transform: rotate(405deg);
    transform: rotate(405deg);
  }
}

@keyframes antSpinMove {
  to {
    opacity: 1;
  }
}

@-webkit-keyframes antSpinMove {
  to {
    opacity: 1;
  }
}
</style>
