<!--
 * @Description: 日程
 * @Author: 黄婷
 * @Date: 2021-05-20 18:13:04
 * @LastEditTime: 2021-09-16 11:04:13
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\k-portal-design\component\calendar.vue
-->
<template>
  <div>
    <!-- 日程 -->
    <a-card :bordered="false">
      <FullCalendar
        class="calendar"
        ref="fullCalendar"
        defaultView="dayGridMonth"
        locale="zh-cn"
        :header="{
          left: 'timeGridDay,timeGridWeek,dayGridMonth',
          center: 'title',
          right: 'prev, today ,next ',
        }"
        :all-day-slot="calendarOptions.allDaySlot"
        :slot-duration="calendarOptions.slotDuration"
        :slot-label-interval="calendarOptions.slotLabelInterval"
        :slot-min-time="calendarOptions.slotMinTime"
        :slot-max-time="calendarOptions.slotMaxTime"
        :scroll-time="calendarOptions.scrollTime"
        :slot-label-format="calendarOptions.slotLabelFormat"
        :event-time-format="calendarOptions.eventTimeFormat"
        :editable="true"
        :selectable="true"
        :unselectAuto="false"
        :buttonText="buttonText"
        :plugins="calendarPlugins"
        :weekends="calendarWeekends"
        :events="getCalendarEvents"
        :eventLimit="true"
        eventLimitText="更多"
      />
    </a-card>
  </div>
</template>

<script>
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";

import { getObjectByString } from "@/utils/util";
export default {
  name: "TableList",
  components: {
    FullCalendar,
  },
  props: { record: { type: Object } },
  watch: {
    record: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        this.options = newVal.options || {};
      },
    },
  },
  data() {
    return {
      moment,
      buttonText: {
        today: "今天",
        month: "月",
        week: "周",
        day: "天",
      },
      options: {},
      calendarPlugins: [
        // plugins must be defined in the JS
        dayGridPlugin,
        timeGridPlugin,
        interactionPlugin, // needed for dateClick
      ],
      calendarOptions: {
        calendarAllDaySlot: false,
        slotLabelInterval: "01:00", // 时间间隔
        slotDuration: "01:00:00", // 时间间隔
        slotMinTime: "06:00",
        slotMaxTime: "24:00",
        scrollTime: "09:00", // 默认展示的时间
        slotLabelFormat: {
          // 周时间的左侧时间轴配置
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        },
        eventTimeFormat: {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        },
      },
      calendarWeekends: true,
      calendarEvents: [],
    };
  },
  mounted() {
    this.calendarApi = this.$refs.fullCalendar.getApi();
    this.$nextTick(() => {
      this.getCalendarData();
    });
  },
  methods: {
    getCalendarData() {
      let params = getObjectByString(this.options.parameter, ",", ":");
      params = { ...params };
      const calendarInfo = {
        date: moment(new Date()).format("YYYY-MM-DD"),
      };
      this.$axios(this.options.method, this.options.url, params)
        .then((res) => {
          if (res.statusCode != 300) {
            res.forEach((val) => {
              this.changeCalendarData(val);
            });
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    changeCalendarData(info) {
      var data = {
        title: info.text,
        start: Date.parse(new Date(info.startDate)),
        end: Date.parse(new Date(info.endDate)),
        eventType: info.eventType,
        uuid: info.uuid,
        backgroundColor: this.changeColor(info.eventType),
      };
      this.calendarEvents.push(data);
      this.calendarApi.refetchEvents();
    },
    changeColor(type) {
      if (type == 1) return "#ff9633";
      if (type == 2) return "#ff5722";
      if (type == 3) return "#9575cd";
      if (type == 4) return "#0fc4a7";
      return "";
    },
    getCalendarEvents(info, successCallback, failureCallback) {
      const events = [
        ...this.calendarEvents,
        {
          title: info.text,
          start: Date.parse(new Date(info.startDate)),
          end: Date.parse(new Date(info.endDate)),
          eventType: info.eventType,
        },
      ];
      successCallback(events);
    },
  },
};
</script>

<style lang="less">
@import "~@fullcalendar/core/main.css";
@import "~@fullcalendar/daygrid/main.css";
@import "~@fullcalendar/timegrid/main.css";
@import "~@assets/style/fullcalendar.css";
</style>
