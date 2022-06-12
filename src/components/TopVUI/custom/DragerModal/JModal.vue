<!--
 * @Description: 可拖拽窗口；默认使用
 * @Author: 黄婷
 * @Date: 2021-01-19 13:44:39
 * @LastEditTime: 2021-08-03 12:02:48
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\custom\DragerModal\JModal.vue
-->
<template>
  <a-modal
    ref="modal"
    :class="getClass(modalClass)"
    :style="getStyle(modalStyle)"
    :visible="visible"
    v-bind="_attrs"
    v-on="$listeners"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :cancelText="cancelText"
    :okText="okText"
  >
    <slot></slot>
    <template v-if="!isNoTitle" slot="title">
      <a-row class="t-modal-title-" type="flex">
        <a-col class="left">
          {{ title }}
        </a-col>
        <a-col
          v-if="switchFullscreen"
          class="right fullscreenBox"
          :class="[fullscreen ? 'fullscreen' : '', 'right']"
        >
          <a-button
            class="ant-modal-close ant-modal-close-x"
            ghost
            type="link"
            :icon="fullscreenButtonIcon"
          />
        </a-col>
        <a-col
          v-if="!switchFullscreen && fullscreen"
          class="fullscreen fullscreenBox"
          style="display: none;"
        ></a-col>
      </a-row>
    </template>

    <!-- 处理 scopedSlots -->
    <template v-for="slotName of scopedSlotsKeys" :slot="slotName">
      <slot :name="slotName"></slot>
    </template>

    <!-- 处理 slots -->
    <template v-for="slotName of slotsKeys" v-slot:[slotName]>
      <slot :name="slotName"></slot>
    </template>
  </a-modal>
</template>

<script>
import { mapState } from "vuex";
import { getClass, getStyle } from "@/utils/props-util";
import { triggerWindowResizeEvent } from "@/utils/util";
export default {
  name: "JModal",
  props: {
    title: String,
    // 可使用 .sync 修饰符
    visible: Boolean,
    // 是否全屏弹窗，当全屏时无论如何都会禁止 body 滚动。可使用 .sync 修饰符
    fullscreen: {
      type: Boolean,
      default: false,
    },
    // 是否允许切换全屏（允许后右上角会出现一个按钮）
    switchFullscreen: {
      type: Boolean,
      default: false,
    },
    // 点击确定按钮的时候是否关闭弹窗
    okClose: {
      type: Boolean,
      default: true,
    },
    // 可拖拽
    dialogDrag: {
      type: Boolean,
      default: true,
    },
    cancelText: {
      type: String,
      default: "取消",
    },
    okText: {
      type: String,
      default: "确定",
    },
  },
  data() {
    return {
      // 内部使用的 slots ，不再处理
      usedSlots: ["title"],
      // 实际控制是否全屏的参数
      innerFullscreen: this.fullscreen,
    };
  },
  computed: {
    ...mapState("setting", ["isMobile"]),
    // 一些未处理的参数或特殊处理的参数绑定到 t-modal 上
    _attrs() {
      let attrs = { ...this.$attrs };
      // 如果全屏就将宽度设为 100%
      if (this.innerFullscreen) {
        attrs["width"] = "100%";
      }
      return attrs;
    },
    modalClass() {
      return {
        "t-modal-box": true,
        fullscreen: this.innerFullscreen,
        "no-title": this.isNoTitle,
        "no-footer": this.isNoFooter,
        mobile: this.isMobile,
      };
    },
    modalStyle() {
      let style = {};
      // 如果全屏就将top设为 0
      if (this.innerFullscreen) {
        style["top"] = "0";
      }
      return style;
    },
    isNoTitle() {
      return this.title && this.allSlotsKeys.includes("title");
    },
    isNoFooter() {
      return this._attrs["footer"] === null;
    },
    slotsKeys() {
      return Object.keys(this.$slots).filter(
        (key) => !this.usedSlots.includes(key)
      );
    },
    scopedSlotsKeys() {
      return Object.keys(this.$scopedSlots).filter(
        (key) => !this.usedSlots.includes(key)
      );
    },
    allSlotsKeys() {
      return this.slotsKeys.concat(this.scopedSlotsKeys);
    },
    // 切换全屏的按钮图标
    fullscreenButtonIcon() {
      return this.innerFullscreen ? "fullscreen-exit" : "fullscreen";
    },
  },
  watch: {
    visible() {
      console.log(this.visible);
      if (this.visible) {
        this.innerFullscreen = this.fullscreen;
      }
    },
    innerFullscreen(val) {
      this.$emit("update:fullscreen", val);
    },
  },
  destroyed() {
    // console.log('destroyed')
  },
  methods: {
    getClass(clazz) {
      return { ...getClass(this), ...clazz };
    },
    getStyle(style) {
      return { ...getStyle(this), ...style };
    },
    close() {
      this.$emit("update:visible", false);
    },
    handleOk() {
      if (this.okClose) {
        this.close();
      }
    },
    handleCancel() {
      this.close();
    },
    /** 切换全屏 */
    toggleFullscreen() {
      this.innerFullscreen = !this.innerFullscreen;
    },
  },
};
</script>

<style lang="less" scoped="scoped">
.t-modal-box {
  /deep/.ant-modal {
    top: 0;
    padding: 0;
    height: 100vh;
  }
  /deep/.ant-modal-body {
    /* title 和 footer 各占 55px */
    height: calc(100vh - 42.6px - 53px);
    overflow: auto;
  }
  &.no-title,
  &.no-footer {
    /deep/.ant-modal-body {
      height: calc(100vh - 53px);
    }
  }

  &.no-title.no-footer {
    /deep/.ant-modal-body {
      height: 100vh;
    }
  }
  &.fullscreen {
    top: 0;
    left: 0;
    padding: 0;

    // 兼容1.6.2版本的antdv
    &.ant-modal {
      top: 0;
      padding: 0;
      height: 100vh;
    }

    &.ant-modal-content {
      height: 100vh;
      border-radius: 0;
      &.ant-modal-body {
        /* title 和 footer 各占 55px */
        height: calc(100% - 55px - 55px);
        overflow: auto;
      }
    }

    &.no-title,
    &.no-footer {
      .ant-modal-body {
        height: calc(100% - 55px);
      }
    }

    &.no-title.no-footer {
      .ant-modal-body {
        height: 100%;
      }
    }
  }

  .t-modal-title-row {
    .left {
      width: calc(100% - 56px - 56px);
    }

    .right {
      width: 56px;
      position: inherit;

      .ant-modal-close {
        right: 56px;
        color: rgba(0, 0, 0, 0.45);

        &:hover {
          color: rgba(0, 0, 0, 0.75);
        }
      }
    }
  }
}

@media (max-width: 767px) {
  .t-modal-box.fullscreen {
    margin: 0;
    max-width: 100vw;
  }
}
</style>
