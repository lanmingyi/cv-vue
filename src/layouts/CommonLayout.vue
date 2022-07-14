<!--
 * @Description: 登录界面
 * @Author: lmy
 * @Date: 2021-06-10 10:31:48
 * @LastEditTime: 2021-07-29 09:08:16
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <div :class="['login_content', isMobile ? 'mobile' : null]">
    <div class="login-right">
      <div class="login-bg">
        <img class="img" src="~@/assets/img/logo.png" alt="" />
        <p class="title">人工智能开发系统</p>
      </div>
      <!-- <div class="right-title">MISBoot快速开发平台</div> -->
      <route-view></route-view>

      <!-- <div class="user-login-other">
        <a-divider>其他登录方式</a-divider>
        <a @click="navTo('QywxLogin')">
          <icon-fonts
            class="item-icon"
            icon="icon-qiyeweixin"
            title="企业微信"
          />
        </a>
        <a @click="navTo('DingtalkLogin')">
          <a-icon class="item-icon" type="dingding" title="钉钉"></a-icon>
        </a>
      </div> -->
    </div>
  </div>
</template>

<script>
import RouteView from "./RouteView.vue";
import { mapState } from "vuex";
export default {
  name: "LoginContent",
  data() {
    return {};
  },
  components: { RouteView },
  computed: {
    ...mapState("setting", ["isMobile"]),
    slots() {
      return Object.keys(this.$slots);
    },
  },
  methods: {
    navTo(val) {
      this.$router.push({ name: val });
    },
  },
};
</script>

<style lang="less" scoped>
@import "./login.less";
</style>
<style lang="less">
.login_content {
  .login-right {
    .ant-form-item {
      margin-bottom: 24px !important;
    }
    .ant-input {
      border: none !important;
      // border-bottom: 1px solid @primary-color !important;
      outline: none !important;
      border-radius: 7px !important;
      background-color: rgba(58, 170, 254, 0.1) !important;
    }
    input:focus,
    input:hover {
      border-color: none !important;
      background-color: rgba(58, 170, 254, 0.1) !important;
      outline: none !important;
      // border-bottom: 1px solid @primary-color !important;
      box-shadow: none;
    }
    .has-error .ant-input-affix-wrapper .ant-input:focus {
      box-shadow: none !important;
      background-color: rgba(58, 170, 254, 0.1) !important;
    }
    .has-error
      .ant-input-affix-wrapper:hover
      .ant-input:not(.ant-input-disabled) {
      background-color: rgba(58, 170, 254, 0.1) !important;
    }
    .ant-divider-horizontal.ant-divider-with-text-center:after,
    .ant-divider-horizontal.ant-divider-with-text-center:before,
    .ant-divider-horizontal.ant-divider-with-text-left:after,
    .ant-divider-horizontal.ant-divider-with-text-left:before,
    .ant-divider-horizontal.ant-divider-with-text-right:after,
    .ant-divider-horizontal.ant-divider-with-text-right:before {
      top: 0 !important;
    }
  }
}
</style>
