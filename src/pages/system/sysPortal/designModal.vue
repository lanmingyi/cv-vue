<!--
 * @Description: 门户拖拽设计
 * @Author: lmy
 * @Date: 2021-05-21 17:19:40
 * @LastEditTime: 2021-08-06 09:58:41
 * @LastEditors: lmy
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\pages\system\sysPortal\designModal.vue
-->
<template>
  <t-drawer
    class="k-dr"
    :visible="visible"
    :closable="false"
    :fullscreen="fullscreen"
    :switchFullscreen="fullscreen"
    @close="
      () => {
        $emit('cancel');
      }
    "
  >
    <KPortalDesign
      ref="KPortalDesign"
      :menu-data="menuData"
      :jsonData="jsonData"
      @close="
        () => {
          $emit('cancel');
        }
      "
      @save="
        (value) => {
          handleOk(value);
        }
      "
    ></KPortalDesign>
  </t-drawer>
</template>

<script>
import KPortalDesign from "@/components/TopVUI/k-portal-design/design";

export default {
  props: { visible: { type: Boolean } },
  components: { KPortalDesign },
  data() {
    return {
      fullscreen: true,
      menuData: {},
      templateUuid: "",
      jsonData: {},
    };
  },
  methods: {
    handleOk(value) {
      this.$post("/system/sysPortal/update", {
        uuid: this.templateUuid,
        portalJsonData: value,
      }).then((res) => {
        if (res.statusCode === 200) {
          this.$message.success(res.message ? res.message : "操作成功", 1.5);
          this.$emit("ok");
        } else {
          this.$message.error(res.message, 1.5);
        }
      });
    },
    getDesignData(val) {
      this.templateUuid = val.uuid;
      this.menuData = val.templateJsonData
        ? JSON.parse(val.templateJsonData)
        : {};
      console.log(this.menuData);
      this.jsonData = val.portalJsonData
        ? JSON.parse(val.portalJsonData)
        : {
            list: [],
          };
    },
  },
};
</script>

<style lang="scss">
.k-dr {
  .ant-drawer-body {
    padding: 0 !important;
  }
}
</style>
