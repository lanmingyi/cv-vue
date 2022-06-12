<!--
 * @Description: 流程图
 * @Author: 黄婷
 * @Date: 2021-01-18 15:17:26
 * @LastEditTime: 2021-09-16 09:15:43
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\bpmn\Viewer.vue
-->
<template>
  <div class="main">
    <div class="flex justify-between flex-wrap align-center">
      <a-button-group style="padding-left: 10px;">
        <a-tooltip class="item" effect="dark" title="放大" placement="bottom">
          <a-button size="default" @click="fitZoom(0.05)"
            ><i class="fa fa-search-plus"></i
          ></a-button>
        </a-tooltip>
        <a-tooltip class="item" effect="dark" title="缩小" placement="bottom">
          <a-button size="default" @click="fitZoom(-0.05)"
            ><i class="fa fa-search-minus"></i
          ></a-button>
        </a-tooltip>
      </a-button-group>
      <!-- 颜色 -->
      <div class="flex justify-between flex-wrap align-center">
        <color-checkbox-group
          :multiple="true"
          :disabled="true"
          class="margin-right-sm"
        >
          <color-checkbox color="#009688" value="1" />已完成
        </color-checkbox-group>
        <color-checkbox-group
          :multiple="true"
          :disabled="true"
          class="margin-right-sm"
        >
          <color-checkbox color="#ff0000" value="2" />进行中
        </color-checkbox-group>
        <color-checkbox-group
          :multiple="true"
          :disabled="true"
          class="margin-right-sm"
        >
          <color-checkbox color="#000000" value="3" />未执行
        </color-checkbox-group>
      </div>
    </div>
    <div class="bpmn-viewer my-bpmn-con">
      <div class="bpmn-viewer-container">
        <div ref="bpmnViewer" class="bpmn-viewer-content"></div>
      </div>
    </div>
    <!-- 节点信息 -->
    <a-card
      title="任务审批详情"
      :style="{
        top: taskTop + 'px',
        left: taskLeft + 'px',
        display: taskDisplay,
      }"
      class="task"
    >
      <!-- 只有一条数据的时候显示 -->
      <template v-if="taskConList && taskConList.length == 1">
        <div style="width: 350px;">
          <p class="task-item">
            <span class="task-title">任务名称 </span
            ><span class="task-content">{{ taskConList[0].taskName }}</span>
          </p>
          <p class="task-item">
            <span class="task-title">执 行 人 </span
            ><span class="task-content">{{ taskConList[0].assignee }}</span>
          </p>
          <p class="task-item">
            <span class="task-title">处理时间 </span
            ><span class="task-content">{{ taskConList[0].startTime }}</span>
          </p>
          <p class="task-item four">
            <span class="task-title">意 见 </span
            ><span class="task-content">{{ taskConList[0].message }}</span>
          </p>
        </div>
      </template>
      <!-- 多条数据显示table -->
      <template v-else>
        <a-table
          :columns="columns"
          :data-source="taskConList"
          bordered
          :pagination="{ hideOnSinglePage: true }"
          size="small"
        />
      </template>
    </a-card>
  </div>
</template>

<script>
import BpmnViewer from "bpmn-js/lib/Viewer";
import bpmnHelper from "./helper/BpmnHelper";
// 引入可拖拽js
import MoveModule from "diagram-js/lib/features/move";
import ModelingModule from "bpmn-js/lib/features/modeling";
import MoveCanvasModule from "diagram-js/lib/navigation/movecanvas";
import ColorCheckbox from "@/components/antd/checkbox/ColorCheckbox";
// import customControlsModule from '../js/customControls';
const forEach = require("lodash/forEach");
const ColorCheckboxGroup = ColorCheckbox.Group;
export default {
  props: ["params", "inProgress", "notInProgress", "nodeParam"],
  components: { ColorCheckbox, ColorCheckboxGroup },
  provide: function() {
    return {
      bpmnModeler: this.getBpmnModeler,
    };
  },
  data() {
    return {
      propsComponent: "CommonPropsReadonly",
      bpmnModeler: null,
      canvas: null,
      element: null,
      key: "1",
      defaultData: {
        "bpmn:StartEvent": "交易开始",
        "bpmn:EndEvent": "交易完成",
        "bpmn:IntermediateThrowEvent": "交易终止",
      },
      nodeList: [],
      taskConList: [],
      taskTop: 0,
      taskLeft: 0,
      taskDisplay: "none",
      zoom: 0,
      spinning: false,
      scale: 1.0,
      columns: [
        {
          title: "执行人",
          dataIndex: "assignee",
        },
        {
          title: "处理时间",
          dataIndex: "startTime",
        },
        {
          title: "处理意见",
          dataIndex: "message",
        },
      ],
    };
  },
  methods: {
    //初始化BpmnModeler
    initBpmnModeler() {
      let canvas = this.$refs.bpmnViewer;
      this.bpmnModeler = new BpmnViewer({
        container: canvas,
        additionalModules: [
          MoveModule, // 可以调整元素
          ModelingModule, // 基础工具 MoveModule、SetColor 等依赖于此
          MoveCanvasModule, // 移动整个画布
        ],
      });
      this.importBpmnXml();
    },
    //导入xml文档
    importBpmnXml() {
      const that = this;
      let bpmnXml = bpmnHelper.getBpmnTempate();
      if (that.params) {
        bpmnXml = that.params;
      }
      that.bpmnModeler.importXML(bpmnXml, function(err) {
        if (err) {
          console.log("bpmn文档导入失败");
        } else {
          const bpmnCanvas = that.bpmnModeler.get("canvas");
          // bpmnCanvas.zoom("fit-viewport", "auto");
          // 绑定监听事件
          that.success();
          that.setNodeColor();
          // that.fitViewport()
        }
      });
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
    // 缩放
    fitZoom(val) {
      let newScale = !val
        ? 1.0
        : this.scale + val <= 0.2
        ? 0.2
        : this.scale + val;
      this.bpmnModeler.get("canvas").zoom(newScale);
      this.scale = newScale;
    },
    // 渲染xml
    initDiagramAgain(actDeModelId, actDeModelKey, actDeModelName, xml) {
      let _tag = document.getElementsByClassName(
        "djs-direct-editing-parent"
      )[0];
      if (_tag) {
        _tag.style.display = "none";
      }
      if (actDeModelId) {
        this.initData = {
          id: actDeModelId,
          key: actDeModelKey,
          name: actDeModelName,
          xml: xml,
        };
      } else {
        this.getInitData();
      }
      this.bpmnModeler.importXML(xml, (err) => {
        if (err) {
          this.$Message.error("打开模型出错,请确认该模型符合Bpmn2.0规范");
        } else {
          // const bpmnCanvas = that.bpmnModeler.get('canvas')
          // bpmnCanvas.zoom("fit-viewport", "auto");
        }
        this.addModelerListener();
        this.setNodeColor();
        // this.fitViewport()
      });
    },
    // 设置节点属性
    setNodeColor() {
      let that = this;
      // 目的：将走过的结点变成绿色，正在走的结点变成红色
      // 此时得到的userTaskList 便是流程图中所有的节点的集合
      // 调用设置高亮颜色class方法,对不同的部分设置不同的class名，然后在css中设置样式
      let canvas = that.bpmnModeler.get("canvas");
      // 方法1   没有引入基础工具 MoveModule才使用
      // if(that.notInProgress&&that.notInProgress.length != 0) that.setNodeColors(that.notInProgress, "nodeSuccess", canvas);		//已走的节点
      // if(that.inProgress&&that.inProgress.length != 0) that.setNodeColors(that.inProgress, "nodeDoing", canvas);		//进行中节点
      // 方法2   可以移动节点改变位置 不采取
      // 实现步骤：1、找到页面里所有节点
      const elementRegistry = that.bpmnModeler.get("elementRegistry");
      let modeling = that.bpmnModeler.get("modeling");
      // 已完成的节点
      if (this.notInProgress && this.notInProgress.length != 0) {
        this.notInProgress.forEach((e) => {
          if (elementRegistry._elements[e]) {
            modeling.setColor(elementRegistry._elements[e].element, {
              stroke: "#009688",
            });
          }
        });
      }
      // 正在进行的节点
      if (this.inProgress && this.inProgress.length != 0) {
        this.inProgress.forEach((e) => {
          if (elementRegistry._elements[e]) {
            modeling.setColor(elementRegistry._elements[e].element, {
              stroke: "red",
            });
          }
        });
      }
    },
    // 设置高亮颜色的class
    setNodeColors(nodeCodes, colorClass, canvas) {
      for (let i = 0; i < nodeCodes.length; i++) {
        canvas.addMarker(nodeCodes[i], colorClass);
      }
    },
    getBpmnModeler() {
      // 初始化canvas
      this.bpmnModeler = new BpmnViewer({
        container: this.$refs.BpmnViewer,
        additionalModules: [
          MoveModule, // 可以调整元素
          ModelingModule, // 基础工具 MoveModule、SetColor 等依赖于此
          MoveCanvasModule, // 移动整个画布
        ],
      });
      return this.bpmnModeler;
    },
    // 渲染成功调用
    success() {
      this.addModelerListener();
      this.addEventBusListener();
    },
    // 节点监听
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
            // console.log('新增了shape');
            // 展示新增图形的属性
            that.key = e.element.id.replace("_label", "");
            that.propsComponent = bpmnHelper.getComponentByEleType(
              shape.type + "Readonly"
            );
            that.element = e.element;
            // console.log(that.element)
          } else if (event === "shape.move.end") {
            // console.log('移动了shape')
            // 展示新增图形的属性
            that.key = shape.id;
            that.propsComponent = bpmnHelper.getComponentByEleType(
              shape.type + "Readonly"
            );
            that.element = e.shape;
          } else if (event === "shape.removed") {
            // console.log('删除了shape')
            // 展示默认的属性
            that.propsComponent = "CommonPropsReadonly";
          }
        });
      });
      let eventBus = that.bpmnModeler.get("eventBus");
    },
    // 监听流程节点
    addEventBusListener() {
      // 监听 element
      let that = this;
      const eventBus = this.bpmnModeler.get("eventBus");
      const eventTypes = [
        "element.click",
        "element.changed",
        "selection.changed",
        "element.hover",
        "element.out",
      ];
      eventTypes.forEach(function(eventType) {
        eventBus.on(eventType, function(e) {
          if (eventType === "element.changed") {
            // 节点发生改变的时候
            that.elementChanged(e);
          } else if (eventType === "element.click") {
            if (!e || e.element.type == "bpmn:Process") {
              that.key = "1";
              that.propsComponent = "CommonPropsReadonly";
              that.element = e.element;
            } else {
              // 展示新增图形的属性
              that.key = e.element.id;
              that.propsComponent = bpmnHelper.getComponentByEleType(
                e.element.type + "Readonly"
              );
              that.element = e.element;
            }
          } else if (eventType === "element.hover") {
            //节点悬浮事件
            that.element = e.element;
            if (that.element.type === "bpmn:UserTask") {
              that.spinning = true;
              if (
                that.notInProgress &&
                ~that.notInProgress.indexOf(that.element.businessObject.id)
              ) {
                that
                  .$post("/workflow/apiFlowableModel/moveUserTaskUpper", {
                    procdefId: that.nodeParam.procdefId,
                    processInstanceId: that.nodeParam.processInstanceId,
                    nodeId: that.element.businessObject.id,
                  })
                  .then((res) => {
                    if (res.statusCode == 300) {
                      return;
                    }
                    that.taskConList = res;
                    // that.taskCon.user = res.assignee
                    // that.taskCon.msg = res.message
                    // that.taskCon.time = res.startTime
                    that.spinning = false;
                    that.taskDisplay = "block";
                  });
                // that.taskCon.user = that.element.businessObject.$attrs['flowable:assigneeName']
                // that.taskCon.name = that.element.businessObject.name
                that.taskTop = Number(that.element.y) + 50;
                that.taskLeft = Number(that.element.x) + 150;
              }
            }
          } else if (eventType === "element.out") {
            that.taskDisplay = "none";
          }
        });
      });
    },
    isInvalid(param) {
      // 判断是否是无效的值
      return param === null || param === undefined || param === "";
    },
    isSequenceFlow(type) {
      // 判断是否是线
      return type === "bpmn:SequenceFlow";
    },
    elementChanged(e) {
      const id = e.element.id.replace("_label", "");
      var shape = this.getShape(id);
      this.element = shape;
      const that = this;
      if (!shape) {
        // 若是shape为null则表示删除, 无论是shape还是connect删除都调用此处
        // console.log('无效的shape')
        // 上面已经用 shape.removed 检测了shape的删除, 要是删除shape的话这里还会被再触发一次
        // console.log('删除了shape和connect')
        return;
      }
      if (!this.isInvalid(shape.type)) {
        if (this.isSequenceFlow(shape.type)) {
          console.log("改变了线");
        } else {
          that.setDefaultProperties();
        }
      }
    },
    getShape(id) {
      var elementRegistry = this.bpmnModeler.get("elementRegistry");
      return elementRegistry.get(id);
    },
    setDefaultProperties() {
      const that = this;
      const { element } = that;
      if (element) {
        // 这里可以拿到当前点击的节点的所有属性
        const { type, businessObject } = element;
        const { name } = businessObject;
        if (that.verifyIsEvent(type)) {
          const eventType = businessObject.eventDefinitions
            ? businessObject.eventDefinitions[0]["$type"]
            : "";
        } else if (this.verifyIsTask(type)) {
          const taskType = type;
        }
        that.element["name"] = name || that.defaultData[element.type];
      }
    },
    verifyIsEvent(type) {
      return type.includes("Event");
    },
    verifyIsTask(type) {
      return type.includes("Task");
    },
  },
  mounted() {
    //初始化模型编辑器
    this.initBpmnModeler();
  },
};
</script>

<style lang="less">
@import "~bpmn-js/dist/assets/diagram-js.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
@import "~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
@import "./assets/css/vue-bmpn.css";
@import "./assets/css/font-awesome.min.css";

.djs-container .djs-palette,
.djs-context-pad {
  display: none !important;
}
.task .ant-card-grid {
  padding: 10px 20px;
  text-align: left !important;
}
.task {
  // width: 350px;
  min-width: 350px;
  position: absolute;
  font-size: 13px !important;
  .task-item {
    border: 1px solid #e2e2e2;
    line-height: 45px;
    padding: 0 5px;
    margin: 0;
    display: flex;
    &:not(.four) {
      border-bottom: none;
    }
    .task-title {
      display: inline-block;
      width: 80px;
      border-right: 1px solid #e2e2e2;
      margin-right: 10px;
    }
    .task-content {
      width: 250px;
    }
    .ant-card-head {
      min-height: 30px;
    }
    .ant-card .ant-card-body {
      padding: 10px;
      overflow: hidden;
    }
  }
}
/* .ant-card-head-title{
  padding: 10px 0 !important;
  font-size: 14px !important;
} */

.nodeSuccess {
  .djs-visual {
    > :nth-child(1) {
      stroke: #009688 !important;
    }
    > :nth-child(2) {
      fill: #009688 !important;
    }
  }
}
.nodeDoing {
  .djs-visual {
    > :nth-child(1) {
      stroke: red !important;
    }
  }
}
</style>
