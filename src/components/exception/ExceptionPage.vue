<!--
 * @Description: 错误页面
 * @Author: lmy
 * @Date: 2021-06-02 13:38:08
 * @LastEditTime: 2021-09-15 11:50:20
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <div :class="['exception-page', { mobile: isMobile }]">
    <div class="img">
      <img :src="config[type].img" />
    </div>
    <div class="content">
      <h1>{{ config[type].title }}</h1>
      <div class="desc">{{ config[type].desc }}</div>
      <div class="action">
        <a-button type="primary" @click="backHome">返回首页</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Config from "./typeConfig";

export default {
  name: "ExceptionPage",
  props: ["type", "homeRoute"],
  data() {
    return {
      config: Config,
    };
  },
  computed: {
    ...mapState("setting", ["isMobile"]),
  },
  methods: {
    backHome() {
      if (this.homeRoute) {
        this.$router.push(this.homeRoute);
      }
      this.$emit("backHome", this.type);
    },
  },
};
</script>

<style lang="less" scoped>
.exception-page {
  border-radius: 4px;
  // margin: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: @base-bg-color;
  flex-wrap: wrap;
  .img {
    padding-right: 52px;
    zoom: 1;
    img {
      max-width: 430px;
    }
  }
  .content {
    h1 {
      color: #434e59;
      font-size: 72px;
      font-weight: 600;
      line-height: 72px;
      margin-bottom: 24px;
    }
    .desc {
      color: @text-color-second;
      font-size: 20px;
      line-height: 28px;
      margin-bottom: 16px;
    }
  }
}
</style>
<style lang="less" scoped>
.exception-page {
  &.mobile {
    .img {
      padding: 0;
    }
  }
}
</style>
