<template>
  <div>
    <a-select
      v-show="isSelect"
      mode="multiple"
      :placeholder="placeholder"
      v-model="selectValue"
      :options="selectOptions"
      allowClear
      :disabled="disabled"
      :open="selectOpen"
      style="width: 100%;"
      @dropdownVisibleChange="handleDropdownVisibleChange"
      @click.native="visible = buttons ? visible : true"
    />
    <a-button
      class="cu-btn-primary"
      v-if="showBtn"
      :icon="selectButtonIcon"
      :disabled="disabled"
      @click="handleShow"
      >{{ selectButtonText }}</a-button
    >
    <t-select-biz-component-modal
      ref="table"
      v-model="selectValue"
      :visible.sync="visible"
      :showBtn="showBtn"
      v-bind="modalProps"
      @close="close"
      @input="handleOptions"
      @changeData="changeData"
    />
  </div>
</template>

<script>
import TSelectBizComponentModal from "./TSelectBizComponentModal";

export default {
  name: "TSelectBizComponent",
  components: {
    TSelectBizComponentModal,
  },
  props: {
    isSelect: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: "",
    },
    /** 是否返回 id，默认 false，返回 code */
    returnId: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "请选择",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    // 是否支持多选，默认 true
    multiple: {
      type: Boolean,
      default: true,
    },
    // 是否显示按钮，默认 true
    buttons: {
      type: Boolean,
      default: true,
    },
    // 显示的 Key
    displayKey: {
      type: String,
      default: null,
    },
    // 返回的 key
    returnKeys: {
      type: Array,
      default: () => ["uuid", "id"],
    },
    // 选择按钮文字
    selectButtonText: {
      type: String,
      default: "选择",
    },
    selectButtonIcon: {
      type: String,
      default: "search",
    },
    showBtn: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      selectValue: [],
      selectOptions: [],
      dataSourceMap: {},
      selectOpen: false,
      visible: false,
    };
  },
  computed: {
    valueKey() {
      return this.returnId ? this.returnKeys[0] : this.returnKeys[1];
    },
    modalProps() {
      return Object.assign(
        {
          valueKey: this.valueKey,
          multiple: this.multiple,
          returnKeys: this.returnKeys,
          displayKey: this.displayKey || this.valueKey,
        },
        this.$attrs
      );
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (val) {
          this.selectValue = val.split(",");
        } else {
          this.selectValue = [];
        }
      },
    },
    selectValue: {
      deep: true,
      handler(val) {
        const rows = val.map((key) => this.dataSourceMap[key]);
        const data = val.join(",");
        if (data !== this.value) {
          this.$emit("select", rows);
          this.$emit("input", data);
          this.$emit("change", data);
        }
      },
    },
  },
  methods: {
    handleShow(e) {
      this.$emit("show");
    },
    close() {
      this.$emit("close");
    },
    show(e) {
      this.visible = true;
      this.queryParam = e;
      this.$refs.table.refreshList(this.queryParam);
    },
    handleOptions(options, dataSourceMap) {
      // console.log("options, dataSourceMap" , options, dataSourceMap)
      // this.selectOptions = options
      // this.dataSourceMap = dataSourceMap
      // this.$emit('change', options, dataSourceMap)
    },
    changeData(data) {
      this.$emit("changeData", data);
    },
    handleDropdownVisibleChange() {
      // 解决antdv自己的bug —— open 设置为 false 了，点击后还是添加了 open 样式，导致点击事件失效
      this.selectOpen = true;
      this.$nextTick(() => {
        this.selectOpen = false;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.j-select-biz-component-box {
  @width: 82px;

  .left {
    width: calc(100% - @width - 8px);
  }

  .right {
    width: @width;
  }

  .full {
    width: 100%;
  }

  /deep/ .ant-select-search__field {
    display: none !important;
  }
}
</style>
