<template>
  <admin-layout>
    <contextmenu
      :itemList="menuItemList"
      :visible.sync="menuVisible"
      @select="onMenuSelect"
    />
    <tabs-head
      v-if="multiPage"
      :active="activePage"
      :page-list="pageList"
      @change="changePage"
      @close="remove"
      @refresh="refresh"
      @contextmenu="onContextmenu"
    />
    <div
      :class="['tabs-view-content', layout, pageWidth]"
      :style="`margin-top: ${multiPage ? -24 : 0}px`"
    >
      <page-toggle-transition
        :disabled="animate.disabled"
        :animate="animate.name"
        :direction="animate.direction"
      >
        <a-keep-alive v-if="!multiPage && !keepAlive" v-model="clearCaches">
          <router-view v-if="!refreshing" ref="tabContent" :key="$route.path" />
        </a-keep-alive>
        <template v-else>
          <router-view v-if="!cacheRefresh" />
        </template>
      </page-toggle-transition>
    </div>
  </admin-layout>
</template>

<script>
import AdminLayout from "@/layouts/AdminLayout";
import Contextmenu from "@/components/menu/Contextmenu";
import PageToggleTransition from "@/components/transition/PageToggleTransition";
import { triggerWindowResizeEvent } from "@/utils/util";
import { getI18nKey } from "@/utils/routerUtil";
import { mapState, mapMutations } from "vuex";
import AKeepAlive from "@/components/cache/AKeepAlive";
import TabsHead from "@/layouts/tabs/TabsHead";
const indexKey = "/system/portal/index";
import store from "@/store";
export default {
  name: "TabsView",
  i18n: require("./i18n"),
  components: {
    TabsHead,
    PageToggleTransition,
    Contextmenu,
    AdminLayout,
    AKeepAlive,
  },
  data() {
    return {
      clearCaches: [],
      pageList: [],
      activePage: "",
      menuVisible: false,
      refreshing: false,
			cacheRefresh: false
    };
  },
  computed: {
    ...mapState("setting", ["multiPage", "animate", "layout", "pageWidth"]),
    menuItemList() {
      return [
        {
          key: "1",
          icon: "vertical-right",
          text: this.$t("closeLeft"),
        },
        {
          key: "2",
          icon: "vertical-left",
          text: this.$t("closeRight"),
        },
        {
          key: "3",
          icon: "close",
          text: this.$t("closeOthers"),
        },
        {
          key: "4",
          icon: "sync",
          text: this.$t("refresh"),
        },
      ];
    },
    tabsOffset() {
      return this.multiPage ? 24 : 0;
    },
    keepAlive() {
      return this.$route.meta.keepAlive;
    },
  },
  provide() {
    return {
      closeCurrent: this.closeCurrent,
    };
  },
  created() {
		console.log(this.multiPage)
    this.loadCachedTabs();
    const route = this.$route;
    if (
      this.pageList.findIndex((item) => item.fullPath === route.fullPath) === -1
    ) {
      this.pageList.push(this.createPage(route));
    }
    this.activePage = route.fullPath;
    if (this.multiPage) {
      this.$nextTick(() => {
        this.setCachedKey(route);
      });
      this.addListener();
    }
    if (this.$route.path != indexKey) {
      // this.addIndexToFirst();
    }
  },
  mounted() {
    this.correctPageMinHeight(-this.tabsOffset);
  },
  beforeDestroy() {
    this.removeListener();
    this.correctPageMinHeight(this.tabsOffset);
  },
  watch: {
    $route: function(newRoute, from) {
      this.activePage = newRoute.fullPath;
      if (!this.multiPage) {
        this.pageList = [this.createPage(newRoute)];
      } else if (
        this.pageList.findIndex(
          (item) => item.fullPath === newRoute.fullPath
        ) === -1
      ) {
        this.pageList.push(this.createPage(newRoute));
      }
      if (this.multiPage) {
        this.$nextTick(() => {
          this.setCachedKey(newRoute);
        });
      }
      this.refresh(this.activePage);
    },
    multiPage: function(newVal) {
      if (!newVal) {
        this.pageList = [this.createPage(this.$route)];
        this.removeListener();
      } else {
        this.addListener();
      }
    },
    tabsOffset(newVal, oldVal) {
      this.correctPageMinHeight(oldVal - newVal);
    },
  },
  methods: {
    // 将首页添加到第一位
    addIndexToFirst() {
      // console.log(store.getters.addRouters[0])
      // if (this.pageList[0].fullPath != indexKey) {
      // 	this.pageList.splice(0, 0, {
      // 		cachedKey: '__transition-308-'+store.getters.addRouters[0].path + '/portal/index'+'172',
      // 		path: indexKey,
      // 		fullPath: indexKey,
      // 		loading: false,
      // 		title: '平台门户',
      // 		icon: 'home',
      // 		unclose: true,
      // 		_init_: true,
      // 	});
      // }
    },
    changePage(key) {
      this.activePage = key;
      this.$router.push(this.activePage);
    },
    remove(key, next) {
      // if (key === store.getters.addRouters[0].path + '/portal/index') {
      // 	this.$message.warning('首页不能关闭！');
      // 	return;
      // }
      if (this.pageList.length === 1) {
        return this.$message.warning(this.$t("warn"));
      }
      //清除缓存
      let index = this.pageList.findIndex((item) => item.fullPath === key);
      this.clearCaches = this.pageList
        .splice(index, 1)
        .map((page) => page.cachedKey);
      if (next) {
        this.$router.push(next);
      } else if (key === this.activePage) {
        index =
          index >= this.pageList.length ? this.pageList.length - 1 : index;
        this.activePage = this.pageList[index].fullPath;
        this.$router.push(this.activePage);
      }
    },
    refresh(key, page, cache) {
      // this.$route.meta.keepAlive = !this.$route.meta.keepAlive;
      page = page || this.pageList.find((item) => item.fullPath === key);
      page.loading = true;
      this.clearCache(page);
      if (key === this.activePage) {
        this.reloadContent(() => (page.loading = false));
      } else {
        // 其实刷新很快，加这个延迟纯粹为了 loading 状态多展示一会儿，让用户感知刷新这一过程
				this.changePage(key)
        setTimeout(() => (page.loading = false), 500);
      }
			if(cache){
				this.cacheRefresh = true
				this.$nextTick(() => {
				  this.cacheRefresh = false
				});
			}
      triggerWindowResizeEvent();
    },
    onContextmenu(pageKey, e) {
      if (pageKey) {
        e.preventDefault();
        e.meta = pageKey;
        this.menuVisible = true;
      }
    },
    onMenuSelect(key, target, pageKey) {
      switch (key) {
        case "1":
          this.closeLeft(pageKey);
          break;
        case "2":
          this.closeRight(pageKey);
          break;
        case "3":
          this.closeOthers(pageKey);
          break;
        case "4":
          this.refresh(pageKey,null,true);
          break;
        default:
          break;
      }
    },
    closeCurrent() {
      this.remove(this.activePage);
    },
    closeOthers(pageKey) {
      // 清除缓存
      const clearPages = this.pageList.filter(
        (item) => item.fullPath !== pageKey && !item.unclose
      );
      this.clearCaches = clearPages.map((item) => item.cachedKey);
      this.pageList = this.pageList.filter(
        (item) => !clearPages.includes(item)
      );
      // 判断跳转
      if (this.activePage != pageKey) {
        this.activePage = pageKey;
        this.$router.push(this.activePage);
      }
      // this.addIndexToFirst();
    },
    closeLeft(pageKey) {
      const index = this.pageList.findIndex(
        (item) => item.fullPath === pageKey
      );
      // 清除缓存
      const clearPages = this.pageList.filter(
        (item, i) => i < index && !item.unclose
      );
      this.clearCaches = clearPages.map((item) => item.cachedKey);

      this.pageList = this.pageList.filter(
        (item) => !clearPages.includes(item)
      );
      // 判断跳转
      if (!this.pageList.find((item) => item.fullPath === this.activePage)) {
        this.activePage = pageKey;
        this.$router.push(this.activePage);
      }
      // this.addIndexToFirst();
    },
    closeRight(pageKey) {
      // 清除缓存
      const index = this.pageList.findIndex(
        (item) => item.fullPath === pageKey
      );
      const clearPages = this.pageList.filter(
        (item, i) => i > index && !item.unclose
      );
      this.clearCaches = clearPages.map((item) => item.cachedKey);

      this.pageList = this.pageList.filter(
        (item) => !clearPages.includes(item)
      );
      // 判断跳转
      if (!this.pageList.find((item) => item.fullPath === this.activePage)) {
        this.activePage = pageKey;
        this.$router.push(this.activePage);
      }
    },
    clearCache(page) {
      page._init_ = false;
      this.clearCaches = [page.cachedKey];
    },
    reloadContent(onLoaded) {
      this.refreshing = !this.refreshing;
      setTimeout(() => {
        this.refreshing = !this.refreshing;
        this.$nextTick(() => {
          this.setCachedKey(this.$route);
          if (typeof onLoaded === "function") {
            onLoaded.apply(this, []);
          }
        });
      }, 200);
    },
    pageName(page) {
      return this.$t(getI18nKey(page.keyPath));
    },
    /**
     * 添加监听器
     */
    addListener() {
      window.addEventListener("page:close", this.closePageListener, false);
      window.addEventListener("page:refresh", this.refreshPageListener, false);
      window.addEventListener("unload", this.unloadListener, false);
    },
    /**
     * 移出监听器
     */
    removeListener() {
      window.removeEventListener("page:close", this.closePageListener);
      window.removeEventListener("page:refresh", this.refreshPageListener);
      window.removeEventListener("unload", this.unloadListener);
    },
    /**
     * 页签关闭事件监听
     * @param event 页签关闭事件
     */
    closePageListener(event) {
      const { closeRoute, nextRoute } = event.detail;
      const closePath =
        typeof closeRoute === "string" ? closeRoute : closeRoute.path;
      this.remove(closePath, nextRoute);
    },
    /**
     * 页面刷新事件监听
     * @param event 页签关闭事件
     */
    refreshPageListener(event) {
      const { pageKey } = event.detail;
      this.refresh(pageKey);
    },
    /**
     * 页面 unload 事件监听器，添加页签到 session 缓存，用于刷新时保留页签
     */
    unloadListener() {
      const tabs = this.pageList.map((item) => ({ ...item, _init_: false }));
      sessionStorage.setItem(
        process.env.VUE_APP_TBAS_KEY,
        JSON.stringify(tabs)
      );
      console.log(tabs, "tabs=====");
    },
    createPage(route) {
      return {
        keyPath: route.matched[route.matched.length - 1].path,
        // keyPath:route.fullPath,
        fullPath: route.fullPath,
        loading: false,
        title: route.meta && route.meta.title,
        icon: route.meta && route.meta.icon,
        unclose:
          route.meta && route.meta.page && route.meta.page.closable === false,
      };
    },
    /**
     * 设置页面缓存的key
     * @param route 页面对应的路由
     */
    setCachedKey(route) {
      const page = this.pageList.find(
        (item) => item.fullPath === route.fullPath
      );
      page.unclose =
        route.meta && route.meta.page && route.meta.page.closable === false;
      if (!page._init_) {
        // const vnode = this.$refs.tabContent.$vnode
        // page.cachedKey = vnode.key + vnode.componentOptions.Ctor.cid
        page._init_ = true;
      }
    },
    /**
     * 加载缓存的 tabs
     */
    loadCachedTabs() {
      const cachedTabsStr = sessionStorage.getItem(
        process.env.VUE_APP_TBAS_KEY
      );
      if (cachedTabsStr) {
        try {
          const cachedTabs = JSON.parse(cachedTabsStr);
          if (cachedTabs.length > 0) {
            this.pageList = cachedTabs;
          }
        } catch (e) {
          console.warn("failed to load cached tabs, got exception:", e);
        } finally {
          sessionStorage.removeItem(process.env.VUE_APP_TBAS_KEY);
        }
      }
    },
    ...mapMutations("setting", ["correctPageMinHeight"]),
  },
};
</script>

<style scoped lang="less">
.tabs-view {
  margin: -16px auto 8px;

  &.head.fixed {
    // max-width: 1400px;
  }
}

.tabs-view-content {
  position: relative;
  margin: 0 auto !important;
  // margin-left: 10px !important;
  // margin-right: 10px !important;
  &.head.fixed {
    width: 1400px;
    margin: 0 auto !important;
  }
}
</style>
