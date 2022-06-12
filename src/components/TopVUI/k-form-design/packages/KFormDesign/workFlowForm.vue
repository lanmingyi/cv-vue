<!--
 * @Description: 流程表单设计界面
 * @Author: 黄婷
 * @Date: 2021-06-02 13:38:08
 * @LastEditTime: 2021-09-17 11:13:42
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\k-form-design\packages\KFormDesign\workFlowForm.vue
-->
<template>
  <a-config-provider :locale="locale">
    <div
      :class="[
        'form-designer-container-9136076486841527',
        { mobile: isMobile },
      ]"
    >
      <!-- <k-header v-if="showHead" :title="title" /> -->
      <!-- 操作区域 start -->
      <operatingArea
        v-if="toolbarsTop"
        :showToolbarsText="showToolbarsText"
        :toolbars="toolbars"
        @handleSave="handleSave"
        @handlePreview="handlePreview"
        @handleOpenImportJsonModal="handleOpenImportJsonModal"
        @handleOpenCodeModal="handleOpenCodeModal"
        @handleOpenJsonModal="handleOpenJsonModal"
        @handleReset="handleReset"
        @handleClose="handleClose"
      >
        <template slot="left-action">
          <slot name="left-action"></slot>
        </template>

        <template slot="right-action">
          <slot name="right-action"></slot>
        </template>
      </operatingArea>
      <!-- 操作区域 end -->
      <div
        class="content"
        :class="{
          'show-head': showHead,
          'toolbars-top': toolbarsTop,
          'show-head-and-toolbars-top': toolbarsTop && showHead,
        }"
      >
        <!-- 左侧控件区域 start -->
        <aside class="left">
          <!-- 基础控件 start -->

          <collapseItem
            title="基础控件"
            :list="basicsArray"
            @generateKey="generateKey"
            @handleListPush="handleListPush"
            @start="handleStart"
          />
          <!-- 基础控件 end -->

          <!-- 布局控件 start -->

          <collapseItem
            title="布局控件"
            :list="layoutArray"
            @generateKey="generateKey"
            @handleListPush="handleListPush"
            @start="handleStart"
          />
          <!-- 布局控件 end -->
          <!-- 自定义控件 start -->

          <collapseItem
            title="自定义组件"
            :list="customComponents"
            @generateKey="generateKey"
            @handleListPush="handleListPush"
            @start="handleStart"
          />
          <!-- 自定义控件 end -->
        </aside>
        <!-- 左侧控件区域 end -->

        <!-- 中间面板区域 start -->
        <section>
          <!-- 操作区域 start -->
          <operatingArea
            v-if="!toolbarsTop"
            :showToolbarsText="showToolbarsText"
            :toolbars="toolbars"
            @handleSave="handleSave"
            @handlePreview="handlePreview"
            @handleOpenImportJsonModal="handleOpenImportJsonModal"
            @handleOpenCodeModal="handleOpenCodeModal"
            @handleOpenJsonModal="handleOpenJsonModal"
            @handleReset="handleReset"
            @handleClose="handleClose"
          >
            <template slot="left-action">
              <slot name="left-action"></slot>
            </template>

            <template slot="right-action">
              <slot name="right-action"></slot>
            </template>
          </operatingArea>
          <!-- 操作区域 end -->
          <k-form-component-panel
            :class="{ 'no-toolbars-top': !toolbarsTop }"
            :data="data"
            :selectItem="selectItem"
            :noModel="noModel"
            :hideModel="hideModel"
            :startType="startType"
            ref="KFCP"
            @handleSetSelectItem="handleSetSelectItem"
          />
          <!-- 操作区域 start -->
          <k-json-modal ref="jsonModal" />
          <k-code-modal ref="codeModal" />
          <importJsonModal ref="importJsonModal" />
          <previewModal ref="previewModal" />
        </section>
        <!-- 中间面板区域 end -->

        <!-- 右侧控件属性区域 start -->
        <aside class="right">
          <a-tabs default-active-key="1">
            <a-tab-pane key="1" tab="组件属性" force-render>
              <formItemProperties
                :tName="formTableName"
                :class="{ 'show-properties': true }"
                class="form-item-properties"
                :selectItem="selectItem"
                :hideModel="hideModel"
                @handleHide="showPropertie = false"
              />
            </a-tab-pane>
            <a-tab-pane key="2" tab="表单属性">
              <formProperties :config="data.config" />
            </a-tab-pane>
          </a-tabs>
        </aside>
        <!-- 右侧控件属性区域 end -->
      </div>
      <!-- <k-footer /> -->
    </div>
  </a-config-provider>
</template>
<script>
/*
 * author 黄婷
 * date 2019-11-20
 * description 表单设计器
 */
import { mapState } from "vuex";
import kHeader from "./module/header";
import operatingArea from "./module/operatingAreaWork";

// import kFooter from "./module/footer";
import kFormComponentPanel from "./module/formComponentPanel";
import kJsonModal from "./module/jsonModal";
import kCodeModal from "./module/codeModal";
import collapseItem from "./module/collapseItem";
import importJsonModal from "./module/importJsonModal";
import previewModal from "../KFormPreview/index.vue";
// import draggable from "vuedraggable";
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import {
  basicsList,
  // highList,
  layoutList,
  customComponents,
} from "./config/formItemsConfig";
import formItemProperties from "./module/formItemProperties";
import formProperties from "./module/formProperties";

import { loadTypeList, getAnalysisByList } from "@/utils/formatter";
export default {
  name: "KFormDesign",
  props: {
    title: {
      type: String,
      default: "表单设计器 --by kcz",
    },
    showHead: {
      type: Boolean,
      default: true,
    },
    toolbarsTop: {
      type: Boolean,
      default: false,
    },
    toolbars: {
      type: Array,
      default: () => [
        "save",
        "preview",
        "importJson",
        "exportJson",
        "exportCode",
        "reset",
        "close",
      ],
    },
    showToolbarsText: {
      type: Boolean,
      default: false,
    },
    fields: {
      type: Array,
      default: () => [
        "input",
        "textarea",
        "number",
        "select",
        "checkbox",
        "radio",
        "date",
        "time",
        "rate",
        "slider",
        "uploadFile",
        "uploadImg",
        "cascader",
        "treeSelect",
        "batch",
        "editor",
        "switch",
        "button",
        "alert",
        "text",
        "html",
        "divider",
        "card",
        "tabs",
        "grid",
        "table",
      ],
    },
    hideModel: {
      // 隐藏数据字段
      type: Boolean,
      default: false,
    },
		parentFormDesignUuid: {
			type: String,
			required: true
		}
  },
  data() {
    return {
      locale: zhCN,
      customComponents,
      updateTime: 0,
      updateRecordTime: 0,
      showPropertie: false,
      startType: "",
      noModel: [
        "button",
        "divider",
        "card",
        "grid",
        "table",
        "alert",
        "text",
        "html",
      ],
      data: {
        list: [],
        config: {
          layout: "horizontal",
          labelCol: { xs: 4, sm: 4, md: 4, lg: 4, xl: 4, xxl: 4 },
          wrapperCol: { xs: 18, sm: 18, md: 18, lg: 18, xl: 18, xxl: 18 },
          hideRequiredMark: false,
          customStyle: "",
          columns: "one",
          width: 850,
        },
      },
      previewOptions: {
        width: 850,
      },
      selectItem: {
        key: "",
      },
      formTableName: "",
			formDesignUuid: ""
    };
  },
  components: {
    kHeader,
    // kFooter,
    operatingArea,
    collapseItem,
    kJsonModal,
    kCodeModal,
    importJsonModal,
    previewModal,
    kFormComponentPanel,
    formItemProperties,
    formProperties,
    // draggable
  },
  computed: {
    ...mapState("setting", ["isMobile"]),
    basicsArray() {
      // 计算需要显示的基础字段
      return basicsList.filter((item) => this.fields.includes(item.type));
    },
    layoutArray() {
      // 计算需要显示的布局字段
      return layoutList.filter((item) => this.fields.includes(item.type));
    },
    collapseDefaultActiveKey() {
      // 计算当前展开的控件列表
      let defaultActiveKey = window.localStorage.getItem(
        "collapseDefaultActiveKey"
      );
      if (defaultActiveKey) {
        return defaultActiveKey.split(",");
      } else {
        return ["1"];
      }
    },
  },
  mounted() {},
  methods: {
    // 新增时加载数据表单
    loadData(e) {
      this.selectItem = {};
      this.formTableName = e;
      this.$post("/form/formFieldJson/getDetailByTableName", {
        tableName: this.formTableName,
      }).then((res) => {
        let data = {
          list: [],
          config: {
            layout: "horizontal",
            labelCol: { xs: 4, sm: 4, md: 4, lg: 4, xl: 4, xxl: 4 },
            wrapperCol: { xs: 18, sm: 18, md: 18, lg: 18, xl: 18, xxl: 18 },
            hideRequiredMark: false,
            customStyle: "",
          },
        };
        this.data = res.fieldJson ? JSON.parse(res.fieldJson) : data;
				this.formDesignUuid = res.uuid
        if (this.data.list.length != 0) {
          // this.data.list.forEach((m) => {
          //   loadTypeList(m);
          // });
          this.sendFormData();
        }
      });
    },
    // 标签发生变化
    titleChange(selectItem) {
      let drawingist = [];
      this.data.list.forEach((m) => {
        if (selectItem && m.model === selectItem.model) {
          m.label = selectItem.label;
        }
        getAnalysisByList(m, drawingist);
      });
      this.$emit("updateList", drawingist);
    },
    // 数据字段发生变化
    modelChange(selectItem) {
      let drawingist = [];
      this.data.list.forEach((m) => {
        if (selectItem && m.model === selectItem.oldModel) {
          m.model = selectItem.model;
          // m.oldModel	 = selectItem.model
        }
      });
      this.handleSave(true);
    },
    sendFormData() {
      let drawingist = [];
      this.data.list.forEach((m) => {
        getAnalysisByList(m, drawingist);
      });
      this.$emit("sendFormData", drawingist);
      this.$emit("updateList", []);
    },
    // 编辑时获取表单数据
    getFormJson(fieldJson, formModel, formTableName) {
      this.formTableName = formTableName;
      this.data = JSON.parse(fieldJson);
      if (this.data.list.length != 0) {
        this.data.list.forEach((m) => {
          loadTypeList(m);
        });
        this.sendFormData();
      }
    },
    generateKey(list, index) {
      // 生成key值
      const key = list[index].type + "_" + new Date().getTime();
      this.$set(list, index, {
        ...list[index],
        key,
        model: key,
        oldModel: key,
      });
      if (this.noModel.includes(list[index].type)) {
        // 删除不需要的model属性
        delete list[index].model;
      }
    },
    // 点击新增时添加组件到设计面板
    handleListPush(item) {
      // 双击控件按钮push到list
      // 生成key值
      if (!this.selectItem.key) {
        // 在没有选择表单时，将数据push到this.data.list
        const key = item.type + "_" + new Date().getTime();
        item = {
          ...item,
          key,
          model: key,
          oldModel: key,
        };
        if (this.noModel.includes(item.type)) {
          // 删除不需要的model属性
          delete item.model;
        }
        const itemString = JSON.stringify(item);
        const record = JSON.parse(itemString);
        // 删除icon及compoent属性
        delete record.icon;
        delete record.component;
        this.data.list.push(record);
        this.handleSetSelectItem(record, 1);
        return false;
      }
      this.$refs.KFCP.handleCopy(false, item);
    },
    handleOpenJsonModal() {
      // 打开json预览模态框
      this.$refs.jsonModal.jsonData = this.data;
      this.$refs.jsonModal.visible = true;
    },
    handleOpenCodeModal() {
      // 打开代码预览模态框
      this.$refs.codeModal.jsonData = this.data;
      this.$refs.codeModal.visible = true;
    },
    handleOpenImportJsonModal() {
      // 打开json预览模态框
      this.$refs.importJsonModal.jsonData = this.data;
      this.$refs.importJsonModal.handleSetSelectItem = this.handleSetSelectItem;
      this.$refs.importJsonModal.visible = true;
    },
    handlePreview() {
      // 打开预览模态框
      this.$refs.previewModal.jsonData = this.data;
      this.$refs.previewModal.previewWidth = this.data.config.width;
      this.$refs.previewModal.visible = true;
    },
    handleReset() {
      // 清空
      this.$confirm({
        title: "警告",
        content: "是否确认清空内容?",
        okText: "是",
        okType: "danger",
        cancelText: "否",
        onOk: () => {
          this.data.list = [];
          this.handleSetSelectItem({ key: "" });
          this.$message.success("已清空");
        },
      });
    },
    handleSetSelectItem(record, type) {
      console.log(record, type);
      // 操作间隔不能低于100毫秒
      let newTime = new Date().getTime();
      if (newTime - this.updateTime < 100) {
        return false;
      }

      this.updateTime = newTime;

      // 设置selectItem的值
      this.selectItem = record;

      // 判断是否选中控件，如果选中则弹出属性面板，否则关闭属性面板
      if (record.key) {
        this.startType = record.type;
        this.showPropertie = true;
      } else {
        this.showPropertie = false;
      }
      if (type === 0) {
        this.deleteFiled(record);
      } else if (type === 1) {
        this.saveFiled(record);
      }
    },
    // 保存数据表关联字段
    saveFiled(record) {
      let typeList = [
        "table",
        "grid",
        "tabs",
        "card",
        "alert",
        "text",
        "html",
        "divider",
      ];
      if (!typeList.includes(record.type)) {
        let pramer = {
          tableName: this.formTableName,
          fieldName: record.oldModel,
          tagName: record.type,
        };
        this.$post("/form/formField/addFieldName", pramer).then((res) => {
          this.sendFormData();
        });
      }
    },
    // 删除数据表关联字段
    deleteFiled(record) {
      let typeList = [
        "table",
        "grid",
        "tabs",
        "card",
        "alert",
        "text",
        "html",
        "divider",
      ];
      if (!typeList.includes(record.type)) {
        console.log(record, this.formTableName);
        let pramer = {
          tableName: this.formTableName,
          fieldName: record.oldModel,
        };
        this.$post("/form/formField/deleteFieldName", pramer).then((res) => {
          this.titleChange();
        });
      }
    },
    handleSetData(data) {
      // 用于父组件赋值
      try {
        if (typeof data !== "object") {
          return false;
        } else {
          this.data = data;
          // 导入json数据后，需要清除已选择key
          this.handleSetSelectItem({ key: "" });
        }
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    collapseChange(val) {
      // 点击collapse时，保存当前collapse状态
      window.localStorage.setItem("collapseDefaultActiveKey", val);
    },
    handleStart(type) {
      this.startType = type;
    },
    handleSave(type) {
      // 保存函数
      // this.$emit("save", JSON.stringify(this.data));
      let pramer = {
        tableName: this.formTableName,
        fieldJson: JSON.stringify(this.data),
        formModel: JSON.stringify(this.data.config),
      };
			console.log(this.parentFormDesignUuid)
			pramer.uuid = this.formDesignUuid?this.formDesignUuid:this.parentFormDesignUuid
      this.$post("/form/formFieldJson/save", pramer).then((res) => {
        console.log("res======" + res);
        if (res.statusCode === 200) {
          if (!type) {
            this.$emit("formSave", pramer);
            this.$message.success(res.message);
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },
    handleClose() {
      this.$emit("close");
    },
  },
};
</script>
<style scoped="scoped">
/deep/.ant-spin-container .content.show-head {
  height: calc(100vh - 56px - 53px) !important;
}
</style>
