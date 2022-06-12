<!--
 * @Description: 后台管理布局
 * @Author: 黄婷
 * @Date: 2021-06-02 13:38:08
 * @LastEditTime: 2021-09-17 11:10:33
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\layouts\AdminLayout.vue
-->
<template>
  <a-layout :class="['admin-layout', 'beauty-scroll', { mobile: isMobile }]">
    <drawer v-if="isMobile" v-model="drawerOpen">
      <side-menu
        :theme="theme.mode"
        :menuData="menuData"
        :collapsed="false"
        :collapsible="false"
        @menuSelect="onMenuSelect"
      />
    </drawer>
    <side-menu
      :class="[fixedSideBar ? 'fixed-side' : '']"
      :theme="theme.mode"
      v-else-if="layout === 'side' || layout === 'mix'"
      :menuData="sideMenuData"
      :collapsed="collapsed"
      :collapsible="true"
      :isShowTitle="isShowTitle"
    />
    <div
      v-if="fixedSideBar && !isMobile"
      :style="
        `width: ${sideMenuWidth}; min-width: ${sideMenuWidth};max-width: ${sideMenuWidth};`
      "
      class="virtual-side"
    ></div>
    <a-layout class="admin-layout-main beauty-scroll">
      <admin-header
        :headMenuIndex="headMenuIndex"
        :class="[
          {
            'fixed-tabs': fixedTabs,
            'fixed-header': fixedHeader,
            'multi-page': multiPage,
          },
        ]"
        :style="headerStyle"
        :menuData="headMenuData"
        :collapsed="collapsed"
        @toggleCollapse="toggleCollapse"
      />
      <a-layout-header
        :class="[
          'virtual-header',
          {
            'fixed-tabs': fixedTabs,
            'fixed-header': fixedHeader,
            'multi-page': multiPage,
          },
        ]"
        v-show="fixedHeader"
      ></a-layout-header>
      <a-layout-content
        class="admin-layout-content"
        :style="`min-height: ${minHeight}px;`"
      >
        <div style="position: relative">
          <slot></slot>
        </div>
      </a-layout-content>
      <a-layout-footer style="padding: 0px">
        <page-footer :link-list="footerLinks" :copyright="copyright" />
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>
import AdminHeader from "./header/AdminHeader";
import PageFooter from "./footer/PageFooter";
import Drawer from "../components/tool/Drawer";
import SideMenu from "../components/menu/SideMenu";
import Setting from "../components/setting/Setting";
import RouteView from "./RouteView.vue";
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import { triggerWindowResizeEvent } from "@/utils/util";
import store from "@/store";
import router from "@/router";
// const minHeight = window.innerHeight - 64 - 122

export default {
  name: "AdminLayout",
  components: { SideMenu, Drawer, PageFooter, AdminHeader, Setting, RouteView },
  data() {
    return {
      minHeight: this.fixedTabs
        ? window.innerHeight - 54
        : window.innerHeight - 54 - 54,
      collapsed: false,
      showSetting: false,
      drawerOpen: false,
      isShowTitle: false,
      headMenuIndex: 0,
    };
  },
  provide() {
    return {
      adminLayout: this,
    };
  },
  watch: {
    $route(val) {
      this.setActivated(val);
    },
    layout() {
      this.setActivated(this.$route);
    },
    isMobile(val) {
      if (!val) {
        this.drawerOpen = false;
      }
    },
    fixedTabs(val) {
      this.minHeight =
        val && !this.fixedHeader
          ? window.innerHeight - 54
          : window.innerHeight - 54 - 54;
    },
    fixedHeader(val) {
      this.minHeight =
        val && this.fixedTabs
          ? window.innerHeight - 54 - 54
          : val
          ? window.innerHeight - 54 - 54
          : window.innerHeight - 54;
    },
  },
  computed: {
    ...mapState("setting", [
      "isMobile",
      "theme",
      "layout",
      "footerLinks",
      "copyright",
      "fixedHeader",
      "fixedSideBar",
      "fixedTabs",
      "hideSetting",
      "multiPage",
    ]),
    ...mapGetters("setting", ["firstMenu", "subMenu", "menuData"]),
    sideMenuWidth() {
      return this.collapsed ? "80px" : "256px";
    },
    headerStyle() {
      let width =
        this.fixedHeader && this.layout !== "head" && !this.isMobile
          ? `calc(100% - ${this.sideMenuWidth})`
          : "100%";
      let position = this.fixedHeader ? "fixed" : "static";
      return `width: ${width}; position: ${position};`;
    },
    headMenuData() {
      const { layout, menuData, firstMenu } = this;
      return layout === "mix" ? firstMenu : menuData;
    },
    sideMenuData() {
      const { layout, menuData, subMenu } = this;
      return layout === "mix" ? subMenu : menuData;
    },
  },
  methods: {
    ...mapMutations("setting", ["correctPageMinHeight", "setActivatedFirst"]),
    ...mapActions(["setSidebar"]),
    toggleCollapse() {
      this.collapsed = !this.collapsed;
      this.setSidebar(!this.collapsed);
      this.isShowTitle = !this.isShowTitle;
      triggerWindowResizeEvent();
    },
    onMenuSelect() {
      this.toggleCollapse();
    },
    setActivated(route) {
      if (this.layout === "mix") {
        let matched = route.matched;
        matched = matched.slice(0, matched.length - 1);
        const { firstMenu } = this;
        firstMenu.forEach((menu, index) => {
          if (
            matched.findIndex(
              (item) => "/" + item.path.split("/")[1] === menu.fullPath
            ) !== -1
          ) {
            this.headMenuIndex = index;
            this.setActivatedFirst(menu.fullPath);
            store.commit("setting/setActivatedFirst", menu.fullPath);
            return;
          } else {
            if (index === 0) {
              this.headMenuIndex = 0;
              this.setActivatedFirst(menu.fullPath);
              store.commit("setting/setActivatedFirst", menu.fullPath);
            }
          }
        });
      }
    },
  },
  created() {
    this.correctPageMinHeight(this.minHeight - 24);
    this.setActivated(this.$route);
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.minHeight =
          this.fixedTabs && !this.fixedHeader
            ? window.innerHeight - 54
            : window.innerHeight - 54 - 54;
      })();
    };
  },
  beforeDestroy() {
    this.correctPageMinHeight(-this.minHeight + 24);
  },
};
</script>

<style lang="less" scoped>
.admin-layout {
  .side-menu {
    &.fixed-side {
      position: fixed;
      height: 100vh;
      left: 0;
      top: 0;
    }
  }
  .virtual-side {
    transition: all 0.2s;
  }
  .virtual-header {
    transition: all 0.2s;
    opacity: 0;
    &.fixed-tabs.multi-page:not(.fixed-header) {
      height: 0 !important;
    }
  }
  .admin-layout-main {
    .admin-header {
      top: 0;
      right: 0;
      overflow: hidden;
      transition: all 0.2s;
      &.fixed-tabs.multi-page:not(.fixed-header) {
        height: 0 !important;
      }
    }
  }
  .admin-layout-content {
    // padding: 20px 0px 0;
    /*overflow-x: hidden;*/
    // min-height: calc(100vh - 54px - 54px) !important;
  }
  .setting {
    background-color: @primary-color;
    color: @base-bg-color;
    border-radius: 5px 0 0 5px;
    line-height: 40px;
    font-size: 22px;
    width: 40px;
    height: 40px;
    box-shadow: -2px 0 8px @shadow-color;
  }
  &.mobile {
    .ant-table-content {
      overflow-x: auto;
    }
    .ant-table-body {
      min-width: 800px;
    }
  }
}
</style>
<style lang="less">
.mobile {
  .ant-table-content,
  .ant-table-scroll {
    overflow-x: auto;
  }
  .ant-table-body {
    min-width: 800px;
  }
  .footer {
    .version {
      position: relative;
      text-align: center;
    }
  }
  .tabs-container.affixed.fixed-header {
    left: 0;
    width: 100%;
  }
  .ant-layout.ant-layout-has-sider {
    flex-wrap: wrap;
    .ant-layout-sider {
      flex: 1 !important;
      max-width: 100% !important;
      width: 100% !important;
      padding-bottom: 20px;
    }
  }
  .ant-modal {
    width: 100% !important;
  }
  .table-page-search-wrapper .ant-form-inline .ant-form-item {
    margin-bottom: 10px !important;
  }
}
</style>
