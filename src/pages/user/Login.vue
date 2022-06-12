<!--
 * @Description: 账号密码登录
 * @Author: 黄婷
 * @Date: 2021-06-02 13:38:09
 * @LastEditTime: 2021-12-01 13:37:57
 * @LastEditors: 黄婷
 * @FilePath: \com_misboot_wwwe:\wwwroot\Vue\misboot-cloud-vue\src\pages\user\Login.vue
-->
<template>
  <div class="login-mian-content">
    <a-form
        id="formLogin"
        class="user-layout-login"
        ref="formLogin"
        :form="form"
        @submit="handleSubmit"
    >
      <a-tabs
          :activeKey="customActiveKey"
          @change="changeTabs"
          :tabBarStyle="{
          textAlign: 'center',
          borderBottom: 'unset',
        }"
          size="large"
      >
        <a-tab-pane tab="账号密码登录" key="1">
          <a-alert
              v-if="isLoginError"
              type="error"
              showIcon
              style="margin-bottom: 24px"
              :message="errMessage"
          />
          <a-form-item>
            <a-input
                size="large"
                type="text"
                placeholder="账号"
                allowClear
                v-decorator="[
                'userNameId',
                {
                  rules: [{ required: true, message: '请输入帐号' }],
                  validateTrigger: 'blur',
                  initialValue: 'ewsd0001',
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
                type="password"
                autocomplete="false"
                placeholder="密码"
                v-decorator="[
                'password',
                {
                  rules: [{ required: true, message: '请输入密码' }],
                  validateTrigger: 'blur',
                  initialValue: 'ewsd0001',
                },
              ]"
                allowClear
            >
              <a-icon
                  slot="prefix"
                  type="lock"
                  :style="{ color: 'rgba(0,0,0,.25)' }"
              />
            </a-input>
          </a-form-item>
          <a-row :gutter="8">
            <a-col class="gutter-row" :span="15">
              <a-form-item>
                <a-input
                    size="large"
                    type="text"
                    placeholder="验证码"
                    :maxLength="4"
                    v-decorator="[
                    'code',
                    {
                      rules: [{ required: true, message: '请输入验证码' }],
                      validateTrigger: 'blur',
                    },
                  ]"
                >
                  <icon-fonts
                      slot="prefix"
                      icon="icon-yanzhengma"
                      :style="{ color: 'rgba(0,0,0,.25)' }"
                      type="small"
                  ></icon-fonts>
                </a-input>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row text-right" :span="8" @click="getCode">
              <s-identify
                  v-if="requestCodeSuccess"
                  :identifyCode="identifyCode"
                  :contentWidth="90"
              ></s-identify>
              <img
                  v-else
                  src="~@/assets/img/code.png"
                  alt=""
                  class="code-img"
              />
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
      <a-form-item class="margin-top-sm">
        <a-button
            size="large"
            type="primary"
            block
            htmlType="submit"
            class="login-button"
            :loading="loginBtn"
            :disabled="loginBtn"
        >确定
        </a-button
        >
      </a-form-item>
    </a-form>
    <div
        class="user-login-register margin-top-sm"
        v-if="customActiveKey === '2'"
    >
      <!-- <p class="register" v-show="isSaaSEnabled" style="float:left">
            没有账号?
            <router-link :to="{ name: 'register' }"> 注册</router-link>
          </p> -->
      <p class="forget" style="float: right">
        <router-link :to="{ name: 'ForgetPwd' }"> 忘记密码?</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import {JSEncrypt} from 'jsencrypt'
import SIdentify from "@/components/TopVUI/verificationCode/verificationCode";
import {mapGetters, mapActions} from "vuex";
import store from "@/store";
import {timeFix} from "@/utils/util";

export default {
  components: {SIdentify},
  data() {
    return {
      requestCodeSuccess: false,
      identifyCode: "",
      form: this.$form.createForm(this),
      loginBtn: false,
      isLoginError: false,
      errMessage: "",
      isSaaSEnabled: false,
      state: {
        time: 60,
        smsSendBtn: false,
      },
      customActiveKey: "1",
    };
  },
  created() {
    this.getCode();
    this.getSaaSEnabled();
  },
  methods: {
    ...mapActions(["Login"]),
    // 获取验证码
    getCode() {
      let that = this;
      that
          .$post("/system/getVerificationCode.api")
          .then((res) => {
            if (res) {
              that.form.setFieldsValue({code: ""});
              that.identifyCode = res.toString();
              that.requestCodeSuccess = true;
            } else {
              that.requestCodeSuccess = false;
            }
          })
          .catch(() => {
            this.requestCodeSuccess = false;
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
    handleSubmit(e) {
      e.preventDefault();
      const {
        form: {validateFields},
        customActiveKey,
        Login
      } = this;

      this.loginBtn = true;
      console.log(customActiveKey);
      const validateFieldsKey = ["userNameId", "password", "code"];

      validateFields(
          validateFieldsKey,
          {
            force: true,
          },
          (err, values) => {
            if (!err) {
              const loginParams = {...values};
              let publicKey = '-----BEGIN PUBLIC KEY-----\n' +
                  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC5bxAa8KASxYwrRe7kP8XjF8LO\n' +
                  'pbAqDVj3HZEu+j/8zp75TRYXnOeNFV4QjPktsvTI0ErtH2Bzvkedkhm5JQYxQ/yv\n' +
                  'nGMtbvV3VNkaKtT+fVYtBN5bF1IXJP5YLR/IvevMx5h3WqTiwZG4Df/QJ0Abenl6\n' +
                  'GUfXZi0aR85+ysc6UwIDAQAB\n' +
                  '-----END PUBLIC KEY-----'
              let encryptor = new JSEncrypt()  // 新建JSEncrypt对象
              encryptor.setPublicKey(publicKey)  // 设置公钥
              let rsaPassWord = encryptor.encrypt(loginParams.password)  // 对密码进行加密
              loginParams.password = rsaPassWord
              Login(loginParams)
                  .then((res) => this.loginSuccess(res))
                  .catch((err) => this.requestFailed(err))
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
    // 获取token成功跳转到首页
    loginSuccess(res) {
      console.log(store.getters.addRouters);
      this.$router.push({path: "/system/portal/index"}).catch(() => {
        console.log("登录跳转首页出错,这个错误从哪里来的");
      });
      // // location.reload();
      // // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: "欢迎",
          description: `${timeFix()}，欢迎回来`,
        });
      }, 1000);
      this.isLoginError = false;
    },
    requestFailed(err) {
      this.getCode()
      this.isLoginError = true;
      this.errMessage = err.message;
      setTimeout(() => {
        this.isLoginError = false;
      }, 3000);
    },
    navTo(val) {
      this.$router.push({name: val});
    },
    changeTabs(key) {
      this.customActiveKey = key;
    }
  }
};
</script>
<style lang="less">
.login-right {
  .ant-tabs-bar {
    margin-bottom: 30px !important;
  }
}

.login_content {
  &.mobile {
    .login-right {
      .ant-tabs-bar {
        margin-bottom: 20px !important;
      }

      button.login-button {
        margin-top: 10px;
      }

      .user-login-register {
        margin-top: 10px !important;
      }
    }
  }
}
</style>
