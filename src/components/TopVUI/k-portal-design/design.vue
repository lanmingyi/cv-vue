<!--
 * @Description: 门户拖拽页设计/用户设计页面
 * @Author: 黄婷
 * @Date: 2021-05-20 18:13:04
 * @LastEditTime: 2021-09-16 11:13:53
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\k-portal-design\design.vue
-->
<template>
  <a-config-provider :locale="locale">
    <div
      :class="[
        'form-designer-container-9136076486841527 index-container-1592076357139',
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
          <!-- <aside-left
						:list="basicsArray"
						@generateKey="generateKey"
						@handleListPush="handleListPush"
						@start="handleStart"
					></aside-left> -->

          <collapseItem
            title="布局控件"
            :list="layoutArray"
            @generateKey="generateKey"
            @handleListPush="handleListPush"
            @start="handleStart"
          />
          <!-- 布局控件 end -->
          <!-- 基本组件 start -->
          <collapseItem
            v-if="basicsArray.length > 0"
            v-for="(item, index) in basicsArray"
            :key="index + 1"
            :title="item.label"
            :list="item.children"
            @generateKey="generateKey"
            @handleListPush="handleListPush"
            @start="handleStart"
          />
          <!-- 基本组件 end -->
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
          <layout-panel
            :class="{ 'no-toolbars-top': !toolbarsTop }"
            :data="data"
            :selectItem="selectItem"
            :noModel="noModel"
            :hideModel="hideModel"
            :startType="startType"
            ref="KFCP"
            @handleSetSelectItem="handleSetSelectItem"
            @fetch-data="fetchData"
          />
          <previewModal :data="data" ref="previewModal" />
          <!-- 操作区域 start -->
        </section>
        <!-- 中间面板区域 end -->

        <!-- 右侧控件属性区域 start -->
        <aside class="right">
          <layoutItemProperties
            class="form-item-properties show-properties"
            :selectItem="selectItem"
            designer="consumer"
          />
        </aside>
        <!-- 右侧控件属性区域 end -->
      </div>
      <!-- <k-footer /> -->
    </div>
  </a-config-provider>
</template>
<script>
import { mapState } from "vuex";
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import {
  asideLeft,
  layoutPanel,
  operatingArea,
  layoutItemProperties,
  collapseItem,
} from "./KPortalDesign";
import previewModal from "./preview/index.vue";
import { basicsList, colList, layoutList } from "./config/formItemsConfig";
import { getPortalByList } from "@/utils/formatter";
export default {
  name: "KFormDesign",
  props: {
    title: {
      type: String,
      default: "",
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
        "list",
        "schedule",
        "card",
        "grid",
        "bar",
        "pie",
        "line",
        "calendar",
        "timeLine",
        "weather",
        "flowCard",
        "tabs",
        "miniCard",
      ],
    },
    hideModel: {
      // 隐藏数据字段
      type: Boolean,
      default: false,
    },
    menuData: {
      type: Object,
    },
    jsonData: {},
  },
  components: {
    asideLeft,
    layoutPanel,
    operatingArea,
    layoutItemProperties,
    previewModal,
    collapseItem,
  },
  data() {
    return {
      locale: zhCN,
      data: {
        list: [],
      },
      selectItem: {
        key: "",
      },
      startType: "",
      showPropertie: true,
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
      previewOptions: {
        width: 850,
      },
      basicsArray: [],
      colListData: colList,
      itemDisabled: false,
    };
  },
  computed: {
    ...mapState("setting", ["isMobile"]),
    // basicsArray() {
    // 	// 计算需要显示的基础字段
    // 	let asideList = this.menuData;
    // 	if (asideList.length > 0) {
    // 		asideList.forEach((child) => {
    // 			getPortalByList(child, colList);
    // 		});
    // 	}
    // 	let basicsArray = colList.filter((item) => item.children.length != 0);
    // 	return basicsArray.filter((item) => this.fields.includes(item.type));
    // },
    layoutArray() {
      // 计算需要显示的布局字段
      return layoutList.filter((item) => this.fields.includes(item.type));
    },
    collapseDefaultActiveKey() {
      // 计算当前展开的控件列表
      return ["0"];
    },
  },
  watch: {
    // 左侧菜单数据
    menuData: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        let asideList = [];
        asideList = newVal && newVal.list ? newVal.list : [];
        let colListData = this.colListData;
        colListData.forEach((e) => {
          e.children = [];
        });
        if (asideList.length > 0) {
          asideList.forEach((child) => {
            getPortalByList(child, colListData);
          });
        }
        let basicsArray = colListData.filter(
          (item) => item.children.length != 0
        );
        this.basicsArray = basicsArray.filter((item) =>
          this.fields.includes(item.type)
        );
      },
    },
    jsonData: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        this.data = newVal;
        let canEdit = this.hasWeather(this.data.list);
        this.basicsArray.forEach((val) => {
          val.children.forEach((el) => {
            el.canEdit = el.type == "weather" ? canEdit : false;
          });
        });
      },
    },
  },
  mounted() {},
  methods: {
    handleDownload() {
      this.dialogVisible = true;
      this.showFileName = true;
      this.operationType = "download";
    },
    hasWeather(list) {
      let isHas = false;
      list.forEach((val) => {
        if (["grid", "tabs"].includes(val.type)) {
          val.columns.forEach((el) => {
            if (el.list && el.list.length > 0) {
              isHas = this.hasWeather(el.list);
            }
          });
        } else if (val.type == "weather") {
          isHas = true;
        }
      });
      return isHas;
    },
    generateKey(list, index) {
      // 生成key值
      const key = list[index].type + "_" + new Date().getTime();
      this.$set(list, index, {
        ...list[index],
        key,
        model: key,
      });
      if (this.noModel.includes(list[index].type)) {
        // 删除不需要的model属性
        delete list[index].model;
      }
    },
    // 添加组件到设计面板
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
        this.handleSetSelectItem(record);
        return false;
      }
      this.$refs.KFCP.handleCopy(false, item);
    },
    handlePreview() {
      // 打开预览模态框
      this.$refs.previewModal.jsonData = this.data;
      this.$refs.previewModal.previewWidth = this.previewOptions.width;
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
    handleSetSelectItem(record) {
      // 操作间隔不能低于100毫秒
      let newTime = new Date().getTime();
      if (newTime - this.updateTime < 100) {
        return false;
      }

      this.updateTime = newTime;

      // 设置selectItem的值
      this.selectItem = record;
      console.log(this.selectItem);
      // 判断是否选中控件，如果选中则弹出属性面板，否则关闭属性面板
      this.startType = record.type;
      // if (record.key) {
      // 	this.startType = record.type;
      // 	this.showPropertie = true;
      // } else {
      // 	this.showPropertie = false;
      // }
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
    handleSave() {
      // 保存函数
      this.$emit("save", JSON.stringify(this.data));
      // localStorage.setItem('formDesign', JSON.stringify(this.data));
    },
    handleClose() {
      this.$emit("close");
      this.selectItem = {};
    },
    fetchData(selectItem) {
      this.selectItem = selectItem;
    },
  },
};
</script>
<style lang="less">
@import "./index.less";
</style>
