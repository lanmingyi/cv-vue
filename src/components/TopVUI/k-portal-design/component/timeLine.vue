<!--
 * @Description: 时间轴
 * @Author: 黄婷
 * @Date: 2021-05-20 18:13:04
 * @LastEditTime: 2021-09-16 11:13:14
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\k-portal-design\component\timeLine.vue
-->
<template>
  <a-card
    :hoverable="true"
    :style="{ height: cHeight }"
    class="c-schedule-159357"
  >
    <template slot="title" v-if="options.titleShow">
      <icon-fonts
        :icon="'icon-' + record.options.iconFont"
        class="card-title-icon"
      />
      <span>{{ record.options.title }}</span>
    </template>
    <template slot="extra" v-if="options.action && options.titleShow">
      <card-title
        :formType="options.formType"
        :formOptions="formOptions"
        @sendCurrent="getSchedulerList"
      ></card-title>
    </template>
    <a-timeline class="padding-sm">
      <a-timeline-item v-for="(item, index) in schedulerList" :key="index">
        <p>{{ item.startDate }} - {{ item.endDate }}</p>
        <p>{{ item.text }}</p>
      </a-timeline-item>
    </a-timeline>
  </a-card>
</template>

<script>
import { Ellipsis } from "@/components";
import { getObjectByString } from "@/utils/util";
import cardTitle from "./cardTitle";
import { axiosRequest } from "@/services/apiByPortal";
export default {
  name: "timeLine",
  data() {
    return {
      schedulerList: [],
      loading: true,
      visibleDetail: false,
      options: {},
      formOptions: {},
    };
  },
  components: { Ellipsis, cardTitle },
  props: { record: { type: Object } },
  watch: {
    record: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        this.options = newVal.options || {};
        this.formOptions = newVal.options.formOptions || {};
      },
    },
  },
  mounted() {
    this.getSchedulerList();
  },
  computed: {
    cHeight() {
      let val = this.record?.options.height;
      if (val) {
        return val;
      }
      return "100%";
    },
  },
  methods: {
    // 获取数据
    getSchedulerList(val) {
      let params = getObjectByString(this.record.options.parameter, ",", ":");
      params = {
        ...params,
        pageSize: this.record.options.pageSize
          ? this.record.options.pageSize
          : 7,
      };
      if (val) {
        params[this.formOptions.params] = val;
      }
      axiosRequest(this.record.options.method, this.record.options.url, params)
        .then((res) => {
          this.schedulerList = res?.data;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getTime(val) {
      return val.substr(0, 11);
    },
  },
};
</script>

<style lang="less">
.c-schedule-159357.ant-card {
  overflow: hidden;
  > .ant-card-body {
    height: calc(100% - 46px) !important;
    overflow-y: scroll;
  }
}
</style>
