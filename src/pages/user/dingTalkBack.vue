<!--
 * @Description: 钉钉账号绑定结果页
 * @Author: 黄婷
 * @Date: 2021-06-07 09:27:28
 * @LastEditTime: 2021-09-18 11:46:29
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\user\dingTalkBack.vue
-->
<template>
  <div>
    <div
      :class="['exception-page', { mobile: isMobile }]"
      :style="`min-height: ${minHeight}`"
    >
      <div class="img">
        <img src="~@/assets/img/500.svg" />
      </div>
      <div class="content">
        <h1>{{ result.title }}</h1>
        <!-- <div class="desc">{{ config[type].desc }}</div> -->
        <div class="action">
          <a-button type="primary" @click="navBack">返回</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getQueryString } from "@/services/common";
import { mapGetters, mapState } from "vuex";
export default {
  data() {
    return {
      result: {
        title: "",
        desc: "",
      },
    };
  },
  computed: {
    ...mapState("setting", ["pageMinHeight", "isMobile"]),
    ...mapGetters(["userInfo"]),
    minHeight() {
      return this.pageMinHeight ? this.pageMinHeight + "px" : "100vh";
    },
  },
  mounted() {
    if (this.$route.query.code) {
      const code = this.$route.query.code;
      this.bindCpAccount(code);
    }
  },
  methods: {
    // 绑定账户
    bindCpAccount(code) {
      const uuid = this.userInfo.uuid;
      this.$post("/system/dingding/ddLogin.api", {
        uuid: uuid,
        type: "binding",
        code: code,
      }).then((res) => {
        this.result.title = res.message;
      });
    },
    navBack() {
      this.$router.go(-1);
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
      font-size: 36px;
      font-weight: 600;
      line-height: 36px;
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
