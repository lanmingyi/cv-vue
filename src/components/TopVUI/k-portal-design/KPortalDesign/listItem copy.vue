<!--
 * @Description: 
 * @Author: lmy
 * @Date: 2021-06-02 13:38:08
 * @LastEditTime: 2021-08-04 16:49:14
 * @LastEditors: lmy
 * @FilePath:
-->
<template>
  <div>
    <template v-if="record.type === 'card'">
      <card-list></card-list>
    </template>
  </div>
</template>
<script>
/*
 * author lmy
 * date 2019-11-20
 */
// import moment from "moment";
import cardList from "../component/cardList";
export default {
  name: "klistItem",
  props: {
    // 表单数组
    record: {
      type: Object,
      required: true,
    },
    dynamicData: {
      type: Object,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    cardList,
  },
  computed: {
    customList() {
      if (window.$customComponentList) {
        return window.$customComponentList.map((item) => item.type);
      } else {
        return [];
      }
    },
  },
  watch: {
    record(val) {
      // console.log(val.options.defaultValue)
      val.options.defaultValue = val.options.defaultValue
        ? val.options.defaultValue
        : "";
    },
  },
  mounted() {
    // console.log(this.isView,'111111111111')
  },
  methods: {
    validationSubform() {
      // 验证动态表格
      if (!this.$refs.KBatch) return true;
      return this.$refs.KBatch.validationSubform();
    },
    handleChange(value, key) {
      this.record.options.defaultValue = value;
      // change事件
      this.$emit("change", value, key);
    },
  },
};
</script>
<style lang="less" scoped>
.slider-box {
  display: flex;
  > .slider {
    flex: 1;
    margin-right: 16px;
  }
  > .number {
    width: 70px;
  }
}
</style>
