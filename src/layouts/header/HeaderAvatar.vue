<template>
  <div>
    <a-dropdown>
      <div class="header-avatar" style="cursor: pointer">
        <a-avatar class="avatar" size="small" shape="circle" :src="avatar" />
        <span class="name">{{ nickname }}</span>
      </div>
      <a-menu :class="['avatar-menu']" slot="overlay">
        <a-menu-item key="1">
          <router-link :to="{ name: 'BaseSettings' }">
            <a-icon type="user" style="margin-right: 8px;" />
            <span>账户设置</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="2" @click="handleBindingWeChat">
          <icon-fonts
            class="item-icon"
            icon="icon-qiyeweixin"
            title="企业微信"
          />
          <span>绑定企业微信</span>
        </a-menu-item>
        <a-menu-item key="5" @click="handleBindingDingding">
          <a-icon type="dingding" />
          <span>绑定钉钉</span>
        </a-menu-item>
        <a-menu-item key="3" @click="handleResetPwd">
          <a-icon type="lock" />
          <span>修改密码</span>
        </a-menu-item>
        <!-- <a-menu-item key="4" @click="clearCache">
			<a-icon type="delete"/>
			<span>清理缓存</span>
		</a-menu-item> -->
        <a-menu-divider />
        <a-menu-item @click="handleLogout">
          <a-icon style="margin-right: 8px;" type="poweroff" />
          <span>退出登录</span>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    <t-drawer
      class="setting"
      :visible="showSetting"
      placement="right"
      :closable="false"
      @close="onClose"
      :width="280"
    >
      <div class="setting" slot="handler">
        <a-icon :type="showSetting ? 'close' : 'setting'" />
      </div>
      <setting />
    </t-drawer>
    <pwd-form
      ref="createModal"
      :visible="visible"
      :loading="confirmLoading"
      @cancel="handleCancel()"
      @ok="handleOk"
    />
    <enterprise-we-chat
      ref="EnterpriseWeChat"
      :visible.sync="wechatVisible"
      :loading="wechatConfirmLoading"
      @ok="wechatHandleOk"
    ></enterprise-we-chat>
    <enterprise-dingding
      ref="EnterpriseDingding"
      :visible.sync="dingdingVisible"
      :loading="dingdingConfirmLoading"
      @ok="dingdingHandleOk"
    ></enterprise-dingding>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import pwdForm from "@/pages/account/settings/pwdModal";
import EnterpriseWeChat from "./EnterpriseWeChat";
import EnterpriseDingding from "./EnterpriseDingding";
import Setting from "@/components/setting/Setting";
import Drawer from "@/components/tool/Drawer";
import Vue from "vue";
import { UI_CACHE_DB_DICT_DATA } from "@/store/mutation-types";
export default {
  name: "HeaderAvatar",
  computed: {
    ...mapGetters(["nickname", "avatar"]),
  },
  components: {
    pwdForm,
    Setting,
    Drawer,
    EnterpriseWeChat,
    EnterpriseDingding,
  },
  data() {
    return {
      visible: false,
      visibleSetting: false,
      confirmLoading: false,
      showSetting: false,
      wechatVisible: false,
      wechatConfirmLoading: false,
      dingdingVisible: false,
      dingdingConfirmLoading: false,
    };
  },
  methods: {
    ...mapActions(["Logout"]),
    handleLogout() {
      this.$confirm({
        title: "提示",
        content: "真的要注销登录吗 ?",
        okText: "确认",
        cancelText: "取消",
        onOk: () => {
          return this.Logout({})
            .then(() => {
              setTimeout(() => {
                window.location.reload();
              }, 16);
            })
            .catch((err) => {
              this.$message.error({
                title: "错误",
                description: err.message,
              });
            });
        },
        onCancel() {},
      });
    },
    handleShowSetting() {
      this.showSetting = true;
    },
    handleResetPwd() {
      this.visible = true;
    },
    onClose() {
      this.showSetting = false;
    },
    // 取消
    handleCancel(type) {
      let form = {};
      this.visible = false;
      form = this.$refs.createModal.form;
      form.resetFields(); // 清理表单数据（可不做）
    },
    // 表单提交
    handleOk() {
      const form = this.$refs.createModal.form;
      form.validateFields((errors, values) => {
        if (!errors) {
          if (values.password === values.password2) {
            this.confirmLoading = true;
            this.$post("/mdata/user/updateModifyPassword", values)
              .then((res) => {
                if (res.statusCode === 200) {
                  this.visible = false;
                  this.confirmLoading = false;
                  // 重置表单数据
                  form.resetFields();
                  // 刷新表格
                  this.$message.info("修改成功", 2);
                  this.Logout({})
                    .then(() => {
                      setTimeout(() => {
                        window.location.reload();
                      }, 2000);
                    })
                    .catch((err) => {
                      this.$message.error({
                        title: "错误",
                        description: err.message,
                      });
                    });
                } else {
                  this.confirmLoading = false;
                  this.$message.error(res.message);
                }
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            this.$message.error("两次密码输入不一致！");
          }
        } else {
          this.confirmLoading = false;
        }
      });
    },
    clearCache() {
      Vue.ls.remove(UI_CACHE_DB_DICT_DATA);
      this.$message.success("刷新缓存成功！");
    },
    // 绑定企业微信
    handleBindingWeChat() {
      this.wechatVisible = true;
      this.$refs.EnterpriseWeChat.getWwChatCode();
    },
    wechatHandleOk() {
      this.wechatVisible = false;
    },
    // 绑定钉钉
    handleBindingDingding() {
      this.dingdingVisible = true;
      this.$refs.EnterpriseDingding.getDingdingCode();
    },
    dingdingHandleOk() {
      this.dingdingVisible = false;
    },
  },
};
</script>

<style lang="less">
.header-avatar {
  display: inline-flex;
  .avatar,
  .name {
    align-self: center;
  }
  .avatar {
    margin-right: 8px;
  }
  .name {
    font-weight: 500;
    max-width: 168px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.avatar-menu {
  width: 150px;
}
.setting .ant-drawer-body {
  padding: 0 !important;
}
</style>
