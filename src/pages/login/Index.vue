<template>
  <div class="main">
    <div class="login-time">
      {{time}}
    </div>
    <div class="login-left">
      <div class="top">
        <!-- <p class="title">WELCOME</p> -->
        <div class="desc" v-if="configData.length != 0">
          <div class="title">{{configData[configData.findIndex(item => item.code === 'systemName')].value}}</div>
          {{ configData[configData.findIndex(item => item.code === 'systemExplain')].value }}
        </div>
        <div class="header">
          <a href="/">
            <img src="~@/assets/img/logo.png" class="logo" alt="logo">
          </a>
        </div>
      </div>
    </div>
    <div class="login-right">
      <div class="login-title">用户登录</div>
      <a-form id="formLogin" class="user-layout-login" ref="formLogin" :form="form" @submit="handleSubmit">
        <!-- <a-tabs
          :activeKey="customActiveKey"
          :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
          @change="handleTabClick"
        >
          <a-tab-pane key="tab1" tab="账号密码登录"> -->
        <!-- <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px;" message="账号或密码错误" /> -->
        <a-form-item>
          <a-input size="large" type="text" placeholder="账户: ewsd0001" v-decorator="['userNameId',{rules: [{ required: true, message: '请输入帐户名' }, { validator: handleUsernameOrEmail }], validateTrigger: 'change'}]">
            <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input size="large" type="password" autocomplete="false" placeholder="密码: ewsd0001" v-decorator="[
                  'password',
                  {rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}
                ]">
            <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
          </a-input>
        </a-form-item>
        <!-- <a-row :gutter="16">
              <a-col class="gutter-row" :span="16">
                <a-form-item>
                  <a-input size="large" type="text" placeholder="验证码" v-decorator="['code', {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}]">
                    <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col class="gutter-row" :span="8" @click="getCode">
               <s-identify :identifyCode="identifyCode" ></s-identify>
              </a-col>
            </a-row> -->
        <!-- </a-tab-pane> -->
        <!-- <a-tab-pane key="tab2" tab="手机号登录">
            <a-form-item>
              <a-input size="large" type="text" placeholder="手机号" v-decorator="['mobile', {rules: [{ required: true, pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号' }], validateTrigger: 'change'}]">
                <a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }"/>
              </a-input>
            </a-form-item>
      
            <a-row :gutter="16">
              <a-col class="gutter-row" :span="16">
                <a-form-item>
                  <a-input size="large" type="text" placeholder="验证码" v-decorator="['captcha', {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}]">
                    <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col class="gutter-row" :span="8">
                <a-button
                  class="getCaptcha"
                  tabindex="-1"
                  :disabled="state.smsSendBtn"
                  @click.stop.prevent="getCaptcha"
                  v-text="!state.smsSendBtn && '获取验证码' || (state.time+' s')"
                ></a-button>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs> -->

        <!-- <a-form-item>
          <a-checkbox v-decorator="['rememberMe', { valuePropName: 'checked' }]">自动登录</a-checkbox>
          <router-link
            :to="{ name: 'recover', params: { user: 'aaa'} }"
            class="forge-password"
            style="float: right;"
          >忘记密码</router-link>
        </a-form-item> -->

        <a-form-item style="margin-top:24px">
          <a-button size="large" type="primary" htmlType="submit" class="login-button" :loading="state.loginBtn"
            :disabled="state.loginBtn">确定</a-button>
        </a-form-item>

        <!-- <div class="user-login-other">
          <span>其他登录方式</span>
          <a>
            <a-icon class="item-icon" type="alipay-circle"></a-icon>
          </a>
          <a>
            <a-icon class="item-icon" type="taobao-circle"></a-icon>
          </a>
          <a>
            <a-icon class="item-icon" type="weibo-circle"></a-icon>
          </a>
          <router-link class="register" :to="{ name: 'register' }">注册账户</router-link>
        </div> -->
      </a-form>
    </div>

    <two-step-captcha v-if="requiredTwoStepCaptcha" :visible="stepCaptchaVisible" @success="stepCaptchaSuccess" @cancel="stepCaptchaCancel"></two-step-captcha>
  </div>
</template>

<script>
  // import md5 from 'md5'
  import TwoStepCaptcha from '@/components/tool/TwoStepCaptcha'
  import {
    mapActions
  } from 'vuex'
  import {
    timeFix,dateFormat
  } from '@/utils/util'
  // import {
  //   getSmsCaptcha
  // } from '@/services/user'
  import store from '@/store'
  import { mapGetters } from 'vuex'
  export default {
    components: {
      TwoStepCaptcha
    },
    computed: {
      ...mapGetters(['configData'])
    },
    data() {
      return {
        customActiveKey: 'tab1',
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        isLoginError: false,
        requiredTwoStepCaptcha: false,
        stepCaptchaVisible: false,
        form: this.$form.createForm(this),
        state: {
          time: 60,
          loginBtn: false,
          // login type: 0 email, 1 username, 2 telephone
          loginType: 0,
          smsSendBtn: false
        },
        identifyCodes: '1234567890',
        identifyCode: '12345',
        code: '',
        time:''
      }
    },
    created() {
      this.getTime()
      setInterval(() => {
        this.getTime();
      }, 1000);
      store.dispatch('GetAllConfigData').then(() => {
        console.log('获取系统配置成功')
      });
      // get2step({ })
      //   .then(res => {
      //     this.requiredTwoStepCaptcha = res.result.stepCode
      //   })
      //   .catch(() => {
      //     this.requiredTwoStepCaptcha = false
      //   })
      // this.requiredTwoStepCaptcha = true
    },
    methods: {
      ...mapActions(['Login', 'Logout']),
      getTime () {
        this.time = dateFormat(new Date());
      },
      // handler
      handleUsernameOrEmail(rule, value, callback) {
        const {
          state
        } = this
        const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
        if (regex.test(value)) {
          state.loginType = 0
        } else {
          state.loginType = 1
        }
        callback()
      },
      handleTabClick(key) {
        this.customActiveKey = key
        // this.form.resetFields()
      },
      handleSubmit(e) {
        e.preventDefault()
        const {
          form: {
            validateFields
          },
          state,
          customActiveKey,
          Login
        } = this

        state.loginBtn = true

        const validateFieldsKey = customActiveKey === 'tab1' ? ['userNameId', 'password', 'code'] : ['mobile',
          'captcha'
        ]

        validateFields(validateFieldsKey, {
          force: true
        }, (err, values) => {
          if (!err) {
            // md5(values.password)
            console.log('login form', values)
            const loginParams = { ...values
            }
            delete loginParams.userNameId
            loginParams[!state.loginType ? 'email' : 'userNameId'] = values.userNameId
            loginParams.password = values.password
            // loginParams.code = values.code
            Login(loginParams)
              .then((res) => this.loginSuccess(res))
              .catch(err => this.requestFailed(err))
              .finally(() => {
                state.loginBtn = false
              })
          } else {
            setTimeout(() => {
              state.loginBtn = false
            }, 600)
          }
        })
      },
      getCaptcha(e) {
        e.preventDefault()
        const {
          form: {
            validateFields
          },
          state
        } = this

        validateFields(['mobile'], {
          force: true
        }, (err, values) => {
          if (!err) {
            state.smsSendBtn = true

            const interval = window.setInterval(() => {
              if (state.time-- <= 0) {
                state.time = 60
                state.smsSendBtn = false
                window.clearInterval(interval)
              }
            }, 1000)

            const hide = this.$message.loading('验证码发送中..', 0)
            getSmsCaptcha({
              mobile: values.mobile
            }).then(res => {
              setTimeout(hide, 2500)
              this.$notification['success']({
                message: '提示',
                description: '验证码获取成功，您的验证码为：' + res.result.captcha,
                duration: 8
              })
            }).catch(err => {
              setTimeout(hide, 1)
              clearInterval(interval)
              state.time = 60
              state.smsSendBtn = false
              this.requestFailed(err)
            })
          }
        })
      },
      stepCaptchaSuccess() {
        this.loginSuccess()
      },
      stepCaptchaCancel() {
        this.Logout().then(() => {
          this.loginBtn = false
          this.stepCaptchaVisible = false
        })
      },
      loginSuccess(res) {
        console.log(res,'res====')
        // this.GetAllConfigData().then(() => {
        //   console.log('获取系统配置资源')
        // })
        // check res.homePage define, set $router.push name res.homePage
        // Why not enter onComplete
        /*
        this.$router.push({ name: 'analysis' }, () => {
          console.log('onComplete')
          this.$notification.success({
            message: '欢迎',
            description: `${timeFix()}，欢迎回来`
          })
        })
        */
        // this.$router.push('/')
        // this.$router.push({ path: '/system/portal/index' })
        // this.$router.replace({
        //   path: '/system/portal/index'
        // });
        // location.reload();
        // 延迟 1 秒显示欢迎信息
        setTimeout(() => {
          this.$notification.success({
            message: '欢迎',
            description: `${timeFix()}，欢迎回来`
          })
        }, 1000)
        this.isLoginError = false
      },
      requestFailed(err) {
        this.isLoginError = true
		this.$message.error(((err.response || {}).data || {}).message || '账号或者密码错误，请重试')
      }
    }
  }
</script>

<style lang="less" scoped>
  .user-layout-login {
    label {
      font-size: 14px;
    }

    .getCaptcha {
      display: block;
      width: 100%;
      height: 40px;
    }

    .forge-password {
      font-size: 14px;
    }

    button.login-button {
      padding: 0 15px;
      font-size: 16px;
      height: 40px;
      width: 100%;
    }

    .user-login-other {
      text-align: left;
      margin-top: 24px;
      line-height: 22px;

      .item-icon {
        font-size: 24px;
        color: rgba(0, 0, 0, 0.2);
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: @primary-color;
        }
      }

      .register {
        float: right;
      }
    }
  }
  &.mobile {
    .login-left{
      display: none !important;
    }
    .login-right{
      border-radius: 5px;
	  .login-title{
		  color: #333;
	  }
    }
  }
  .main {
    position: relative;
    min-width: 260px;
    width: 1000px;
    height: 500px;
    margin: 0 auto;
    background: #fff;
    display: flex;
    align-items: center;
    .login-time{
      position: absolute;
      top: 10px;
      left: 10px;
      font-size: 18px;
      color: #fff;
    }
    .login-left {
      width: 500px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: @primary-color !important;
      color: #fff;
    }

    .login-right {
      width: 500px;
      padding: 0 60px;
      #formLogin {
        margin: 0 auto;
      }
      .login-title{
        text-align: center;
        margin-bottom: 50px;
        font-size: 22px;
      }
    }

    .top {
      text-align: center;

      .header {
        height: 180px;
        line-height: 180px;
        
        .badge {
          position: absolute;
          display: inline-block;
          line-height: 1;
          vertical-align: middle;
          margin-left: -12px;
          margin-top: -10px;
          opacity: 0.8;
        }

        .logo {
          height: 164px;
          vertical-align: top;
          margin-right: 16px;
          border-style: none;
        }
      }
      .title {
        font-size: 33px;
        position: relative;
        top: 2px;
        color: #fff;
        margin-bottom: 5px;
      }
      .desc {
        font-size: 14px;
        margin-top: 5px;
        margin-bottom: 40px;
      }
    }
  }
</style>
