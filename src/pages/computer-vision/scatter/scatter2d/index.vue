<template>
  <div>
    <h1 style="font-size: larger; font-weight: bold; text-align:center">马力(x)与每加仑燃油行驶公里数(y)的关系：y=f(x)</h1>

    <p align="center">
      训练数据 总数量：{{originalData.length+1}}
      <a-form >
        <a-col :span="8">
          <a-form-item label="batchSize" :labelCol="labelCol" :wrapperCol="wrapperCol" >
            <a-input-number v-model="batchSize"></a-input-number>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="epochs" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input-number v-model="epochs" :min="1"></a-input-number>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-button
                @click="run"
                type="primary"
                :disabled="isTraining"
                icon="el-icon-video-play"
            >Train</a-button>
          </a-form-item>
        </a-col>
      </a-form>
    </p>

    <div class="process">
      <div class="label">训练进度：</div>
      <div class="content">
        <a-progress :percent="processPercent"></a-progress>
      </div>
    </div>

    <div class="one-row">
      <div class="col1">
        <chart-data :original-data="originalData" :predicted-data="predictedData"></chart-data>
      </div>
      <div class="col2">
        <div class="one-column">
          <chart-performance-loss :loss-data="lossData"></chart-performance-loss>
          <chart-performance-mse :mse-data="mseData"></chart-performance-mse>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/** echarts */
import echarts from "echarts";
/** tfjs */
import * as tf from "@tensorflow/tfjs";
/** data */
import getTrainData from "@/components/cv/scatter2d/lib/traindata.ts";
/** model */
import {
  createModel,
  convertToTensor,
  trainModel,
  testModel
} from "@/components/cv/scatter2d/lib/model.ts";
/** components */
import ChartData from '@/components/cv/scatter2d/components/ChartData'
import ChartPerformanceLoss from "@/components/cv/scatter2d/components/ChartPerformanceLoss";
import ChartPerformanceMse from "@/components/cv/scatter2d/components/ChartPerformanceMse";

export default {
  name: "Scatter2d",
  components: { ChartData, ChartPerformanceLoss, ChartPerformanceMse },
  data() {
    return {
      /** 原始数据点的坐标数组，例如[[0,0]] */
      originalData: [],
      /** 预测数据点的坐标数组 */
      predictedData: [],
      /** 损失与epoch的坐标数组 */
      lossData: [],
      /** mse与epoch的坐标数组 */
      mseData: [],
      /** 批次大小 */
      batchSize: 28,
      /** 纪元次数 */
      epochs: 20,
      /** 当前纪元 */
      epochCurrent: -1,
      /** 训练运行标志 */
      isTraining: false,

      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 5
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 16
        }
      },

    };
  },
  computed: {
    processPercent() {
      // console.log(parseInt((((this.epochCurrent + 1) * 100) / this.epochs).toFixed(0)))
      console.log('this.epochCurrent', this.epochCurrent)
      console.log('this.epochs', this.epochs)
      return parseInt(
        (((this.epochCurrent + 1) * 100) / this.epochs).toFixed(0)
      );
    }
  },
  methods: {
    /**
     * 清空数组数据
     */
    reset() {
      this.epochCurrent = -1;
      this.predictedData.splice(0, this.predictedData.length);
      this.lossData.splice(0, this.lossData.length);
      this.mseData.splice(0, this.mseData.length);
    },
    run() {
      this.isTraining = true;
      this.reset();
      /* 创建模型 */
      let model = createModel();
      /* 准备数据 */
      let normalizationData = convertToTensor(this.originalData);
      /** 回调信息显示 */
      let callbacks = {
        onTrainBegin: logs => {
          console.log("Train begin.");
          this.$message.success("Train start!");
        },
        onTrainEnd: logs => {
          console.log("Train End.");
          this.$message.success("Train end!");
          this.isTraining = false;
        },
        onEpochEnd: (epoch, logs) => {
          this.epochCurrent = epoch;
          this.lossData.push([epoch, logs.loss]);
          this.mseData.push([epoch, logs.mse]);
        }
      };
      /** 生成配置 */
      let config = {
        batchSize: this.batchSize,
        epochs: this.epochs,
        shuffle: true,
        callbacks
      };

      /** 延时以提高按钮的响应速度 */
      setTimeout(() => {
        /* 训练模型 */
        trainModel({ model, normalizationData, config }).then(() => {
          /* 测试模型 */
          this.predictedData = testModel(model, normalizationData);
        });
      }, 1000);
    }
  },
  mounted() {
    /* 获取训练数据 */
    this.originalData = getTrainData();
    this.reset();
  }
};
</script>

<style lang="scss" scoped>
.one-row {
  // height: 800px;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .col1 {
    flex: 1;
  }
  .col2 {
    flex: 1;

    .one-column {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
    }
  }
}

.process {
  width: 600px;

  display: flex;
  justify-content: flex-start;
  align-items: center;

  .label {
    flex-basis: 100px;
  }
  .content {
    flex: 1;
  }
}
</style>
