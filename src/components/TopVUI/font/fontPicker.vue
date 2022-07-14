<!--
 * @Description: 图标选择器
 * @Author: lmy
 * @Date: 2021-06-02 13:38:08
 * @LastEditTime: 2021-09-16 10:44:08
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <div>
    <a-popover placement="bottom" v-model="fontVisible" v-if="!disabled">
      <template v-slot:content>
        <a-input-search
          placeholder="搜索图标"
          @search="fontSearch"
          v-model="fontSearchValue"
        />
        <div :style="{ width: '500px', height: '250px', overflow: 'auto' }">
          <div class="font-container">
            <div
              v-for="item in showJson"
              :key="item"
              @click="fontClick(item)"
              class="my-font"
            >
              <font-awesome-icon :icon="item" />
            </div>
          </div>
        </div>
      </template>
      <template v-slot:title>
        <span>图标</span>
      </template>
      <a-input
        allowClear
        v-model="values"
        @mouseover="mouseOver"
        :placeholder="placeholder"
      >
        <template v-slot:addonAfter>
          <a href="javascript:void(0)">
            <div v-if="values">
              <font-awesome-icon :icon="values" />
            </div>
            <div v-else>
              <a-icon type="font-colors" />
            </div>
          </a>
        </template>
      </a-input>
    </a-popover>
    <a-input
      v-else
      readOnly
      v-model="values"
      @mouseover="mouseOver"
      :placeholder="placeholder"
    >
      <template v-slot:addonAfter>
        <a href="javascript:void(0)">
          <div v-if="values">
            <font-awesome-icon :icon="values" />
          </div>
          <div v-else>
            <a-icon type="font-colors" />
          </div>
        </a>
      </template>
    </a-input>
  </div>
</template>
<script>
import fontJson from "./json/font.json";
import Popover from "ant-design-vue/lib/popover";
import Input from "ant-design-vue/lib/input";
import InputSearch from "ant-design-vue/lib/input/Search";
import Icon from "ant-design-vue/lib/icon";
import "ant-design-vue/dist/antd.min.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(fas);
export default {
  name: "fontPicker",
  data() {
    return {
      showJson: null,
      fontVisible: false,
      fontSearchValue: null,
      values: "",
    };
  },
  components: {
    "font-awesome-icon": FontAwesomeIcon,
    "a-popover": Popover,
    "a-input": Input,
    "a-input-search": InputSearch,
    "a-icon": Icon,
  },
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    placeholder: {
      type: String,
      default: null,
    },
    value: {
      type: String,
      default: null,
    },
    record: {
      type: Object,
    },
    disabled: {
      type: Boolean,
    },
  },
  watch: {
    value(val) {
      if (val) {
        this.values = val;
      }
    },
    record(val) {
      if (val) {
        this.values = val.options.defaultValue;
      }
    },
  },
  methods: {
    mouseOver() {
      this.fontSearchValue = null;
      this.showJson = fontJson;
    },
    fontSearch(value) {
      if (value) {
        this.showJson = fontJson.filter((item) => {
          return item.startsWith(value);
        });
      } else {
        this.showJson = fontJson;
      }
    },
    fontClick(item) {
      this.$emit("change", item);
      this.fontVisible = false;
    },
  },
};
</script>
<style scoped>
.font-container {
  font-size: 18px;
  width: 100%;
  height: 235px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-content: flex-start;
  justify-content: center;
}
.my-font {
  cursor: pointer;
  margin: 5px 5px 5px 5px;
  padding-top: 5px;
  text-align: center;
  border-radius: 6px;
  width: 45px;
  height: 40px;
  border: 1px solid #ccc;
}
.my-font:hover {
  background-color: rgba(206, 206, 206, 0.5);
}
</style>
