<!--
 * @Description: 日期时间选择器
 * @Author: 黄婷
 * @Date: 2021-01-18 15:17:26
 * @LastEditTime: 2021-09-15 10:43:47
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\custom\TDate.vue
-->
<template>
  <!-- 日期 -->
  <a-date-picker
    v-if="type == 'date'"
    dropdownClassName="t-date-picker"
    :disabled="disabled || readOnly"
    :placeholder="placeholder"
    @change="handleDateChange"
    v-model="momVal"
    :showTime="showTime"
    :format="dateFormat"
    :getCalendarContainer="getCalendarContainer"
  />
  <!-- 月份 -->
  <a-month-picker
    v-else-if="type == 'month'"
    dropdownClassName="t-date-picker"
    :disabled="disabled || readOnly"
    :placeholder="placeholder"
    @change="handleDateChange"
    v-model="momVal"
    :showTime="showTime"
    :format="dateFormat"
    :getCalendarContainer="getCalendarContainer"
  />
  <!-- 时间 -->
  <a-time-picker
    v-else-if="type == 'time'"
    :disabled="disabled || readOnly"
    :placeholder="placeholder"
    :use12-hours="use12Hours"
    v-model="momVal"
    :format="dateFormat"
    @change="handleDateChange"
  />
  <!-- 日期范围 -->
  <a-range-picker
    v-else-if="type == 'rangePicker'"
    dropdownClassName="t-date-picker"
    :disabled="disabled || readOnly"
    :placeholder="placeholder"
    @change="handleDateChange"
    v-model="momVal"
    :showTime="showTime"
    :format="dateFormat"
    :getCalendarContainer="getCalendarContainer"
    :mode="mode"
    @panelChange="handlePanelChange"
  />
  <!-- <a-week-picker
    v-else-if="type == 'week'"
    dropdownClassName="t-date-picker"
    :disabled="disabled || readOnly"
    :placeholder="placeholder"
    @change="handleWeekChange"
    v-model="momVal"
    :showTime="showTime"
    :format="dateFormat"
    :getCalendarContainer="getCalendarContainer"
    :mode="mode"
    @panelChange="handlePanelChange"
  /> -->
</template>
<script>
import moment from "moment";
export default {
  name: "TDate",
  props: {
    placeholder: {
      required: false,
    },
    value: {
      required: false,
    },
    dateFormat: {
      type: String,
      default: "YYYY-MM-DD",
      required: false,
    },
    //此属性可以被废弃了
    triggerChange: {
      type: Boolean,
      required: false,
      default: false,
    },
    readOnly: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    showTime: {
      type: Boolean,
      required: false,
      default: false,
    },
    getCalendarContainer: {
      type: Function,
      default: (node) => node.parentNode,
    },
    type: {
      type: String,
      default: "date",
    },
    mode: {},
    use12Hours: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    let dateStr = this.value;
    return {
      decorator: "",
      momVal: !dateStr ? null : moment(dateStr, this.dateFormat),
    };
  },
  watch: {
    //监听value值的变化
    value: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        if (!newVal) {
          this.momVal = null;
        } else if (this.type === "range") {
          this.momVal = newVal.map((item) => moment(item, this.dateFormat));
          console.log(newVal, this.dateFormat);
        } else if (this.type === "week") {
          // this.momVal = newVal.map((item) => moment(item, this.dateFormat));
          console.log(newVal);
        } else {
          this.momVal = moment(newVal, this.dateFormat);
        }
      },
    },
  },
  methods: {
    moment,
    handleDateChange(mom, dateStr) {
      console.log(dateStr);
      this.$emit("change", dateStr);
      this.$emit("input", dateStr);
    },
    handlePanelChange(mom, dateStr) {
      // console.log(mom,dateStr)
      this.momVal = mom.map((item) => moment(item, this.dateFormat));
      // console.log(this.momVal)
      this.$emit("change", mom);
      this.$emit("input", mom);
      // this.value = value;
      // this.mode2 = [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]];
    },
    handleWeekChange(mom, dateStr) {
      console.log(mom, dateStr);
    },
  },
  //2.2新增 在组件内定义 指定父组件调用时候的传值属性和事件类型 这个牛逼
  model: {
    prop: "value",
    event: "change",
  },
};
</script>
