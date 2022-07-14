<!--
 * @Description: 时间选择器
 * @Author: lmy
 * @Date: 2020-01-11 17:30:48
 * @LastEditors: lmy
 * @LastEditTime: 2021-08-19 18:09:33
 -->
<template>
  <a-time-picker
    :style="`width:${record.options.width}`"
    :disabled="record.options.disabled || parentDisabled"
    :allowClear="record.options.clearable"
    :placeholder="record.options.placeholder"
    :format="record.options.format"
    :use12Hours="record.options.use12Hours"
    @change="handleSelectChange"
    :value="time"
  />
</template>
<script>
import moment from "moment";
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ["record", "value", "parentDisabled"],
  computed: {
    time() {
      if (!this.value) {
        return undefined;
      } else {
        return moment(this.value, this.record.options.format);
      }
    },
  },
  methods: {
    handleSelectChange(val) {
      let time;
      if (!val) {
        time = "";
      } else {
        time = val.format(this.record.options.format);
      }
      this.$emit("change", time);
      this.$emit("input", time);
    },
  },
};
</script>
