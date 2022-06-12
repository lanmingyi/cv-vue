<template>
  <div class="page-common-layout">
    <div class="page-common-content">
      <a-tabs
        default-active-key="1"
        style="border-top: 1px solid #e7e7e7;margin-top: 20px;"
      >
        <a-tab-pane key="1">
          <span slot="tab" class="tab-box">
            <a-icon type="login" class="icon" style="color: coral;" />
            <span>登录</span>
          </span>
          <login-tab ref="loginTab" />
        </a-tab-pane>
        <a-tab-pane key="2">
          <span slot="tab" class="tab-box">
            <a-icon type="file" class="icon" style="color: coral;" />
            <span>文件上传</span>
          </span>
          <fileUpload-tab ref="fileUploadTab" />
        </a-tab-pane>
        <a-tab-pane key="3">
          <span slot="tab" class="tab-box">
            <a-icon type="message" class="icon" style="color: lightseagreen;" />
            <span>短信</span>
          </span>
          <message-tab ref="messageTab" />
        </a-tab-pane>
        <a-tab-pane key="4">
          <span slot="tab" class="tab-box">
            <a-icon type="mail" class="icon" style="color: lightseagreen;" />
            <span>邮箱</span>
          </span>
          <mail-tab ref="mailTab" />
        </a-tab-pane>
        <a-tab-pane key="5">
          <span slot="tab" class="tab-box">
            <a-icon
              type="dingding"
              class="icon"
              style="color: lightseagreen;"
            />
            <span>钉钉</span>
          </span>
          <dingding-tab ref="dingdingTab" />
        </a-tab-pane>
        <!-- <a-tab-pane key="6">
					<span slot="tab" class="tab-box">
						<a-icon type="weibo-square" class="icon" style="color: lightseagreen;"/>
						<span>微信</span>
					</span>
                    <weixin-tab ref="weixinTab" :weixinTabQueryParam="weixinTabQueryParam"/>
                </a-tab-pane> -->
        <a-tab-pane key="7">
          <span slot="tab" class="tab-box">
            <a-icon type="apple" class="icon" style="color: plum;" />
            <span>APP</span>
          </span>
          <app-tab ref="appTab" />
        </a-tab-pane>
        <a-tab-pane key="8">
          <span slot="tab" class="tab-box">
            <a-icon type="setting" class="icon" style="color: plum;" />
            <span>其他</span>
          </span>
          <other-tab ref="otherTab" />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import {
  appTab,
  dingdingTab,
  fileUploadTab,
  loginTab,
  mailTab,
  messageTab,
  otherTab,
  weixinTab,
} from "./tab";

export default {
  name: "TableList",
  components: {
    loginTab,
    fileUploadTab,
    messageTab,
    mailTab,
    dingdingTab,
    weixinTab,
    appTab,
    otherTab,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped lang="less">
/deep/ .ant-card-head {
  min-height: 32px !important;
  background: #ff4400a3;
}

/deep/ .ant-card-head-wrapper {
  height: 32px !important;
  line-height: 32px !important;
}

/deep/ .ant-card-head-title {
  height: 32px !important;
  line-height: 32px !important;
  font-size: 14px !important;
  color: #fff !important;
}

/deep/ .ant-tabs-nav-wrap {
}

.tab-box {
  font-size: 14px;
  margin: 0 10px;
  text-align: center;
  display: flex;
  align-items: center;
}

.icon {
  // display: block !important;
  font-size: 20px !important;
  // padding: 10px 0 5px 8px;
  text-align: center;
}
</style>
