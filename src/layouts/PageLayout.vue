<!--
 * @Description: 页面布局
 * @Author: lmy
 * @Date: 2021-06-02 13:38:08
 * @LastEditTime: 2021-09-18 13:39:45
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <div class="page-layout">
    <page-header
      ref="pageHeader"
      :style="`margin-top: ${multiPage ? 0 : -24}px`"
      :breadcrumb="breadcrumb"
      :title="pageTitle"
      :logo="logo"
      :avatar="avatar"
      v-if="crumbs"
    >
      <slot name="action" slot="action"></slot>
      <slot slot="content" name="headerContent"></slot>
      <div slot="content" v-if="!this.$slots.headerContent && desc">
        <p>{{ desc }}</p>
        <div v-if="this.linkList" class="link">
          <template v-for="(link, index) in linkList">
            <a :key="index" :href="link.href"
              ><a-icon :type="link.icon" />{{ link.title }}</a
            >
          </template>
        </div>
      </div>
      <slot v-if="this.$slots.extra" slot="extra" name="extra"></slot>
    </page-header>
    <div
      ref="page"
      :class="['page-content', layout, pageWidth]"
      :style="`min-height:${pageLayoutHeight}`"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
import PageHeader from "@/components/page/header/PageHeader";
import { mapState, mapMutations } from "vuex";
import { getI18nKey } from "@/utils/routerUtil";

export default {
  name: "PageLayout",
  components: { PageHeader },
  props: ["desc", "logo", "title", "avatar", "linkList", "extraImage"],
  data() {
    return {
      page: {},
      pageHeaderHeight: 0,
    };
  },
  watch: {
    $route() {
      this.page = this.$route.meta.title;
    },
  },
  updated() {
    if (!this._inactive) {
      this.updatePageHeight();
    }
  },
  activated() {
    this.updatePageHeight();
  },
  deactivated() {
    this.updatePageHeight(0);
  },
  mounted() {
    this.updatePageHeight();
  },
  created() {
    this.page = this.$route.meta.title;
  },
  beforeDestroy() {
    this.updatePageHeight(0);
  },
  computed: {
    ...mapState("setting", [
      "layout",
      "multiPage",
      "pageMinHeight",
      "pageWidth",
      "crumbs",
    ]),
    pageTitle() {
      let pageTitle = this.page && this.page.title;
      return pageTitle === undefined
        ? this.title || this.routeName
        : this.$t(pageTitle);
    },
    routeName() {
      const route = this.$route;
      return this.$t(getI18nKey(route.matched[route.matched.length - 1].path));
    },
    breadcrumb() {
      let page = this.page;
      let breadcrumb = page && page.breadcrumb;
      if (breadcrumb) {
        let i18nBreadcrumb = [];
        breadcrumb.forEach((item) => {
          i18nBreadcrumb.push(this.$t(item));
        });
        return i18nBreadcrumb;
      } else {
        return this.getRouteBreadcrumb();
      }
    },
    marginCorrect() {
      return this.multiPage ? 24 : 0;
    },
    pageLayoutHeight() {
      return this.crumbs
        ? `calc(100vh - 54px - 40px - 20px - 40px - 30px)`
        : `calc(100vh - 54px - 40px - 20px - 30px)`;
    },
  },
  methods: {
    ...mapMutations("setting", ["correctPageMinHeight"]),
    getRouteBreadcrumb() {
      let routes = this.$route.matched;
      let breadcrumb = [];
      routes.forEach((route) => {
        const path = route.path.length === 0 ? "/home" : route.path;
        breadcrumb.push(this.$t(getI18nKey(path)));
      });
      let pageTitle = this.page && this.page.title;
      if (pageTitle) {
        breadcrumb[breadcrumb.length - 1] = pageTitle;
      }
      return breadcrumb;
    },
    /**
     * 用于计算页面内容最小高度
     * @param newHeight
     */
    updatePageHeight(
      newHeight = this.$refs.pageHeader
        ? this.$refs.pageHeader.$el.offsetHeight + this.marginCorrect
        : 0
    ) {
      this.correctPageMinHeight(this.pageHeaderHeight - newHeight);
      this.pageHeaderHeight = newHeight;
    },
  },
};
</script>

<style lang="less">
.page-header {
  margin: 0 -24px 0;
}
.link {
  /*margin-top: 16px;*/
  line-height: 24px;
  a {
    font-size: 14px;
    margin-right: 32px;
    i {
      font-size: 22px;
      margin-right: 8px;
    }
  }
}
.page-layout {
  // overflow: hidden;
  margin-bottom: 9px;
}
.page-content {
  position: relative;
  // background: #fff;
  // height: 100%;
  margin: 10px 10px 0;
  &.side {
  }
  &.head.fixed {
    margin: 10px auto 0;
    // max-width: 1400px;
  }
}
.page-common-layout {
  width: 100%;
  height: calc(100vh - 54px - 40px - 20px - 30px);
  display: flex;
  .page-common-content,
  .page-common-left {
    background: #fff;
    height: 100%;
    padding: 10px;
    overflow: hidden;
    overflow-y: auto;
  }
  .advanced-table,
  .table-wrapper,
  .ant-table-wrapper,
  .ant-spin-nested-loading,
  .ant-spin-container {
    height: 100%;
  }
  .page-common-left {
    height: 100%;
    margin-right: 10px;
    min-width: 220px;
  }
  .page-common-content {
    width: 100%;
    .advanced-table {
      .ant-form-horizontal {
        height: 100%;
      }
    }
    .ant-tabs-content {
      height: calc(100% - 54px);
      .ant-tabs-tabpane,
      .ant-card,
      .ant-card-body {
        height: 100%;
      }
    }
  }
  .page-common-left + .page-common-content {
    max-width: calc(100% - 220px - 10px - 30px);
  }
  .page-common-all-content {
    height: 100%;
  }
  .page-common-box-content {
    height: calc(100% - 50%);
    .ant-tabs {
      height: 100%;
    }
  }
}

.page-header + .page-content {
  .page-common-layout {
    height: calc(100vh - 54px - 40px - 20px - 42px);
  }
  // .page-common-left {
  //   height: calc(100vh - 54px - 40px - 20px - 40px);
  // };;
}
</style>
