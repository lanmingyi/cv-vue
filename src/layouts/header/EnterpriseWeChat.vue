<!--
 * @Description: 企业微信登录
 * @Author: lmy
 * @Date: 2021-06-04 14:43:58
 * @LastEditTime: 2021-07-30 14:15:17
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <t-modal
    class="mL"
    title="绑定企业微信"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    :closable="false"
  >
    <div id="wwChat" class="text-center"></div>
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
import { domainUrl, qywxAppId, qywxAgentId } from "@/services/baseUrl";
export default {
  props: {
    visible: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
  },
  created() {
    // this.getWwChatCode();
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  methods: {
    // 企业微信登录初始化
    getWwChatCode() {
      let that = this;
      // 动态引入企业微信js文件
      const s = document.createElement("script");
      s.type = "text/javascript";
      s.src =
        "https://rescdn.qqmail.com/node/ww/wwopenmng/js/sso/wwLogin-1.0.0.js";
      const wxElement = document.body.appendChild(s);
      // 调用企业微信二维码方法
      wxElement.onload = function() {
        window.WwLogin({
          id: "wwChat", // 需要显示的容器id
          appid: qywxAppId, // 企业id
          agentid: qywxAgentId, // 应用agentid
          scope: "snsapi_login", // 网页默认即可
          redirect_uri: encodeURIComponent(domainUrl + "/#/user/weChatBack"), // 授权成功后回调的url，需要在企业微信配置，我的方法是回调到自己的weChatBack页面
          state: Math.ceil(Math.random() * 1000), // 可设置为简单的随机数加session用来校验
          style: "black", // 提供"black"、"white"可选。二维码的样式
          href: "", // 外部css文件url，需要https
        });
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
