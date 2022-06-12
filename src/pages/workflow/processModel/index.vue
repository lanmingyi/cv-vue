<template>
  <a-card :bordered="false">
    <div class="toolbar flex justify-between flex-wrap" style="width: 100%;">
      <div class="table-operator">
        <a-button class="cu-btn-primary" icon="plus" @click="handleAdd"
          >新建流程</a-button
        >
      </div>
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <div class="flex justify-between flex-wrap">
            <a-form-item label="">
              <a-input v-model="queryParam.userName" placeholder="流程名称" />
            </a-form-item>
            <a-form-item label="">
              <a-input-number
                v-model="queryParam.cellphone"
                placeholder="流程编码"
                style="width: 100%"
              />
            </a-form-item>
            <div class="table-page-search-submitButtons flex">
              <a-button
                class="cu-btn-primary"
                @click="$refs.table.refresh(true)"
                >查询</a-button
              >
              <a-button
                class="cu-btn-filter"
                @click="() => (this.queryParam = {})"
                >重置</a-button
              >
            </div>
          </div>
        </a-form>
      </div>
    </div>
    <s-table
      ref="table"
      :columns="columns"
      :data="loadData"
      bordered
      :rowSelection="rowSelection"
      rowKey="id"
      showPagination="auto"
      :customRow="rowClick"
      :rowClassName="rowClassName"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">流程设计</a>
          <a-divider type="vertical" />
          <a @click="handleSub(record)">部署发布</a>
          <a-divider type="vertical" />
          <a @click="handleSub(record)">导出</a>
          <a-divider type="vertical" />
          <a @click="handleSub(record)">删除</a>
        </template>
      </span>
    </s-table>
    <design-form
      ref="createModal"
      :visible="visible"
      :loading="confirmLoading"
      :model="mdl"
      @cancel="handleCancel(0)"
      @ok="handleOk"
    ></design-form>
  </a-card>
</template>

<script>
import moment from "moment";
import { dataListMixin } from "@/mixins/dataListMixin";
import { STable, Ellipsis } from "@/components";

import designForm from "./design.vue";
const columns = [
  {
    title: "#",
    width: 50,
    align: "center",
    scopedSlots: { customRender: "serial" },
    fixed: "left",
  },
  {
    title: "流程名称",
    dataIndex: "name",
    sorter: true,
  },
  {
    title: "流程标识",
    dataIndex: "modelKey",
    sorter: true,
  },
  {
    title: "流程分类",
    dataIndex: "modelType",
    sorter: true,
  },
  {
    title: "流程版本",
    dataIndex: "version",
    sorter: true,
  },
  {
    title: "发布状态",
    dataIndex: "birthday",
    sorter: true,
  },
  {
    title: "创建时间",
    dataIndex: "created",
    sorter: true,
  },
  {
    title: "更新时间",
    dataIndex: "lastUpdated",
    sorter: true,
  },

  {
    title: "操作",
    dataIndex: "action",
    scopedSlots: { customRender: "action" },
    fixed: "right",
  },
];
export default {
  name: "TableList",
  mixins: [dataListMixin],
  components: {
    STable,
    Ellipsis,
  },
  data() {
    return {
      columns,
      visible: false,
      confirmLoading: false,
      mdl: null,
      advanced: true,
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        console.log("loadData request parameters:", requestParameters);
        return this.$post(this.url.getPageSet, requestParameters).then(
          (res) => {
            return res;
          }
        );
      },
      selectedRowKeys: [],
      selectedRows: [],
      id: "",
      ids: "",
      url: {
        getPageSet: "/workflow/apiFlowableModel/getPageSet",
        deleteBatch: "/workflow/apiFlowableModel/deleteModel",
      },
    };
  },
  computed: {
    rowSelection() {
      return {
        onChange: this.onSelectChange,
      };
    },
  },
  methods: {
    getRowKeys(row) {
      return row.id; // 每条数据的唯一识别值
    },
    rowClassName(row) {
      return row.id === this.id ? "bg-bray" : ""; // 每条数据的唯一识别值
    },
    rowClick(record, index) {
      const that = this;
      return {
        on: {
          click: () => {
            that.info = record;
            that.id = record.id;
            that.rowClassName(record);
          },
        },
      };
    },
    handleAdd() {
      console.log(1111);
      this.visible = true;
    },
    handleEdit(record) {
      if (record === "1") {
        if (this.info) {
          this.visible = true;
          this.mdl = this.info;
        } else {
          this.$message.info("请先选中需要修改的数据");
          return true;
        }
      } else {
        this.visible = true;
        this.mdl = { ...record };
      }
    },
    handleCancel() {
      this.visible = false;
    },
    handleSub(record) {
      const that = this;
      if (record === "all") {
        if (that.selectedRowKeys.length === 0) {
          that.$message.warn("请先勾选需要的删除的数据");
          return true;
        }
      } else {
        that.ids = record.id;
      }
      that.$confirm({
        title: "警告",
        content: `确定要执行该操作吗?`,
        okText: "删除",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          console.log("OK");
          // 在这里调用删除接口
          that.$post(that.url.getPageSet, { id: that.ids }).then((res) => {
            if (res.statusCode === 200) {
              that.$message.success(res.message);
              that.$refs.table.refresh();
              that.ids = "";
            } else {
              that.$message.info(res.message);
            }
          });
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
          }).catch(() => console.log("Oops errors!"));
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      selectedRows.forEach((e, index) => {
        if (index === 0) {
          this.ids = e.id;
        } else {
          this.ids = this.ids + "," + e.id;
        }
      });
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
      console.log(selectedRowKeys, selectedRows);
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    resetSearchForm() {
      this.queryParam = {
        date: moment(new Date()),
      };
    },
  },
};
</script>

<style lang="less"></style>

<!-- <template>
  <div class="containers" ref="content">
    <div class="canvas" ref="canvas"></div>
    <div id="js-properties-panel" class="panel"></div>
    <ul class="buttons">
      <li>下载</li>
      <li>
        <a ref="saveDiagram" href="javascript:" title="download BPMN diagram">BPMN diagram</a>
      </li>
      <li>
        <a ref="saveSvg" href="javascript:" title="download as SVG image">SVG image</a>
      </li>
    </ul>
  </div>
</template>

<script>
  // import BpmnViewer from 'bpmn-js'
  import BpmnModeler from 'bpmn-js/lib/Modeler'
  import propertiesPanelModule from 'bpmn-js-properties-panel'
  import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
  import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda'

  export default {
    data () {
      return {
        // bpmn建模器
        bpmnModeler: null,
        container: null,
        canvas: null,
        xmlStr: null,
        processName: ''
      }
    },
    methods: {
      createNewDiagram () {
        const bpmnXmlStr =
          `
      <?xml version="1.0" encoding="UTF-8"?>
        <bpmn2:definitions xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
          <bpmn2:process id="process1567044459787" name="流程1567044459787">
            <bpmn2:documentation>描述</bpmn2:documentation>
            <bpmn2:startEvent id="StartEvent_1" name="开始"/>
          </bpmn2:process>
          <bpmndi:BPMNDiagram id="BPMNDiagram_1">
            <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="process1567044459787">
              <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
                <dc:Bounds x="184" y="64" width="36" height="36"/>
                <bpmndi:BPMNLabel>
                  <dc:Bounds x="191" y="40" width="22" height="14"/>
                </bpmndi:BPMNLabel>
              </bpmndi:BPMNShape>
            </bpmndi:BPMNPlane>
          </bpmndi:BPMNDiagram>
        <processType id="test"/></bpmn2:definitions>
      `
        // 将字符串转换成图显示出来
        this.bpmnModeler.importXML(bpmnXmlStr, (err) => {
          if (err) {
            console.error(err)
          }
        })
      },
      saveSVG (done) {
        // 把传入的done再传给bpmn原型的saveSVG函数调用
        console.log(done)
        this.bpmnModeler.saveSVG(done)
      },
      // 下载为SVG格式,done是个函数，调用的时候传入的
      saveDiagram (done) {
        // 把传入的done再传给bpmn原型的saveXML函数调用
        this.bpmnModeler.saveXML({
          format: true
        }, function (err, xml) {
           console.log(xml)
        })
      },
      // 当图发生改变的时候会调用这个函数，这个data就是图的xml
      setEncoded (link, name, data) {
        // 把xml转换为URI，下载要用到的
        const encodedData = encodeURIComponent(data)
        // 获取到图的xml，保存就是把这个xml提交给后台
        this.xmlStr = data
        // 下载图的具体操作,改变a的属性，className令a标签可点击，href令能下载，download是下载的文件的名字
        if (data) {
          link.className = 'active'
          link.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData
          link.download = name
        }
      }
    },
    mounted () {
      // 获取到属性ref为“content”的dom节点
      this.container = this.$refs.content
      // 获取到属性ref为“canvas”的dom节点
      const canvas = this.$refs.canvas

      // 建模，官方文档这里讲的很详细
      this.bpmnModeler = new BpmnModeler({
        container: canvas,
        // 添加控制板
        propertiesPanel: {
          parent: '#js-properties-panel'
        },
        additionalModules: [
          // 左边工具栏以及节点
          propertiesProviderModule,
          // 右边的工具栏
          propertiesPanelModule
        ],
        moddleExtensions: {
          camunda: camundaModdleDescriptor
        }
      })

      // 下载画图
      const _this = this
      // 获取a标签dom节点
      const downloadLink = this.$refs.saveDiagram
      const downloadSvgLink = this.$refs.saveSvg
      // 给图绑定事件，当图有发生改变就会触发这个事件
      this.bpmnModeler.on('commandStack.changed', function () {
        _this.saveSVG(function (err, svg) {
          _this.setEncoded(downloadSvgLink, 'diagram.svg', err ? null : svg)
        })

        _this.saveDiagram(function (err, xml) {
          _this.setEncoded(downloadLink, 'diagram.bpmn', err ? null : xml)
        })
      })

      this.createNewDiagram(this.bpmnModeler)
    }
  }
</script>
<style lang="scss">
  // /*左边工具栏以及编辑节点的样式*/
  // @import '~bpmn-js/dist/assets/diagram-js.css';
  // @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
  // @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
  // @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

  /*左边工具栏以及编辑节点的样式*/
  @import '~bpmn-js/dist/assets/diagram-js.css';
  @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
  @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
  @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
  /*右边工具栏样式*/
  @import '~bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';

  .containers {
    position: absolute;
    background-color: #ffffff;
    width: 100%;
    height: 90%;
  }

  .canvas {
    width: 100%;
    height: 100%;
  }

  .panel {
    position: absolute;
    right: 0;
    top: 0;
    width: 200px;
  }

  .buttons {
    position: absolute;
    left: 20px;
    bottom: 20px;

    &>li {
      display: inline-block;
      margin: 5px;

      &>a {
        color: #999;
        background: #eee;
        cursor: not-allowed;
        padding: 8px;
        border: 1px solid #ccc;

        &.active {
          color: #333;
          background: #fff;
          cursor: pointer;
        }
      }
    }
  }
</style>
 -->
