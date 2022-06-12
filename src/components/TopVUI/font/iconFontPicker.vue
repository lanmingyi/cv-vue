<!--
 * @Description: 阿里图标选择器
 * @Author: 黄婷
 * @Date: 2021-06-01 14:27:12
 * @LastEditTime: 2021-09-16 10:43:32
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\font\iconFontPicker.vue
-->
<template>
  <div>
    <a-input :placeholder="placeholder" v-model="values" :disabled="disabled">
      <a-icon slot="addonAfter" type="font-colors" @click="showModal" />
    </a-input>
    <t-modal
      title="图标库"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :width="860"
      centered
    >
      <div class="padding-xs">
        <a-input-search
          style="width:100%"
          v-model="fontTxt"
          placeholder="图标"
          enter-button
          allowClear
          @change="
            (e) => {
              onSearch(e.target.value);
            }
          "
          @search="onSearch"
        />
      </div>
      <a-tabs v-model="currentIndex" @change="changeCurrentIndex">
        <a-tab-pane tab="Ant Design图标库" key="1">
          <ul>
            <li
              v-for="icon in antdJsonList"
              :key="icon.icon_id"
              @click="fontClick(icon)"
            >
              <icon-fonts
                :icon="'icon-' + icon.font_class"
                :title="icon.name"
                :class="{ active: activeIndex === icon.font_class }"
              />
            </li>
          </ul>
        </a-tab-pane>
        <a-tab-pane tab="阿里官方图标" key="2">
          <ul>
            <li
              v-for="icon in iconJsonList"
              :key="icon.icon_id"
              @click="fontClick(icon)"
            >
              <icon-fonts
                :icon="'icon-' + icon.font_class"
                :title="icon.name"
                :class="{ active: activeIndex === icon.font_class }"
              />
            </li>
          </ul>
        </a-tab-pane>
        <a-tab-pane tab="多色图标" key="3">
          <ul>
            <li
              v-for="icon in multicolorList"
              :key="icon.icon_id"
              @click="fontClick(icon)"
            >
              <icon-fonts
                :icon="'icon-' + icon.font_class"
                :title="icon.name"
                :class="{ active: activeIndex === icon.font_class }"
              />
            </li>
          </ul>
        </a-tab-pane>
      </a-tabs>
    </t-modal>
  </div>
</template>

<script>
import iconJson from "./json/icon.json";
import antdJson from "./json/antd.json";
import multicolor from "./json/multicolor.json";
export default {
  data() {
    return {
      values: "",
      activeIndex: "",
      visible: false,
      iconJsonList: [],
      antdJsonList: [],
      multicolorList: [],
      currentIndex: "1",
      fontTxt: "",
    };
  },
  props: {
    value: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "图标选择器",
    },
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        this.values = newVal ? newVal : "";
      },
    },
  },
  methods: {
    showModal() {
      if (!this.disabled) {
        this.iconJsonList = iconJson;
        this.antdJsonList = antdJson;
        this.multicolorList = multicolor;
        this.visible = true;
        this.currentIndex = "1";
      }
      this.values = "";
      this.activeIndex = "";
      this.fontTxt = "";
    },
    handleOk() {
      this.visible = false;
      this.values = this.activeIndex;
      this.$emit("change", this.values);
    },
    handleCancel() {
      this.visible = false;
    },
    fontClick(item) {
      this.activeIndex = item.font_class;
    },
    onSearch(val) {
      if (this.currentIndex === "1") {
        this.antdJsonList = antdJson.filter(
          (item) => item.font_class.indexOf(val) >= 0
        );
      } else if (this.currentIndex === "2") {
        this.iconJsonList = iconJson.filter(
          (item) => item.font_class.indexOf(val) >= 0
        );
      } else {
        this.multicolorList = multicolor.filter(
          (item) => item.font_class.indexOf(val) >= 0
        );
      }
    },
    changeCurrentIndex(key) {
      this.currentIndex = key;
      this.onSearch(this.fontTxt);
    },
  },
};
</script>

<style lang="less" scoped>
@import "../icon/Icon";
// .icon-container-123444 {
// 	background: #e2e2e2;
// 	.icon-span {
// 		display: inline-block;
// 		margin: 10px;
// 		.icon-text {
// 			display: inline-block;
// 			width: 36px;
// 			height: 36px;
// 			border: 1px solid #fff;
// 			border-radius: 5px;
// 			text-align: center;
// 			line-height: 36px;
// 			font-size: 20px;
// 			&.active,
// 			&:hover {
// 				background-color: @active-color;
// 			}
// 		}
// 	}
// }
</style>
