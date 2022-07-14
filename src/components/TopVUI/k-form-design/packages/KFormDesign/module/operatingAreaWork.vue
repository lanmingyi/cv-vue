<!--
 * @Description: 头部
 * @Author: lmy
 * @Date: 2019-12-30 00:37:05
 * @LastEditors: lmy
 * @LastEditTime: 2021-09-14 09:16:14
 -->
<template>
  <div class="operating-area">
    <!-- 头部操作按钮区域 start -->
    <!-- 操作左侧区域 start -->
    <div class="left-btn-box">
      <a-button icon="play-circle" type="link" @click="$emit('handleSave')">
        保存
      </a-button>
      <a-button icon="play-circle" type="link" @click="$emit('handlePreview')">
        预览
      </a-button>
      <a-button
        icon="download"
        type="link"
        @click="$emit('handleOpenImportJsonModal')"
      >
        导入
      </a-button>
      <a-button icon="eye" type="link" @click="$emit('handleOpenJsonModal')">
        查看json
      </a-button>
      <a-button
        class="copy-btn-main"
        icon="copy"
        type="link"
        @click="$emit('handleOpenCodeModal')"
      >
        生成代码
      </a-button>
      <a-button
        v-if="emptyElement"
        class="delete-btn"
        icon="delete"
        type="link"
        @click="$emit('handleReset')"
      >
        清空
      </a-button>
      <!-- 按钮左侧插槽 start -->
      <slot name="left-action"></slot>
      <!-- 按钮左侧插槽 end -->
    </div>
    <!-- 操作左侧区域 end -->

    <!-- 操作右侧区域 start -->
    <div class="right-btn-box">
      <!-- 按钮右侧插槽 start -->
      <slot name="right-action"></slot>
      <!-- 按钮右侧插槽 end -->

      <a-tooltip title="关闭">
        <a v-if="toolbars.includes('close')" @click="$emit('handleClose')">
          <a-icon type="close" />
        </a>
      </a-tooltip>
    </div>
    <!-- 操作右侧区域 end -->

    <!-- 头部操作按钮区域 end -->
  </div>
  <!-- 操作区域 start -->
</template>
<script>
export default {
  props: {
    toolbars: {
      type: Array,
      default: () => [
        "save",
        "preview",
        "importJson",
        "exportJson",
        "exportCode",
        "reset",
        "close",
      ],
    },
    showToolbarsText: {
      type: Boolean,
      default: false,
    },
    emptyElement: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
