<!--
 * @Description: 饼图
 * @Author: 黄婷
 * @Date: 2021-05-20 18:13:04
 * @LastEditTime: 2021-09-16 11:12:48
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\k-portal-design\component\pieChart.vue
-->
<template>
  <a-card :hoverable="true">
    <template slot="title" v-if="options.titleShow">
      <icon-fonts
        :icon="'icon-' + record.options.iconFont"
        class="card-title-icon"
        :style="{ color: options.iconFontColor }"
      />
      <span>{{ record.options.title }}</span>
    </template>
    <template slot="extra" v-if="options.action && options.titleShow">
      <card-title
        :formType="options.formType"
        :formOptions="formOptions"
        @sendCurrent="getChartData"
      ></card-title>
    </template>
    <!-- 图表容器 -->
		<a-card-meta>
			<template slot="description">
				<div ref="pieChart" :style="{ width: cWidth, height: cHeight }"></div>
			</template>
		</a-card-meta>
    
  </a-card>
</template>

<script>
import resize from "@/mixins/resize";
import echarts from "echarts";

import { getObjectByString } from "@/utils/util";
import cardTitle from "./cardTitle";
import { axiosRequest } from "@/services/apiByPortal";
export default {
  name: "hollowPie",
  mixins: [resize],
  components: { cardTitle },
  data() {
    return {
      legend: [],
      seriesData: [],
      options: {},
      formOptions: {},
      colorLost: [],
    };
  },
  props: { record: { type: Object } },
  mounted() {
    this.$nextTick(() => {
      this.getChartData();
      this.initEchart();
    });
  },
  watch: {
    record: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        this.options = newVal.options || {};
        this.formOptions = newVal.options.formOptions || {};
        this.colorLost = [];
        this.colorLost = this.options.colorLost.map((obj) => {
          return obj.value;
        });
        this.$nextTick(() => {
          this.getChartData();
        });
      },
    },
  },
  computed: {
    cWidth() {
      let val = this.record?.options.width;
      if (val) {
        return val;
      }
      return "100%";
    },
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
    getChartData(val) {
      let params = getObjectByString(this.record.options.parameter, ",", ":");
      if (val) {
        params[this.formOptions.params] = val;
      }
      axiosRequest(
        this.record.options.method,
        this.record.options.url,
        params
      ).then((res) => {
        this.legend = res.legend;
        this.seriesData = res.seriesData;
        this.initEchart();
      });
    },
    // 图表渲染
    initEchart() {
      let legend = this.options.legend;
      this.myChart = echarts.init(this.$refs.pieChart);
      this.myChart.setOption(
        {
          color: this.colorLost,
          title: [
            {
              text: this.options.text,
              subtext: this.options.subtext,
              textStyle: {
                color: this.options.textColor,
                fontSize: this.options.textSize,
              },
              subtextStyle: {
                color: this.options.subtextColor,
                fontSize: this.options.subtextSize,
              },
              show: this.options.textShow,
              top: this.options.position?.top,
              left: this.options.position?.left,
              right: this.options.position?.right,
              bottom: this.options.position?.bottom,
            },
          ],
          tooltip: {
            trigger: "item",
            formatter: (params) => {
              return (
                params.marker +
                " " +
                params.name +
                "：" +
                params.value +
                " (" +
                params.percent +
                "%)"
              );
            },
          },
          legend: {
            show: legend.show,
            left: legend.left,
            top: legend.top,
            right: legend.right,
            bottom: legend.bottom,
            type: legend.type,
            orient: legend.orient,
            itemWidth: legend.itemWidth,
            itemHeight: legend.itemHeight,
            data: this.legend,
            textStyle: {
              fontSize: legend.textSize,
            },
          },
          series: [
            {
              name: "消费类型",
              type: "pie",
              icon: "circle",
              radius: this.options.radius.split(","),
              center: this.options.center.split(","),
              roseType: this.options.roseType,
              itemStyle: {
                normal: {
                  borderColor: "#fff",
                  borderWidth: 1,
                },
              },
              data: this.seriesData,
              label: {},
              labelLine: {
                normal: {
                  show: true,
                },
              },
            },
          ],
        },
        true
      );
      this.myChart.resize();
    },
  },
};
</script>
