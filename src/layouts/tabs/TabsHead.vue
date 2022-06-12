<template>
  <div :class="['tabs-head', layout, pageWidth]">
    <a-tabs
      :class="[
        'tabs-container',
        layout,
        pageWidth,
        {
          affixed: affixed,
          'fixed-header': fixedHeader,
          collapsed: adminLayout.collapsed,
        },
      ]"
      :active-key="active"
      :hide-add="true"
    >
      <a-tooltip placement="left" :title="lockTitle" slot="tabBarExtraContent">
        <a-icon
          theme="filled"
          @click="onLockClick"
          class="header-lock"
          :type="fixedTabs ? 'lock' : 'unlock'"
        />
      </a-tooltip>
      <a-tab-pane v-for="(page, index) in pageList" :key="page.fullPath">
        <div
          slot="tab"
          class="tab"
          @contextmenu="(e) => onContextmenu(page.fullPath, e)"
        >
          <!-- <a-icon :class="['icon-sync']"/> -->
          <a-icon
            v-if="page.loading"
            @click="onRefresh(page)"
            :class="['sync']"
            type="loading"
          />
          <icon-fonts
            @change="onRefresh(page)"
            v-else
            :class="['sync']"
            :icon="
              page.fullPath !== active && !page.loading
                ? 'icon-' + page.icon
                : 'icon-sync'
            "
          ></icon-fonts>
          <!-- <a-icon @click="onRefresh(page)" :class="['icon-sync', {'hide': page.fullPath !== active && !page.loading}]" :type="page.loading ? 'loading' : 'sync'" /> -->
          <div class="title" @click="onTabClick(page.fullPath)">
            {{ pageName(page) }}
          </div>
          <a-icon
            v-if="!page.unclose && index != 0"
            @click="onClose(page.fullPath)"
            class="icon-close"
            type="close"
          />
        </div>
      </a-tab-pane>
    </a-tabs>
    <div v-if="affixed" class="virtual-tabs"></div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { getI18nKey } from "@/utils/routerUtil";

export default {
  name: "TabsHead",
  i18n: {
    messages: {
      CN: {
        lock: "点击锁定页签头",
        unlock: "点击解除锁定",
      },
      HK: {
        lock: "點擊鎖定頁簽頭",
        unlock: "點擊解除鎖定",
      },
      US: {
        lock: "click to lock the tabs head",
        unlock: "click to unlock",
      },
    },
  },
  props: {
    pageList: Array,
    active: String,
    fixed: Boolean,
  },
  data() {
    return {
      affixed: false,
    };
  },
  inject: ["adminLayout"],
  created() {
    this.affixed = this.fixedTabs;
  },
  computed: {
    ...mapState("setting", ["layout", "pageWidth", "fixedHeader", "fixedTabs"]),
    lockTitle() {
      return this.$t(this.fixedTabs ? "unlock" : "lock");
    },
  },
  methods: {
    ...mapMutations("setting", ["setFixedTabs"]),
    onLockClick() {
      this.setFixedTabs(!this.fixedTabs);
      if (this.fixedTabs) {
        setTimeout(() => {
          this.affixed = true;
        }, 200);
      } else {
        this.affixed = false;
      }
    },
    onTabClick(key) {
      if (this.active !== key) {
        this.$emit("change", key);
      }
    },
    onClose(key) {
      this.$emit("close", key);
    },
    onRefresh(page) {
			if(page.fullPath !== this.active && !page.loading){
				this.onTabClick(page.fullPath)
			}else{
				this.$emit("refresh", page.fullPath, page, true);
			}
    },
    onContextmenu(pageKey, e) {
      this.$emit("contextmenu", pageKey, e);
    },
    pageName(page) {
      return page.title || this.$t(getI18nKey(page.keyPath));
    },
  },
};
</script>

<style scoped lang="less">
.ant-tabs-ink-bar .ant-tabs-ink-bar-animated {
  transform: translate3d(452px, 0px, 0px);
}
.tab {
  margin: 0 -16px;
  padding: 0 16px;
  font-size: 14px;
  user-select: none;
  transition: all 0.2s;
  .title {
    display: inline-block;
    height: 100%;
  }
  .icon-close {
    font-size: 12px;
    margin-left: 6px;
    margin-right: -4px !important;
    color: transparent;
    line-height: 1.5;
    background: none;
    color: @text-color-second;
    &:hover {
      color: @text-color;
    }
  }
  .sync {
    margin-left: -4px;
    color: @primary-4;
    transition: all 0.3s ease-in-out;
    width: 14px;
    &:hover {
      color: @primary-color;
    }
    font-size: 14px;
    &.hide {
      font-size: 0;
    }
  }
}
.tabs-head {
  margin: 0 auto 0;
  height: 40px;
  &.head.fixed {
    width: 1400px;
  }
  &.side.fixed {
    height: 40px;
    // margin-top: 1px;
  }
}
.tabs-container {
  // margin: -16px auto 8px;
  transition: top, left 0.2s;
  .header-lock {
    font-size: 18px;
    margin-right: 10px;
    cursor: pointer;
    color: @primary-3;
    &:hover {
      color: @primary-color;
    }
  }
  &.affixed {
    margin: 0 auto;
    top: 0px;
    padding: 1px 0 0;
    position: fixed;
    height: 42px;
    z-index: 9;
    background-color: @layout-body-background;
    // border-bottom: 1px solid @layout-body-background;
    &.side,
    &.head,
    &.mix {
      height: 41px;
    }
    &.side,
    &.mix {
      right: 0;
      left: 256px;
      &.collapsed {
        left: 80px;
      }
    }
    &.head {
      width: inherit;
      padding: 1px 0 0;
      &.fluid {
        left: 0;
        right: 0;
        padding: 8px 24px 0;
      }
    }
    &.fixed-header {
      top: 54px;
    }
  }
}
.virtual-tabs {
  height: 48px;
}
.mobile {
  .tabs-container {
    &.mix {
      right: 0;
      left: 0;
    }
  }
}
</style>
