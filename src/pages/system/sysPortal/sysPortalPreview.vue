<!--
 * @Description: 门户首页预览界面
 * @Author: 黄婷
 * @Date: 2021-05-20 18:13:04
 * @LastEditTime: 2021-08-06 10:07:24
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\system\sysPortal\sysPortalPreview.vue
-->
<template>
  <build-modal class="k-portal-pre" :value="jsonData" ref="KPortalPreview" />
</template>
<script>
import buildModal from "@/components/TopVUI/k-portal-design/build/index.vue";
// import { getQueryString } from "@/services/common";
export default {
  name: "KPortalPreview",
  data() {
    return {
      jsonData: {},
    };
  },
  props: { data: { type: Object } },
  components: { buildModal },

  mounted() {
		console.log(this.$route.meta)
    if (this.$route.meta.query.code) {
      this.getPortalClassifyList(this.$route.meta.query.code);
    } else this.jsonData = {};
  },
	watch: {
		$route: {
			handler (val) {
				if (this.$route.meta.query?.code) {
					this.getPortalClassifyList(this.$route.meta.query.code);
				} else this.jsonData = {};
			},
			deep: true,
			immediate: true
		}
	},
  //   watch: {
  //     $route(val) {
  //       console.log(val);
  //       console.log(
  //         this.$route.matched.filter((res) => {
  //           res.path.indexOf("sysPortalPreview");
  //         })
  //       );
  //       if (this.$route.meta.query.code) {
  //         this.getPortalClassifyList(this.$route.meta.query.code);
  //       } else this.jsonData = {};
  //     },
  //   },
  methods: {
    getPortalClassifyList(m) {
      //根据模板分类Id获取数据
      this.$post("/system/sysPortal/getPortalJsonDataByTemplateClassiftCode", {
        templateClassiftCode: m,
      }).then((res) => {
        this.jsonData = res;
      });
    },
  },
};
</script>
<style lang="less">
.k-portal-pre {
  .grid-col {
    // margin-bottom: 24px;
  }
}
</style>
