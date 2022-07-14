<!--
 * @Description: 折线图
 * @Author: lmy
 * @Date: 2021-05-20 18:13:04
 * @LastEditTime: 2021-09-16 11:11:33
 * @LastEditors: lmy
 * @FilePath:
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
				<div ref="lineChart" :style="{ width: cWidth, height: cHeight }"></div>
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
  name: "oneLine",
  mixins: [resize],
  components: { cardTitle },
  data() {
    return {
      xData: [],
      yData: [],
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
        console.log("newVal", newVal);
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
    // 获取图表数据
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
        this.yData = res.yData;
        this.seriesData = res.seriesData;
        this.seriesData.forEach((e) => {
          e.type = "line";
          e.smooth = this.options.smooth;
          if (this.options.areaStyle) e.areaStyle = {};
          else delete e.areaStyle;
          e.lineStyle = {
            width: this.options.linewidth,
          };
          e.symbolSize = this.options.symbolSize;
        });
        this.initEchart();
      });
    },
    // 渲染图表
    initEchart() {
      this.myChart = echarts.init(this.$refs.lineChart);
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
              type: "cross",
            },
          },
          legend: {
            show: legend.show,
            left: legend.left,
            top: legend.top,
            right: legend.right,
            bottom: legend.bottom,
            orient: legend.orient,
            type: legend.type,
            containLabel: true,
            itemWidth: legend.itemWidth,
            itemHeight: legend.itemHeight,
            textStyle: {
              fontSize: legend.textSize,
            },
          },
          grid: {
            top: this.options.grid?.top,
            left: this.options.grid?.left,
            right: this.options.grid?.right,
            bottom: this.options.grid?.bottom,
          },
          xAxis: [
            {
              type: "category",
              name: this.options.x.name,
              boundaryGap: false,
              data: this.xData,
              axisLine: {
                show: this.options.x.axisLine,
                lineStyle: {
                  color: "#cecece",
                },
              },
              axisLabel: {
                color: "#666",
                fontSize: this.options.x.textSize,
                rotate: this.options.x.rotate,
              },
              axisTick: {
                show: false,
              },
              axisPointer: {
                snap: true,
              },
              splitLine: {
                show: this.options.x.splitLine,
              },
            },
          ],
          yAxis: [
            {
              type: "value",
              name: this.options.y.name,
              axisTick: {
                show: false,
              },
              axisLine: {
                show: this.options.y.axisLine,
                lineStyle: {
                  color: "#cecece",
                },
              },
              axisLabel: {
                color: "#666",
                fontSize: this.options.y.textSize,
              },
              splitLine: {
                show: this.options.y.splitLine,
              },
              axisPointer: {
                snap: true,
              },
              data: this.yData,
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
