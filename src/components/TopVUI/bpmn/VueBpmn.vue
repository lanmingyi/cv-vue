<!--
 * @Description: 表单流程设计
 * @Author: 黄婷
 * @Date: 2021-01-18 15:17:26
 * @LastEditTime: 2021-09-16 09:11:27
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\bpmn\VueBpmn.vue
-->
<template>
  <div class="main">
    <div class="bpmn-viewer">
      <!-- 顶部操作按钮 -->
      <vue-header
        ref="header"
        class="bpmn-viewer-header"
        :processData="initData"
        :modeler="bpmnModeler"
        @save="saveData"
        @restart="restart"
        @handleExportSvg="handleExportSvg"
        @handleExportBpmn="handleExportBpmn"
        @processSave="processSave"
        @fitViewport="fitViewport"
        @openBpmn="openBpmn"
        @close="
          () => {
            $emit('close');
          }
        "
      ></vue-header>
      <div class="bpmn-viewer-container">
        <div class="bpmn-viewer-content" ref="bpmnViewer"></div>
      </div>
    </div>
    <!-- 设计面板属性配置 -->
    <bpmn-panel
      ref="bpmnPanel"
      v-if="bpmnModeler"
      :modeler="bpmnModeler"
      :process="initData"
      :isEdit="isEdit"
      @updateProcesName="updateProcesName"
    ></bpmn-panel>
  </div>
</template>

<script>
import templateXml from "./data/template";
import BpmnModeler from "bpmn-js/lib/Modeler";
// import customTranslate from "./data/translate/customTranslate";
import customControlsModule from "./customControls";
import customTranslate from "./customTranslate/customTranslate";
import VueHeader from "./Header";
import BpmnPanel from "./panel/index";
import activitiModele from "./data/activiti.json";
import flowableModdle from "./data/flowable.json";
import BpmData from "./data/BpmData";
import "./assets/css/vue-bmpn.css";
import "./assets/css/font-awesome.min.css";
export default {
  name: "VueBpmn",
  data() {
    return {
      bpmnModeler: null,
      initTemplate: "",
      initData: {},
      formList: [],
      zoom: 1,
    };
  },
  props: {
    product: String,
    formFeildList: Array,
    isEdit: Boolean,
  },
  components: {
    VueHeader,
    BpmnPanel,
  },
  mounted() {
    this.getInitData();
    this.init();
  },
  methods: {
    updateProcesName(e) {
      this.initData.name = e;
    },
    // 初始化
    getInitData() {
      let processId = new Date().getTime();
      this.initTemplate = templateXml.initTemplate(processId);
      this.initData = {
        id: "process" + processId,
        key: "process" + processId,
        name: "流程" + processId,
        xml: this.initTemplate,
				permissionType: 'all'
      };
    },
    init() {
      // 支持activiti和flowable
      let _moddleExtensions = this.getModdleExtensions();
      // 获取画布 element
      this.canvas = this.$refs.bpmnViewer;
      // 创建Bpmn对象
      var customTranslateModule = {
        translate: ["value", customTranslate],
      };
      this.bpmnModeler = new BpmnModeler({
        container: this.canvas,
        additionalModules: [customTranslateModule, customControlsModule],
        moddleExtensions: _moddleExtensions,
      });
      // 初始化建模器内容
      this.initDiagram(this.initTemplate);
      this.adjustPalette(); //自定义
    },
    // 根据xml进行渲染
    initDiagram(xml) {
      this.bpmnModeler.importXML(xml, (err) => {
        if (err) {
          // this.$Message.error("打开模型出错,请确认该模型符合Bpmn2.0规范");
        } else {
        }
      });
    },
    /* 编辑时流程数据设置*/
    initDiagramAgain(actDeModelKey, actDeModelName, xml, permissionType, permissionValue) {
      // console.log(actDeModelKey, actDeModelName, xml);
      let _tag = document.getElementsByClassName(
        "djs-direct-editing-parent"
      )[0];
      if (_tag) {
        _tag.style.display = "none";
      }
      if (actDeModelKey) {
        this.initData = {
          id: actDeModelKey,
          key: actDeModelKey,
          name: actDeModelName,
          xml: xml,
					permissionType: permissionType,
					permissionValue: permissionValue
        };
      } else {
        this.getInitData();
      }
      this.bpmnModeler.importXML(this.initData.xml, (err) => {
        if (err) {
          this.adjustPalette();
          this.$Message.error("打开模型出错,请确认该模型符合Bpmn2.0规范");
        } else {
          this.adjustPalette();
        }
        this.addModelerListener();
      });
    },
    // 获取表单数据
    getFormLists(e) {
      this.formList = e;
      this.$refs.bpmnPanel.getFormList(this.formList);
    },
    // 更新表单数据
    updateFormList(e) {
      // console.log(e);
      this.$refs.bpmnPanel.updateFormLists(e);
    },
    addModelerListener() {
      // 监听 modeler
      const bpmnjs = this.bpmnModeler;
      const that = this;
      // 'shape.removed', 'connect.end', 'connect.move'
      const events = ["shape.added", "shape.move.end", "shape.removed"];
      events.forEach(function(event) {
        that.bpmnModeler.on(event, (e) => {
          var elementRegistry = bpmnjs.get("elementRegistry");
          var shape = e.element ? elementRegistry.get(e.element.id) : e.shape;
          // console.log(shape)
          if (event === "shape.added") {
            // 展示新增图形的属性
            // that.key = e.element.id.replace('_label', '');
            // that.propsComponent = bpmnHelper.getComponentByEleType(shape.type);
            // that.element = e.element;
            console.log(that.element);
          } else if (event === "shape.move.end") {
            // 展示新增图形的属性
            // that.key = shape.id;
            // that.propsComponent = bpmnHelper.getComponentByEleType(shape.type);
            // that.element = e.shape;
          } else if (event === "shape.removed") {
            // console.log('删除了shape')
            // // 展示默认的属性
            // that.propsComponent = 'CommonProps'
          }
        });
      });
    },
    // 打开流程图
    openBpmn(file) {
      const reader = new FileReader();
      reader.readAsText(file, "utf-8");
      reader.onload = () => {
        this.createNewDiagram(reader.result);
      };
      return false;
    },
    async createNewDiagram(data) {
      // 将字符串转换成图显示出来
      // xml = xml.replace(/</g, '&lt;')
      // data = data.replace(/>/g, '&gt;')
      data = data.replace(/<!\[CDATA\[(.+)]]>/g, "&lt;![CDATA[$1]]&gt;");
      data = data.replace(/&#34;/g, '"');
      try {
        await this.bpmnModeler.importXML(data);
        // this.fillColor()
      } catch (err) {
        console.error(err.message, err.warnings);
      }
    },
    getProcessElement() {
      return this.bpmnModeler.getDefinitions().rootElements[0];
    },
    // 下载
    downloadFile(filename, data, type) {
      var a = document.createElement("a");
      var url = window.URL.createObjectURL(new Blob([data], { type: type }));
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    },
    // 导出XML
    async handleExportBpmn() {
      try {
        let { xml } = await this.bpmnModeler.saveXML({ format: true });
        xml = xml.replace(/&lt;/g, "<");
        xml = xml.replace(/&gt;/g, ">");
        this.downloadFile(
          `${this.getProcessElement().name}.xml`,
          xml,
          "application/xml"
        );
        return xml;
      } catch (err) {
        console.log(err);
      }
    },
    // 导出SVG
    async handleExportSvg() {
      try {
        const { svg } = await this.bpmnModeler.saveSVG({ format: true });
        this.downloadFile(this.getProcessElement().name, svg, "image/svg+xml");
        return svg;
      } catch (err) {
        console.log(err);
      }
    },
    // 让图能自适应屏幕
    fitViewport() {
      this.zoom = this.bpmnModeler.get("canvas").zoom("fit-viewport");
      const bbox = document.querySelector(".main .viewport").getBBox();
      const currentViewbox = this.bpmnModeler.get("canvas").viewbox();
      const elementMid = {
        x: bbox.x + bbox.width / 2 - 65,
        y: bbox.y + bbox.height / 2,
      };
      this.bpmnModeler.get("canvas").viewbox({
        x: elementMid.x - currentViewbox.width / 2,
        y: elementMid.y - currentViewbox.height / 2,
        width: currentViewbox.width,
        height: currentViewbox.height,
      });
      this.zoom = (bbox.width / currentViewbox.width) * 1.8;
    },
    setEncoded(type, data) {
      const encodedData = encodeURIComponent(data);
      if (data) {
        if (type === "XML") {
          return {
            filename: "diagram.bpmn20.xml",
            href: "data:application/bpmn20-xml;charset=UTF-8," + encodedData,
            data: data,
          };
        }
        if (type === "BPMN") {
          return {
            filename: "diagram.bpmn",
            href: "data:application/bpmn20-xml;charset=UTF-8," + encodedData,
            data: data,
          };
        }
        if (type === "SVG") {
          this.initData.svg = data;
          return {
            filename: "diagram.svg",
            href: "data:application/text/xml;charset=UTF-8," + encodedData,
            data: data,
          };
        }
      }
    },
    // 保存时获取XML数据
    saveData(data) {
      let formData = this.$refs.bpmnPanel.getFormData();
      let parameters = {
        processId: formData.id,
        processKey: formData.key,
        processName: formData.name,
        description: formData.description,
        xml: data,
        formBtnList: formData["formBtnList"],
        formFieldList: formData.formFieldList,
        formNoticeList: formData.formNoticeList,
        permissionType: formData.permissionType,
        permissionValue: formData.permissionValue,
      };
      this.$emit("bpmSave", parameters);
    },
    save() {
      this.$refs.header.deploy();
    },
    // 获取流程数据
    processSave(data) {
      let initData = this.initData;
      data.procId = initData.key;
      data.name = initData.name;
      this.$emit("processSave", data);
    },
    // 新建
    restart() {
      let _tag = document.getElementsByClassName(
        "djs-direct-editing-parent"
      )[0];
      if (_tag) {
        _tag.style.display = "none";
      }
      let processId = new Date().getTime();
      this.initTemplate = templateXml.initTemplate(processId);
      this.initData = {
        id: "process" + processId,
        key: "process" + processId,
        name: "流程" + processId,
        xml: this.initTemplate,
      };
      this.initDiagram(this.initTemplate);
    },
    getModdleExtensions() {
      let moddleExtensions = {};
      console.log(this.product);
      if (this.product == "flowable") {
        moddleExtensions = {
          flowable: flowableModdle,
        };
      }
      if (this.product == "activiti") {
        moddleExtensions = {
          activiti: activitiModele,
        };
      }
      return moddleExtensions;
    },
    // 左侧工具栏
    adjustPalette() {
      try {
        console.log(this.canvas.children[0]);
        // 获取 bpmn 设计器实例
        const djsPalette = this.canvas.children[0].children[1].children[4];
        const palette = djsPalette.children[0];
        const allGroups = palette.children;
        // allGroups[0].style["display"] = "none";
        allGroups[4].style["display"] = "none";
        allGroups[5].style["display"] = "none";
        // allGroups[6].style["display"] = "none";
        allGroups[7].style["display"] = "none";
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style scoped>
@import "~bpmn-js/dist/assets/diagram-js.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
@import "./assets/css/vue-bmpn.css";
@import "./assets/css/font-awesome.min.css";
.main {
  display: flex;
  height: calc(100vh - 50px - 54px);
}
/deep/ .djs-container .djs-palette {
  display: block !important;
}
/deep/ .djs-context-pad {
  display: block !important;
}
</style>
