<!--
 * @Description: 企业微信登录
 * @Author: lmy
 * @Date: 2021-06-04 14:43:58
 * @LastEditTime: 2021-09-16 09:58:55
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <t-modal
    class="mL"
    title="绑定钉钉"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    :closable="false"
    :destroyOnClose="true"
  >
    <div id="dingding_box" class="text-center"></div>
    <div
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 3,
      }"
    >
      <a-button
        class="cu-btn-primary"
        @click="
          () => {
            $emit('update:visible');
          }
        "
        icon="close"
        >关闭</a-button
      >
    </div>
  </t-modal>
</template>

<script>
import { getQueryString } from "@/services/common";
import { mapGetters } from "vuex";
import { domainUrl, dingtalkAppId } from "@/services/baseUrl";
export default {
  props: {
    visible: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
  },
  mounted() {},
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    // 企业微信登录初始化
    getDingdingCode() {
      /*
       * 解释一下goto参数，参考以下例子：
       * var url = encodeURIComponent('http://localhost.me/index.php?test=1&aa=2');
       * var goto = encodeURIComponent('https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=SuiteKey&response_type=code&scope=snsapi_login&state=STATE&redirect_uri='+url)
       */
      this.$nextTick(() => {
        const url = encodeURIComponent(domainUrl + "/#/user/dingTalkBack");
        const goto = encodeURIComponent(
          `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${dingtalkAppId}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=` +
            url
        );
        var obj = DDLogin({
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
  },
};
</script>

<style lang="scss" scoped></style>
