<!--
 * @Description: 阿里图标离线版
 * @Author: lmy
 * @Date: 2021-04-16 19:01:34
 * @LastEditTime: 2021-09-18 15:29:21
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <span
    :class="['icon', 'iconfont', icon, type]"
    @click="
      () => {
        $emit('change');
      }
    "
  ></span>
</template>

<script>
export default {
  name: "IconFonts",
  props: {
    icon: {
      type: String,
    },
    type: {
      style: String,
      default: "middle",
    },
  },
  data() {
    return {};
  },
};
</script>

<style scoped="scoped">
@import "~@/assets/IconFont/iconfont.css";
.iconfont {
  min-width: 14px;
  margin-right: 10px;
  font-size: 14px;
  -webkit-transition: font-size 0.15s cubic-bezier(0.215, 0.61, 0.355, 1),
    margin 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: font-size 0.15s cubic-bezier(0.215, 0.61, 0.355, 1),
    margin 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.small {
  font-size: 14px;
}
.middle {
  font-size: 18px;
}
.big {
  font-size: 20px;
}
</style>
