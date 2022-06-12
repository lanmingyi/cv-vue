<template>
  <a-radio-group
    v-if="tagType == 'radio'"
    @change="handleInput"
    :value="getValueSting"
    :disabled="disabled"
  >
    <a-radio v-for="(item, key) in dictOptions" :key="key" :value="item.uuid">{{
      item.text
    }}</a-radio>
  </a-radio-group>

  <a-radio-group
    v-else-if="tagType == 'radioButton'"
    buttonStyle="solid"
    @change="handleInput"
    :value="getValueSting"
    :disabled="disabled"
  >
    <a-radio-button
      v-for="(item, key) in dictOptions"
      :key="key"
      :value="item.uuid"
      >{{ item.text }}</a-radio-button
    >
  </a-radio-group>

  <a-select
    style="width: 100%;"
    v-else-if="tagType == 'select'"
    :getPopupContainer="getPopupContainer"
    :placeholder="placeholder"
    :disabled="disabled"
    :value="getValueSting"
    @change="handleInput"
  >
    <a-select-option
      v-for="(item, key) in dictOptions"
      :key="key"
      :value="item.uuid"
    >
      <span style="display: inline-block;width: 100%" :title="item.text">
        {{ item.text }}
      </span>
    </a-select-option>
  </a-select>
</template>

<script>
import { getDictItemsFromCache } from "@/services/common";

export default {
  name: "TreeDictSelectTag",
  props: {
    placeholder: String,
    triggerChange: Boolean,
    disabled: Boolean,
    value: [String, Number],
    type: String,
    getPopupContainer: {
      type: Function,
      default: (node) => node.parentNode,
    },
    dataList: Array,
    levelId: [String, Number],
    codeSetId: String,
  },
  data() {
    return {
      dictOptions: [],
      tagType: "",
    };
  },
  watch: {
    dictCode: {
      immediate: true,
      handler() {
        this.initDictData();
      },
    },
  },
  created() {
    // console.log(this.dictCode);
    if (!this.type || this.type === "list") {
      this.tagType = "select";
    } else {
      this.tagType = this.type;
    }
    //获取字典数据
    // this.initDictData();
  },
  computed: {
    getValueSting() {
      // update-begin author:wangshuai date:20200601 for: 不显示placeholder的文字 ------
      // 当有null或“” placeholder不显示
      return this.value != null ? this.value : undefined;
      // update-end author:wangshuai date:20200601 for: 不显示placeholder的文字 ------
    },
  },
  methods: {
    initDictData() {
      if (this.dataList && this.dataList.length > 0) {
        this.dictOptions = this.dataList;
        return;
      }
      //初始化字典数组
      this.$post(
        "/system/codeItem/getListByCodeSetIdAndLevelId",
        { codeSetId: this.codeSetId, levelId: this.levelId },
        null
      ).then((res) => {
        if (res) {
          this.dictOptions = res;
        }
      });
    },
    handleInput(e) {
      let val;
      if (this.tagType == "radio") {
        val = e.target.value;
      } else {
        val = e;
      }
      this.$emit("change", val);
    },
    setCurrentDictOptions(dictOptions) {
      this.dictOptions = dictOptions;
    },
    getCurrentDictOptions() {
      return this.dictOptions;
    },
  },
};
</script>

<style scoped></style>
