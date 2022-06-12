<!--
 * @Description: 面包屑
 * @Author: 黄婷
 * @Date: 2021-06-02 13:38:08
 * @LastEditTime: 2021-09-15 11:58:25
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\tool\Breadcrumb.vue
-->
<template>
  <a-breadcrumb class="breadcrumb">
    <!-- <a-breadcrumb-item>
      <router-link class="breadcrumb-a" to="/system/portal/index"
        ><a-icon
          type="home"
          style="margin: 0 9px 0 3px;font-size: 13px;"
        />首页</router-link
      >
    </a-breadcrumb-item> -->
    <a-breadcrumb-item v-for="(item, index) in breadList" :key="index">
      <span> {{ item }}</span>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      breadList: [],
    };
  },
  created() {
    this.getBreadcrumb();
  },
  methods: {
    getBreadcrumb() {
      this.breadList = [];
      // this.breadList.push({name: 'index', path: '/dashboard/', meta: {title: '首页'}})
      if (
        this.$route.meta.breadcrumb &&
        this.$route.meta.breadcrumb.length > 0
      ) {
        this.breadList = this.$route.meta.breadcrumb;
      } else {
        this.name = this.$route.name;
        this.$route.matched.forEach((item) => {
          // item.name !== 'index' && this.breadList.push(item)
          this.breadList.push(item.meta.title);
        });
      }
    },
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    },
  },
};
</script>

<style lang="less"></style>
