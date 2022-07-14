<!--
 * @Description: 门户首页预览界面
 * @Author: lmy
 * @Date: 2021-05-20 18:13:04
 * @LastEditTime: 2021-08-06 09:54:15
 * @LastEditors: lmy
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\system\sysPortal\preview.vue
-->
<template>
  <build-modal ref="KPortalBuild" />
</template>
<script>
import buildModal from "@/components/TopVUI/k-portal-design/build/index.vue";

export default {
  name: "KPortalBuild",
  data() {
    return {
      visible: false,
    };
  },
  props: { data: { type: Object } },
  components: { buildModal },
  mounted() {
    this.getPortalClassifyList();
  },
  methods: {
    getPortalClassifyList(m) {
      //根据模板分类Id获取数据
      this.$post(
        "/system/sysPortalTemplate/getListDataByTemplateClassiftUuid",
        {
          templateClassiftUuid: m.classifyUuid,
        }
      ).then((res) => {
        this.sysPortalTemplateList = res;
      });
    },
  },
};
</script>
<style lang="less"></style>
