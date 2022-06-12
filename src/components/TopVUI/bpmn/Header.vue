<!--
 * @Description: 流程设计界面的操作按钮
 * @Author: 黄婷
 * @Date: 2021-01-18 15:17:26
 * @LastEditTime: 2021-09-16 09:16:56
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\bpmn\Header.vue
-->
<template>
  <div>
    <a-button-group>
      <a-tooltip class="item" effect="dark" title="保存" placement="bottom">
        <a-button type="primary" size="default" @click="deploy"
          ><i class="fa fa-save"> 保存</i></a-button
        >
      </a-tooltip>
      <!-- <a-tooltip class="item" effect="dark" title="保存草稿" placement="bottom">
        <a-button type="primary" size="default" @click="save"><i class="fa fa-save"> 保存草稿</i></a-button>
      </a-tooltip> -->
      <!--      <a-tooltip class="item" effect="dark" title="打开流程文件" placement="bottom">
        <a-button type="primary" size="default"><i class="fa fa-folder-open"></i></a-button>
      </a-tooltip> -->
      <a-tooltip effect="dark" title="打开流程文件" placement="bottom">
        <a-upload
          action=""
          :showUploadList="false"
          :before-upload="openBpmn"
          style="display:inline-block;"
        >
          <a-button type="primary" size="default"
            ><i class="fa fa-folder-open"></i
          ></a-button>
        </a-upload>
      </a-tooltip>
      <a-tooltip
        class="item"
        effect="dark"
        title="创建新流程图"
        placement="bottom"
      >
        <a-button type="primary" size="default" @click="reset"
          ><i class="fa fa-plus-circle"></i
        ></a-button>
      </a-tooltip>
      <a-tooltip
        class="item"
        effect="dark"
        title="下载流程图"
        placement="bottom"
      >
        <a-button type="primary" size="default" @click="downloadSvg"
          ><i class="fa fa-picture-o"></i
        ></a-button>
      </a-tooltip>
      <a-tooltip
        class="item"
        effect="dark"
        title="下载流程文件"
        placement="bottom"
      >
        <a-button type="primary" size="default" @click="downloadBpmn"
          ><i class="fa fa-download"></i
        ></a-button>
      </a-tooltip>
      <a-tooltip class="item" effect="dark" title="撤销" placement="bottom">
        <a-button size="default" @click="undo"
          ><i class="fa fa-rotate-left"></i
        ></a-button>
      </a-tooltip>
      <a-tooltip class="item" effect="dark" title="恢复" placement="bottom">
        <a-button size="default" @click="redo"
          ><i
            class="fa fa-rotate-right"
            :class="!canRedo ? 'default-undo' : ''"
          ></i
        ></a-button>
      </a-tooltip>
      <a-tooltip class="item" effect="dark" title="放大" placement="bottom">
        <a-button size="default" @click="zoom(0.05)"
          ><i class="fa fa-search-plus"></i
        ></a-button>
      </a-tooltip>
      <a-tooltip class="item" effect="dark" title="缩小" placement="bottom">
        <a-button size="default" @click="zoom(-0.05)"
          ><i class="fa fa-search-minus"></i
        ></a-button>
      </a-tooltip>
      <a-tooltip
        class="item"
        effect="dark"
        title="自适应屏幕"
        placement="bottom"
      >
        <a-button size="default" @click="fitViewport"
          ><i class="fa fa-hand-pointer-o"></i
        ></a-button>
      </a-tooltip>
      <a-tooltip
        class="item"
        effect="dark"
        title="关闭"
        placement="bottom"
        v-if="bpmnClose"
      >
        <a-button
          type="danger"
          size="default"
          @click="
            () => {
              $emit('close');
            }
          "
          ><i class="fa fa-close"></i
        ></a-button>
      </a-tooltip>
    </a-button-group>
  </div>
</template>

<script>
export default {
  name: "ViewerHeader",
  data() {
    return {
      scale: 1.0,
      canRedo: false,
    };
  },
  props: {
    processData: {
      type: Object,
    },
    modeler: {
      type: Object,
    },
    bpmnClose: {
      type: Boolean,
      default: true,
    },
  },
  components: {},
  methods: {
    // 保存
    deploy() {
      let that = this;
      let _xml;
      let _svg;
      this.modeler.saveXML((err, xml) => {
        if (err) {
          console.error(err);
        }
        _xml = xml;
        this.$emit("save", _xml);
      });
      this.modeler.saveSVG((err, svg) => {
        if (err) {
          console.error(err);
        }
        _svg = svg;
      });
    },
    // 保存草稿
    save() {
      let that = this;
      let _xml;
      let _svg;
      this.modeler.saveXML((err, xml) => {
        if (err) {
          console.error(err);
        }
        _xml = xml;
      });
      this.modeler.saveSVG((err, svg) => {
        if (err) {
          console.error(err);
        }
        _svg = svg;
      });
      console.log(_xml);
      that.$emit("processSave", { xmlStr: _xml, svgStr: _svg });
    },
    //新建
    reset() {
      this.$emit("restart");
    },
    downloadSvg() {
      this.$emit("handleExportSvg");
    },
    downloadBpmn() {
      this.$emit("handleExportBpmn");
    },
    openBpmn(e) {
      this.$emit("openBpmn", e);
    },
    undo() {
      this.modeler.get("commandStack").undo();
      this.canRedo = this.modeler.get("commandStack").canRedo();
    },
    fitViewport() {
      this.$emit("fitViewport");
    },
    redo() {
      if (!this.canRedo) {
        return;
      }
      this.modeler.get("commandStack").redo();
      this.canRedo = this.modeler.get("commandStack").canRedo();
    },
    // 放大缩小
    zoom(val) {
      let newScale = !val
        ? 1.0
        : this.scale + val <= 0.2
        ? 0.2
        : this.scale + val;
      this.modeler.get("canvas").zoom(newScale);
      this.scale = newScale;
    },
  },
};
</script>

<style scoped></style>
