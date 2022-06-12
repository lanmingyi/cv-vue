<!--
 * @Description: 柱状图
 * @Author: 黄婷
 * @Date: 2021-05-20 18:13:04
 * @LastEditTime: 2021-09-16 11:03:41
 * @LastEditors: 黄婷
 * @FilePath: \vite-demoe:\wwwroot\Vue\MisBoot\misboot-cloud-vue\src\components\TopVUI\k-portal-design\component\barChart.vue
-->
<template>
  <a-card :hoverable="true" class="chart-box-122343">
    <!-- 标题 -->
    <template slot="title" v-if="options.titleShow">
      <icon-fonts
        :icon="'icon-' + record.options.iconFont"
        class="card-title-icon"
        :style="{ color: options.iconFontColor }"
      />
      <span>{{ record.options.title }}</span>
    </template>
    <!-- 操作 -->
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
				<div ref="barChart" :style="{ width: cWidth, height: cHeight }"></div>
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
  name: "moreBar",
  mixins: [resize],
  components: { cardTitle },
  data() {
    return {
      xData: [],
      seriesData: [],
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
        this.$nextTick(() => {
          this.getChartData();
          this.colorLost = [];
          this.colorLost = this.options.colorLost.map((obj) => {
            return obj.value;
          });
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
        this.xData = res.xData;
        this.seriesData = res.seriesData;
        this.seriesData.forEach((e) => {
          e.type = "bar";
          e.barWidth = this.options.barwidth;
          e.showBackground = this.options.showBackground;
          e.emphasis = {
            focus: this.options.emphasis ? "series" : "none",
          };
          if (this.options.stack) e.stack = "bar";
          else delete e.stack;
          e.itemStyle = {
            normal: {
              barBorderRadius: this.options.barBorderRadius,
            },
          };
          e.barGap = this.options.barGap;
        });
        this.initEchart();
      });
    },
    // 渲染图表
    initEchart() {
      this.myChart = echarts.init(this.$refs.barChart);
      let legend = this.options.legend;
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
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
            padding: [5, 10],
          },
          grid: {
            top: this.options.grid?.top,
            left: this.options.grid?.left,
            right: this.options.grid?.right,
            bottom: this.options.grid?.bottom,
          },
          legend: {
            show: legend.show,
            left: legend.left,
            top: legend.top,
            right: legend.right,
            bottom: legend.bottom,
            orient: legend.orient,
            type: legend.type,
            itemWidth: legend.itemWidth,
            itemHeight: legend.itemHeight,
            textStyle: {
              fontSize: legend.textSize,
            },
          },
          xAxis: [
            {
              type: "category",
              data: this.xData,
              axisLine: {
                lineStyle: {
                  color: "#cecece",
                },
              },
              axisLabel: {
                color: "#666",
              },
              axisTick: {
                show: false,
              },
              splitLine: {
                show: this.options.x.splitLine,
              },
            },
          ],
          yAxis: [
            {
              type: "value",
              axisTick: {
                show: false,
              },
              axisLine: {
                lineStyle: {
                  color: "#cecece",
                },
              },
              axisLabel: {
                color: "#666",
              },
              splitLine: {
                show: this.options.y.splitLine,
              },
            },
          ],
          series: this.seriesData,
        },
        true
      );
      this.myChart.resize();
    },
  },
};
</script>
