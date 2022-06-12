<!--
 * @Description: 登录界面
 * @Author: 黄婷
 * @Date: 2021-06-10 10:31:48
 * @LastEditTime: 2021-07-16 21:22:03
 * @LastEditors: 黄婷
 * @FilePath: \misboot-cloud-vue\src\layouts\LoginLayout.vue
-->
<template>
  <div :class="['login_content', isMobile ? 'mobile' : null]">
    <!-- <div class="login-left">
			<div class="left-content">
				<div class="left-title">
					欢迎来到MISBoot快速开发平台
					<div class="cross_line">
						<p class="line-item"><span class="line-item-box"></span><span class="line-item-box"></span></p>
						<p class="line-item"><span class="line-item-box"></span><span class="line-item-box"></span></p>
						<p class="line-item"><span class="line-item-box"></span><span class="line-item-box"></span></p>
					</div>
				</div>
				<span class="bg-white"></span>
				<div class="left-content-info">
					<p>SIGN</p>
					<p class="left-content-info-dot">
						IN<i class="dot"></i
						><span class="semicircle">
							<i class="semicircle-item"></i><i class="semicircle-item"></i>
						</span>
					</p>
				</div>
			</div>
			<div class="left-bottom">
				<span class="rectangle"></span>
				<span class="rectangle"></span>
				<span class="rectangle"></span>
				<span class="rectangle"></span>
				<span class="rectangle"></span>
				<span class="rectangle"></span>
				<span class="rectangle"></span>
				<span class="rectangle"></span>
			</div>
		</div> -->
    <div class="login-right">
      <div class="login-bg">
        <img class="img" src="~@/assets/img/logo.png" alt="" />
        <p class="title">MISBoot 快速开发平台</p>
      </div>
      <!-- <div class="right-title">MISBoot快速开发平台</div> -->
      <slot name="loginContent"></slot>

      <!-- <div class="user-login-other">
        <a-divider>其他登录方式</a-divider>
        <a @click="navTo('QywxLogin')">
          <icon-fonts
            class="item-icon"
            icon="icon-qiyeweixin"
            title="企业微信"
          />
        </a>
      </div> -->
    </div>
    <!-- <div class="right-top-dot"></div>
    <div class="right-bottom-dot"></div> -->
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "LoginContent",
  data() {
    return {};
  },
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
      background: rgba(58, 170, 254, 0.1);
    }
    input:focus,
    input:hover {
      border-color: none !important;
      background: rgba(58, 170, 254, 0.1) !important;
      outline: none !important;
      // border-bottom: 1px solid @primary-color !important;
      box-shadow: none;
    }
    .has-error .ant-input-affix-wrapper .ant-input:focus {
      box-shadow: none !important;
      background: rgba(58, 170, 254, 0.1) !important;
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
