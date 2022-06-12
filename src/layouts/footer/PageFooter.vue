<!--
 * @Description: 页脚
 * @Author: 黄婷
 * @Date: 2021-06-02 13:38:08
 * @LastEditTime: 2021-09-18 13:34:26
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\layouts\footer\PageFooter.vue
-->
<template>
  <div class="footer">
    <div class="copyright">
      Copyright <a-icon type="copyright" /> {{ systemVersionPublishDate }}
      <a class="companyName" :href="companyWebsite" target="_blank">{{
        companyName
      }}</a>
    </div>
    <div class="links">
      <p class="version">{{ systemVersion }}</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "PageFooter",
  computed: {
    ...mapGetters(["configData"]),
    systemVersionPublishDate() {
      let index = this.configData.findIndex(
        (item) => item.code === "systemVersionPublishDate"
      );
      if (index >= 0) {
        return this.configData[index].value;
      } else {
        return "2021";
      }
    },
    companyWebsite() {
      let index = this.configData.findIndex(
        (item) => item.code === "companyWebsite"
      );
      if (index >= 0) {
        return this.configData[index].value;
      } else {
        return "https://www.zuoyo.com";
      }
    },
    companyName() {
      let index = this.configData.findIndex(
        (item) => item.code === "companyName"
      );
      if (index >= 0) {
        return this.configData[index].value;
      } else {
        return "湖南佐佑时代科技有限公司";
      }
    },
    systemVersion() {
      let index = this.configData.findIndex(
        (item) => item.code === "systemVersion"
      );
      if (index >= 0) {
        return this.configData[index].value;
      } else {
        return "版本：V3.2.0【Spring Cloud微服务版】";
      }
    },
  },
};
</script>

<style lang="less" scoped>
.footer {
  padding: 0 16px;
  margin: 0 0 10px;
  text-align: center;
  position: relative;
  .links {
    margin-bottom: 8px;
  }
  .copyright {
    text-align: center;
    color: rgba(0, 0, 0, 0.45);
    font-size: 13px;
    .companyName {
      color: rgba(0, 0, 0, 0.45);
    }
    .companyName:hover {
      color: @primary-color;
    }
  }
  .version {
    position: absolute;
    right: 5px;
    top: 0px;
    text-align: right;
    color: rgba(0, 0, 0, 0.45);
    font-size: 12px;
  }
}
</style>
