<!--
 * @Description: 
 * @Author: lmy
 * @Date: 2021-06-02 13:38:08
 * @LastEditTime: 2021-08-26 16:56:22
 * @LastEditors: lmy
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\form\formModule\design.vue
-->
<template>
  <t-drawer
    class="t-dr"
    :visible="visibleDetail"
    :closable="false"
    :fullscreen="fullscreen"
    :switchFullscreen="fullscreen"
    @close="
      () => {
        $emit('cancel');
      }
    "
  >
		<a-spin :spinning="$store.state.loadding" tip="修改中...">
			<form-view
				ref="formView"
				:tName="tName"
				@close="
					() => {
						$emit('cancel');
					}
				"
				@save="
					() => {
						$emit('ok');
					}
				"
			></form-view>
		</a-spin>
  </t-drawer>
</template>

<script>
import formView from "@/components/TopVUI/k-form-design/packages/KFormDesign/form.vue";
export default {
  components: {
    formView,
  },
  props: {
    visibleDetail: {
      type: Boolean,
    },
  },
  data() {
    return {
      fullscreen: true,
      tName: "",
    };
  },
  computed: {},
  methods: {
    getData(e) {
      this.tName = e;
      if (this.$refs.formView) {
        this.$refs.formView.loadFormData(e);
      }
    },
  },
};
</script>

<style lang="less">
.t-dr .ant-drawer-body {
  padding: 0 !important;
}
</style>
