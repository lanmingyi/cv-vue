<!--
 * @Description: 多租户注册页面
 * @Author: lmy
 * @Date: 2021-06-02 13:38:09
 * @LastEditTime: 2021-09-18 11:48:15
 * @LastEditors: lmy
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\user\Register.vue
-->
<template>
  <div :class="['user-register-content', { 'user-register-mobile': isMobile }]">
    <div class="user-layout-register">
      <div><p class="text-center text-sm">企业注册</p></div>
      <!-- <a-avatar src="~@/assets/img/f.png" /> -->
      <!-- <div class="head-img shadow-gray"><img src="~@/assets/img/f.png"></div> -->
      <a-form ref="formRegister" :form="form" id="formRegister">
        <a-form-item class="hiddenItem">
          <a-input v-decorator="['uuid']" type="hidden" />
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="[
              'enterpriseName',
              {
                rules: [{ required: true, message: '必填！' }],
                validateTrigger: ['blur'],
              },
            ]"
            placeholder="企业名称"
          />
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="[
              'creditCode',
              {
                rules: [{ required: true, message: '必填' }],
                validateTrigger: ['blur'],
              },
            ]"
            placeholder="信用代码"
          />
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="[
              'accountNumber',
              {
                rules: [{ required: true, message: '必填' }],
                validateTrigger: ['blur'],
              },
            ]"
            placeholder="账号"
          />
        </a-form-item>
        <a-popover
          placement="rightTop"
          :trigger="['focus']"
          :getPopupContainer="(trigger) => trigger.parentElement"
          v-model="state.passwordLevelChecked"
        >
          <template slot="content">
            <div :style="{ width: '240px' }">
              <div :class="['user-register', passwordLevelClass]">
                强度：<span>{{ passwordLevelName }}</span>
              </div>
              <a-progress
                :percent="state.percent"
                :showInfo="false"
                :strokeColor="passwordLevelColor"
              />
              <div style="margin-top: 10px;">
                <span>请至少输入 6 个字符。请不要使用容易被猜到的密码。</span>
              </div>
            </div>
          </template>
          <a-form-item>
            <a-input-password
              size="large"
              @click="handlePasswordInputClick"
              placeholder="密码必须6到12位，且不能出现空格"
              v-decorator="[
                'accoountPassword',
                {
                  rules: [
                    {
                      required: true,
                      message: '密码必须6到12位，且不能出现空格',
                      pattern: /^[\S]{6,12}$/,
                    },
                    { validator: this.handlePasswordLevel },
                  ],
                  validateTrigger: ['change', 'blur'],
                },
              ]"
            >
            </a-input-password>
          </a-form-item>
        </a-popover>
        <!-- <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label=" 确认密码">
				<a-input-password size="large" placeholder="确认密码" v-decorator="['rePassword', {rules: [{ required: true, message: '密码必须6到12位，且不能出现空格' }, { validator: this.handlePasswordCheck }], validateTrigger: ['change', 'blur']}]">
				</a-input-password>
			</a-form-item> -->
        <a-form-item>
          <a-input
            v-decorator="[
              'contacts',
              {
                rules: [{ required: true, message: '必填' }],
                validateTrigger: ['blur'],
              },
            ]"
            placeholder="联系人"
          />
        </a-form-item>
        <a-form-item>
          <a-input
            size="large"
            placeholder="11 位手机号"
            v-decorator="[
              'contactsNumber',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入正确的手机号',
                    pattern: /^1(3[0-9]|4[0,1,3,4,5,6,7,8,9]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0-9]|8[0-9]|9[0,1,2,3,5,8,7,6,9])\d{8}$/,
                  },
                ],
                validateTrigger: ['blur'],
              },
            ]"
          >
            <!-- <a-select slot="addonBefore" size="large" defaultValue="+86">
						<a-select-option value="+86">+86</a-select-option>
						<a-select-option value="+87">+87</a-select-option>
					</a-select> -->
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            type="text"
            placeholder="邮箱"
            v-decorator="[
              'emailAccountNumber',
              {
                rules: [
                  { required: true, type: 'email', message: '请输入邮箱地址' },
                ],
                validateTrigger: ['blur'],
              },
            ]"
          ></a-input>
        </a-form-item>
        <a-form-item>
          <t-image-upload
            url="/document/oss/wpsOssUpload"
            v-decorator="[
              'businessLicense',
              {
                rules: [{ required: false, message: '必填' }],
                validateTrigger: ['blur'],
              },
            ]"
            text="上传营业执照"
          ></t-image-upload>
        </a-form-item>
        <a-row :gutter="8">
          <a-col class="gutter-row" :span="24">
            <a-form-item>
              <a-button
                type="primary"
                htmlType="submit"
                block
                class="register-button"
                :loading="registerBtn"
                @click.stop.prevent="handleSubmit"
                :disabled="registerBtn"
                >注册
              </a-button>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item>
              <a-button
                htmlType="reset"
                block
                class="register-button line-olive"
                :loading="registerBtn"
                @click.stop.prevent="handleReset"
                >重置
              </a-button>
            </a-form-item>
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-form-item>
              <a-button
                htmlType="submit"
                block
                class="register-button line-mauve"
                :loading="registerBtn"
                @click.stop.prevent="handleSeach"
                :disabled="registerBtn"
                >查询
              </a-button>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item>
          <span class="login"
            >已有账号?
            <router-link :to="{ name: 'login' }"> 登录</router-link></span
          >
        </a-form-item>
      </a-form>
      <search-modal
        ref="searchModal"
        :visible="visible"
        :loading="comFormLoading"
        @ok="handleReSubmit"
        @cancel="
          () => {
            visible = false;
          }
        "
      ></search-modal>
    </div>
  </div>
</template>

<script>
import TImageUpload from "@/components/TopVUI/custom/TImageUpload.vue";
import searchModal from "./search.vue";
import { mapState } from "vuex";
const levelNames = {
  0: "低",
  1: "低",
  2: "中",
  3: "强",
};
const levelClass = {
  0: "error",
  1: "error",
  2: "warning",
  3: "success",
};
const levelColor = {
  0: "#ff0000",
  1: "#ff0000",
  2: "#ff7e05",
  3: "#52c41a",
};
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};
export default {
  name: "Register",
  components: {},
  mixins: [],
  data() {
    return {
      form: this.$form.createForm(this),
      formItemLayout,
      state: {
        time: 60,
        smsSendBtn: false,
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: "#FF0000",
      },
      registerBtn: false,
      visible: false,
      comFormLoading: false,
    };
  },
  computed: {
    ...mapState("setting", ["isMobile"]),
    passwordLevelClass() {
      return levelClass[this.state.passwordLevel];
    },
    passwordLevelName() {
      return levelNames[this.state.passwordLevel];
    },
    passwordLevelColor() {
      return levelColor[this.state.passwordLevel];
    },
  },
  components: { TImageUpload, searchModal },
  methods: {
    handlePasswordLevel(rule, value, callback) {
      let level = 0;

      // 判断这个字符串中有没有数字
      if (/[0-9]/.test(value)) {
        level++;
      }
      // 判断字符串中有没有字母
      if (/[a-zA-Z]/.test(value)) {
        level++;
      }
      // 判断字符串中有没有特殊符号
      if (/[^0-9a-zA-Z_]/.test(value)) {
        level++;
      }
      this.state.passwordLevel = level;
      this.state.percent = level * 30;
      if (level >= 2) {
        if (level >= 3) {
          this.state.percent = 100;
        }
        this.state.passwordLevelChecked = false;
        callback();
      } else {
        if (level === 0) {
          this.state.percent = 10;
        }
        this.state.passwordLevelChecked = true;
        callback(new Error("密码强度不够"));
      }
    },

    handlePasswordCheck(rule, value, callback) {
      const password = this.form.getFieldValue("accoountPassword");
      if (value === undefined) {
        callback(new Error("请输入密码"));
      }
      if (value && password && value.trim() !== password.trim()) {
        callback(new Error("两次密码不一致"));
      }
      callback();
    },

    handlePhoneCheck(rule, value, callback) {
      console.log("handlePhoneCheck, rule:", rule);
      console.log("handlePhoneCheck, value", value);
      console.log("handlePhoneCheck, callback", callback);

      callback();
    },

    handlePasswordInputClick() {
      // // if (!this.isMobile()) {
      // this.state.passwordLevelChecked = true;
      // return;
      // // }
      // this.state.passwordLevelChecked = false;
    },
    // tiji
    handleSubmit() {
      this.registerBtn = true;
      const {
        form: { validateFields },
        state,
        $router,
      } = this;
      validateFields(
        {
          force: true,
        },
        (err, values) => {
          if (!err) {
            state.passwordLevelChecked = false;
            // this.$message.success('注册成功', 1.5)
            // $router.push({
            // 	name: 'registerResult',
            // 	params: {
            // 		...values
            // 	}
            // })
            this.$post("/system/sysEnterpriseRegister/save", values)
              .then((res) => {
                this.$message.success(res.message, 1.5);
                this.registerBtn = false;
                if (res.statusCode === 200) {
                  this.$router.push({ name: "login" });
                }
              })
              .catch((err) => {
                this.registerBtn = false;
              });
          } else {
            this.registerBtn = false;
          }
        }
      );
    },

    getCaptcha(e) {
      e.preventDefault();
      const {
        form: { validateFields },
        state,
        $message,
        $notification,
      } = this;

      validateFields(
        ["mobile"],
        {
          force: true,
        },
        (err, values) => {
          if (!err) {
            state.smsSendBtn = true;

            const interval = window.setInterval(() => {
              if (state.time-- <= 0) {
                state.time = 60;
                state.smsSendBtn = false;
                window.clearInterval(interval);
              }
            }, 1000);

            const hide = $message.loading("验证码发送中..", 0);

            this.$post({
              mobile: values.mobile,
            })
              .then((res) => {
                setTimeout(hide, 2500);
                $notification["success"]({
                  message: "提示",
                  description:
                    "验证码获取成功，您的验证码为：" + res.result.captcha,
                  duration: 8,
                });
              })
              .catch((err) => {
                setTimeout(hide, 1);
                clearInterval(interval);
                state.time = 60;
                state.smsSendBtn = false;
                this.requestFailed(err);
              });
          }
        }
      );
    },
    requestFailed(err) {
      this.$notification["error"]({
        message: "错误",
        description:
          ((err.response || {}).data || {}).message ||
          "请求出现错误，请稍后再试",
        duration: 4,
      });
      this.registerBtn = false;
    },
    handleSeach() {
      this.visible = true;
      if (this.$refs.searchModal) this.$refs.searchModal.restForm();
    },
    handleReSubmit(val) {
      this.form.setFieldsValue(val);
      this.visible = false;
    },
    handleReset() {
      this.form.resetFields(); // 清理表单数据（可不做)
    },
  },
  watch: {
    "state.passwordLevel"(val) {
      console.log(val);
    },
  },
};
</script>
<style lang="less">
.user-register {
  &.error {
    color: #ff0000;
  }

  &.warning {
    color: #ff7e05;
  }

  &.success {
    color: #52c41a;
  }
}

.user-layout-register {
  .ant-input-group-addon:first-child {
    background-color: #fff;
  }
}
</style>
<style lang="less" scoped>
.user-register-content {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background: -webkit-linear-gradient(
    to bottom,
    fade(@primary-color, 20%),
    fade(@primary-color, 50%)
  );
  /* Safari 5.1 - 6.0*/
  background: -o-linear-gradient(
    to bottom,
    fade(@primary-color, 20%),
    fade(@primary-color, 50%)
  );
  /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(
    to bottom,
    fade(@primary-color, 20%),
    fade(@primary-color, 50%)
  );
  /* Firefox 3.6 - 15 */
  background: linear-gradient(
    to bottom,
    fade(@primary-color, 20%),
    fade(@primary-color, 50%)
  );
  /* 标准的语法 */
}

.user-layout-register {
  width: 450px;

  padding: 20px;
  background: #fff;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 20px 60px -10px;
  .ant-form-item {
    margin-bottom: 15px !important;
  }
  .head-img {
    width: 48px;
    height: 24px;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.01);
    border-radius: 0 0 48px 48px;

    margin: 0 auto;
    position: relative;
    img {
      position: absolute;
      top: -24px;
      width: 100%;
    }
  }
  & > h3 {
    font-size: 16px;
    margin-bottom: 20px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .register-button {
    // width: 50%;
  }

  .login {
    float: right;
    line-height: 40px;
  }
}
.user-register-content.user-register-mobile {
  padding: 0;
  .user-layout-register {
    width: 100%;
    height: 100%;
  }
}
</style>
