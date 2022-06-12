<template>
  <a-layout-header :class="[headerTheme, 'admin-header']">
    <div :class="['admin-header-wide', layout, pageWidth, headerCss]">
      <router-link
        v-if="isMobile || layout === 'head'"
        to="/system/portal/index"
        :class="['logo', isMobile ? null : 'pc', headerTheme]"
      >
        <img :src="companyPlatformIcon" alt="logo" />
        <h1 v-if="!isMobile">{{ systemNameShort }}</h1>
      </router-link>
      <a-divider v-if="isMobile" type="vertical" />
      <a-icon
        v-if="layout !== 'head'"
        class="trigger"
        :type="collapsed ? 'menu-unfold' : 'menu-fold'"
        @click="toggleCollapse"
      />
      <div
        v-if="layout !== 'side' && !isMobile"
        class="admin-header-menu"
        :style="`width: ${menuWidth};`"
      >
        <i-menu
          class="head-menu"
          :theme="headerTheme"
          mode="horizontal"
          :menu="menuData"
          @select="onSelect"
          v-if="layout === 'head'"
        />
        <a-tabs :activeKey="headMenuIndex" class="head-menu" v-else>
          <a-tab-pane
            :key="index"
            v-for="(item, index) in menuData"
            @click="onSelect(item)"
            v-if="item.meta"
          >
            <span slot="tab">
              <router-link :to="item.fullPath" class="head-menu-link">
                <!-- <a-icon :type="item.meta.icon" /> -->
                <icon-fonts
                  :icon="'icon-' + item.meta.icon"
                  type="small"
                ></icon-fonts>
                {{ item.title }}
              </router-link>
            </span>
          </a-tab-pane>
        </a-tabs>
      </div>
      <div :class="['admin-header-right', headerTheme]">
        <!-- <header-search class="header-item" @active="val => searchActive = val" /> -->
        <header-notice class="header-item" />
        <!-- <a-tooltip class="header-item" title="锁屏" placement="bottom">
          <headerLock></headerLock>
        </a-tooltip> -->
        <a-tooltip class="header-item" title="系统设置" placement="bottom">
          <span href="javascript:void(0)" @click="handleShowSetting">
            <a-icon type="setting" style="font-size: 16px;padding: 4px;" />
          </span>
        </a-tooltip>
        <header-avatar class="header-item" />
        <!-- <a-dropdown class="lang header-item">
					<div><a-icon type="global" /> {{ langAlias }}</div>
					<a-menu @click="(val) => setLang(val.key)" :selected-keys="[lang]" slot="overlay">
						<a-menu-item v-for="lang in langList" :key="lang.key">{{
							lang.key.toLowerCase() + ' ' + lang.name
						}}</a-menu-item>
					</a-menu>
				</a-dropdown> -->
      </div>
    </div>
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
  </a-layout-header>
</template>

<script>
import HeaderSearch from "./HeaderSearch";
import HeaderNotice from "./HeaderNotice";
import HeaderAvatar from "./HeaderAvatar";
import headerLock from "./headerLock";
import IMenu from "@/components/menu/menu";
import { mapState, mapMutations, mapGetters } from "vuex";
import Setting from "@/components/setting/Setting";
export default {
  name: "AdminHeader",
  components: {
    IMenu,
    HeaderAvatar,
    HeaderNotice,
    HeaderSearch,
    Setting,
    headerLock,
  },
  props: ["collapsed", "menuData", "headMenuIndex"],
  data() {
    return {
      langList: [
        { key: "CN", name: "简体中文", alias: "简体" },
        { key: "HK", name: "繁體中文", alias: "繁體" },
        { key: "US", name: "English", alias: "English" },
      ],
      searchActive: false,
      showSetting: false,
    };
  },
  computed: {
    ...mapState("setting", [
      "theme",
      "isMobile",
      "layout",
      "systemName",
      "lang",
      "pageWidth",
    ]),
    ...mapGetters(["configData", "firstMenu"]),
    headerTheme() {
      if (
        this.layout == "side" &&
        this.theme.mode == "dark" &&
        !this.isMobile
      ) {
        return "light";
      }
      return this.theme.mode;
    },
    headerCss() {
      if (
        this.layout == "side" &&
        this.theme.mode != "night" &&
        !this.isMobile
      ) {
        return "lightCss";
      } else if (
        this.layout == "head" &&
        this.theme.mode == "dark" &&
        !this.isMobile
      ) {
        return "darkCss";
      } else if (
        this.layout != "side" &&
        this.theme.mode == "light" &&
        !this.isMobile
      ) {
        return "headCss";
      }
      return this.theme.mode;
    },
    langAlias() {
      let lang = this.langList.find((item) => item.key == this.lang);
      return lang.alias;
    },
    menuWidth() {
      const { layout, searchActive } = this;
      const headWidth = layout === "head" ? "100% - 188px" : "100%";
      const extraWidth = searchActive ? "600px" : "400px"; //400px
      return `calc(${headWidth} - ${extraWidth})`;
    },
    systemNameShort() {
      let index = this.configData.findIndex(
        (item) => item.code === "systemNameShort"
      );
      if (index >= 0) {
        return this.configData[index].value;
      } else {
        return "智能运输管理ERP系统";
      }
    },
    companyPlatformIcon() {
      let index = this.configData.findIndex(
        (item) => item.code === "companyPlatformIcon"
      );
      if (index >= 0) {
        return this.configData[index].value;
      } else {
        return "https://zysd-shanghai.oss-cn-shanghai.aliyuncs.com/emis/logo.png";
      }
    },
  },
  methods: {
    toggleCollapse() {
      this.$emit("toggleCollapse");
    },
    onSelect(obj) {
      this.$emit("menuSelect", obj);
    },
    handleShowSetting() {
      this.showSetting = true;
    },
    onClose() {
      this.showSetting = false;
    },
    ...mapMutations("setting", ["setLang"]),
  },
};
</script>

<style lang="less" scoped>
@import "index";
.admin-header-wide {
  img {
    width: 32px;
    margin: 0 10px;
  }
}
.lightCss,
.headCss {
  color: rgba(0, 0, 0, 0.65) !important;
}
.darkCss {
  color: rgba(225, 225, 225, 0.65) !important;
}
.head-menu-link {
  color: rgba(225, 225, 225, 0.65) !important;
}
</style>
